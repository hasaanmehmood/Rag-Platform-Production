import { startServer } from './interfaces/http/server.js';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});