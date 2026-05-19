// backend/src/routes/products.js
const router  = require('express').Router();
const ctrl    = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { upload }  = require('../config/cloudinary');
const multer = require('multer');

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.csv', 'text/csv', 'application/vnd.ms-excel', 'application/csv'];
    const extOk = file.originalname.toLowerCase().endsWith('.csv');
    const mimeOk = allowed.includes(file.mimetype);
    if (extOk || mimeOk) return cb(null, true);
    cb(new Error('Solo se aceptan archivos CSV'));
  },
});

// Públicas (stats va antes de :slug para evitar conflicto)
router.get('/',           ctrl.getProducts);
router.get('/stats',      ctrl.getStats);
router.get('/export/csv', protect, ctrl.exportCSV);
router.get('/:slug',      ctrl.getProduct);
router.post('/:id/click', ctrl.trackWhatsappClick);
router.get('/:id/related', ctrl.getRelatedProducts);

// Importación masiva (protegida)
router.post('/import/preview',  protect, csvUpload.single('file'), ctrl.importPreview);
router.post('/import/confirm',  protect, ctrl.importConfirm);

// Protegidas (requieren login)
router.post('/',           protect, upload.array('images', 10), ctrl.createProduct);
router.put('/:id',         protect, upload.array('images', 10), ctrl.updateProduct);
router.delete('/:id',      protect, ctrl.deleteProduct);
router.delete('/:id/images/:imageId', protect, ctrl.deleteImage);
router.patch('/:id/images/:imageId/main', protect, ctrl.setMainImage);
router.post('/:id/duplicate', protect, ctrl.duplicateProduct);

module.exports = router;
