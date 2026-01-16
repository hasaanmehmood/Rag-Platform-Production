import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { config } from '../../config/index.js';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

export async function createServer() {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: config.nodeEnv === 'development' ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
        },
      } : undefined,
    },
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'reqId',
    disableRequestLogging: false,
    trustProxy: true,
  });
  
  // Security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });
  
  // CORS
  await fastify.register(cors, {
    origin: config.nodeEnv === 'production' 
      ? ['https://your-frontend-domain.com'] 
      : true,
    credentials: true,
  });
  
  // Rate limiting
  await fastify.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
  });
  
  // Multipart support for file uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: config.upload.maxFileSize,
      files: 1,
    },
  });
  
  // Register routes
  await registerRoutes(fastify);
  
  // Error handler (must be last)
  fastify.setErrorHandler(errorHandler);
  
  return fastify;
}

export async function startServer() {
  try {
    const fastify = await createServer();
    
    await fastify.listen({
      port: config.port,
      host: '0.0.0.0',
    });
    
    console.log(`Server listening on http://0.0.0.0:${config.port}`);
    
    // Graceful shutdown
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`Received ${signal}, closing server...`);
        await fastify.close();
        process.exit(0);
      });
    });
    
    return fastify;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}