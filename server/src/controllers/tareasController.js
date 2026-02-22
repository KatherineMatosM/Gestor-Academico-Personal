const tareasService = require('../services/tareasService');

class TareasController {
  async getAll(req, res, next) {
    try {
      const tareas = await tareasService.getAll(req.userId);
      res.json(tareas);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const tarea = await tareasService.getById(req.params.id, req.userId);
      res.json(tarea);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const tarea = await tareasService.create(req.userId, req.body);
      res.status(201).json(tarea);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const tarea = await tareasService.update(req.params.id, req.userId, req.body);
      res.json(tarea);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await tareasService.delete(req.params.id, req.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TareasController();