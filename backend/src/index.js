// backend/src/index.js
require('dotenv').config();
require('express-async-errors');

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const compression = require('compression');
const mongoose   = require('mongoose');

const connectDB      = require('./config/db');
const telegram       = require('./services/telegram');
const { cloudinary } = require('./config/cloudinary');
const errorHandler   = require('./middleware/errorHandler');

const productRoutes  = require('./routes/products');
const authRoutes     = require('./routes/auth');
const configRoutes   = require('./routes/config');
const orderRoutes    = require('./routes/orders');
const systemRoutes   = require('./routes/system');
const bannerRoutes   = require('./routes/banners');
const analyticsRoutes = require('./routes/analytics');
const seoRoutes      = require('./routes/seo');

// ── Conectar BD ────────────────────────────────────────────────────────────
connectDB();

const app = express();

// ── Compresion (gzip) ───────────────────────────────────────────────────────
app.use(compression({ level: 6 }));

// ── Seguridad ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// Rate limiting — máx 100 req / 15min por IP
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  message:  { success: false, message: 'Demasiadas peticiones, intenta más tarde' },
}));

// ── Parsers ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ── Rutas ──────────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/config',   configRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/system',   systemRoutes);
app.use('/api/banners',  bannerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/seo',      seoRoutes);

// Sitemap y robots (XML/plain-text publico)
const seoCtrl = require('./controllers/seoController');
app.get('/sitemap.xml', seoCtrl.sitemap);
app.get('/robots.txt',  seoCtrl.robots);

// Health check (para Railway/Render)
const pkg = require('../package.json');
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: pkg.version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    telegram: process.env.TELEGRAM_NOTIFICATIONS_ENABLED === 'true' && !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID ? 'enabled' : 'disabled',
    cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) ? 'configured' : 'not configured',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date(),
    appName: 'lesmoda-api',
  });
});

// ── 404 ────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));

// ── Error handler (siempre al final) ──────────────────────────────────────
app.use(errorHandler);

// ── Arrancar ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 LesModa API corriendo en http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV}`);
});
