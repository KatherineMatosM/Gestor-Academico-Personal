const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const authConfig = require('../config/auth');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      throw new UnauthorizedError('Token con formato inválido');
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      throw new UnauthorizedError('Token mal formateado');
    }

    jwt.verify(token, authConfig.jwtSecret, (err, decoded) => {
      if (err) {
        throw new UnauthorizedError('Token inválido o expirado');
      }

      req.userId = decoded.id;
      req.userEmail = decoded.email;
      return next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;