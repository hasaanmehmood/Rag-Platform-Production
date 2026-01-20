import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { RegisterDTO } from '../../dto/auth.dto.js';
import { ConflictError, ValidationError } from '../../errors/AppError.js';

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}
  
  async execute(data: RegisterDTO) {
    try {
      // Validate email format
      if (!data.email || !data.email.includes('@')) {
        throw new ValidationError('Invalid email format');
      }

      // Validate password strength
      if (!data.password || data.password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters long');
      }

      // Attempt to create user
      const user = await this.userRepository.create(data);
      
      return user;
    } catch (error: any) {
      // Handle Supabase Auth errors
      if (error.__isAuthError) {
        if (error.code === 'user_already_exists') {
          throw new ConflictError('An account with this email already exists');
        }
        if (error.status === 422) {
          throw new ValidationError(error.message || 'Invalid registration data');
        }
      }
      
      // Re-throw our custom errors
      if (error.name === 'ValidationError' || error.name === 'ConflictError') {
        throw error;
      }

      // Log unexpected errors
      console.error('Unexpected registration error:', error);
      throw new ValidationError('Registration failed. Please try again.');
    }
  }
}