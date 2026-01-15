import { ChatSession, ChatMessage } from '../entities/ChatSession.js';

export interface IChatRepository {
  createSession(userId: string, title?: string): Promise<ChatSession>;
  findSessionById(id: string, userId: string): Promise<ChatSession | null>;
  findSessionsByUserId(userId: string): Promise<ChatSession[]>;
  deleteSession(id: string, userId: string): Promise<void>;
  
  createMessage(message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage>;
  findMessagesBySessionId(sessionId: string, userId: string): Promise<ChatMessage[]>;
}