const apuntesService = require('../services/apuntesService');

class ApuntesController {
  async getAll(req, res, next) {
    try {
      const apuntes = await apuntesService.getAll(req.userId);
      res.json(apuntes);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const apunte = await apuntesService.getById(req.params.id, req.userId);
      res.json(apunte);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const apunte = await apuntesService.create(req.userId, req.body);
      res.status(201).json(apunte);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const apunte = await apuntesService.update(req.params.id, req.userId, req.body);
      res.json(apunte);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await apuntesService.delete(req.params.id, req.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ApuntesController();