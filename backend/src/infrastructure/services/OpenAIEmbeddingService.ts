import { openaiClient } from '../external/openai-client.js';
import { config } from '../../config/index.js';

export interface IEmbeddingService {
  generateEmbedding(text: string): Promise<number[]>;
  generateEmbeddings(texts: string[]): Promise<number[][]>;
}

export class OpenAIEmbeddingService implements IEmbeddingService {
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openaiClient.embeddings.create({
        model: config.openai.embeddingModel,
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      throw error;
    }
  }
  
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await openaiClient.embeddings.create({
        model: config.openai.embeddingModel,
        input: texts,
      });
      
      return response.data.map(d => d.embedding);
    } catch (error) {
      console.error('Failed to generate embeddings:', error);
      throw error;
    }
  }
}