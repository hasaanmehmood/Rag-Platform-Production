import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { RegisterSchema, LoginSchema } from '../../../application/dto/auth.dto.js';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const controller = new AuthController();
  
  fastify.post(
    '/register',
    {
      preHandler: validateBody(RegisterSchema),
    },
    async (request, reply) => controller.register(request as any, reply)
  );
  
  fastify.post(
    '/login',
    {
      preHandler: validateBody(LoginSchema),
    },
    async (request, reply) => controller.login(request as any, reply)
  );
  
  fastify.get(
    '/me',
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => controller.me(request, reply)
  );
  
  fastify.post(
    '/logout',
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => controller.logout(request, reply)
  );
}