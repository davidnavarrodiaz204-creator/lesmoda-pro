const router = require('express').Router();
const ctrl   = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Pública (crear pedido desde el carrito)
router.post('/', ctrl.createOrder);

// Admin (stats y test-telegram van antes de :id para evitar conflicto)
router.get('/stats', protect, ctrl.getOrderStats);
router.get('/test-telegram', protect, ctrl.testTelegram);
router.get('/export/csv', protect, ctrl.exportOrdersCSV);
router.get('/',       protect, ctrl.getOrders);
router.patch('/:id/viewed', protect, ctrl.markViewed);
router.get('/:id',    protect, ctrl.getOrder);
router.patch('/:id/status', protect, ctrl.updateStatus);
router.patch('/:id/notes',  protect, ctrl.updateNotes);
router.delete('/cleanup/test', protect, ctrl.cleanupTestOrders);
router.delete('/:id',    protect, ctrl.deleteOrder);

module.exports = router;
