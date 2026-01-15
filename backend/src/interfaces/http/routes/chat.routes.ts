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
    controller.createSession.bind(controller)
  );
  
  fastify.get('/sessions', controller.listSessions.bind(controller));
  
  fastify.get('/sessions/:sessionId/messages', controller.getMessages.bind(controller));
  
  fastify.post(
    '/sessions/:sessionId/messages',
    {
      preHandler: validateBody(SendMessageSchema),
    },
    controller.sendMessage.bind(controller)
  );
  
  fastify.delete('/sessions/:sessionId', controller.deleteSession.bind(controller));
}