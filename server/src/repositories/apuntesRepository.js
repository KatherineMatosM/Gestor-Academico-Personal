const { getPool } = require('../config/database');
const Apunte = require('../models/Apunte');

class ApuntesRepository {
  async findAll(usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('usuarioId', usuarioId)
      .query('SELECT * FROM Apunte WHERE usuarioId = @usuarioId ORDER BY createAt DESC');

    return result.recordset.map(a => new Apunte(a));
  }

  async findById(id, usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .query('SELECT * FROM Apunte WHERE id = @id AND usuarioId = @usuarioId');

    if (result.recordset.length === 0) {
      return null;
    }

    return new Apunte(result.recordset[0]);
  }

  async create(apunteData) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('materiaId', apunteData.materiaId)
      .input('usuarioId', apunteData.usuarioId)
      .input('titulo', apunteData.titulo)
      .input('contenido', apunteData.contenido)
      .query(`
        INSERT INTO Apunte (materiaId, usuarioId, titulo, contenido)
        OUTPUT INSERTED.*
        VALUES (@materiaId, @usuarioId, @titulo, @contenido)
      `);

    return new Apunte(result.recordset[0]);
  }

  async update(id, usuarioId, apunteData) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .input('materiaId', apunteData.materiaId)
      .input('titulo', apunteData.titulo)
      .input('contenido', apunteData.contenido)
      .query(`
        UPDATE Apunte
        SET materiaId = @materiaId, titulo = @titulo, contenido = @contenido,
            updateAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id AND usuarioId = @usuarioId
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    return new Apunte(result.recordset[0]);
  }

  async delete(id, usuarioId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('usuarioId', usuarioId)
      .query('DELETE FROM Apunte WHERE id = @id AND usuarioId = @usuarioId');

    return result.rowsAffected[0] > 0;
  }
}

module.exports = new ApuntesRepository();