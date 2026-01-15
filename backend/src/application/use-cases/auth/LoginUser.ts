import { supabaseAnonClient } from '../../../infrastructure/external/supabase-client.js';
import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { UserWithAuth } from '../../../domain/entities/User.js';
import { LoginDTO } from '../../dto/auth.dto.js';
import { UnauthorizedError, InternalError } from '../../errors/AppError.js';
import { logger } from '../../../shared/logger.js';

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}
  
  async execute(dto: LoginDTO): Promise<UserWithAuth> {
    try {
      const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });
      
      if (error || !data.user || !data.session) {
        throw new UnauthorizedError('Invalid credentials');
      }
      
      const role = await this.userRepository.getUserRole(data.user.id);
      
      return {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        role,
        createdAt: new Date(data.user.created_at),
        updatedAt: new Date(data.user.updated_at || data.user.created_at),
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      logger.error({ error }, 'Error in LoginUser use case');
      throw new InternalError('Failed to login');
    }
  }
}