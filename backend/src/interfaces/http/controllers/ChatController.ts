import { FastifyRequest, FastifyReply } from 'fastify';
import SendMessage from '../../../application/use-cases/chat/SendMessage.js';
import { PostgresChatRepository } from '../../../infrastructure/database/repositories/PostgresChatRepository.js';
import { PostgresChunkRepository } from '../../../infrastructure/database/repositories/PostgresChunkRepository.js';
import { OpenAIEmbeddingService } from '../../../infrastructure/services/OpenAIEmbeddingService.js';
import { CreateSessionDTO, SendMessageDTO } from '../../../application/dto/chat.dto.js';
import { HTTP_STATUS } from '../../../shared/constants.js';

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
    
    return reply.status(HTTP_STATUS.CREATED).send({ session });
  }
  
  async listSessions(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const sessions = await this.chatRepository.findSessionsByUserId(request.user.id);
    return reply.status(HTTP_STATUS.OK).send({ sessions });
  }
  
  async getMessages(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const messages = await this.chatRepository.findMessagesBySessionId(
      request.params.sessionId,
      request.user.id
    );
    
    return reply.status(HTTP_STATUS.OK).send({ messages });
  }
  
  async handleSendMessage(
    request: FastifyRequest<{
      Params: { sessionId: string };
      Body: SendMessageDTO;
    }>,
    reply: FastifyReply
  ): Promise<void> {
    const { sessionId } = request.params;
    const { content, documentIds, systemPrompt } = request.body;

    // Bypass Fastify's reply handling for SSE
    reply.hijack();

    // Set up SSE headers with CORS
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': request.headers.origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'X-Accel-Buffering': 'no',
    });

    try {
      const generator = this.sendMessageUseCase.execute(
        sessionId,
        request.user.id,
        content,
        documentIds,
        systemPrompt
      );
      
      for await (const event of generator) {
        reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
      }
      
      reply.raw.end();
    } catch (error) {
      console.error('Stream error:', error);
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
    
    return reply.status(HTTP_STATUS.OK).send({ success: true });
  }
}