const tareasRepository = require('../repositories/tareasRepository');
const { NotFoundError } = require('../utils/errors');

class TareasService {
  async getAll(usuarioId) {
    return await tareasRepository.findAll(usuarioId);
  }

  async getById(id, usuarioId) {
    const tarea = await tareasRepository.findById(id, usuarioId);
    
    if (!tarea) {
      throw new NotFoundError('Tarea no encontrada');
    }

    return tarea;
  }

  async create(usuarioId, tareaData) {
    const data = {
      usuarioId,
      materiaId: tareaData.materiaId,
      titulo: tareaData.titulo,
      tipo: tareaData.tipo || 'Estudio',
      fecha: tareaData.fecha,
      prioridad: tareaData.prioridad || 'Media',
      estado: tareaData.estado || 'Pendiente',
    };

    return await tareasRepository.create(data);
  }

  async update(id, usuarioId, tareaData) {
    const tarea = await tareasRepository.update(id, usuarioId, tareaData);
    
    if (!tarea) {
      throw new NotFoundError('Tarea no encontrada');
    }

    return tarea;
  }

  async delete(id, usuarioId) {
    const deleted = await tareasRepository.delete(id, usuarioId);
    
    if (!deleted) {
      throw new NotFoundError('Tarea no encontrada');
    }

    return { success: true, message: 'Tarea eliminada correctamente' };
  }
}

module.exports = new TareasService();