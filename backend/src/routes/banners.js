const router = require('express').Router();
const ctrl   = require('../controllers/bannerController');
const { protect } = require('../middleware/auth');

router.get('/',           ctrl.getBanners);
router.post('/',          protect, ctrl.createBanner);
router.put('/:id',        protect, ctrl.updateBanner);
router.delete('/:id',     protect, ctrl.deleteBanner);

module.exports = router;
