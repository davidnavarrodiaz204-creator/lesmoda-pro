const Order = require('../models/Order');
const telegram = require('../services/telegram');

// ── POST /api/orders (público) ─────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  console.log('[orders] createOrder hit');

  const { customerName, customerPhone, customerAddress, items, total, whatsappMessage } = req.body;

  console.log('[orders] body received:', {
    itemsCount: items?.length || 0,
    total,
    customerNameExists: !!customerName,
    source: req.body.source || 'whatsapp',
  });

  if (!customerName || !customerPhone || !items?.length) {
    return res.status(400).json({ success: false, message: 'Nombre, celular y items son requeridos' });
  }

  const order = await Order.create({
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    customerAddress: (customerAddress || '').trim(),
    items: items.map(i => ({
      productId: i.productId,
      name: i.name,
      slug: i.slug || '',
      image: i.image || '',
      size: i.size || '',
      color: i.color || '',
      quantity: i.quantity,
      price: i.price,
      subtotal: i.price * i.quantity,
    })),
    total,
    whatsappMessage: whatsappMessage || '',
    source: 'whatsapp',
  });

  console.log('[orders] order saved:', { orderId: order._id, total: order.total });

  // Telegram notification (no bloqueante — no debe afectar la respuesta)
  console.log('[orders] triggering telegram notification');
  setImmediate(async () => {
    try {
      const cleanPhone = customerPhone.replace(/\D/g, '');
      let tgMessage = '<b>Nuevo Pedido</b>\n\n';
      tgMessage += `<b>Pedido #${order._id}</b>\n\n`;
      tgMessage += `<b>Cliente:</b> ${customerName.trim()}\n`;
      tgMessage += `<b>Celular:</b> ${customerPhone.trim()}\n`;
      if (customerAddress) tgMessage += `<b>Direccion:</b> ${customerAddress.trim()}\n`;
      tgMessage += `<b>Total:</b> S/ ${Number(total).toFixed(2)}\n\n`;
      tgMessage += `<b>Productos:</b>\n`;
      items.forEach((item, i) => {
        tgMessage += `${i + 1}. ${item.name}`;
        if (item.size) tgMessage += ` — T: ${item.size}`;
        if (item.color) tgMessage += ` — C: ${item.color}`;
        tgMessage += ` x${item.quantity} — S/ ${(item.price * item.quantity).toFixed(2)}\n`;
      });
      if (cleanPhone) {
        tgMessage += `\n<a href="https://wa.me/${cleanPhone}">Contactar por WhatsApp</a>`;
      }
      await telegram.sendNotification(tgMessage);
    } catch (err) {
      console.error('[telegram] error in notification:', err.message);
    }
  });

  res.status(201).json({ success: true, data: order });
};

// ── GET /api/orders (admin) ────────────────────────────────────────────────
exports.getOrders = async (req, res) => {
  const {
    status, search,
    page = 1, limit = 50,
    startDate, endDate,
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { customerName:  { $regex: search, $options: 'i' } },
      { customerPhone: { $regex: search, $options: 'i' } },
    ];
  }
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate)   filter.createdAt.$lte = new Date(endDate);
  }

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), data: orders });
};

// ── GET /api/orders/stats (admin) ──────────────────────────────────────────
exports.getOrderStats = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const [
    todayCount,
    pendingCount,
    totalRevenueResult,
    weekCount,
    weekRevenueResult,
    unviewedCount,
    mostOrdered,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.countDocuments({ status: 'pending' }),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: weekStart } }),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: weekStart } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ isViewed: false }),
    Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', count: { $sum: '$items.quantity' }, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  res.json({
    success: true,
    data: {
      todayOrders: todayCount,
      weekOrders: weekCount,
      pendingOrders: pendingCount,
      potentialRevenue: totalRevenueResult[0]?.total || 0,
      weekRevenue: weekRevenueResult[0]?.total || 0,
      unviewedCount,
      mostOrderedProducts: mostOrdered,
      recentOrders,
    },
  });
};

// ── GET /api/orders/:id (admin) ────────────────────────────────────────────
exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  res.json({ success: true, data: order });
};

// ── PATCH /api/orders/:id/status (admin) ───────────────────────────────────
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'contacted', 'confirmed', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ success: false, message: 'Estado inválido' });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
  if (!order) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  res.json({ success: true, data: order });
};

// ── PATCH /api/orders/:id/viewed (admin) ─────────────────────────────────
exports.markViewed = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { isViewed: true, viewedAt: new Date() },
    { new: true }
  ).lean();
  if (!order) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  res.json({ success: true, data: order });
};

// ── GET /api/orders/test-telegram (admin) ────────────────────────────────
exports.testTelegram = async (req, res) => {
  const sent = await telegram.sendNotification('<b>Prueba Telegram LesModa desde backend</b>\n\nSi ves esto, Telegram funciona correctamente.');
  if (sent) {
    res.json({ success: true, message: 'Mensaje de prueba enviado a Telegram' });
  } else {
    res.status(500).json({ success: false, message: 'Error enviando mensaje de prueba a Telegram' });
  }
};

// ── PATCH /api/orders/:id/notes (admin) ────────────────────────────────────
exports.updateNotes = async (req, res) => {
  const { notes } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { notes }, { new: true }).lean();
  if (!order) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  res.json({ success: true, data: order });
};

// ── DELETE /api/orders/:id (admin) ──────────────────────────────────────
exports.deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  res.json({ success: true, message: 'Pedido eliminado' });
};

// ── DELETE /api/orders/cleanup/test (admin) ─────────────────────────────
exports.cleanupTestOrders = async (req, res) => {
  const patterns = ['test', 'prueba', 'demo'];
  const orConditions = [];
  patterns.forEach(p => {
    orConditions.push({ customerName: { $regex: p, $options: 'i' } });
    orConditions.push({ customerPhone: { $regex: p, $options: 'i' } });
  });
  const filter = { $or: orConditions };
  const result = await Order.deleteMany(filter);
  res.json({ success: true, deletedCount: result.deletedCount, message: `Se eliminaron ${result.deletedCount} pedidos de prueba` });
};

// ── DELETE /api/orders/all (admin) ───────────────────────────────────────
exports.deleteAllOrders = async (req, res) => {
  const result = await Order.deleteMany({});
  res.json({
    success: true,
    deletedCount: result.deletedCount,
    message: `Se eliminaron ${result.deletedCount} pedidos`,
  });
};

// ── GET /api/orders/export/csv ────────────────────────────────────────────
exports.exportOrdersCSV = async (req, res) => {
  console.log('[backup] exporting orders');
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

  const headers = ['orderId','customerName','customerPhone','customerAddress','total','status','itemsCount','products','source','createdAt','isViewed'];
  const csvRows = [headers.join(',')];

  orders.forEach(o => {
    const esc = (v) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    const productsStr = (o.items || []).map(item =>
      `${item.name} x${item.quantity} S/${item.subtotal?.toFixed(2) || '0.00'}`
    ).join(' | ');
    const row = [
      o._id || '',
      esc(o.customerName),
      esc(o.customerPhone),
      esc(o.customerAddress || ''),
      o.total ?? '',
      esc(o.status || ''),
      o.items?.length ?? 0,
      esc(productsStr),
      esc(o.source || ''),
      o.createdAt ? new Date(o.createdAt).toISOString() : '',
      o.isViewed !== false ? 'true' : 'false',
    ];
    csvRows.push(row.join(','));
  });

  const csv = '\ufeff' + csvRows.join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=pedidos_export.csv');
  res.send(csv);
};
