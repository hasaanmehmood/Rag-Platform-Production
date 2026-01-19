import api from './api.service';
import type { ChatSession, ChatMessage, SendMessageData } from '@/types/chat.types';

class ChatService {
  async createSession(title?: string): Promise<ChatSession> {
    const response = await api.post<{ session: ChatSession }>('/api/v1/chat/sessions', {
      title,
    });
    return response.data.session;
  }

  async listSessions(): Promise<ChatSession[]> {
    const response = await api.get<{ sessions: ChatSession[] }>('/api/v1/chat/sessions');
    return response.data.sessions;
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const response = await api.get<{ messages: ChatMessage[] }>(
      `/api/v1/chat/sessions/${sessionId}/messages`
    );
    return response.data.messages;
  }

  async sendMessage(
    sessionId: string,
    data: SendMessageData,
    onToken: (token: string) => void,
    onSources: (sources: any[]) => void,
    onDone: () => void,
    onError: (error: any) => void
  ): Promise<void> {
    const token = localStorage.getItem('accessToken');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const response = await fetch(
      `${baseUrl}/api/v1/chat/sessions/${sessionId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr.trim()) {
              const event = JSON.parse(jsonStr);

              if (event.type === 'token') {
                onToken(event.data);
              } else if (event.type === 'sources') {
                onSources(event.data);
              } else if (event.type === 'done') {
                onDone();
              } else if (event.type === 'error') {
                onError(event.data);
              }
            }
          }
        }
      }
    } catch (error) {
      onError(error);
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    await api.delete(`/api/v1/chat/sessions/${sessionId}`);
  }
}

export default new ChatService();