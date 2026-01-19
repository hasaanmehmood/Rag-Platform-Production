import api from './api.service';
import type { Document, DocumentListResponse } from '@/types/document.types';

class DocumentService {
  async upload(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ document: Document }>(
      '/api/v1/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.document;
  }

  async list(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<DocumentListResponse> {
    const response = await api.get<DocumentListResponse>('/api/v1/documents', params);
    return response.data;
  }

  async get(id: string): Promise<Document> {
    const response = await api.get<{ document: Document }>(`/api/v1/documents/${id}`);
    return response.data.document;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/documents/${id}`);
  }
}

export default new DocumentService();