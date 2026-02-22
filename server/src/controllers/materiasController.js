const materiasService = require('../services/materiasService');

class MateriasController {
  async getAll(req, res, next) {
    try {
      const materias = await materiasService.getAll(req.userId);
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const materia = await materiasService.getById(req.params.id, req.userId);
      res.json(materia);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const materia = await materiasService.create(req.userId, req.body);
      res.status(201).json(materia);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const materia = await materiasService.update(req.params.id, req.userId, req.body);
      res.json(materia);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await materiasService.delete(req.params.id, req.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MateriasController();