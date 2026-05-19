// backend/src/routes/config.js
const router = require('express').Router();
const Config = require('../models/Config');
const { protect } = require('../middleware/auth');
const { configUpload } = require('../config/cloudinary');

// GET /api/config  — pública
router.get('/', async (req, res) => {
  const docs = await Config.find({}).lean();
  const result = {};
  docs.forEach(d => { result[d.key] = d.value; });
  res.json({ success: true, data: result });
});

// PUT /api/config  — solo admin (soporta JSON + FormData con archivos)
router.put('/', protect, configUpload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]), async (req, res) => {
  const updates = req.body;

  if (req.files) {
    if (req.files.logo) updates.logo = req.files.logo[0].path;
    if (req.files.banner) updates.banner = req.files.banner[0].path;
  }

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined && value !== null) {
      await Config.set(key, value);
    }
  }
  res.json({ success: true, message: 'Configuracion guardada' });
});

module.exports = router;
