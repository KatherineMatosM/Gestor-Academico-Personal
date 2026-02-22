const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const materiasRoutes = require('./materiasRoutes');
const tareasRoutes = require('./tareasRoutes');
const examenesRoutes = require('./examenesRoutes');
const apuntesRoutes = require('./apuntesRoutes');
const reportesRoutes = require('./reportesRoutes');

router.use('/auth', authRoutes);
router.use('/materias', materiasRoutes);
router.use('/tareas', tareasRoutes);
router.use('/examenes', examenesRoutes);
router.use('/apuntes', apuntesRoutes);
router.use('/reportes', reportesRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;