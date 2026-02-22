const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/general', reportesController.getReporteGeneral);
router.get('/materias', reportesController.getReporteMaterias);
router.get('/tareas', reportesController.getReporteTareas);
router.get('/examenes', reportesController.getReporteExamenes);

module.exports = router;