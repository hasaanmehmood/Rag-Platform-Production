import { supabaseAnonClient } from '../../../infrastructure/external/supabase-client.js';
import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { UserWithAuth } from '../../../domain/entities/User.js';
import { RegisterDTO } from '../../dto/auth.dto.js';
import { ConflictError, InternalError } from '../../errors/AppError.js';
import { USER_ROLES } from '../../../shared/constants.js';
import logger from '../../../shared/logger.js';

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}
  
  async execute(dto: RegisterDTO): Promise<UserWithAuth> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }
      
      // Register user with Supabase Auth
      const { data, error } = await supabaseAnonClient.auth.signUp({
        email: dto.email,
        password: dto.password,
        options: {
          data: {
            name: dto.name,
          },
        },
      });
      
      if (error || !data.user || !data.session) {
        logger.error({ error }, 'Registration failed');
        throw new InternalError('Registration failed');
      }
      
      // Set default user role
      await this.userRepository.setUserRole(data.user.id, USER_ROLES.USER);
      
      return {
        id: data.user.id,
        email: data.user.email!,
        name: dto.name,
        role: USER_ROLES.USER,
        createdAt: new Date(data.user.created_at),
        updatedAt: new Date(data.user.updated_at || data.user.created_at),
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      logger.error({ error }, 'Error in RegisterUser use case');
      throw new InternalError('Failed to register user');
    }
  }
}

export default RegisterUser;