import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { User } from '../../../domain/entities/User.js';
import { UserRole, USER_ROLES } from '../../../shared/constants.js';
import { query } from '../postgres.js';
import { supabaseClient } from '../../external/supabase-client.js';

export class PostgresUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabaseClient.auth.admin.getUserById(id);
    
    if (error || !data.user) {
      return null;
    }
    
    const role = await this.getUserRole(id);
    
    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
      role,
      createdAt: new Date(data.user.created_at),
      updatedAt: new Date(data.user.updated_at || data.user.created_at),
    };
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseClient.auth.admin.listUsers();
    
    if (error) {
      return null;
    }
    
    const user = data.users.find(u => u.email === email);
    
    if (!user) {
      return null;
    }
    
    const role = await this.getUserRole(user.id);
    
    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
      role,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at || user.created_at),
    };
  }
  
  async getUserRole(userId: string): Promise<UserRole> {
    const result = await query<{ role: UserRole }>(
      'SELECT role FROM user_roles WHERE user_id = $1',
      [userId]
    );
    
    return result.rows[0]?.role || USER_ROLES.USER;
  }
  
  async setUserRole(userId: string, role: UserRole): Promise<void> {
    await query(
      `INSERT INTO user_roles (user_id, role) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id) 
       DO UPDATE SET role = $2`,
      [userId, role]
    );
  }
}