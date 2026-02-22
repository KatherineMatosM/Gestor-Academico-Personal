const { ValidationError } = require('../utils/errors');

const validateMateria = (req, res, next) => {
  const { nombre, codigo, creditos } = req.body;

  if (!nombre || nombre.trim().length === 0) {
    throw new ValidationError('El nombre de la materia es requerido');
  }

  if (!codigo || codigo.trim().length === 0) {
    throw new ValidationError('El código de la materia es requerido');
  }

  if (!creditos || creditos < 1 || creditos > 8) {
    throw new ValidationError('Los créditos deben estar entre 1 y 8');
  }

  next();
};

const validateTarea = (req, res, next) => {
  const { titulo, materiaId, fecha } = req.body;

  if (!titulo || titulo.trim().length === 0) {
    throw new ValidationError('El título de la tarea es requerido');
  }

  if (!materiaId) {
    throw new ValidationError('La materia es requerida');
  }

  if (!fecha) {
    throw new ValidationError('La fecha límite es requerida');
  }

  next();
};

const validateExamen = (req, res, next) => {
  const { titulo, materiaId, fecha, hora } = req.body;

  if (!titulo || titulo.trim().length === 0) {
    throw new ValidationError('El título del examen es requerido');
  }

  if (!materiaId) {
    throw new ValidationError('La materia es requerida');
  }

  if (!fecha) {
    throw new ValidationError('La fecha del examen es requerida');
  }

  if (!hora) {
    throw new ValidationError('La hora del examen es requerida');
  }

  next();
};

const validateApunte = (req, res, next) => {
  const { titulo, materiaId, contenido } = req.body;

  if (!titulo || titulo.trim().length === 0) {
    throw new ValidationError('El título del apunte es requerido');
  }

  if (!materiaId) {
    throw new ValidationError('La materia es requerida');
  }

  if (!contenido || contenido.trim().length === 0) {
    throw new ValidationError('El contenido del apunte es requerido');
  }

  next();
};

const validateAuth = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.includes('@')) {
    throw new ValidationError('Email inválido');
  }

  if (!password || password.length < 4) {
    throw new ValidationError('La contraseña debe tener al menos 4 caracteres');
  }

  next();
};

module.exports = {
  validateMateria,
  validateTarea,
  validateExamen,
  validateApunte,
  validateAuth,
};