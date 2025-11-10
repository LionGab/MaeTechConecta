import { MAE_VALENTE_PILLARS } from './pillars';
import { MAE_VALENTE_WEEKLY_RITUALS } from './rituals';
import { MAE_VALENTE_SPRINTS } from './sprints';
import {
  MAE_VALENTE_COMMUNITY_LOOP,
  MAE_VALENTE_SQUAD,
  MAE_VALENTE_TREND_RESPONSE,
  MAE_VALENTE_TREND_SOURCES,
} from './operations';
import { MAE_VALENTE_DISTRIBUTION } from './distribution';
import { MAE_VALENTE_METRICS } from './metrics';
import { MaeValentePlan } from './types';

const MAE_VALENTE_PLAN: MaeValentePlan = {
  pillars: MAE_VALENTE_PILLARS,
  weeklyRituals: MAE_VALENTE_WEEKLY_RITUALS,
  sprintCycles: MAE_VALENTE_SPRINTS,
  squad: MAE_VALENTE_SQUAD,
  trendSources: MAE_VALENTE_TREND_SOURCES,
  trendResponse: MAE_VALENTE_TREND_RESPONSE,
  communityLoop: MAE_VALENTE_COMMUNITY_LOOP,
  distribution: MAE_VALENTE_DISTRIBUTION,
  metrics: MAE_VALENTE_METRICS,
};

/**
 * Retorna blueprint completo do plano MãeValente para consumo por hooks ou serviços.
 * Objeto é imutável; alterações devem ser feitas nos módulos específicos.
 */
export function getMaeValentePlan(): MaeValentePlan {
  return MAE_VALENTE_PLAN;
}

export * from './types';
export * from './values';
export {
  MAE_VALENTE_PILLARS,
  MAE_VALENTE_WEEKLY_RITUALS,
  MAE_VALENTE_SPRINTS,
  MAE_VALENTE_SQUAD,
  MAE_VALENTE_TREND_SOURCES,
  MAE_VALENTE_TREND_RESPONSE,
  MAE_VALENTE_COMMUNITY_LOOP,
  MAE_VALENTE_DISTRIBUTION,
  MAE_VALENTE_METRICS,
};
