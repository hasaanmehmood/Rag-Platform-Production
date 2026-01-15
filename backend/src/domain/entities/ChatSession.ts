import { MessageRole } from '../../shared/constants.js';

export interface ChatSession {
  id: string;
  userId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  role: MessageRole;
  content: string;
  sources: Array<{
    chunkId: string;
    documentId: string;
    content: string;
    score: number;
  }>;
  metadata: Record<string, any>;
  createdAt: Date;
}