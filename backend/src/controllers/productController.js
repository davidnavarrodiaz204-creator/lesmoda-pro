// backend/src/controllers/productController.js
const Product   = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// ── GET /api/products ─────────────────────────────────────────────────────
exports.getProducts = async (req, res) => {
  const {
    category, badge, featured,
    search, page = 1, limit = 20,
    sort = '-createdAt',
  } = req.query;

  const filter = { isActive: true };
  if (category) filter.category = category;
  if (badge)    filter.badge    = badge;
  if (featured === 'true') filter.featured = true;
  if (search)   filter.$text = { $search: search };

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
    sizes:    sizes    ? JSON.parse(sizes)    : [],
    colors:   colors   ? JSON.parse(colors)   : [],
    stock:    stock    || 0,
    featured: featured === 'true',
  });

  // Si viene imagen desde Cloudinary (multer ya la subió)
  if (req.file) {
    product.images = [{
      url:      req.file.path,
      publicId: req.file.filename,
      isMain:   true,
    }];
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
        ? JSON.parse(req.body[field])
        : req.body[field];
    }
  });

  // Nueva imagen
  if (req.file) {
    // Borrar imagen anterior de Cloudinary
    if (product.images[0]?.publicId) {
      await cloudinary.uploader.destroy(product.images[0].publicId);
    }
    product.images = [{
      url:      req.file.path,
      publicId: req.file.filename,
      isMain:   true,
    }];
  }

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

// ── POST /api/products/:id/click-whatsapp ─────────────────────────────────
exports.trackWhatsappClick = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { $inc: { whatsappClicks: 1 } });
  res.json({ success: true });
};
