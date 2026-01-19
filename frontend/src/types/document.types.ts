export interface Document {
  id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  status: 'processing' | 'ready' | 'failed';
  errorMessage?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
}