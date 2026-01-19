import { FastifyRequest, FastifyReply } from 'fastify';
import { SendMessage } from '../../../application/use-cases/chat/SendMessage.js';
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
    try {
      const session = await this.chatRepository.createSession(
        request.user.id,
        request.body.title
      );
      
      return reply.status(HTTP_STATUS.CREATED).send({ session });
    } catch (error: any) {
      request.log.error({ error }, 'Error creating session');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        error: 'Failed to create session',
        message: error.message
      });
    }
  }
  
  async listSessions(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const sessions = await this.chatRepository.findSessionsByUserId(request.user.id);
      return reply.status(HTTP_STATUS.OK).send({ sessions });
    } catch (error: any) {
      request.log.error({ error }, 'Error listing sessions');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        error: 'Failed to list sessions',
        message: error.message
      });
    }
  }
  
  async getMessages(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const messages = await this.chatRepository.findMessagesBySessionId(
        request.params.sessionId,
        request.user.id
      );
      
      return reply.status(HTTP_STATUS.OK).send({ messages });
    } catch (error: any) {
      request.log.error({ error }, 'Error getting messages');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        error: 'Failed to get messages',
        message: error.message
      });
    }
  }
  
  // CRITICAL: This method handles its own response completely
  // The route handler must NOT await this or try to handle the response
  
 sendMessage(
  request: FastifyRequest<any>,
  reply: FastifyReply
): void {
  console.log('🔍 sendMessage called');
  console.log('🔍 reply.sent:', reply.sent);
  console.log('🔍 reply.raw.headersSent:', reply.raw.headersSent);
  
  const { sessionId } = request.params as { sessionId: string };
  const { content, documentIds } = request.body as SendMessageDTO;
  
  (async () => {
    try {
      console.log('🔍 Inside IIFE - about to set headers');
      console.log('🔍 reply.sent:', reply.sent);
      console.log('🔍 reply.raw.headersSent:', reply.raw.headersSent);
      
      request.log.info({ sessionId, userId: request.user.id }, 'Processing chat message');
      
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      
      console.log('✅ Headers set');
      
      const generator = this.sendMessageUseCase.execute(
        sessionId,
        request.user.id,
        content,
        documentIds
      );
      
      for await (const event of generator) {
        if (reply.raw.destroyed) {
          request.log.warn({ sessionId }, 'Client disconnected');
          break;
        }
        reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
      }
      
      if (!reply.raw.destroyed) {
        reply.raw.end();
      }
      
    } catch (error: any) {
      request.log.error({ error, sessionId }, 'Error in sendMessage');
      
      if (!reply.raw.headersSent) {
        reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
          error: 'Failed to send message',
          message: error.message
        });
      } else if (!reply.raw.destroyed) {
        reply.raw.write(
          `data: ${JSON.stringify({
            type: 'error',
            data: { message: error.message || 'An error occurred' }
          })}\n\n`
        );
        reply.raw.end();
      }
    }
  })();
}


  async deleteSession(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await this.chatRepository.deleteSession(
        request.params.sessionId,
        request.user.id
      );
      
      return reply.status(HTTP_STATUS.OK).send({ success: true });
    } catch (error: any) {
      request.log.error({ error }, 'Error deleting session');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        error: 'Failed to delete session',
        message: error.message
      });
    }
  }
}