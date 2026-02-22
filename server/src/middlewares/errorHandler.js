const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error capturado:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Error no operacional
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
};

module.exports = errorHandler;