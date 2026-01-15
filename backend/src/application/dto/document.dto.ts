import { z } from 'zod';
import { DOCUMENT_STATUS } from '../../shared/constants.js';

export const GetDocumentsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum([DOCUMENT_STATUS.PROCESSING, DOCUMENT_STATUS.READY, DOCUMENT_STATUS.FAILED]).optional(),
});

export type GetDocumentsDTO = z.infer<typeof GetDocumentsSchema>;