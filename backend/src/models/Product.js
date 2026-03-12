// backend/src/models/Product.js
const mongoose = require('mongoose');
const slugify  = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'El nombre es requerido'],
      trim:     true,
      maxlength: [120, 'Nombre muy largo'],
    },
    slug: {
      type:   String,
      unique: true,
      index:  true,
    },
    description: {
      type:    String,
      trim:    true,
      default: '',
    },
    price: {
      type:     Number,
      required: [true, 'El precio es requerido'],
      min:      [0, 'El precio no puede ser negativo'],
    },
    oldPrice: {
      type:    Number,
      default: null,
    },
    category: {
      type:     String,
      required: true,
      enum:     ['Mujer', 'Hombre', 'Accesorios'],
    },
    badge: {
      type:    String,
      enum:    ['new', 'sale', 'hot', null],
      default: null,
    },
    // Imágenes en Cloudinary
    images: [
      {
        url:       { type: String, required: true },
        publicId:  { type: String },          // para poder borrarla
        isMain:    { type: Boolean, default: false },
      },
    ],
    // Tallas disponibles
    sizes: {
      type:    [String],
      default: [],
    },
    // Colores disponibles
    colors: {
      type:    [String],
      default: [],
    },
    stock: {
      type:    Number,
      default: 0,
      min:     0,
    },
    isActive: {
      type:    Boolean,
      default: true,
      index:   true,
    },
    featured: {
      type:    Boolean,
      default: false,
    },
    // Contador de veces que se hizo clic en WhatsApp
    whatsappClicks: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true,   // crea createdAt y updatedAt automáticamente
    toJSON:    { virtuals: true },
    toObject:  { virtuals: true },
  }
);

// ── VIRTUAL: imagen principal ──────────────────────────────────────────────
productSchema.virtual('mainImage').get(function () {
  const main = this.images.find(img => img.isMain);
  return main ? main.url : (this.images[0]?.url ?? null);
});

// ── VIRTUAL: tiene descuento ───────────────────────────────────────────────
productSchema.virtual('hasDiscount').get(function () {
  return this.oldPrice != null && this.oldPrice > this.price;
});

productSchema.virtual('discountPercent').get(function () {
  if (!this.hasDiscount) return 0;
  return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
});

// ── MIDDLEWARE: generar slug antes de guardar ──────────────────────────────
productSchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();

  let base = slugify(this.name, { lower: true, strict: true });
  let slug = base;
  let count = 1;

  // Evitar duplicados
  while (await mongoose.models.Product.findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${count++}`;
  }
  this.slug = slug;
  next();
});

// ── ÍNDICES para búsquedas rápidas ────────────────────────────────────────
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' }); // búsqueda full-text

module.exports = mongoose.model('Product', productSchema);
