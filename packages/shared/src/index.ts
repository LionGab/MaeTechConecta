/**
 * @nossa/shared
 *
 * Pacote compartilhado com:
 * - Sistema de IA (NAT-AI)
 * - Schemas Zod para validação
 * - Design System (tema)
 * - Utilitários compartilhados
 */

// Sistema de IA
export * from './nat-ai/system-prompt';
export * from './nat-ai/guardrails';
export * from './nat-ai/risk-analyzer';
export * from './nat-ai/context-manager';
export * from './nat-ai/team-notifier';
export * from './nat-ai/model-router';
export * from './nat-ai/schemas';

// Schemas Zod
export * from './schemas/user-profile';
export * from './schemas/chat-message';
export * from './schemas/risk-analysis';

// Design System
export * from './theme/colors';
export * from './theme/index';
