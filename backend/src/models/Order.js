const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:      String,
  slug:      String,
  image:     String,
  size:      { type: String, default: '' },
  color:     { type: String, default: '' },
  quantity:  { type: Number, required: true },
  price:     { type: Number, required: true },
  subtotal:  { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerName:  { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  customerAddress:{ type: String, default: '', trim: true },
  items:         [orderItemSchema],
  total:         { type: Number, required: true },
  status: {
    type:    String,
    enum:    ['pending', 'contacted', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending',
  },
  source:         { type: String, default: 'whatsapp' },
  whatsappMessage:{ type: String, default: '' },
  notes:          { type: String, default: '' },
  isViewed:  { type: Boolean, default: false },
  viewedAt:  { type: Date, default: null },
}, { timestamps: true });

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ customerPhone: 1 });
orderSchema.index({ isViewed: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
