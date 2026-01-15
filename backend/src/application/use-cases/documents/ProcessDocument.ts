import { IDocumentRepository } from '../../../domain/repositories/IDocumentRepository.js';
import { IChunkRepository } from '../../../domain/repositories/IChunkRepository.js';
import { IDocumentParserService } from '../../../infrastructure/services/DocumentParserService.js';
import { IChunkingService } from '../../../infrastructure/services/RecursiveChunkingService.js';
import { IEmbeddingService } from '../../../infrastructure/services/OpenAIEmbeddingService.js';
import { supabaseClient } from '../../../infrastructure/external/supabase-client.js';
import { DOCUMENT_STATUS } from '../../../shared/constants.js';
import { logger } from '../../../shared/logger.js';

export class ProcessDocument {
  constructor(
    private documentRepository: IDocumentRepository,
    private chunkRepository: IChunkRepository,
    private parserService: IDocumentParserService,
    private chunkingService: IChunkingService,
    private embeddingService: IEmbeddingService
  ) {}
  
  async execute(documentId: string): Promise<void> {
    try {
      logger.info({ documentId }, 'Starting document processing');
      
      // Get document
      const document = await this.documentRepository.findById(documentId, documentId);
      if (!document) {
        throw new Error('Document not found');
      }
      
      // Download file from storage
      const { data: fileData, error: downloadError } = await supabaseClient.storage
        .from('documents')
        .download(document.storagePath);
      
      if (downloadError || !fileData) {
        throw new Error('Failed to download document');
      }
      
      const buffer = Buffer.from(await fileData.arrayBuffer());
      
      // Parse document
      logger.debug({ documentId }, 'Parsing document');
      const text = await this.parserService.parseDocument(buffer, document.fileType);
      
      if (!text || text.trim().length === 0) {
        throw new Error('No text content extracted from document');
      }
      
      // Chunk text
      logger.debug({ documentId }, 'Chunking text');
      const chunks = this.chunkingService.chunkText(text);
      
      if (chunks.length === 0) {
        throw new Error('No chunks generated from document');
      }
      
      // Generate embeddings in batches
      logger.debug({ documentId, chunkCount: chunks.length }, 'Generating embeddings');
      const batchSize = 100;
      const allEmbeddings: number[][] = [];
      
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const embeddings = await this.embeddingService.generateEmbeddings(
          batch.map(c => c.content)
        );
        allEmbeddings.push(...embeddings);
      }
      
      // Store chunks with embeddings
      logger.debug({ documentId }, 'Storing chunks');
      const chunksToStore = chunks.map((chunk, index) => ({
        documentId: document.id,
        userId: document.userId,
        chunkIndex: chunk.index,
        content: chunk.content,
        embedding: allEmbeddings[index],
        metadata: chunk.metadata,
      }));
      
      await this.chunkRepository.createMany(chunksToStore);
      
      // Update document status
      await this.documentRepository.updateStatus(documentId, DOCUMENT_STATUS.READY);
      
      logger.info(
        { documentId, chunkCount: chunks.length },
        'Document processing completed'
      );
    } catch (error) {
      logger.error({ error, documentId }, 'Document processing failed');
      
      await this.documentRepository.updateStatus(
        documentId,
        DOCUMENT_STATUS.FAILED,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      throw error;
    }
  }
}