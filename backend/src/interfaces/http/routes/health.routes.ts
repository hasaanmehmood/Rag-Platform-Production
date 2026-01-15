import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { pool } from '../../../infrastructure/database/postgres.js';

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });
  
  fastify.get('/health/db', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await pool.query('SELECT 1');
      reply.send({
        status: 'ok',
        database: 'connected',
      });
    } catch (error) {
      reply.status(503).send({
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}