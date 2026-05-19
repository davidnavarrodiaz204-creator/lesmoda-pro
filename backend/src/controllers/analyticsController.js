const Product = require('../models/Product');

exports.track = async (req, res) => {
  res.json({ success: true });
};

exports.getStats = async (req, res) => {
  const [mostViewed, mostOrdered] = await Promise.all([
    Product.find({ isActive: true }).sort({ whatsappClicks: -1 }).limit(10).select('name price images whatsappClicks'),
    Product.aggregate([
      { $match: { isActive: true } },
      { $sort: { whatsappClicks: -1 } },
      { $limit: 10 },
      { $project: { name: 1, price: 1, 'images.url': 1, whatsappClicks: 1 } },
    ]),
  ]);
  res.json({ success: true, data: { mostViewed, mostOrdered } });
};
