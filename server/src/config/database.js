const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const server = process.env.DB_SERVER || 'Katherine';
const database = process.env.DB_DATABASE || 'GestorAcademico';
const driver = process.env.DB_DRIVER || 'ODBC Driver 17 for SQL Server';

const config = {
  connectionString: `Driver={${driver}};Server=${server};Database=${database};Trusted_Connection=yes;`,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

const getPool = async () => {
  if (!pool) {
    try {
      pool = await new sql.ConnectionPool(config).connect();
      console.log('[INFO] Pool de conexión creado exitosamente');
    } catch (err) {
      pool = null;
      console.error('[ERROR] Fallo al conectar:', err.message);
      throw err;
    }
  }
  return pool;
};

const closePool = async () => {
  if (pool) {
    await pool.close();
    pool = null;
  }
};

module.exports = {
  sql,
  getPool,
  closePool,
};