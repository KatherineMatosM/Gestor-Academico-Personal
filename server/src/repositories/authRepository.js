const { getPool } = require('../config/database');
const Usuario = require('../models/Usuario');

class AuthRepository {
  async findByEmail(email) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('email', email)
      .query('SELECT * FROM Usuario WHERE email = @email');

    if (result.recordset.length === 0) {
      return null;
    }

    return new Usuario(result.recordset[0]);
  }

  async findById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .query('SELECT * FROM Usuario WHERE id = @id');

    if (result.recordset.length === 0) {
      return null;
    }

    return new Usuario(result.recordset[0]);
  }

  async create(userData) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('nombre', userData.nombre)
      .input('email', userData.email)
      .input('password', userData.password)
      .query(`
        INSERT INTO Usuario (nombre, email, password)
        OUTPUT INSERTED.*
        VALUES (@nombre, @email, @password)
      `);

    return new Usuario(result.recordset[0]);
  }

  async update(id, userData) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('nombre', userData.nombre)
      .input('email', userData.email)
      .query(`
        UPDATE Usuario
        SET nombre = @nombre, email = @email, updateAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    return new Usuario(result.recordset[0]);
  }

  async updatePassword(id, hashedPassword) {
    const pool = await getPool();
    await pool
      .request()
      .input('id', id)
      .input('password', hashedPassword)
      .query(`
        UPDATE Usuario
        SET password = @password, updateAt = GETDATE()
        WHERE id = @id
      `);
  }

  async delete(id) {
    const pool = await getPool();
    await pool
      .request()
      .input('id', id)
      .query('DELETE FROM Usuario WHERE id = @id');
  }
}

module.exports = new AuthRepository();