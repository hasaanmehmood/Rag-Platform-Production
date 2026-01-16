import { z } from 'zod';

export const GetDocumentsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['processing', 'ready', 'failed']).optional(),
});

export type GetDocumentsDTO = z.infer<typeof GetDocumentsSchema>;