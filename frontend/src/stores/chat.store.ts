import { defineStore } from 'pinia';
import { ref } from 'vue';
import chatService from '@/services/chat.service';
import type { ChatSession, ChatMessage } from '@/types/chat.types';

export const useChatStore = defineStore('chat', () => {
  const sessions = ref<ChatSession[]>([]);
  const currentSession = ref<ChatSession | null>(null);
  const messages = ref<ChatMessage[]>([]);
  const loading = ref(false);
  const sending = ref(false);
  const error = ref<string | null>(null);
  const streamingMessage = ref('');
  const streamingSources = ref<any[]>([]);

  const fetchSessions = async () => {
    loading.value = true;
    error.value = null;
    try {
      sessions.value = await chatService.listSessions();
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch sessions';
    } finally {
      loading.value = false;
    }
  };

  const createSession = async (title?: string) => {
    loading.value = true;
    error.value = null;
    try {
      const session = await chatService.createSession(title);
      sessions.value.unshift(session);
      currentSession.value = session;
      messages.value = [];
      return session;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to create session';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const selectSession = async (sessionId: string) => {
    const session = sessions.value.find((s) => s.id === sessionId);
    if (!session) return;

    currentSession.value = session;
    loading.value = true;
    error.value = null;
    try {
      messages.value = await chatService.getMessages(sessionId);
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch messages';
    } finally {
      loading.value = false;
    }
  };

  const sendMessage = async (content: string, documentIds?: string[], systemPrompt?: string) => {
    if (!currentSession.value) return;

    sending.value = true;
    error.value = null;
    streamingMessage.value = '';
    streamingSources.value = [];

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sessionId: currentSession.value.id,
      userId: '',
      role: 'user',
      content,
      sources: [],
      metadata: {},
      createdAt: new Date().toISOString(),
    };
    messages.value.push(userMessage);

    try {
      await chatService.sendMessage(
        currentSession.value.id,
        { content, documentIds, systemPrompt },
        (token) => {
          streamingMessage.value += token;
        },
        (sources) => {
          streamingSources.value = sources;
        },
        () => {
          // Add assistant message
          const assistantMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sessionId: currentSession.value!.id,
            userId: '',
            role: 'assistant',
            content: streamingMessage.value,
            sources: streamingSources.value,
            metadata: {},
            createdAt: new Date().toISOString(),
          };
          messages.value.push(assistantMessage);
          streamingMessage.value = '';
          streamingSources.value = [];
          sending.value = false;
        },
        (err) => {
          error.value = 'Failed to send message';
          sending.value = false;
        }
      );
    } catch (err: any) {
      error.value = err.message || 'Failed to send message';
      sending.value = false;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await chatService.deleteSession(sessionId);
      sessions.value = sessions.value.filter((s) => s.id !== sessionId);
      if (currentSession.value?.id === sessionId) {
        currentSession.value = null;
        messages.value = [];
      }
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to delete session';
      throw err;
    }
  };

  return {
    sessions,
    currentSession,
    messages,
    loading,
    sending,
    error,
    streamingMessage,
    streamingSources,
    fetchSessions,
    createSession,
    selectSession,
    sendMessage,
    deleteSession,
  };
});