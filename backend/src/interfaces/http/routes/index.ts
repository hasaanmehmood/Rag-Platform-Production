import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes.js';
import { documentRoutes } from './document.routes.js';
import { chatRoutes } from './chat.routes.js';
import { healthRoutes } from './health.routes.js';

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  // Health routes (no prefix, public)
  await fastify.register(healthRoutes);
  
  // API v1 routes
  await fastify.register(
    async (instance) => {
      await instance.register(authRoutes, { prefix: '/auth' });
      await instance.register(documentRoutes, { prefix: '/documents' });
      await instance.register(chatRoutes, { prefix: '/chat' });
    },
    { prefix: '/api/v1' }
  );
}