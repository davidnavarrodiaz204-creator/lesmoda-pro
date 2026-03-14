// backend/src/controllers/authController.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// ── POST /api/auth/login ──────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });

  if (!user.isActive)
    return res.status(401).json({ success: false, message: 'Cuenta desactivada' });

  const token = signToken(user._id);
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// ── POST /api/auth/register ───────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Nombre, email y contraseña son requeridos' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: 'Ya existe un usuario con ese email' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' });

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'editor' ? 'editor' : 'admin',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
