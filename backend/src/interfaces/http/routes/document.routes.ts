import { FastifyInstance } from 'fastify';
import { DocumentController } from '../controllers/DocumentController.js';
import { validateQuery } from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { GetDocumentsSchema } from '../../../application/dto/document.dto.js';

export async function documentRoutes(fastify: FastifyInstance): Promise<void> {
  const controller = new DocumentController();
  
  // All document routes require authentication
  fastify.addHook('preHandler', authMiddleware);
  
  fastify.post('/upload', controller.upload.bind(controller));
  
  fastify.get(
    '/',
    {
      preHandler: validateQuery(GetDocumentsSchema),
    },
    controller.list.bind(controller)
  );
  
  fastify.get('/:id', controller.get.bind(controller));
  
  fastify.delete('/:id', controller.delete.bind(controller));
}