/**
 * Zod Schemas - Chat Message
 * Validação de mensagens de chat
 */

import { z } from 'zod';

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  message: z.string().min(1).max(5000),
  response: z.string().max(5000),
  risk_level: z.number().int().min(0).max(10).default(0),
  risk_flags: z.array(z.string()).default([]),
  requires_intervention: z.boolean().default(false),
  created_at: z.string().datetime(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const CreateChatMessageSchema = z.object({
  message: z.string().min(1).max(5000),
  userId: z.string().uuid(),
});

export type CreateChatMessage = z.infer<typeof CreateChatMessageSchema>;
