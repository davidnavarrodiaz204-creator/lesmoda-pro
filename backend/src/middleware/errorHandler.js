// backend/src/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Error interno del servidor';

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message    = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // ID de Mongo inválido
  if (err.name === 'CastError') {
    statusCode = 400;
    message    = 'ID inválido';
  }

  // Clave duplicada (ej: email ya existe)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `El campo "${field}" ya existe`;
  }

  // JWT expirado
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Sesión expirada, inicia sesión de nuevo';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('❌', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
