import { supabaseAnonClient } from '../../../infrastructure/external/supabase-client.js';
import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { UserWithAuth } from '../../../domain/entities/User.js';
import { RegisterDTO } from '../../dto/auth.dto.js';
import { ConflictError, InternalError } from '../../errors/AppError.js';

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}
  
  async execute(dto: RegisterDTO): Promise<UserWithAuth> {
    try {
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
        console.error('Registration failed:', error);
        throw new InternalError('Registration failed: ' + (error?.message || 'Unknown error'));
      }
      
      // Set default user role (in background, ignore errors)
      try {
        await this.userRepository.setUserRole(data.user.id, 'user');
      } catch (roleError) {
        console.error('Failed to set user role (non-critical):', roleError);
      }
      
      return {
        id: data.user.id,
        email: data.user.email!,
        name: dto.name,
        role: 'user',
        createdAt: new Date(data.user.created_at),
        updatedAt: new Date(data.user.updated_at || data.user.created_at),
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error) {
      if (error instanceof ConflictError || error instanceof InternalError) {
        throw error;
      }
      console.error('Error in RegisterUser use case:', error);
      throw new InternalError('Failed to register user');
    }
  }
}