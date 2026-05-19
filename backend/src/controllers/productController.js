// backend/src/controllers/productController.js
const Product   = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');


// Helper: acepta "S, M, L" o ["S","M","L"] o JSON string
const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(v => v.trim()).filter(Boolean);
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch {}
  return val.split(',').map(v => v.trim()).filter(Boolean);
};

// ── GET /api/products ─────────────────────────────────────────────────────
exports.getProducts = async (req, res) => {
  const {
    category, badge, featured,
    search, page = 1, limit = 20,
    sort = '-createdAt', admin,
    lowStock, isActive: activeFilter,
  } = req.query;

  const filter = {};

  // Admin puede ver productos inactivos; público solo activos
  if (admin === 'true') {
    if (activeFilter !== undefined) filter.isActive = activeFilter === 'true';
  } else {
    filter.isActive = true;
  }

  if (category) filter.category = category;
  if (badge)    filter.badge    = badge;
  if (featured === 'true') filter.featured = true;
  if (search)   filter.$text = { $search: search };
  if (lowStock === 'true') filter.stock = { $gt: 0, $lte: 5 };

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .lean({ virtuals: true });

  res.json({
    success: true,
    total,
    page:  Number(page),
    pages: Math.ceil(total / Number(limit)),
    data:  products,
  });
};

// ── GET /api/products/stats ────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  const [
    totalProducts,
    activeProducts,
    featuredProducts,
    totalClicks,
    topProducts,
    lowStockProducts,
    recentProducts,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ featured: true }),
    Product.aggregate([{ $group: { _id: null, total: { $sum: '$whatsappClicks' } } }]),
    Product.find().sort({ whatsappClicks: -1 }).limit(5).lean({ virtuals: true }),
    Product.find({ stock: { $gt: 0, $lte: 5 } }).sort({ stock: 1 }).limit(10).lean({ virtuals: true }),
    Product.find().sort({ createdAt: -1 }).limit(5).lean({ virtuals: true }),
  ]);

  res.json({
    success: true,
    data: {
      totalProducts,
      activeProducts,
      inactiveProducts: totalProducts - activeProducts,
      featuredProducts,
      totalWhatsappClicks: totalClicks[0]?.total || 0,
      topProducts,
      lowStockProducts,
      recentProducts,
    },
  });
};

// ── GET /api/products/:slug ───────────────────────────────────────────────
exports.getProduct = async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  }).lean({ virtuals: true });

  if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
  res.json({ success: true, data: product });
};

// ── POST /api/products  (admin) ───────────────────────────────────────────
exports.createProduct = async (req, res) => {
  const { name, description, price, oldPrice, category, badge, sizes, colors, stock, featured } = req.body;

  const product = new Product({
    name, description, price, oldPrice, category, badge,
    sizes:    parseList(sizes),
    colors:   parseList(colors),
    stock:    stock    || 0,
    featured: featured === 'true',
  });

  const files = req.files || (req.file ? [req.file] : []);
  if (files.length > 0) {
    product.images = files.map((f, i) => ({
      url:      f.path,
      publicId: f.filename,
      isMain:   i === 0,
    }));
  }

  await product.save();
  res.status(201).json({ success: true, data: product });
};

// ── PUT /api/products/:id  (admin) ────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

  const allowed = ['name','description','price','oldPrice','category','badge','sizes','colors','stock','featured','isActive'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = ['sizes','colors'].includes(field)
        ? parseList(req.body[field])
        : req.body[field];
    }
  });

  const files = req.files || (req.file ? [req.file] : []);
  if (files.length > 0) {
    const hasMain = product.images.some(img => img.isMain);
    const newImages = files.map((f, i) => ({
      url:      f.path,
      publicId: f.filename,
      isMain:   !hasMain && i === 0,
    }));
    product.images.push(...newImages);
  }

  await product.save();
  res.json({ success: true, data: product });
};

// ── DELETE /api/products/:id/images/:imageId  (admin) ─────────────────────
exports.deleteImage = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

  const image = product.images.id(req.params.imageId);
  if (!image) return res.status(404).json({ success: false, message: 'Imagen no encontrada' });

  if (image.publicId) {
    await cloudinary.uploader.destroy(image.publicId).catch(() => {});
  }

  const wasMain = image.isMain;
  image.deleteOne();

  if (wasMain && product.images.length > 0) {
    product.images[0].isMain = true;
  }

  await product.save();
  res.json({ success: true, data: product });
};

// ── PATCH /api/products/:id/images/:imageId/main  (admin) ────────────────
exports.setMainImage = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

  const image = product.images.id(req.params.imageId);
  if (!image) return res.status(404).json({ success: false, message: 'Imagen no encontrada' });

  product.images.forEach(img => { img.isMain = false; });
  image.isMain = true;

  await product.save();
  res.json({ success: true, data: product });
};

// ── DELETE /api/products/:id  (admin) ─────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

  // Borrar imágenes de Cloudinary
  for (const img of product.images) {
    if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Producto eliminado' });
};

// ── POST /api/products/:id/duplicate ──────────────────────────────────────
exports.duplicateProduct = async (req, res) => {
  const original = await Product.findById(req.params.id);
  if (!original) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

  const copy = new Product({
    name:        original.name + ' (Copia)',
    description: original.description,
    price:       original.price,
    oldPrice:    original.oldPrice,
    category:    original.category,
    badge:       original.badge,
    sizes:       [...original.sizes],
    colors:      [...original.colors],
    stock:       original.stock,
    featured:    false,
    isActive:    false,
  });

  await copy.save();
  res.status(201).json({ success: true, data: copy });
};

// ── GET /api/products/:id/related ─────────────────────────────────────────
exports.getRelatedProducts = async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

  const related = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    category: product.category,
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean({ virtuals: true });

  res.json({ success: true, data: related });
};

// ── POST /api/products/:id/click-whatsapp ─────────────────────────────────
exports.trackWhatsappClick = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { $inc: { whatsappClicks: 1 } });
  res.json({ success: true });
};
