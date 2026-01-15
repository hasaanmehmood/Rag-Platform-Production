import { z } from 'zod';

export const CreateSessionSchema = z.object({
  title: z.string().max(200).optional(),
});

export const SendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(4000),
  documentIds: z.array(z.string().uuid()).optional(),
});

export type CreateSessionDTO = z.infer<typeof CreateSessionSchema>;
export type SendMessageDTO = z.infer<typeof SendMessageSchema>;