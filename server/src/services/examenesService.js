const examenesRepository = require('../repositories/examenesRepository');
const { NotFoundError } = require('../utils/errors');

class ExamenesService {
  async getAll(usuarioId) {
    return await examenesRepository.findAll(usuarioId);
  }

  async getById(id, usuarioId) {
    const examen = await examenesRepository.findById(id, usuarioId);
    
    if (!examen) {
      throw new NotFoundError('Examen no encontrado');
    }

    return examen;
  }

  async create(usuarioId, examenData) {
    const data = {
      usuarioId,
      materiaId: examenData.materiaId,
      titulo: examenData.titulo,
      fecha: examenData.fecha,
      hora: examenData.hora || '10:00',
      temas: examenData.temas || '',
      preparacion: examenData.preparacion || 0,
      nota: examenData.nota || null,
      autoevaluacion: examenData.autoevaluacion || '',
    };

    return await examenesRepository.create(data);
  }

  async update(id, usuarioId, examenData) {
    const examen = await examenesRepository.update(id, usuarioId, examenData);
    
    if (!examen) {
      throw new NotFoundError('Examen no encontrado');
    }

    return examen;
  }

  async delete(id, usuarioId) {
    const deleted = await examenesRepository.delete(id, usuarioId);
    
    if (!deleted) {
      throw new NotFoundError('Examen no encontrado');
    }

    return { success: true, message: 'Examen eliminado correctamente' };
  }
}

module.exports = new ExamenesService();