import { FastifyInstance } from 'fastify';
import { ChatController } from '../controllers/ChatController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { CreateSessionSchema, SendMessageSchema } from '../../../application/dto/chat.dto.js';

export async function chatRoutes(fastify: FastifyInstance): Promise<void> {
  const controller = new ChatController();
  
  fastify.post('/sessions', {
    preHandler: authMiddleware
  }, async (request, reply) => {
    // Validate manually
    const validation = CreateSessionSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send({ error: 'Validation failed', details: validation.error });
    }
    return controller.createSession(request as any, reply);
  });
  
  fastify.get('/sessions', {
    preHandler: authMiddleware
  }, async (request, reply) => controller.listSessions(request as any, reply));
  
  fastify.get('/sessions/:sessionId/messages', {
    preHandler: authMiddleware
  }, async (request, reply) => controller.getMessages(request as any, reply));
  
  // Streaming endpoint
  fastify.post('/sessions/:sessionId/messages', {
    preHandler: authMiddleware
  }, (request, reply) => {
    // Validate manually
    const validation = SendMessageSchema.safeParse(request.body);
    if (!validation.success) {
      reply.status(400).send({ error: 'Validation failed', details: validation.error });
      return;
    }
    
    // Call streaming controller
    controller.sendMessage(request, reply);
  });
  
  fastify.delete('/sessions/:sessionId', {
    preHandler: authMiddleware
  }, async (request, reply) => controller.deleteSession(request as any, reply));
}