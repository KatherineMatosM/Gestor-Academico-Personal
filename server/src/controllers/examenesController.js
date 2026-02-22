const examenesService = require('../services/examenesService');

class ExamenesController {
  async getAll(req, res, next) {
    try {
      const examenes = await examenesService.getAll(req.userId);
      res.json(examenes);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const examen = await examenesService.getById(req.params.id, req.userId);
      res.json(examen);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const examen = await examenesService.create(req.userId, req.body);
      res.status(201).json(examen);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const examen = await examenesService.update(req.params.id, req.userId, req.body);
      res.json(examen);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await examenesService.delete(req.params.id, req.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExamenesController();