import { FastifyRequest, FastifyReply } from 'fastify';
import { supabaseClient } from '../../../infrastructure/external/supabase-client.js';
import { UnauthorizedError } from '../../../application/errors/AppError.js';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authorization token provided');
    }
    
    const token = authHeader.substring(7);
    
    console.log('Validating token...');
    const { data, error } = await supabaseClient.auth.getUser(token);
    
    if (error) {
      console.error('Token validation error:', error.message);
      throw new UnauthorizedError('Invalid or expired token');
    }
    
    if (!data.user) {
      console.error('No user data in token response');
      throw new UnauthorizedError('Invalid or expired token');
    }
    
    console.log('Token valid for user:', data.user.email);
    
    // Fetch user role (default to 'user' on error)
    let role = 'user';
    try {
      const roleResult = await supabaseClient
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();
      
      if (roleResult.data?.role) {
        role = roleResult.data.role;
      }
    } catch (roleError) {
      console.error('Failed to fetch role, using default:', roleError);
    }
    
    request.user = {
      id: data.user.id,
      email: data.user.email!,
      role,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    console.error('Auth middleware error:', error);
    throw new UnauthorizedError('Authentication failed');
  }
}