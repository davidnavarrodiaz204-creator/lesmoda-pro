const router = require('express').Router();
const ctrl   = require('../controllers/systemController');
const { protect } = require('../middleware/auth');

router.get('/backup',  protect, ctrl.backup);
router.post('/restore', protect, ctrl.restore);

module.exports = router;
