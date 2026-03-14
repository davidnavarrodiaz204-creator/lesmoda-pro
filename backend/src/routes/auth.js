// backend/src/routes/auth.js
const router = require('express').Router();
const ctrl   = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login',    ctrl.login);
router.get('/me',        protect, ctrl.getMe);
router.post('/register', protect, ctrl.register);

module.exports = router;
