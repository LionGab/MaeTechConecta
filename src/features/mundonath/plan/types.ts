export interface TonePrinciple {
  readonly id: string;
  readonly description: string;
  readonly practicalExamples: readonly string[];
}

export interface Guardrail {
  readonly id: string;
  readonly focus: string;
  readonly boundaries: readonly string[];
  readonly alignmentChecks: readonly string[];
}

export interface PreferredFormat {
  readonly id: string;
  readonly cadence: string;
  readonly channel: string;
  readonly structure: readonly string[];
  readonly ctas: readonly string[];
}

export interface IntegrationTouchpoint {
  readonly context: string;
  readonly expectation: string;
  readonly crossPromotion: readonly string[];
}

export interface AnalyticsNeed {
  readonly metric: string;
  readonly owner: string;
  readonly insightAction: string;
}

export interface MundoNathPlan {
  readonly tone: readonly TonePrinciple[];
  readonly guardrails: readonly Guardrail[];
  readonly formats: readonly PreferredFormat[];
  readonly integrations: readonly IntegrationTouchpoint[];
  readonly analytics: readonly AnalyticsNeed[];
}

