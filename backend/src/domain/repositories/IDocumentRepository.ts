import { Document } from '../entities/Document.js';
import { DocumentStatus } from '../../shared/constants.js';

export interface IDocumentRepository {
  create(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document>;
  findById(id: string, userId: string): Promise<Document | null>;
  findByUserId(userId: string, options?: {
    page?: number;
    limit?: number;
    status?: DocumentStatus;
  }): Promise<{ documents: Document[]; total: number }>;
  updateStatus(id: string, status: DocumentStatus, errorMessage?: string): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}