import { IChatRepository } from '../../../domain/repositories/IChatRepository.js';
import { ChatSession, ChatMessage } from '../../../domain/entities/ChatSession.js';
import { query } from '../postgres.js';

export class PostgresChatRepository implements IChatRepository {
  async createSession(userId: string, title?: string): Promise<ChatSession> {
    const result = await query<ChatSession>(
      'INSERT INTO chat_sessions (user_id, title) VALUES ($1, $2) RETURNING *',
      [userId, title || null]
    );
    
    return this.mapSession(result.rows[0]);
  }
  
  async findSessionById(id: string, userId: string): Promise<ChatSession | null> {
    const result = await query<ChatSession>(
      'SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    return result.rows[0] ? this.mapSession(result.rows[0]) : null;
  }
  
  async findSessionsByUserId(userId: string): Promise<ChatSession[]> {
    const result = await query<ChatSession>(
      'SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    
    return result.rows.map(this.mapSession);
  }
  
  async deleteSession(id: string, userId: string): Promise<void> {
    await query(
      'DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
  }
  
  async createMessage(message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
    const result = await query<ChatMessage>(
      `INSERT INTO chat_messages 
       (session_id, user_id, role, content, sources, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        message.sessionId,
        message.userId,
        message.role,
        message.content,
        JSON.stringify(message.sources),
        JSON.stringify(message.metadata),
      ]
    );
    
    // Update session updated_at
    await query(
      'UPDATE chat_sessions SET updated_at = NOW() WHERE id = $1',
      [message.sessionId]
    );
    
    return this.mapMessage(result.rows[0]);
  }
  
  async findMessagesBySessionId(sessionId: string, userId: string): Promise<ChatMessage[]> {
    const result = await query<ChatMessage>(
      `SELECT m.* FROM chat_messages m
       JOIN chat_sessions s ON m.session_id = s.id
       WHERE m.session_id = $1 AND s.user_id = $2
       ORDER BY m.created_at ASC`,
      [sessionId, userId]
    );
    
    return result.rows.map(this.mapMessage);
  }
  
  private mapSession(row: any): ChatSession {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
  
  private mapMessage(row: any): ChatMessage {
    return {
      id: row.id,
      sessionId: row.session_id,
      userId: row.user_id,
      role: row.role,
      content: row.content,
      sources: row.sources,
      metadata: row.metadata,
      createdAt: new Date(row.created_at),
    };
  }
}