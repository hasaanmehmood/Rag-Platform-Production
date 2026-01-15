import { FastifyRequest, FastifyReply } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { UploadDocument } from '../../../application/use-cases/documents/UploadDocument.js';
import { ProcessDocument } from '../../../application/use-cases/documents/ProcessDocument.js';
import { PostgresDocumentRepository } from '../../../infrastructure/database/repositories/PostgresDocumentRepository.js';
import { PostgresChunkRepository } from '../../../infrastructure/database/repositories/PostgresChunkRepository.js';
import { SupabaseStorageService } from '../../../infrastructure/services/SupabaseStorageService.js';
import { DocumentParserService } from '../../../infrastructure/services/DocumentParserService.js';
import { RecursiveChunkingService } from '../../../infrastructure/services/RecursiveChunkingService.js';
import { OpenAIEmbeddingService } from '../../../infrastructure/services/OpenAIEmbeddingService.js';
import { GetDocumentsDTO } from '../../../application/dto/document.dto.js';
import { HTTP_STATUS } from '../../../shared/constants.js';
import { ValidationError, NotFoundError } from '../../../application/errors/AppError.js';

export class DocumentController {
  private uploadDocument: UploadDocument;
  private processDocument: ProcessDocument;
  private documentRepository: PostgresDocumentRepository;
  
  constructor() {
    this.documentRepository = new PostgresDocumentRepository();
    const chunkRepository = new PostgresChunkRepository();
    const storageService = new SupabaseStorageService();
    const parserService = new DocumentParserService();
    const chunkingService = new RecursiveChunkingService();
    const embeddingService = new OpenAIEmbeddingService();
    
    this.uploadDocument = new UploadDocument(this.documentRepository, storageService);
    this.processDocument = new ProcessDocument(
      this.documentRepository,
      chunkRepository,
      parserService,
      chunkingService,
      embeddingService
    );
  }
  
  async upload(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const data = await request.file();
    
    if (!data) {
      throw new ValidationError('No file uploaded');
    }
    
    const buffer = await data.toBuffer();
    
    const document = await this.uploadDocument.execute(request.user.id, {
      data: buffer,
      filename: data.filename,
      mimetype: data.mimetype,
    });
    
    // Process document asynchronously
    this.processDocument.execute(document.id).catch(err => {
      console.error('Document processing failed:', err);
    });
    
    reply.status(HTTP_STATUS.CREATED).send({ document });
  }
  
  async list(
    request: FastifyRequest<{ Querystring: GetDocumentsDTO }>,
    reply: FastifyReply
  ): Promise<void> {
    const { documents, total } = await this.documentRepository.findByUserId(
      request.user.id,
      request.query
    );
    
    reply.status(HTTP_STATUS.OK).send({
      documents,
      total,
      page: request.query.page || 1,
      limit: request.query.limit || 20,
    });
  }
  
  async get(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const document = await this.documentRepository.findById(
      request.params.id,
      request.user.id
    );
    
    if (!document) {
      throw new NotFoundError('Document');
    }
    
    reply.status(HTTP_STATUS.OK).send({ document });
  }
  
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const document = await this.documentRepository.findById(
      request.params.id,
      request.user.id
    );
    
    if (!document) {
      throw new NotFoundError('Document');
    }
    
    await this.documentRepository.delete(request.params.id, request.user.id);
    
    reply.status(HTTP_STATUS.OK).send({ success: true });
  }
}