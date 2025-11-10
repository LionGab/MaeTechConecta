/**
 * NAT-AI - Sistema de IA de Acolhimento Emocional
 *
 * Exporta todos os módulos do sistema NAT-AI:
 * - System prompts
 * - Guardrails de segurança
 * - Risk analyzer
 * - Context manager
 * - Team notifier
 * - Model router
 *
 * Note: Schemas are exported from individual modules that define them,
 * not from schemas.ts to avoid duplicate exports
 */

export * from './system-prompt';
export * from './guardrails';
export * from './risk-analyzer';
export * from './context-manager';
export * from './team-notifier';
export * from './model-router';

