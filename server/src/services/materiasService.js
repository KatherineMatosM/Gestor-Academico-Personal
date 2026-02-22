const materiasRepository = require('../repositories/materiasRepository');
const { NotFoundError } = require('../utils/errors');

class MateriasService {
  async getAll(usuarioId) {
    return await materiasRepository.findAll(usuarioId);
  }

  async getById(id, usuarioId) {
    const materia = await materiasRepository.findById(id, usuarioId);
    
    if (!materia) {
      throw new NotFoundError('Materia no encontrada');
    }

    return materia;
  }

  async create(usuarioId, materiaData) {
    const data = {
      usuarioId,
      nombre: materiaData.nombre,
      codigo: materiaData.codigo,
      creditos: materiaData.creditos,
      dificultad: materiaData.dificultad || 'Media',
      estado: materiaData.estado || 'Activa',
      nota: materiaData.nota || null,
    };

    return await materiasRepository.create(data);
  }

  async update(id, usuarioId, materiaData) {
    const materia = await materiasRepository.update(id, usuarioId, materiaData);
    
    if (!materia) {
      throw new NotFoundError('Materia no encontrada');
    }

    return materia;
  }

  async delete(id, usuarioId) {
    const deleted = await materiasRepository.delete(id, usuarioId);
    
    if (!deleted) {
      throw new NotFoundError('Materia no encontrada');
    }

    return { success: true, message: 'Materia eliminada correctamente' };
  }
}

module.exports = new MateriasService();