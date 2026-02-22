const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.userId, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = await authService.changePassword(req.userId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();