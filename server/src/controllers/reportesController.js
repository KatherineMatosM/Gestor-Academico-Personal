const reportesService = require('../services/reportesService');

class ReportesController {
  async getReporteGeneral(req, res, next) {
    try {
      const reporte = await reportesService.getReporteGeneral(req.userId);
      res.json(reporte);
    } catch (error) {
      next(error);
    }
  }

  async getReporteMaterias(req, res, next) {
    try {
      const reporte = await reportesService.getReporteMaterias(req.userId);
      res.json(reporte);
    } catch (error) {
      next(error);
    }
  }

  async getReporteTareas(req, res, next) {
    try {
      const reporte = await reportesService.getReporteTareas(req.userId);
      res.json(reporte);
    } catch (error) {
      next(error);
    }
  }

  async getReporteExamenes(req, res, next) {
    try {
      const reporte = await reportesService.getReporteExamenes(req.userId);
      res.json(reporte);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportesController();