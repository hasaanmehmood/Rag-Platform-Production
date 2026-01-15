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
    const user = await this.registerUser.execute(request.body);
    
    reply.status(HTTP_STATUS.CREATED).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    });
  }
  
  async login(
    request: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply
  ): Promise<void> {
    const user = await this.loginUser.execute(request.body);
    
    reply.status(HTTP_STATUS.OK).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    });
  }
  
  async me(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.status(HTTP_STATUS.OK).send({
      user: request.user,
    });
  }
  
  async logout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Supabase handles token invalidation automatically
    reply.status(HTTP_STATUS.OK).send({
      success: true,
    });
  }
}