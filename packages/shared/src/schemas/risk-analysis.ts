/**
 * Zod Schemas - Risk Analysis
 * Validação de análise de risco emocional
 */

import { z } from 'zod';

export const RiskAnalysisSchema = z.object({
  level: z.number().int().min(0).max(10),
  flags: z.array(
    z.enum([
      'suicidal_ideation',
      'harm_to_baby',
      'psychosis',
      'self_harm',
      'severe_depression',
      'ppd',
      'burnout',
      'normal_stress',
    ])
  ),
  requires_intervention: z.boolean(),
  suggested_resources: z.array(z.enum(['cvv', 'caps', 'emergency', 'therapy'])),
  reasoning: z.string().max(500),
});

export type RiskAnalysis = z.infer<typeof RiskAnalysisSchema>;
