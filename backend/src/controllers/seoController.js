const Product = require('../models/Product');
const Config = require('../models/Config');

function domain(req) {
  const host = req.get('host') || 'lesmoda.com';
  return `${req.protocol || 'https'}://${host}`;
}

exports.sitemap = async (req, res) => {
  const base = domain(req);
  const config = await Config.findOne({ key: 'siteDescription' });
  const storeName = (await Config.get('storeName')) || 'LeisModa';

  let products = '';
  const all = await Product.find({ isActive: true }).select('slug updatedAt').lean();
  for (const p of all) {
    const d = p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString();
    products += `  <url><loc>${base}/producto/${p.slug}</loc><lastmod>${d}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${base}/about</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>${base}/how-to-buy</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
${products}</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
};

exports.robots = async (req, res) => {
  const base = domain(req);
  const indexable = await Config.get('indexable');
  const allow = indexable !== false;

  const lines = [];
  if (!allow) lines.push('User-agent: *\nDisallow: /');
  else {
    lines.push('User-agent: *');
    lines.push('Allow: /');
    lines.push('Disallow: /admin');
    lines.push('Disallow: /api');
    lines.push(`Sitemap: ${base}/sitemap.xml`);
  }
  lines.push('');

  res.set('Content-Type', 'text/plain');
  res.send(lines.join('\n'));
};

exports.organizationSchema = async (req, res) => {
  const base = domain(req);
  const storeName = (await Config.get('storeName')) || 'LeisModa';
  const logo = await Config.get('logo');
  const ogImage = await Config.get('ogImage');
  const facebook = await Config.get('facebook');
  const instagram = await Config.get('instagram');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: storeName,
    url: base,
    logo: logo || ogImage || `${base}/icons/icon.svg`,
    description: (await Config.get('siteDescription')) || 'Tienda de ropa online en Paita',
    sameAs: [facebook, instagram].filter(Boolean),
  };

  res.json({ success: true, data: schema });
};

exports.productSchema = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

  const base = domain(req);
  const storeName = (await Config.get('storeName')) || 'LeisModa';
  const img = product.images?.[0]?.url || '';
  const brand = (await Config.get('siteTitle')) || storeName;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} en ${storeName}`,
    image: img ? [img] : undefined,
    url: `${base}/producto/${product.slug}`,
    sku: product._id.toString(),
    brand: { '@type': 'Brand', name: brand },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PEN',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${base}/producto/${product.slug}`,
    },
  };

  if (product.oldPrice && product.oldPrice > product.price) {
    schema.offers.priceSpecification = {
      '@type': 'PriceSpecification',
      price: product.oldPrice,
      priceCurrency: 'PEN',
    };
  }

  res.json({ success: true, data: schema });
};
