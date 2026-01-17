import { IDocumentRepository } from '../../../domain/repositories/IDocumentRepository.js';
import { IStorageService } from '../../../infrastructure/services/SupabaseStorageService.js';
import { Document } from '../../../domain/entities/Document.js';
import { DOCUMENT_STATUS } from '../../../shared/constants.js';
import { ValidationError } from '../../errors/AppError.js';
import { config } from '../../../config/index.js';
import crypto from 'crypto';

export class UploadDocument {
  constructor(
    private documentRepository: IDocumentRepository,
    private storageService: IStorageService
  ) {}
  
  async execute(
    userId: string,
    file: {
      data: Buffer;
      filename: string;
      mimetype: string;
    }
  ): Promise<Document> {
    // Validate file type
    const allowedTypes = config.upload.allowedTypes.split(',');
    if (!allowedTypes.includes(file.mimetype)) {
      throw new ValidationError('Invalid file type. Allowed: PDF, DOCX, TXT');
    }
    
    // Validate file size
    if (file.data.length > config.upload.maxFileSize) {
      throw new ValidationError(
        `File size exceeds maximum of ${config.upload.maxFileSize / 1024 / 1024}MB`
      );
    }
    
    try {
      // Generate unique filename
      const fileExt = file.filename.split('.').pop();
      const uniqueFilename = `${crypto.randomUUID()}.${fileExt}`;
      const storagePath = `${userId}/${uniqueFilename}`;
      
      // Upload to storage
      await this.storageService.uploadFile(
        'documents',
        storagePath,
        file.data,
        file.mimetype
      );
      
      // Create document record
      const document = await this.documentRepository.create({
        userId,
        filename: uniqueFilename,
        originalFilename: file.filename,
        fileType: file.mimetype,
        fileSize: file.data.length,
        storagePath,
        status: DOCUMENT_STATUS.PROCESSING,
        metadata: {},
      });
      
      console.log('Document uploaded successfully:', { documentId: document.id, userId });
      
      return document;
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw error;
    }
  }
}