const router = require('express').Router();
const ctrl   = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.post('/track', ctrl.track);
router.get('/stats',  protect, ctrl.getStats);

module.exports = router;
