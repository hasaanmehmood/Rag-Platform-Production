import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../../application/errors/AppError.js';
import { ZodError } from 'zod';
import { logger } from '../../../shared/logger.js';
import { HTTP_STATUS } from '../../../shared/constants.js';

export async function errorHandler(
  error: FastifyError | AppError | ZodError | Error,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Log error
  logger.error(
    {
      err: error,
      req: request,
    },
    'Request error'
  );
  
  // Handle AppError (our custom errors)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }
  
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(HTTP_STATUS.BAD_REQUEST).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }
  
  // Handle Fastify validation errors
  if ('validation' in error) {
    return reply.status(HTTP_STATUS.BAD_REQUEST).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.validation,
      },
    });
  }
  
  // Default to 500 for unknown errors
  const statusCode = 'statusCode' in error ? error.statusCode || 500 : 500;
  
  reply.status(statusCode).send({
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : error.message,
    },
  });
}