import { MaeValentePillarId, MaeValenteRitualId, MaeValenteSprintId } from './values';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface EditorialPillar {
  readonly id: MaeValentePillarId;
  readonly title: string;
  readonly description: string;
  readonly proofPoints: readonly string[];
  readonly keyActions: readonly string[];
}

export interface WeeklyRitual {
  readonly id: MaeValenteRitualId;
  readonly title: string;
  readonly dayOfWeek: DayOfWeek;
  readonly objective: string;
  readonly coreDeliverables: readonly string[];
  readonly distributionChannels: readonly string[];
  readonly successSignals: readonly string[];
}

export interface SprintPhase {
  readonly week: number;
  readonly focus: string;
  readonly deliverables: readonly string[];
}

export interface SprintCycle {
  readonly id: MaeValenteSprintId;
  readonly theme: string;
  readonly description: string;
  readonly phases: readonly SprintPhase[];
  readonly metrics: readonly string[];
}

export interface SquadRole {
  readonly role: string;
  readonly responsibilities: readonly string[];
  readonly rituals: readonly string[];
}

export interface TrendSource {
  readonly name: string;
  readonly cadence: string;
  readonly owner: string;
  readonly automation: string;
}

export interface TrendResponsePlay {
  readonly trigger: string;
  readonly expectedSlaHours: number;
  readonly actions: readonly string[];
}

export interface CommunityLoopInitiative {
  readonly name: string;
  readonly description: string;
  readonly successCriteria: readonly string[];
}

export interface DistributionChannel {
  readonly name: string;
  readonly objective: string;
  readonly frequency: string;
  readonly owner: string;
  readonly kpis: readonly string[];
}

export interface MetricDefinition {
  readonly name: string;
  readonly description: string;
  readonly calculation: string;
  readonly cadence: string;
  readonly owner: string;
  readonly alertRule?: string;
}

export interface MaeValentePlan {
  readonly pillars: readonly EditorialPillar[];
  readonly weeklyRituals: readonly WeeklyRitual[];
  readonly sprintCycles: readonly SprintCycle[];
  readonly squad: readonly SquadRole[];
  readonly trendSources: readonly TrendSource[];
  readonly trendResponse: readonly TrendResponsePlay[];
  readonly communityLoop: readonly CommunityLoopInitiative[];
  readonly distribution: readonly DistributionChannel[];
  readonly metrics: readonly MetricDefinition[];
}
