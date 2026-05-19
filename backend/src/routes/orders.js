const router = require('express').Router();
const ctrl   = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Pública (crear pedido desde el carrito)
router.post('/', ctrl.createOrder);

// Admin (stats va antes de :id para evitar conflicto)
router.get('/stats', protect, ctrl.getOrderStats);
router.get('/',       protect, ctrl.getOrders);
router.get('/:id',    protect, ctrl.getOrder);
router.patch('/:id/status', protect, ctrl.updateStatus);
router.patch('/:id/notes',  protect, ctrl.updateNotes);

module.exports = router;
