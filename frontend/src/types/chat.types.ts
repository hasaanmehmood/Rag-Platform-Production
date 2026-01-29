export interface ChatSession {
  id: string;
  userId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  sources: Array<{
    chunkId: string;
    documentId: string;
    content: string;
    score: number;
  }>;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface SendMessageData {
  content: string;
  documentIds?: string[];
  systemPrompt?: string;
}