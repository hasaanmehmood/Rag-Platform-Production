import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { ZodSchema } from 'zod';
import { ValidationError } from '../../../application/errors/AppError.js';

export function validateBody(schema: ZodSchema) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    try {
      request.body = schema.parse(request.body);
      done();
    } catch (error) {
      done(error as Error);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    try {
      request.query = schema.parse(request.query);
      done();
    } catch (error) {
      done(error as Error);
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) => {
    try {
      request.params = schema.parse(request.params);
      done();
    } catch (error) {
      done(error as Error);
    }
  };
}