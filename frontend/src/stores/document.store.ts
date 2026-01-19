import { defineStore } from 'pinia';
import { ref } from 'vue';
import documentService from '@/services/document.service';
import type { Document } from '@/types/document.types';

export const useDocumentStore = defineStore('document', () => {
  const documents = ref<Document[]>([]);
  const selectedDocuments = ref<string[]>([]);
  const loading = ref(false);
  const uploading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(20);

  const fetchDocuments = async (params?: { page?: number; limit?: number; status?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await documentService.list(params);
      documents.value = response.documents;
      total.value = response.total;
      page.value = response.page;
      limit.value = response.limit;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch documents';
    } finally {
      loading.value = false;
    }
  };

  const uploadDocument = async (file: File) => {
    uploading.value = true;
    error.value = null;
    try {
      const document = await documentService.upload(file);
      documents.value.unshift(document);
      return document;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Upload failed';
      throw err;
    } finally {
      uploading.value = false;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await documentService.delete(id);
      documents.value = documents.value.filter((d) => d.id !== id);
      selectedDocuments.value = selectedDocuments.value.filter((docId) => docId !== id);
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Delete failed';
      throw err;
    }
  };

  const toggleDocumentSelection = (id: string) => {
    const index = selectedDocuments.value.indexOf(id);
    if (index > -1) {
      selectedDocuments.value.splice(index, 1);
    } else {
      selectedDocuments.value.push(id);
    }
  };

  const clearSelection = () => {
    selectedDocuments.value = [];
  };

  return {
    documents,
    selectedDocuments,
    loading,
    uploading,
    error,
    total,
    page,
    limit,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    toggleDocumentSelection,
    clearSelection,
  };
});