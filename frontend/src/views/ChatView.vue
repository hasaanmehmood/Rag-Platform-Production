<template>
  <div class="h-screen flex bg-dark-gradient overflow-hidden">
    <!-- Sidebar -->
    <div class="w-80 glass-dark-modern border-r border-white/10 flex flex-col backdrop-blur-xl">
      <div class="p-4 border-b border-white/10 shrink-0">
        <button @click="handleNewChat" class="w-full btn-modern mb-3 text-sm">
          <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>

        <!-- Persona Selector -->
        <button
          @click="showPersonaSelector = !showPersonaSelector"
          class="w-full px-4 py-2.5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-300 text-sm font-semibold mb-3"
        >
          <span class="text-lg mr-2">{{ selectedPersona.icon }}</span>
          {{ selectedPersona.name }}
        </button>

        <!-- Document Filter Toggle -->
        <button
          @click="showDocumentFilter = !showDocumentFilter"
          class="w-full px-4 py-2.5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-300 text-sm font-semibold"
        >
          <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {{ selectedDocumentIds.length > 0 ? `${selectedDocumentIds.length} Doc(s) Selected` : 'Filter Documents' }}
        </button>
      </div>

      <!-- Persona Selector Panel -->
      <div v-if="showPersonaSelector" class="p-4 border-b border-white/10 max-h-96 overflow-y-auto bg-dark-200 shrink-0">
        <p class="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Choose AI Persona:</p>
        <div class="space-y-2">
          <button
            v-for="persona in PERSONAS"
            :key="persona.id"
            @click="selectPersona(persona)"
            class="w-full text-left p-3 rounded-lg transition-all duration-200 border"
            :class="selectedPersona.id === persona.id
              ? 'border-primary-500/50 bg-primary-500/10'
              : 'border-white/10 bg-dark-300 hover:bg-dark-400 hover:border-white/20'"
          >
            <div class="flex items-start gap-3">
              <span class="text-2xl" :style="`color: ${persona.color}`">{{ persona.icon }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-white mb-1">{{ persona.name }}</p>
                <p class="text-xs text-gray-400 line-clamp-2">{{ persona.description }}</p>
              </div>
              <svg
                v-if="selectedPersona.id === persona.id"
                class="w-5 h-5 text-primary-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Document Filter Panel -->
      <div v-if="showDocumentFilter" class="p-4 border-b border-white/10 max-h-72 overflow-y-auto bg-dark-200 shrink-0">
        <p class="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Select Documents:</p>
        <div v-if="readyDocuments.length === 0" class="text-xs text-gray-500 text-center py-4">
          No ready documents
        </div>
        <div v-else class="space-y-2">
          <label
            v-for="doc in readyDocuments"
            :key="doc.id"
            class="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-dark-300 transition-colors"
            :class="{ 'bg-primary-500/20 border border-primary-500/40': selectedDocumentIds.includes(doc.id) }"
          >
            <input
              type="checkbox"
              :value="doc.id"
              v-model="selectedDocumentIds"
              class="mt-0.5 w-4 h-4 text-primary-500 rounded focus:ring-primary-500 bg-dark-300 border-white/20"
            />
            <span class="text-xs line-clamp-2" :style="selectedDocumentIds.includes(doc.id) ? 'color: #696969; font-weight: 600;' : 'color: #a1a1aa;'">
              {{ doc.originalFilename }}
            </span>
          </label>
        </div>
        <button
          v-if="selectedDocumentIds.length > 0"
          @click="selectedDocumentIds = []"
          class="text-xs text-red-400 hover:text-red-300 mt-3 font-semibold"
        >
          Clear Selection
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div
          v-for="session in chatStore.sessions"
          :key="session.id"
          class="group relative p-4 rounded-xl mb-3 cursor-pointer transition-all duration-300 border"
          :style="chatStore.currentSession?.id === session.id ? 'background: rgba(37, 37, 37, 0.5); border-color: #696969;' : ''"
          :class="
            chatStore.currentSession?.id === session.id
              ? 'shadow-lg'
              : 'bg-dark-200 border-white/10 hover:bg-dark-300 hover:border-white/20'
          "
        >
          <div @click="chatStore.selectSession(session.id)">
            <p class="text-sm font-semibold truncate text-white mb-1 pr-8">
              {{ session.title || 'New Chat' }}
            </p>
            <p class="text-xs text-gray-400">
              {{ formatDate(session.updatedAt) }}
            </p>
          </div>
          <button
            @click.stop="handleDeleteSession(session.id)"
            class="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/20 border border-transparent hover:border-red-500/50"
            title="Delete chat"
          >
            <svg class="w-4 h-4 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div class="p-4 border-t border-white/10 space-y-2 shrink-0">
        <router-link to="/documents" class="block w-full btn-modern text-center text-sm">
          My Documents
        </router-link>
        <button @click="authStore.logout" class="w-full px-4 py-2.5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold text-sm">
          Logout
        </button>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="glass-dark-modern backdrop-blur-xl border-b border-white/10 p-6 shrink-0">
        <h1 class="text-2xl font-black text-white gradient-text-light">
          {{ chatStore.currentSession?.title || 'Select or create a chat' }}
        </h1>
        <p v-if="selectedDocumentIds.length > 0" class="text-sm mt-1 font-medium" style="color: #696969;">
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Searching in {{ selectedDocumentIds.length }} selected document(s)
        </p>
        <p v-else class="text-sm text-gray-400 mt-1">
          Searching in all documents
        </p>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <div v-if="!chatStore.currentSession" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 neon-glow" style="background: #252525;">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p class="text-gray-400 text-lg">Create a new chat to get started</p>
          </div>
        </div>

        <div v-else class="max-w-4xl mx-auto space-y-6">
          <div
            v-for="message in chatStore.messages"
            :key="message.id"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-3xl rounded-2xl p-5"
              :style="message.role === 'user' ? 'background: linear-gradient(135deg, #252525, #292929); background-size: 200% 200%; animation: moveGradient 3s ease infinite;' : ''"
              :class="
                message.role === 'user'
                  ? 'text-white neon-glow'
                  : 'glass-dark-modern border border-white/10'
              "
            >
              <p class="whitespace-pre-wrap" :class="message.role === 'user' ? 'text-white' : 'text-gray-200'">{{ message.content }}</p>
              <div v-if="message.sources && message.sources.length > 0" class="mt-4 pt-4 border-t border-white/20">
                <p class="text-xs font-bold mb-2 text-gray-300 uppercase tracking-wider">Sources:</p>
                <div class="text-xs space-y-1">
                  <div v-for="(source, idx) in message.sources" :key="idx" class="text-gray-400">
                    <span class="font-mono bg-dark-300 px-2 py-1 rounded">[{{ idx + 1 }}]</span>
                    <span class="ml-2">Score: {{ (source.score * 100).toFixed(1) }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Thinking/Streaming message -->
          <div v-if="chatStore.sending" class="flex justify-start">
            <div class="max-w-3xl glass-dark-modern border border-white/10 rounded-2xl p-5">
              <div v-if="!chatStore.streamingMessage" class="flex items-center gap-3">
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style="animation-delay: 0s"></div>
                  <div class="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
                <span class="text-sm text-gray-300 font-medium">Thinking...</span>
              </div>
              <div v-else>
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                  <span class="text-xs text-gray-400 font-medium">AI is typing...</span>
                </div>
                <p class="whitespace-pre-wrap text-gray-200">{{ chatStore.streamingMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Input Area -->
      <footer v-if="chatStore.currentSession" class="glass-dark-modern backdrop-blur-xl border-t border-white/10 p-6 shrink-0">
        <div class="max-w-4xl mx-auto">
          <form @submit.prevent="handleSendMessage" class="flex gap-4">
            <textarea
              v-model="messageContent"
              @keydown.enter.exact.prevent="handleSendMessage"
              placeholder="Ask a question about your documents..."
              rows="2"
              class="flex-1 bg-dark-200 border border-white/20 text-white rounded-xl px-4 py-3 resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 placeholder-gray-500"
              :disabled="chatStore.sending"
            ></textarea>
            <button
              type="submit"
              :disabled="!messageContent.trim() || chatStore.sending"
              class="btn-modern px-8 py-3 self-end disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="chatStore.sending" class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Thinking...
              </span>
              <span v-else>Send</span>
            </button>
          </form>
          <div v-if="chatStore.error" class="mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {{ chatStore.error }}
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';
import { useDocumentStore } from '@/stores/document.store';
import { PERSONAS, type Persona } from '@/types/persona.types';

const authStore = useAuthStore();
const chatStore = useChatStore();
const documentStore = useDocumentStore();

const messageContent = ref('');
const selectedDocumentIds = ref<string[]>([]);
const showDocumentFilter = ref(false);
const showPersonaSelector = ref(false);
const selectedPersona = ref<Persona>(PERSONAS[0]); // Default to General Assistant

const readyDocuments = computed(() => {
  return documentStore.documents.filter((d) => d.status === 'ready');
});

onMounted(async () => {
  await chatStore.fetchSessions();
  await documentStore.fetchDocuments();
});

const handleNewChat = async () => {
  try {
    await chatStore.createSession();
  } catch (error) {
    console.error('Failed to create chat:', error);
  }
};

const handleDeleteSession = async (sessionId: string) => {
  if (!confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
    return;
  }

  try {
    await chatStore.deleteSession(sessionId);
  } catch (error) {
    console.error('Failed to delete chat:', error);
  }
};

const selectPersona = (persona: Persona) => {
  selectedPersona.value = persona;
  showPersonaSelector.value = false;
  console.log('Selected persona:', persona.name);
};

const handleSendMessage = async () => {
  if (!messageContent.value.trim()) return;

  const content = messageContent.value;
  messageContent.value = '';

  try {
    // Only use explicitly selected documents
    const docsToUse = selectedDocumentIds.value.length > 0
      ? selectedDocumentIds.value
      : undefined;

    console.log('📤 Sending with documents:', docsToUse || 'all documents');
    console.log('📤 Using persona:', selectedPersona.value.name);

    await chatStore.sendMessage(content, docsToUse, selectedPersona.value.systemPrompt);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};
</script>
