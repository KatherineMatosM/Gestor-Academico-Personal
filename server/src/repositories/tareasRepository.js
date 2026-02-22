const { getPool } = require('../config/database');
const Tarea = require('../models/Tarea');

class TareasRepository {
  async findAll(usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('usuarioId', usuarioId)
      .query('SELECT * FROM Tareas WHERE usuarioId = @usuarioId ORDER BY fechaLimite ASC');

    return result.recordset.map(t => {
      const tarea = { ...t };
      // Formatear fecha para el frontend
      if (tarea.fechaLimite && typeof tarea.fechaLimite === 'object') {
        tarea.fecha = tarea.fechaLimite.toISOString().split('T')[0];
      } else {
        tarea.fecha = tarea.fechaLimite;
      }
      return tarea;
    });
  }

  async findById(id, usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .query('SELECT * FROM Tareas WHERE id = @id AND usuarioId = @usuarioId');

    if (result.recordset.length === 0) {
      return null;
    }

    const tarea = { ...result.recordset[0] };
    if (tarea.fechaLimite && typeof tarea.fechaLimite === 'object') {
      tarea.fecha = tarea.fechaLimite.toISOString().split('T')[0];
    } else {
      tarea.fecha = tarea.fechaLimite;
    }
    return tarea;
  }

  async create(tareaData) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('usuarioId', tareaData.usuarioId)
      .input('materiaId', tareaData.materiaId)
      .input('titulo', tareaData.titulo)
      .input('tipo', tareaData.tipo)
      .input('fechaLimite', tareaData.fecha)
      .input('prioridad', tareaData.prioridad)
      .input('estado', tareaData.estado)
      .query(`
        INSERT INTO Tareas (usuarioId, materiaId, titulo, tipo, fechaLimite, prioridad, estado)
        OUTPUT INSERTED.*
        VALUES (@usuarioId, @materiaId, @titulo, @tipo, @fechaLimite, @prioridad, @estado)
      `);

    const tarea = { ...result.recordset[0] };
    if (tarea.fechaLimite && typeof tarea.fechaLimite === 'object') {
      tarea.fecha = tarea.fechaLimite.toISOString().split('T')[0];
    } else {
      tarea.fecha = tarea.fechaLimite;
    }
    return tarea;
  }

  async update(id, usuarioId, tareaData) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .input('materiaId', tareaData.materiaId)
      .input('titulo', tareaData.titulo)
      .input('tipo', tareaData.tipo)
      .input('fechaLimite', tareaData.fecha)
      .input('prioridad', tareaData.prioridad)
      .input('estado', tareaData.estado)
      .query(`
        UPDATE Tareas
        SET materiaId = @materiaId, titulo = @titulo, tipo = @tipo,
            fechaLimite = @fechaLimite, prioridad = @prioridad, estado = @estado,
            updateAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id AND usuarioId = @usuarioId
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    const tarea = { ...result.recordset[0] };
    if (tarea.fechaLimite && typeof tarea.fechaLimite === 'object') {
      tarea.fecha = tarea.fechaLimite.toISOString().split('T')[0];
    } else {
      tarea.fecha = tarea.fechaLimite;
    }
    return tarea;
  }

  async delete(id, usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .query('DELETE FROM Tareas WHERE id = @id AND usuarioId = @usuarioId');

    return result.rowsAffected[0] > 0;
  }
}

module.exports = new TareasRepository();