// backend/src/index.js
require('dotenv').config();
require('express-async-errors');

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');

const connectDB      = require('./config/db');
const errorHandler   = require('./middleware/errorHandler');

const productRoutes  = require('./routes/products');
const authRoutes     = require('./routes/auth');
const configRoutes   = require('./routes/config');

// ── Conectar BD ────────────────────────────────────────────────────────────
connectDB();

const app = express();

// ── Seguridad ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

// Health check (para Railway/Render)
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

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
