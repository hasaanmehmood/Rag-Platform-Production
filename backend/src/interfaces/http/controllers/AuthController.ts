import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUser } from '../../../application/use-cases/auth/RegisterUser.js';
import { LoginUser } from '../../../application/use-cases/auth/LoginUser.js';
import { PostgresUserRepository } from '../../../infrastructure/database/repositories/PostgresUserRepository.js';
import { RegisterDTO, LoginDTO } from '../../../application/dto/auth.dto.js';
import { HTTP_STATUS } from '../../../shared/constants.js';

export class AuthController {
  private registerUser: RegisterUser;
  private loginUser: LoginUser;
  
  constructor() {
    const userRepository = new PostgresUserRepository();
    this.registerUser = new RegisterUser(userRepository);
    this.loginUser = new LoginUser(userRepository);
  }
  
  async register(
    request: FastifyRequest<{ Body: RegisterDTO }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const user = await this.registerUser.execute(request.body);
      
      return reply.status(HTTP_STATUS.CREATED).send({
        token: user.accessToken, // Frontend expects 'token'
        user: {
          id: user.id,
          email: user.email,
          role: user.role || 'user',
        }
      });
    } catch (error: any) {
      request.log.error({ error }, 'Registration failed');
      
      // Don't throw - just send error response
      const statusCode = error.statusCode || 500;
      return reply.status(statusCode).send({
        error: error.message || 'Registration failed',
        code: error.code
      });
    }
  }
  
  async login(
    request: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const user = await this.loginUser.execute(request.body);
      
      return reply.status(HTTP_STATUS.OK).send({
        token: user.accessToken, // Frontend expects 'token'
        user: {
          id: user.id,
          email: user.email,
          role: user.role || 'user',
        }
      });
    } catch (error: any) {
      request.log.error({ error }, 'Login failed');
      
      const statusCode = error.statusCode || 401;
      return reply.status(statusCode).send({
        error: error.message || 'Login failed',
        code: error.code
      });
    }
  }
  
  async me(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    return reply.status(HTTP_STATUS.OK).send(request.user);
  }
  
  async logout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    return reply.status(HTTP_STATUS.OK).send({
      success: true,
    });
  }
}