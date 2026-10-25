import app from './app.js';
import env from './config/env.js';
import logger from './logger.js';
import prisma from './lib/prisma.js';

const server = app.listen(env.PORT, () => {
  logger.info(`Server \x1b[32mrunning\x1b[0m on port: \x1b[32;1m${env.PORT}\x1b[0m`);
});

const shutdown = async () => {
  logger.info('Server \x1b[31mshutdown\x1b[0m')
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', (err) => logger.error(err));
