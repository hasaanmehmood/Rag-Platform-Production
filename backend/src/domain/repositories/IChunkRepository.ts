import { DocumentChunk } from '../entities/Document.js';

export interface IChunkRepository {
  createMany(chunks: Omit<DocumentChunk, 'id' | 'createdAt'>[]): Promise<void>;
  findSimilar(embedding: number[], userId: string, topK: number, documentIds?: string[]): Promise<Array<DocumentChunk & { score: number }>>;
  deleteByDocumentId(documentId: string): Promise<void>;
}