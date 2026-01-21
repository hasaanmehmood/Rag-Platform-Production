<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">My Documents</h1>
        <div class="flex items-center gap-4">
          <router-link to="/chat" class="btn-secondary">Go to Chat</router-link>
          <button @click="authStore.logout" class="btn-secondary">Logout</button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Upload Section -->
      <div class="card mb-8">
        <h2 class="text-lg font-semibold mb-4">Upload Document</h2>
        <div class="flex items-center gap-4">
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.docx,.txt"
            @change="handleFileSelect"
            class="flex-1"
          />
          <button
            @click="handleUpload"
            :disabled="!selectedFile || documentStore.uploading"
            class="btn-primary"
          >
            {{ documentStore.uploading ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
        <p class="mt-2 text-sm text-gray-500">Supported: PDF, DOCX, TXT (max 10MB)</p>
      </div>

      <!-- Error Message -->
      <div v-if="documentStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-600">{{ documentStore.error }}</p>
      </div>

      <!-- Documents List -->
      <div class="card">
        <h2 class="text-lg font-semibold mb-4">Your Documents</h2>

        <div v-if="documentStore.loading" class="text-center py-8">
          <p class="text-gray-500">Loading documents...</p>
        </div>

        <div v-else-if="documentStore.documents.length === 0" class="text-center py-8">
          <p class="text-gray-500">No documents yet. Upload your first document!</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="doc in documentStore.documents"
            :key="doc.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">{{ doc.originalFilename }}</h3>
                <div class="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <span>{{ formatFileSize(doc.fileSize) }}</span>
                  <span>•</span>
                  <span :class="getStatusColor(doc.status)">
                    {{ doc.status.toUpperCase() }}
                  </span>
                  <span>•</span>
                  <span>{{ formatDate(doc.createdAt) }}</span>
                </div>
                <div v-if="doc.errorMessage" class="mt-2 text-sm text-red-600">
                  Error: {{ doc.errorMessage }}
                </div>
              </div>
              <button
                @click="handleDelete(doc.id)"
                class="text-red-600 hover:text-red-700 text-sm font-medium"
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

const authStore = useAuthStore();
const documentStore = useDocumentStore();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
let pollInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  await documentStore.fetchDocuments();
  
  // Poll for document status updates every 5 seconds
  pollInterval = setInterval(async () => {
    await documentStore.fetchDocuments();
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
      return 'text-green-600';
    case 'processing':
      return 'text-yellow-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};
</script>