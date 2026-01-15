import { IDocumentRepository } from '../../../domain/repositories/IDocumentRepository.js';
import { Document } from '../../../domain/entities/Document.js';
import { DocumentStatus } from '../../../shared/constants.js';
import { query } from '../postgres.js';

export class PostgresDocumentRepository implements IDocumentRepository {
  async create(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    const result = await query<Document>(
      `INSERT INTO documents 
       (user_id, filename, original_filename, file_type, file_size, storage_path, status, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        document.userId,
        document.filename,
        document.originalFilename,
        document.fileType,
        document.fileSize,
        document.storagePath,
        document.status,
        JSON.stringify(document.metadata),
      ]
    );
    
    return this.mapDocument(result.rows[0]);
  }
  
  async findById(id: string, userId: string): Promise<Document | null> {
    const result = await query<Document>(
      'SELECT * FROM documents WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    return result.rows[0] ? this.mapDocument(result.rows[0]) : null;
  }
  
  async findByUserId(
    userId: string,
    options: { page?: number; limit?: number; status?: DocumentStatus } = {}
  ): Promise<{ documents: Document[]; total: number }> {
    const { page = 1, limit = 20, status } = options;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE user_id = $1';
    const params: any[] = [userId];
    
    if (status) {
      whereClause += ' AND status = $2';
      params.push(status);
    }
    
    const [documentsResult, countResult] = await Promise.all([
      query<Document>(
        `SELECT * FROM documents 
         ${whereClause} 
         ORDER BY created_at DESC 
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
      ),
      query<{ count: string }>(
        `SELECT COUNT(*) FROM documents ${whereClause}`,
        params
      ),
    ]);
    
    return {
      documents: documentsResult.rows.map(this.mapDocument),
      total: parseInt(countResult.rows[0].count, 10),
    };
  }
  
  async updateStatus(id: string, status: DocumentStatus, errorMessage?: string): Promise<void> {
    await query(
      `UPDATE documents 
       SET status = $1, error_message = $2, updated_at = NOW() 
       WHERE id = $3`,
      [status, errorMessage || null, id]
    );
  }
  
  async delete(id: string, userId: string): Promise<void> {
    await query(
      'DELETE FROM documents WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
  }
  
  private mapDocument(row: any): Document {
    return {
      id: row.id,
      userId: row.user_id,
      filename: row.filename,
      originalFilename: row.original_filename,
      fileType: row.file_type,
      fileSize: parseInt(row.file_size, 10),
      storagePath: row.storage_path,
      status: row.status,
      errorMessage: row.error_message,
      metadata: row.metadata,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}