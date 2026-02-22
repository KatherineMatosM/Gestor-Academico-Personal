const { getPool } = require('../config/database');
const Examen = require('../models/Examen');

class ExamenesRepository {
  async findAll(usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('usuarioId', usuarioId)
      .query('SELECT * FROM Examen WHERE usuarioId = @usuarioId ORDER BY fecha DESC');

    return result.recordset.map(e => {
      const examen = { ...e };
      // Formatear fecha si es necesario
      if (examen.fecha && typeof examen.fecha === 'object') {
        examen.fecha = examen.fecha.toISOString().split('T')[0];
      }
      return examen;
    });
  }

  async findById(id, usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .query('SELECT * FROM Examen WHERE id = @id AND usuarioId = @usuarioId');

    if (result.recordset.length === 0) {
      return null;
    }

    const examen = { ...result.recordset[0] };
    if (examen.fecha && typeof examen.fecha === 'object') {
      examen.fecha = examen.fecha.toISOString().split('T')[0];
    }
    return examen;
  }

  async create(examenData) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('usuarioId', examenData.usuarioId)
      .input('materiaId', examenData.materiaId)
      .input('titulo', examenData.titulo)
      .input('fecha', examenData.fecha)
      .input('hora', examenData.hora)
      .input('temas', examenData.temas)
      .input('preparacion', examenData.preparacion)
      .input('nota', examenData.nota)
      .input('autoevaluacion', examenData.autoevaluacion)
      .query(`
        INSERT INTO Examen (usuarioId, materiaId, titulo, fecha, hora, temas, preparacion, nota, autoevaluacion)
        OUTPUT INSERTED.*
        VALUES (@usuarioId, @materiaId, @titulo, @fecha, @hora, @temas, @preparacion, @nota, @autoevaluacion)
      `);

    const examen = { ...result.recordset[0] };
    if (examen.fecha && typeof examen.fecha === 'object') {
      examen.fecha = examen.fecha.toISOString().split('T')[0];
    }
    return examen;
  }

  async update(id, usuarioId, examenData) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .input('materiaId', examenData.materiaId)
      .input('titulo', examenData.titulo)
      .input('fecha', examenData.fecha)
      .input('hora', examenData.hora)
      .input('temas', examenData.temas)
      .input('preparacion', examenData.preparacion)
      .input('nota', examenData.nota)
      .input('autoevaluacion', examenData.autoevaluacion)
      .query(`
        UPDATE Examen
        SET materiaId = @materiaId, titulo = @titulo, fecha = @fecha, hora = @hora,
            temas = @temas, preparacion = @preparacion, nota = @nota,
            autoevaluacion = @autoevaluacion, updateAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id AND usuarioId = @usuarioId
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    const examen = { ...result.recordset[0] };
    if (examen.fecha && typeof examen.fecha === 'object') {
      examen.fecha = examen.fecha.toISOString().split('T')[0];
    }
    return examen;
  }

  async delete(id, usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .query('DELETE FROM Examen WHERE id = @id AND usuarioId = @usuarioId');

    return result.rowsAffected[0] > 0;
  }
}

module.exports = new ExamenesRepository();