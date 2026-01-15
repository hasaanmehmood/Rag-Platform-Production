import { User } from '../entities/User.js';
import { UserRole } from '../../shared/constants.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  getUserRole(userId: string): Promise<UserRole>;
  setUserRole(userId: string, role: UserRole): Promise<void>;
}