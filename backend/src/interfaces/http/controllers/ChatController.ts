import { FastifyRequest, FastifyReply } from 'fastify';
import { SendMessage } from '../../../application/use-cases/chat/SendMessage.js';
import { PostgresChatRepository } from '../../../infrastructure/database/repositories/PostgresChatRepository.js';
import { PostgresChunkRepository } from '../../../infrastructure/database/repositories/PostgresChunkRepository.js';
import { OpenAIEmbeddingService } from '../../../infrastructure/services/OpenAIEmbeddingService.js';
import { CreateSessionDTO, SendMessageDTO } from '../../../application/dto/chat.dto.js';
import { HTTP_STATUS } from '../../../shared/constants.js';
import { NotFoundError } from '../../../application/errors/AppError.js';

export class ChatController {
  private sendMessageUseCase: SendMessage;
  private chatRepository: PostgresChatRepository;
  
  constructor() {
    this.chatRepository = new PostgresChatRepository();
    const chunkRepository = new PostgresChunkRepository();
    const embeddingService = new OpenAIEmbeddingService();
    
    this.sendMessageUseCase = new SendMessage(
      this.chatRepository,
      chunkRepository,
      embeddingService
    );
  }
  
  async createSession(
    request: FastifyRequest<{ Body: CreateSessionDTO }>,
    reply: FastifyReply
  ): Promise<void> {
    const session = await this.chatRepository.createSession(
      request.user.id,
      request.body.title
    );
    
    reply.status(HTTP_STATUS.CREATED).send({ session });
  }
  
  async listSessions(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const sessions = await this.chatRepository.findSessionsByUserId(request.user.id);
    reply.status(HTTP_STATUS.OK).send({ sessions });
  }
  
  async getMessages(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const messages = await this.chatRepository.findMessagesBySessionId(
      request.params.sessionId,
      request.user.id
    );
    
    reply.status(HTTP_STATUS.OK).send({ messages });
  }
  
  async sendMessage(
    request: FastifyRequest<{
      Params: { sessionId: string };
      Body: SendMessageDTO;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { sessionId } = request.params;
    const { content, documentIds } = request.body;
    
    // Set up SSE headers
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    
    try {
      const generator = this.sendMessageUseCase.execute(
        sessionId,
        request.user.id,
        content,
        documentIds
      );
      
      for await (const event of generator) {
        reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
      }
      
      reply.raw.end();
    } catch (error) {
      reply.raw.write(
        `data: ${JSON.stringify({
          type: 'error',
          data: { message: 'Failed to process message' },
        })}\n\n`
      );
      reply.raw.end();
    }
  }
  
  async deleteSession(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    await this.chatRepository.deleteSession(
      request.params.sessionId,
      request.user.id
    );
    
    reply.status(HTTP_STATUS.OK).send({ success: true });
  }
}