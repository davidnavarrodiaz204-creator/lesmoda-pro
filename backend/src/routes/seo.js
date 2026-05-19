const router = require('express').Router();
const ctrl   = require('../controllers/seoController');

router.get('/schema/organization', ctrl.organizationSchema);
router.get('/schema/product/:slug', ctrl.productSchema);

module.exports = router;
