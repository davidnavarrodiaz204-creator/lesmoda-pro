// backend/src/middleware/auth.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Verifica el token JWT
exports.protect = async (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET no está definido');
    return res.status(500).json({ success: false, message: 'Error de configuración del servidor' });
  }

  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: 'Usuario inactivo' });
    }
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

// Solo admins
exports.adminOnly = (req, res, next) => {
  const allowed = new Set(['admin', 'owner', 'superadmin']);
  if (!allowed.has(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  next();
};

exports.allowRoles = (...roles) => (req, res, next) => {
  const allowed = new Set(roles);
  if (!allowed.has(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  next();
};
