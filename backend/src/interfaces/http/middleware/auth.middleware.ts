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
    
    const { data, error } = await supabaseClient.auth.getUser(token);
    
    if (error || !data.user) {
      throw new UnauthorizedError('Invalid or expired token');
    }
    
    // Fetch user role
    const roleResult = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single();
    
    request.user = {
      id: data.user.id,
      email: data.user.email!,
      role: roleResult.data?.role || 'user',
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Authentication failed');
  }
}