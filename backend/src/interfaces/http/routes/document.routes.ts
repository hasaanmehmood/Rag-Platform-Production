import { FastifyInstance } from 'fastify';
import { DocumentController } from '../controllers/DocumentController.js';
import { validateQuery } from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { GetDocumentsSchema } from '../../../application/dto/document.dto.js';

export async function documentRoutes(fastify: FastifyInstance): Promise<void> {
  const controller = new DocumentController();
  
  // All document routes require authentication
  fastify.addHook('preHandler', authMiddleware);
  
  fastify.post('/upload', async (request, reply) => controller.upload(request, reply));
  
  fastify.get(
    '/',
    {
      preHandler: validateQuery(GetDocumentsSchema),
    },
    async (request, reply) => controller.list(request as any, reply)
  );
  
  fastify.get('/:id', async (request, reply) => controller.get(request as any, reply));
  
  fastify.delete('/:id', async (request, reply) => controller.delete(request as any, reply));
}