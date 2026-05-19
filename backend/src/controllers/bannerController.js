const Banner = require('../models/Banner');

exports.getBanners = async (req, res) => {
  const filter = req.query.admin === 'true' ? {} : { isActive: true };
  const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data: banners });
};

exports.createBanner = async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, data: banner });
};

exports.updateBanner = async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!banner) return res.status(404).json({ success: false, message: 'Banner no encontrado' });
  res.json({ success: true, data: banner });
};

exports.deleteBanner = async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner no encontrado' });
  res.json({ success: true, message: 'Banner eliminado' });
};
