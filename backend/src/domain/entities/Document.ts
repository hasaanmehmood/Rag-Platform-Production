import { DocumentStatus } from '../../shared/constants.js';

export interface Document {
  id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  status: DocumentStatus;
  errorMessage?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  userId: string;
  chunkIndex: number;
  content: string;
  embedding?: number[];
  metadata: Record<string, any>;
  createdAt: Date;
}