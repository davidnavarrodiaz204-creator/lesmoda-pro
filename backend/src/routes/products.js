// backend/src/routes/products.js
const router  = require('express').Router();
const ctrl    = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { upload }  = require('../config/cloudinary');

// Públicas (stats va antes de :slug para evitar conflicto)
router.get('/',           ctrl.getProducts);
router.get('/stats',      ctrl.getStats);
router.get('/:slug',      ctrl.getProduct);
router.post('/:id/click', ctrl.trackWhatsappClick);

// Protegidas (requieren login)
router.post('/',    protect, upload.single('image'), ctrl.createProduct);
router.put('/:id',  protect, upload.single('image'), ctrl.updateProduct);
router.delete('/:id', protect, ctrl.deleteProduct);

module.exports = router;
