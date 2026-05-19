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
router.get('/:id/related', ctrl.getRelatedProducts);

// Protegidas (requieren login)
router.post('/',           protect, upload.array('images', 10), ctrl.createProduct);
router.put('/:id',         protect, upload.array('images', 10), ctrl.updateProduct);
router.delete('/:id',      protect, ctrl.deleteProduct);
router.delete('/:id/images/:imageId', protect, ctrl.deleteImage);
router.patch('/:id/images/:imageId/main', protect, ctrl.setMainImage);
router.post('/:id/duplicate', protect, ctrl.duplicateProduct);

module.exports = router;
