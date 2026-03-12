// backend/src/routes/config.js
const router = require('express').Router();
const Config = require('../models/Config');
const { protect } = require('../middleware/auth');

// GET /api/config  — pública (frontend la usa para leer el número WA, etc.)
router.get('/', async (req, res) => {
  const docs = await Config.find({}).lean();
  const result = {};
  docs.forEach(d => { result[d.key] = d.value; });
  res.json({ success: true, data: result });
});

// PUT /api/config  — solo admin
router.put('/', protect, async (req, res) => {
  const updates = req.body; // { waNumber: '51999...', storeName: 'LesModa', ... }
  for (const [key, value] of Object.entries(updates)) {
    await Config.set(key, value);
  }
  res.json({ success: true, message: 'Configuración guardada' });
});

module.exports = router;
