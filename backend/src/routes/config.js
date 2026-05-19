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
  const hasSeo = ['siteTitle','siteDescription','keywords','ogImage','favicon','indexable'].some(k => k in result);
  if (hasSeo) console.log(`[config] returned seo: ${['siteTitle','siteDescription','keywords','ogImage','favicon','indexable'].filter(k => k in result).map(k => `${k}=${result[k]}`).join(', ')}`);
  res.json({ success: true, data: result });
});

// PUT /api/config  — solo admin (soporta JSON + FormData con archivos)
router.put('/', protect, configUpload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]), async (req, res) => {
  const updates = req.body;
  const keys = Object.keys(updates || {});
  console.log(`[config] received keys: ${keys.join(', ')}`);

  if (req.files) {
    if (req.files.logo) updates.logo = req.files.logo[0].path;
    if (req.files.banner) updates.banner = req.files.banner[0].path;
  }

  const seoKeys = [];
  const updatedKeys = [];
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined && value !== null) {
      let saveValue = value;
      if (key === 'indexable') {
        saveValue = value === true || value === 'true' || value === 1;
      }
      await Config.set(key, saveValue);
      updatedKeys.push(key);
      if (['siteTitle','siteDescription','keywords','ogImage','favicon','indexable'].includes(key)) seoKeys.push(key);
    }
  }
  if (seoKeys.length > 0) console.log(`[config] seo saved: ${seoKeys.join(', ')}`);
  console.log(`[config] updated: ${updatedKeys.join(', ')}`);
  res.json({ success: true, message: 'Configuracion guardada' });
});

module.exports = router;
