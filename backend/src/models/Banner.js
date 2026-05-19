const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    text:     { type: String, required: true, trim: true, maxlength: 200 },
    subtitle: { type: String, trim: true, default: '' },
    color:    { type: String, default: '#C9A96E' },
    cta:      { type: String, default: '' },
    link:     { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true },
    order:    { type: Number, default: 0 },
    storeId:  { type: String, default: 'default', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
