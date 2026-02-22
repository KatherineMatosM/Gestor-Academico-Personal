const apuntesRepository = require('../repositories/apuntesRepository');
const { NotFoundError } = require('../utils/errors');

class ApuntesService {
  async getAll(usuarioId) {
    return await apuntesRepository.findAll(usuarioId);
  }

  async getById(id, usuarioId) {
    const apunte = await apuntesRepository.findById(id, usuarioId);
    
    if (!apunte) {
      throw new NotFoundError('Apunte no encontrado');
    }

    return apunte;
  }

  async create(usuarioId, apunteData) {
    const data = {
      materiaId: apunteData.materiaId,
      usuarioId,
      titulo: apunteData.titulo,
      contenido: apunteData.contenido,
    };

    return await apuntesRepository.create(data);
  }

  async update(id, usuarioId, apunteData) {
    const apunte = await apuntesRepository.update(id, usuarioId, apunteData);
    
    if (!apunte) {
      throw new NotFoundError('Apunte no encontrado');
    }

    return apunte;
  }

  async delete(id, usuarioId) {
    const deleted = await apuntesRepository.delete(id, usuarioId);
    
    if (!deleted) {
      throw new NotFoundError('Apunte no encontrado');
    }

    return { success: true, message: 'Apunte eliminado correctamente' };
  }
}

module.exports = new ApuntesService();