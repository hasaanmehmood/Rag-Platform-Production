import { IChatRepository } from '../../../domain/repositories/IChatRepository.js';
import { IChunkRepository } from '../../../domain/repositories/IChunkRepository.js';
import { IEmbeddingService } from '../../../infrastructure/services/OpenAIEmbeddingService.js';
import { openaiClient } from '../../../infrastructure/external/openai-client.js';
import { MESSAGE_ROLES } from '../../../shared/constants.js';
import { NotFoundError } from '../../errors/AppError.js';
import { config } from '../../../config/index.js';
import logger from '../../../shared/logger.js';

export class SendMessage {
  constructor(
    private chatRepository: IChatRepository,
    private chunkRepository: IChunkRepository,
    private embeddingService: IEmbeddingService
  ) {}
  
  async *execute(
    sessionId: string,
    userId: string,
    content: string,
    documentIds?: string[],
    systemPrompt?: string
  ): AsyncGenerator<{ type: 'token' | 'sources' | 'done'; data: any }> {
    try {
      // Verify session exists
      const session = await this.chatRepository.findSessionById(sessionId, userId);
      if (!session) {
        throw new NotFoundError('Chat session');
      }
      
      // Store user message
      await this.chatRepository.createMessage({
        sessionId,
        userId,
        role: MESSAGE_ROLES.USER,
        content,
        sources: [],
        metadata: {},
      });
      
      // Generate embedding for the question
      const questionEmbedding = await this.embeddingService.generateEmbedding(content);
      
      // Find similar chunks
      const similarChunks = await this.chunkRepository.findSimilar(
        questionEmbedding,
        userId,
        config.rag.topK,
        documentIds
      );
      
      // Yield sources
      yield {
        type: 'sources',
        data: similarChunks.map(chunk => ({
          chunkId: chunk.id,
          documentId: chunk.documentId,
          content: chunk.content,
          score: chunk.score,
        })),
      };
      
      // Build context
      const context = similarChunks
        .map((chunk, i) => `[${i + 1}] ${chunk.content}`)
        .join('\n\n');

      // Build system message - use custom persona prompt if provided, otherwise use default
      const defaultSystemPrompt = `You are a helpful assistant that answers questions based on the provided context.
If the context doesn't contain relevant information, say so clearly.
Always cite the source numbers [1], [2], etc. when using information from the context.`;

      const basePrompt = systemPrompt || defaultSystemPrompt;

      // Build messages for GPT
      const messages = [
        {
          role: 'system' as const,
          content: `${basePrompt}

Context:
${context}`,
        },
        {
          role: 'user' as const,
          content,
        },
      ];
      
      // Stream response
      const stream = await openaiClient.chat.completions.create({
        model: config.openai.chatModel,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      });
      
      let fullResponse = '';
      
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullResponse += delta;
          yield {
            type: 'token',
            data: delta,
          };
        }
      }
      
      // Store assistant message
      await this.chatRepository.createMessage({
        sessionId,
        userId,
        role: MESSAGE_ROLES.ASSISTANT,
        content: fullResponse,
        sources: similarChunks.map(chunk => ({
          chunkId: chunk.id,
          documentId: chunk.documentId,
          content: chunk.content,
          score: chunk.score,
        })),
        metadata: {},
      });
      
      yield { type: 'done', data: null };
    } catch (error) {
      logger.error({ error, sessionId, userId }, 'Failed to send message');
      throw error;
    }
  }
}

export default SendMessage;