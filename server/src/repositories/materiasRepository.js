const { getPool } = require('../config/database');
const Materia = require('../models/Materia');

class MateriasRepository {
  async findAll(usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('usuarioId', usuarioId)
      .query('SELECT * FROM Materia WHERE usuarioId = @usuarioId ORDER BY createAt DESC');

    return result.recordset.map(m => new Materia(m));
  }

  async findById(id, usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .query('SELECT * FROM Materia WHERE id = @id AND usuarioId = @usuarioId');

    if (result.recordset.length === 0) {
      return null;
    }

    return new Materia(result.recordset[0]);
  }

  async create(materiaData) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('usuarioId', materiaData.usuarioId)
      .input('nombre', materiaData.nombre)
      .input('codigo', materiaData.codigo)
      .input('creditos', materiaData.creditos)
      .input('dificultad', materiaData.dificultad)
      .input('estado', materiaData.estado)
      .input('nota', materiaData.nota)
      .query(`
        INSERT INTO Materia (usuarioId, nombre, codigo, creditos, dificultad, estado, nota)
        OUTPUT INSERTED.*
        VALUES (@usuarioId, @nombre, @codigo, @creditos, @dificultad, @estado, @nota)
      `);

    return new Materia(result.recordset[0]);
  }

  async update(id, usuarioId, materiaData) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .input('nombre', materiaData.nombre)
      .input('codigo', materiaData.codigo)
      .input('creditos', materiaData.creditos)
      .input('dificultad', materiaData.dificultad)
      .input('estado', materiaData.estado)
      .input('nota', materiaData.nota)
      .query(`
        UPDATE Materia
        SET nombre = @nombre, codigo = @codigo, creditos = @creditos,
            dificultad = @dificultad, estado = @estado, nota = @nota,
            updateAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id AND usuarioId = @usuarioId
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    return new Materia(result.recordset[0]);
  }

  async delete(id, usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .query('DELETE FROM Materia WHERE id = @id AND usuarioId = @usuarioId');

    return result.rowsAffected[0] > 0;
  }
}

module.exports = new MateriasRepository();