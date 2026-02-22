require('dotenv').config();
const app = require('./src/app');
const { getPool, closePool } = require('./src/config/database');
const logger = require('./src/utils/logger');
const serverConfig = require('./src/config/server');

const PORT = serverConfig.port;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await getPool();
    logger.info('Conexión a la base de datos establecida');

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      logger.info(`Servidor ejecutándose en puerto ${PORT}`);
      logger.info(`Entorno: ${serverConfig.env}`);
    });

    // Manejo de cierre graceful
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} recibido. Cerrando servidor...`);
      
      server.close(async () => {
        logger.info('Servidor cerrado');
        
        try {
          await closePool();
          logger.info('Conexion a la base de datos cerrada');
          process.exit(0);
        } catch (error) {
          logger.error('Error al cerrar la conexión a la base de datos', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();