import { startServer } from './interfaces/http/server.js';
import { logger } from './shared/logger.js';

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Rejection');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
  process.exit(1);
});

startServer().catch((error) => {
  logger.error({ error }, 'Failed to start application');
  process.exit(1);
});