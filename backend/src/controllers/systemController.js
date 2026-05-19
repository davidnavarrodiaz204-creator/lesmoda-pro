const Product = require('../models/Product');
const Order = require('../models/Order');
const Config = require('../models/Config');

// ── GET /api/system/backup ──────────────────────────────────────────────────
exports.backup = async (req, res) => {
  console.log('[backup] full backup generated');
  const [products, orders, configDocs] = await Promise.all([
    Product.find({}).sort({ createdAt: -1 }).lean({ virtuals: true }),
    Order.find({}).sort({ createdAt: -1 }).lean(),
    Config.find({}).lean(),
  ]);

  const config = {};
  configDocs.forEach(doc => { config[doc.key] = doc.value; });

  res.json({
    success: true,
    data: {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      stats: {
        products: products.length,
        orders: orders.length,
        configKeys: Object.keys(config).length,
      },
      products,
      orders,
      config,
    },
  });
};

// ── POST /api/system/restore ────────────────────────────────────────────────
exports.restore = async (req, res) => {
  console.log('[backup] restore started');
  const { backup, merge } = req.body;

  if (!backup || typeof backup !== 'object') {
    return res.status(400).json({ success: false, message: 'Backup invalido: se requiere un objeto JSON' });
  }

  if (!Array.isArray(backup.products) || !Array.isArray(backup.orders)) {
    return res.status(400).json({ success: false, message: 'Backup invalido: se requieren arrays products y orders' });
  }

  if (backup.products.length > 1000 || backup.orders.length > 1000) {
    return res.status(400).json({ success: false, message: 'Backup muy grande. Maximo 1000 productos y 1000 pedidos' });
  }

  let imported = { products: 0, orders: 0, config: false };
  const errors = [];

  // Restaurar productos
  for (const p of backup.products) {
    try {
      if (!p.name || p.price === undefined) {
        errors.push({ type: 'product', name: p.name || 'sin nombre', error: 'name y price requeridos' });
        continue;
      }
      const existing = await Product.findOne({ name: p.name }).collation({ locale: 'es', strength: 2 });
      if (existing) {
        if (merge === true) {
          Object.assign(existing, {
            description: p.description || existing.description,
            price: p.price,
            oldPrice: p.oldPrice || existing.oldPrice,
            category: p.category || existing.category,
            stock: p.stock ?? existing.stock,
            badge: p.badge ?? existing.badge,
            sizes: p.sizes || existing.sizes,
            colors: p.colors || existing.colors,
            isActive: p.isActive ?? existing.isActive,
            featured: p.featured ?? existing.featured,
          });
          if (p.images?.length) existing.images = p.images;
          await existing.save();
        }
        errors.push({ type: 'product', name: p.name, error: merge === true ? 'actualizado' : 'ya existe' });
        continue;
      }
      await Product.create({
        name: p.name,
        description: p.description || '',
        price: p.price,
        oldPrice: p.oldPrice || undefined,
        category: p.category || 'General',
        badge: p.badge || null,
        sizes: p.sizes || [],
        colors: p.colors || [],
        stock: p.stock ?? 0,
        images: p.images || [],
        isActive: p.isActive !== false,
        featured: p.featured === true,
      });
      imported.products++;
    } catch (err) {
      errors.push({ type: 'product', name: p.name || 'sin nombre', error: err.message });
    }
  }

  // Restaurar pedidos
  for (const o of backup.orders) {
    try {
      if (!o.customerName || !o.items?.length) {
        errors.push({ type: 'order', name: o.customerName || 'sin nombre', error: 'customerName e items requeridos' });
        continue;
      }
      const existing = await Order.findById(o._id).lean();
      if (existing) {
        errors.push({ type: 'order', name: o.customerName, error: 'ya existe' });
        continue;
      }
      await Order.create({
        customerName: o.customerName,
        customerPhone: o.customerPhone || '',
        customerAddress: o.customerAddress || '',
        items: o.items,
        total: o.total,
        status: o.status || 'pending',
        source: o.source || 'whatsapp',
        whatsappMessage: o.whatsappMessage || '',
        notes: o.notes || '',
        isViewed: o.isViewed ?? false,
        viewedAt: o.viewedAt || null,
      });
      imported.orders++;
    } catch (err) {
      errors.push({ type: 'order', name: o.customerName || 'sin nombre', error: err.message });
    }
  }

  // Restaurar config
  if (backup.config && typeof backup.config === 'object') {
    try {
      for (const [key, value] of Object.entries(backup.config)) {
        await Config.set(key, value);
      }
      imported.config = true;
    } catch (err) {
      errors.push({ type: 'config', error: err.message });
    }
  }

  console.log(`[backup] restore completed: ${imported.products} products, ${imported.orders} orders`);

  res.json({
    success: true,
    data: {
      imported,
      errors: errors.length,
      errorDetails: errors,
      merge: merge === true,
    },
  });
};
