// backend/src/routes/config.js
const router = require('express').Router();
const Config = require('../models/Config');
const { protect } = require('../middleware/auth');
const { configUpload } = require('../config/cloudinary');

const SEO_KEYS = ['siteTitle','siteDescription','keywords','ogImage','favicon','indexable'];

// GET /api/config  — pública
router.get('/', async (req, res) => {
  const count = await Config.countDocuments({});
  console.log(`[config] count: ${count}`);
  const docs = await Config.find({}).lean();
  const result = {};
  docs.forEach(d => { result[d.key] = d.value; });
  const hasSeo = SEO_KEYS.some(k => k in result);
  if (hasSeo) {
    const vals = SEO_KEYS.filter(k => k in result).map(k => `${k}="${result[k]}"`);
    console.log(`[config] returned seo: ${vals.join(', ')}`);
  }
  const missing = SEO_KEYS.filter(k => !(k in result));
  if (missing.length) console.log(`[config] missing seo keys: ${missing.join(', ')}`);
  res.json({ success: true, data: result });
});

// PUT /api/config  — solo admin (soporta JSON + FormData con archivos)
router.put('/', protect, configUpload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]), async (req, res) => {
  const updates = req.body;
  const keys = Object.keys(updates || {});
  console.log(`[config] === SAVE START ===`);
  console.log(`[config] count before: ${await Config.countDocuments({})}`);

  // Log each value with quotes
  keys.forEach(k => {
    const v = updates[k];
    console.log(`[config]  ${k}=${JSON.stringify(v)} (type=${typeof v}, len=${(v||'').length})`);
  });

  if (req.files) {
    if (req.files.logo) updates.logo = req.files.logo[0].path;
    if (req.files.banner) updates.banner = req.files.banner[0].path;
  }

  const updatedKeys = [];
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null) {
      console.log(`[config]  SKIP ${key} (null/undefined)`);
      continue;
    }
    let saveValue = value;
    if (key === 'indexable') {
      saveValue = value === true || value === 'true' || value === 1;
    }
    await Config.set(key, saveValue);
    updatedKeys.push(key);

    // Verify persistence immediately
    const verify = await Config.findOne({ key }).lean();
    if (verify) {
      console.log(`[config]  ${key} -> _id=${verify._id} value=${JSON.stringify(verify.value)}`);
    } else {
      console.log(`[config]  ${key} -> NOT FOUND after save!`);
    }
  }

  console.log(`[config] count after: ${await Config.countDocuments({})}`);
  console.log(`[config] updated: ${updatedKeys.join(', ')}`);
  console.log(`[config] === SAVE END ===`);
  res.json({ success: true, message: 'Configuracion guardada' });
});

module.exports = router;
