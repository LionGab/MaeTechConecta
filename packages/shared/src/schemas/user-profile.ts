/**
 * Zod Schemas - User Profile
 * Validação de dados de perfil de usuário
 */

import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().optional(),
  name: z.string().min(1).max(100),
  type: z.enum(['gestante', 'mae', 'tentante']),
  pregnancy_week: z.number().int().min(1).max(42).optional().nullable(),
  baby_name: z.string().max(100).optional().nullable(),
  preferences: z.array(z.string()).default([]),
  subscription_tier: z.enum(['free', 'premium']).default('free'),
  onboarding_data: z.record(z.unknown()).default({}),
  behavior_analysis: z.record(z.unknown()).optional().nullable(),
  risk_level: z.number().int().min(0).max(10).default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const CreateUserProfileSchema = UserProfileSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type CreateUserProfile = z.infer<typeof CreateUserProfileSchema>;

export const UpdateUserProfileSchema = UserProfileSchema.partial().omit({
  id: true,
  created_at: true,
});

export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;
