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
    controller.register.bind(controller)
  );
  
  fastify.post(
    '/login',
    {
      preHandler: validateBody(LoginSchema),
    },
    controller.login.bind(controller)
  );
  
  fastify.get(
    '/me',
    {
      preHandler: authMiddleware,
    },
    controller.me.bind(controller)
  );
  
  fastify.post(
    '/logout',
    {
      preHandler: authMiddleware,
    },
    controller.logout.bind(controller)
  );
}