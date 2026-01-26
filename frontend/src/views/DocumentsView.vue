<template>
  <div class="h-screen flex flex-col bg-dark-gradient overflow-hidden">
    <!-- Header -->
    <header class="glass-dark-modern backdrop-blur-xl border-b border-white/10 shrink-0">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="scale-[0.4] origin-left">
            <LogoLoader />
          </div>
          <h1 class="text-2xl font-black gradient-text-light">My Documents</h1>
        </div>
        <div class="flex items-center gap-4">
          <router-link to="/chat" class="btn-modern">
            Go to Chat
          </router-link>
          <button @click="authStore.logout" class="px-6 py-2.5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col max-w-7xl mx-auto px-6 py-6 w-full overflow-hidden gap-6">
      <!-- Upload Section -->
      <div class="glass-dark-modern p-6 rounded-2xl neon-border shrink-0">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: #252525;">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white">Upload Document</h2>
        </div>
        <div class="flex items-center gap-4">
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.docx,.txt"
            @change="handleFileSelect"
            class="flex-1 bg-dark-200 border border-white/20 text-white rounded-xl px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600 file:cursor-pointer cursor-pointer"
          />
          <button
            @click="handleUpload"
            :disabled="!selectedFile || documentStore.uploading"
            class="btn-modern px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {{ documentStore.uploading ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
        <p class="mt-3 text-sm text-gray-400">Supported: PDF, DOCX, TXT (max 10MB)</p>
      </div>

      <!-- Error Message -->
      <div v-if="documentStore.error" class="glass-dark-modern p-4 rounded-xl border border-red-500/50 bg-red-500/10 shrink-0">
        <p class="text-red-400 font-medium">{{ documentStore.error }}</p>
      </div>

      <!-- Documents List -->
      <div class="glass-dark-modern p-6 rounded-2xl neon-border flex-1 flex flex-col overflow-hidden">
        <div class="flex items-center gap-3 mb-6 shrink-0">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: #252525;">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white">Your Documents</h2>
          <div class="ml-auto text-sm text-gray-400">
            {{ documentStore.documents.length }} document{{ documentStore.documents.length !== 1 ? 's' : '' }}
          </div>
        </div>

        <div v-if="documentStore.loading" class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <div class="spinner mb-4 mx-auto"></div>
            <p class="text-gray-400">Loading documents...</p>
          </div>
        </div>

        <div v-else-if="documentStore.documents.length === 0" class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <div class="w-20 h-20 bg-dark-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-gray-400 text-lg">No documents yet</p>
            <p class="text-gray-500 text-sm mt-1">Upload your first document to get started!</p>
          </div>
        </div>

        <div v-else class="flex-1 overflow-y-auto space-y-3 pr-2">
          <div
            v-for="doc in documentStore.documents"
            :key="doc.id"
            class="bg-dark-200 border border-white/10 rounded-xl p-5 hover:border-primary-500/50 hover:bg-dark-300 transition-all duration-300 card-hover"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2">
                  <svg class="w-5 h-5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 class="font-semibold text-white truncate">{{ doc.originalFilename }}</h3>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {{ formatFileSize(doc.fileSize) }}
                  </span>
                  <span class="flex items-center gap-2">
                    <div
                      class="w-2 h-2 rounded-full"
                      :class="{
                        'bg-green-400 animate-pulse': doc.status === 'ready',
                        'bg-yellow-400 animate-pulse': doc.status === 'processing',
                        'bg-red-400': doc.status === 'failed'
                      }"
                    ></div>
                    <span :class="getStatusColor(doc.status)" class="font-medium">
                      {{ doc.status.toUpperCase() }}
                    </span>
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDate(doc.createdAt) }}
                  </span>
                </div>
                <div v-if="doc.errorMessage" class="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <span class="font-medium">Error:</span> {{ doc.errorMessage }}
                </div>
              </div>
              <button
                @click="handleDelete(doc.id)"
                class="ml-4 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-all duration-300 font-medium text-sm shrink-0"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useDocumentStore } from '@/stores/document.store';
import LogoLoader from '@/components/LogoLoader.vue';

const authStore = useAuthStore();
const documentStore = useDocumentStore();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
let pollInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  await documentStore.fetchDocuments();

  // Poll for document status updates every 5 seconds (silent refresh to avoid flickering)
  pollInterval = setInterval(async () => {
    await documentStore.fetchDocuments(undefined, true);
  }, 5000);
});

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
});

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] || null;
};

const handleUpload = async () => {
  if (!selectedFile.value) return;

  try {
    await documentStore.uploadDocument(selectedFile.value);
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this document?')) return;

  try {
    await documentStore.deleteDocument(id);
  } catch (error) {
    console.error('Delete failed:', error);
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'ready':
      return 'text-green-400';
    case 'processing':
      return 'text-yellow-400';
    case 'failed':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};
</script>
