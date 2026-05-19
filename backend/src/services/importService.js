const { parse } = require('csv-parse/sync');
const Product = require('../models/Product');

const ALLOWED_BADGES = ['new', 'sale', 'hot', 'last', 'featured', ''];
const VALID_CATEGORIES = ['Mujer', 'Hombre', 'Accesorios', 'General'];
const MAX_ROWS = 300;

function parseList(val) {
  if (!val || typeof val !== 'string') return [];
  return val.split(/[,|]/).map(s => s.trim()).filter(Boolean);
}

function parseBool(val) {
  if (val === undefined || val === null) return false;
  if (typeof val === 'boolean') return val;
  const str = String(val).toLowerCase().trim();
  return str === 'true' || str === '1' || str === 'yes';
}

function validateRow(row, index) {
  const errors = [];
  const cleaned = {};

  if (!row.name || !String(row.name).trim()) {
    errors.push('name es obligatorio');
  } else {
    cleaned.name = String(row.name).trim();
  }

  const price = parseFloat(row.price);
  if (isNaN(price) || price < 0) {
    errors.push('price debe ser un numero valido mayor o igual a 0');
  } else {
    cleaned.price = price;
  }

  const cat = String(row.category || 'General').trim();
  cleaned.category = VALID_CATEGORIES.includes(cat) ? cat : 'General';

  const oldPrice = parseFloat(row.oldPrice);
  cleaned.oldPrice = isNaN(oldPrice) || oldPrice <= 0 ? undefined : oldPrice;

  const stock = parseInt(row.stock, 10);
  cleaned.stock = isNaN(stock) || stock < 0 ? 0 : stock;

  const badge = String(row.badge || '').trim().toLowerCase();
  cleaned.badge = ALLOWED_BADGES.includes(badge) ? badge || null : null;
  if (badge && !ALLOWED_BADGES.includes(badge)) {
    errors.push(`badge "${row.badge}" no es valido. Valores: ${ALLOWED_BADGES.filter(Boolean).join(', ')}`);
  }

  cleaned.sizes = parseList(row.sizes);
  cleaned.colors = parseList(row.colors);

  cleaned.description = String(row.description || '').trim();

  const imageUrl = String(row.imageUrl || '').trim();
  cleaned.imageUrl = imageUrl || null;

  cleaned.isActive = parseBool(row.isActive);
  cleaned.featured = parseBool(row.featured);

  return { valid: errors.length === 0, data: cleaned, errors, index };
}

function validateRows(rows) {
  const valid = [];
  const invalid = [];

  rows.forEach((row, i) => {
    const result = validateRow(row, i);
    if (result.valid) {
      valid.push(result.data);
    } else {
      invalid.push(result);
    }
  });

  return { valid, invalid, total: rows.length, validCount: valid.length, invalidCount: invalid.length };
}

function parseCSV(content) {
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
  });
  return records;
}

module.exports = { parseCSV, validateRows, validateRow, MAX_ROWS };
