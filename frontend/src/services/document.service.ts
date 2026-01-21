import api from './api.service';
import type { Document, DocumentListResponse } from '@/types/document.types';

class DocumentService {
  async upload(file: File): Promise<Document> {
    console.log('Uploading file:', file.name, file.type, file.size);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<{ document: Document }>(
        '/api/v1/documents/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload response:', response.data);
      return response.data.document;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async list(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<DocumentListResponse> {
    console.log('Fetching documents with params:', params);
    
    try {
      const response = await api.get<DocumentListResponse>('/api/v1/documents', params);
      console.log('Documents fetched:', response.data?.documents?.length || 0);
      return response.data;
    } catch (error) {
      console.error('List documents error:', error);
      throw error;
    }
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