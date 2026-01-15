import { IChunkRepository } from '../../../domain/repositories/IChunkRepository.js';
import { DocumentChunk } from '../../../domain/entities/Document.js';
import { query, getClient } from '../postgres.js';

export class PostgresChunkRepository implements IChunkRepository {
  async createMany(chunks: Omit<DocumentChunk, 'id' | 'createdAt'>[]): Promise<void> {
    if (chunks.length === 0) return;
    
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      for (const chunk of chunks) {
        const embeddingStr = `[${chunk.embedding!.join(',')}]`;
        await client.query(
          `INSERT INTO document_chunks 
           (document_id, user_id, chunk_index, content, embedding, metadata)
           VALUES ($1, $2, $3, $4, $5::vector, $6)`,
          [
            chunk.documentId,
            chunk.userId,
            chunk.chunkIndex,
            chunk.content,
            embeddingStr,
            JSON.stringify(chunk.metadata),
          ]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  async findSimilar(
    embedding: number[],
    userId: string,
    topK: number,
    documentIds?: string[]
  ): Promise<Array<DocumentChunk & { score: number }>> {
    const embeddingStr = `[${embedding.join(',')}]`;
    
    let whereClause = 'WHERE user_id = $2';
    const params: any[] = [embeddingStr, userId, topK];
    
    if (documentIds && documentIds.length > 0) {
      whereClause += ' AND document_id = ANY($4)';
      params.push(documentIds);
    }
    
    const result = await query<any>(
      `SELECT 
         id, document_id, user_id, chunk_index, content, metadata, created_at,
         1 - (embedding <=> $1::vector) AS score
       FROM document_chunks
       ${whereClause}
       ORDER BY embedding <=> $1::vector
       LIMIT $3`,
      params
    );
    
    return result.rows.map(row => ({
      id: row.id,
      documentId: row.document_id,
      userId: row.user_id,
      chunkIndex: row.chunk_index,
      content: row.content,
      metadata: row.metadata,
      createdAt: new Date(row.created_at),
      score: parseFloat(row.score),
    }));
  }
  
  async deleteByDocumentId(documentId: string): Promise<void> {
    await query(
      'DELETE FROM document_chunks WHERE document_id = $1',
      [documentId]
    );
  }
}