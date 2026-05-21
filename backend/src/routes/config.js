// backend/src/routes/config.js
const router = require('express').Router();
const Config = require('../models/Config');
const { protect, adminOnly } = require('../middleware/auth');
const { configUpload } = require('../config/cloudinary');

const SEO_KEYS = ['siteTitle','siteDescription','keywords','ogImage','favicon','indexable'];

// GET /api/config  — pública
router.get('/', async (req, res) => {
  const docs = await Config.find({}).lean();
  const result = {};
  docs.forEach(d => { result[d.key] = d.value; });
  res.json({ success: true, data: result });
});

// PUT /api/config  — solo admin (soporta JSON + FormData con archivos)
router.put('/', protect, adminOnly, configUpload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]), async (req, res) => {
  const updates = req.body;

  if (req.files) {
    if (req.files.logo) updates.logo = req.files.logo[0].path;
    if (req.files.banner) updates.banner = req.files.banner[0].path;
  }

  const updatedKeys = [];
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null) {
      continue;
    }
    let saveValue = value;
    if (key === 'indexable') {
      saveValue = value === true || value === 'true' || value === 1;
    }
    await Config.set(key, saveValue);
    updatedKeys.push(key);
  }
  res.json({ success: true, message: 'Configuracion guardada', updatedKeys });
});

// POST /api/config/reset-theme — solo admin
router.post('/reset-theme', protect, adminOnly, async (req, res) => {
  const theme = {
    primaryColor: '#111827',
    secondaryColor: '#111827',
    bgColor: '#F6F7FB',
    surfaceColor: '#FFFFFF',
    textColor: '#111827',
    mutedColor: '#6B7280',
    borderColor: '#E5E7EB',
    visualMode: 'modern-fashion',
  };
  for (const [k, v] of Object.entries(theme)) {
    await Config.set(k, v);
  }
  res.json({ success: true, message: 'Tema moderno restablecido', data: theme });
});

module.exports = router;
