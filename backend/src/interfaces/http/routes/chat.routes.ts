import { FastifyInstance } from 'fastify';
import { ChatController } from '../controllers/ChatController.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { CreateSessionSchema, SendMessageSchema } from '../../../application/dto/chat.dto.js';

export async function chatRoutes(fastify: FastifyInstance): Promise<void> {
  const controller = new ChatController();
  
  // All chat routes require authentication
  fastify.addHook('preHandler', authMiddleware);
  
  fastify.post(
    '/sessions',
    {
      preHandler: validateBody(CreateSessionSchema),
    },
    async (request, reply) => controller.createSession(request as any, reply)
  );
  
  fastify.get('/sessions', async (request, reply) => controller.listSessions(request, reply));
  
  fastify.get('/sessions/:sessionId/messages', async (request, reply) => 
    controller.getMessages(request as any, reply)
  );
  
  fastify.post(
    '/sessions/:sessionId/messages',
    {
      preHandler: validateBody(SendMessageSchema),
    },
    async (request, reply) => controller.handleSendMessage(request as any, reply)
  );
  
  fastify.delete('/sessions/:sessionId', async (request, reply) => 
    controller.deleteSession(request as any, reply)
  );
}