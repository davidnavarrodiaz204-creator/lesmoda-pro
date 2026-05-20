// backend/src/controllers/productController.js
const Product   = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');
const importService = require('../services/importService');


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

  const normalizedBadge = badge && typeof badge === 'string' ? badge.trim() : null;
  const product = new Product({
    name, description, price, oldPrice, category,
    badge: ['new','sale','hot','last','featured'].includes(normalizedBadge) ? normalizedBadge : null,
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
      let val = ['sizes','colors'].includes(field) ? parseList(req.body[field]) : req.body[field];
      if (field === 'badge') {
        const trimmed = val && typeof val === 'string' ? val.trim() : null;
        val = ['new','sale','hot','last','featured'].includes(trimmed) ? trimmed : null;
      }
      product[field] = val;
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

// ── POST /api/products/import/preview ─────────────────────────────────────
exports.importPreview = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Archivo requerido' });

  const content = req.file.buffer.toString('utf-8');
  let records;
  try {
    records = importService.parseCSV(content);
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Error al leer el archivo CSV: ' + err.message });
  }

  if (records.length === 0) {
    return res.status(400).json({ success: false, message: 'El archivo no contiene datos' });
  }

  if (records.length > importService.MAX_ROWS) {
    return res.status(400).json({
      success: false,
      message: `Maximo ${importService.MAX_ROWS} filas por importacion. El archivo tiene ${records.length}`,
    });
  }

  const result = importService.validateRows(records);

  res.json({
    success: true,
    data: {
      total: result.total,
      validCount: result.validCount,
      invalidCount: result.invalidCount,
      valid: result.valid,
      invalid: result.invalid,
    },
  });
};

// ── GET /api/products/export/csv ──────────────────────────────────────────
exports.exportCSV = async (req, res) => {
  console.log('[backup] exporting products');
  const products = await Product.find({}).sort({ createdAt: -1 }).lean({ virtuals: true });

  const headers = ['name','category','price','oldPrice','stock','badge','sizes','colors','description','imageUrl','isActive','featured','createdAt'];
  const csvRows = [headers.join(',')];

  products.forEach(p => {
    const esc = (v) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    const sizes = (p.sizes || []).join('|');
    const colors = (p.colors || []).join('|');
    const imageUrl = p.images?.[0]?.url || '';
    const row = [
      esc(p.name),
      esc(p.category),
      p.price ?? '',
      p.oldPrice ?? '',
      p.stock ?? 0,
      esc(p.badge || ''),
      esc(sizes),
      esc(colors),
      esc(p.description || ''),
      esc(imageUrl),
      p.isActive !== false ? 'true' : 'false',
      p.featured ? 'true' : 'false',
      p.createdAt ? new Date(p.createdAt).toISOString() : '',
    ];
    csvRows.push(row.join(','));
  });

  const csv = '\ufeff' + csvRows.join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=productos_export.csv');
  res.send(csv);
};

// ── POST /api/products/import/confirm ─────────────────────────────────────
exports.importConfirm = async (req, res) => {
  const { rows } = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ success: false, message: 'Se requiere un array de productos validos' });
  }

  if (rows.length > importService.MAX_ROWS) {
    return res.status(400).json({ success: false, message: `Maximo ${importService.MAX_ROWS} productos` });
  }

  const created = [];
  const skipped = [];
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const validation = importService.validateRow(row, i);
    if (!validation.valid) {
      errors.push({ index: i, errors: validation.errors });
      continue;
    }

    const data = validation.data;

    try {
      const existingSlug = await Product.findOne({ name: data.name }).collation({ locale: 'es', strength: 2 });
      if (existingSlug) {
        skipped.push({ index: i, name: data.name, reason: 'Ya existe un producto con este nombre' });
        continue;
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        badge: data.badge,
        sizes: data.sizes,
        colors: data.colors,
        isActive: data.isActive,
        featured: data.featured,
      };

      if (data.oldPrice !== undefined) productData.oldPrice = data.oldPrice;
      if (data.imageUrl) {
        productData.images = [{ url: data.imageUrl, isMain: true }];
      }

      const product = await Product.create(productData);
      created.push({ index: i, name: data.name, _id: product._id });
    } catch (err) {
      errors.push({ index: i, name: data.name, errors: [err.message] });
    }
  }

  res.json({
    success: true,
    data: {
      total: rows.length,
      created: created.length,
      skipped: skipped.length,
      errors: errors.length,
      createdDetails: created,
      skippedDetails: skipped,
      errorDetails: errors,
    },
  });
};
