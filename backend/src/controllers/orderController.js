const Order = require('../models/Order');

// ── POST /api/orders (público) ─────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  const { customerName, customerPhone, customerAddress, items, total, whatsappMessage } = req.body;

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

  const [
    todayCount,
    pendingCount,
    totalRevenue,
  ] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.countDocuments({ status: 'pending' }),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();

  res.json({
    success: true,
    data: {
      todayOrders: todayCount,
      pendingOrders: pendingCount,
      potentialRevenue: totalRevenue[0]?.total || 0,
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

// ── PATCH /api/orders/:id/notes (admin) ────────────────────────────────────
exports.updateNotes = async (req, res) => {
  const { notes } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { notes }, { new: true }).lean();
  if (!order) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  res.json({ success: true, data: order });
};
