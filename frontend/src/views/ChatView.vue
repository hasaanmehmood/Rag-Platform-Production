<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div class="p-4 border-b border-gray-200">
        <button @click="handleNewChat" class="w-full btn-primary mb-3">New Chat</button>
        
        <!-- Document Filter Toggle -->
        <button 
          @click="showDocumentFilter = !showDocumentFilter"
          class="w-full btn-secondary text-sm"
        >
          {{ selectedDocumentIds.length > 0 ? `${selectedDocumentIds.length} Doc(s) Selected` : 'Filter Documents' }}
        </button>
      </div>

      <!-- Document Filter Panel -->
      <div v-if="showDocumentFilter" class="p-4 border-b border-gray-200 max-h-64 overflow-y-auto bg-gray-50">
        <p class="text-xs font-semibold text-gray-700 mb-2">Select Documents:</p>
        <div v-if="readyDocuments.length === 0" class="text-xs text-gray-500">
          No ready documents
        </div>
        <div v-else class="space-y-2">
          <label 
            v-for="doc in readyDocuments" 
            :key="doc.id"
            class="flex items-start gap-2 cursor-pointer"
          >
            <input 
              type="checkbox"
              :value="doc.id"
              v-model="selectedDocumentIds"
              class="mt-1"
            />
            <span class="text-xs text-gray-700 line-clamp-2">{{ doc.originalFilename }}</span>
          </label>
        </div>
        <button 
          v-if="selectedDocumentIds.length > 0"
          @click="selectedDocumentIds = []"
          class="text-xs text-red-600 hover:text-red-700 mt-2"
        >
          Clear Selection
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div
          v-for="session in chatStore.sessions"
          :key="session.id"
          @click="chatStore.selectSession(session.id)"
          class="p-3 rounded-lg mb-2 cursor-pointer transition-colors"
          :class="
            chatStore.currentSession?.id === session.id
              ? 'bg-primary-100 text-primary-900'
              : 'hover:bg-gray-100'
          "
        >
          <p class="text-sm font-medium truncate">
            {{ session.title || 'New Chat' }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ formatDate(session.updatedAt) }}
          </p>
        </div>
      </div>

      <div class="p-4 border-t border-gray-200">
        <router-link to="/documents" class="btn-secondary w-full">My Documents</router-link>
        <button @click="authStore.logout" class="btn-secondary w-full mt-2">Logout</button>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col">
      <header class="bg-white shadow-sm p-4">
        <h1 class="text-xl font-semibold text-gray-900">
          {{ chatStore.currentSession?.title || 'Select or create a chat' }}
        </h1>
        <p v-if="selectedDocumentIds.length > 0" class="text-sm text-gray-600 mt-1">
          Searching in {{ selectedDocumentIds.length }} selected document(s)
        </p>
        <p v-else class="text-sm text-gray-500 mt-1">
          Searching in all documents
        </p>
      </header>

      <main class="flex-1 overflow-y-auto p-4">
        <div v-if="!chatStore.currentSession" class="text-center py-16">
          <p class="text-gray-500">Create a new chat to get started</p>
        </div>

        <div v-else class="max-w-4xl mx-auto space-y-4">
          <div
            v-for="message in chatStore.messages"
            :key="message.id"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-3xl rounded-lg p-4"
              :class="
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white shadow-md'
              "
            >
              <p class="whitespace-pre-wrap">{{ message.content }}</p>
              <div v-if="message.sources && message.sources.length > 0" class="mt-2 pt-2 border-t border-gray-200">
                <p class="text-xs font-medium mb-1">Sources:</p>
                <div class="text-xs space-y-1">
                  <div v-for="(source, idx) in message.sources" :key="idx" class="opacity-75">
                    [{{ idx + 1 }}] Score: {{ (source.score * 100).toFixed(1) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Streaming message -->
          <div v-if="chatStore.sending && chatStore.streamingMessage" class="flex justify-start">
            <div class="max-w-3xl bg-white shadow-md rounded-lg p-4">
              <p class="whitespace-pre-wrap">{{ chatStore.streamingMessage }}</p>
            </div>
          </div>
        </div>
      </main>

      <!-- Input Area -->
      <footer v-if="chatStore.currentSession" class="bg-white border-t border-gray-200 p-4">
        <div class="max-w-4xl mx-auto">
          <form @submit.prevent="handleSendMessage" class="flex gap-2">
            <textarea
              v-model="messageContent"
              @keydown.enter.exact.prevent="handleSendMessage"
              placeholder="Ask a question about your documents..."
              rows="2"
              class="flex-1 input resize-none"
              :disabled="chatStore.sending"
            ></textarea>
            <button
              type="submit"
              :disabled="!messageContent.trim() || chatStore.sending"
              class="btn-primary self-end"
            >
              {{ chatStore.sending ? 'Sending...' : 'Send' }}
            </button>
          </form>
          <div v-if="chatStore.error" class="mt-2 text-red-600 text-sm">
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

const authStore = useAuthStore();
const chatStore = useChatStore();
const documentStore = useDocumentStore();

const messageContent = ref('');
const selectedDocumentIds = ref<string[]>([]);
const showDocumentFilter = ref(false);

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

const handleSendMessage = async () => {
  if (!messageContent.value.trim()) return;

  const content = messageContent.value;
  messageContent.value = '';

  try {
    // Use selected documents, or all ready documents if none selected
    const docsToUse = selectedDocumentIds.value.length > 0 
      ? selectedDocumentIds.value 
      : readyDocuments.value.map((d) => d.id);

    console.log('📤 Sending with documents:', docsToUse);
    
    await chatStore.sendMessage(content, docsToUse.length > 0 ? docsToUse : undefined);
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