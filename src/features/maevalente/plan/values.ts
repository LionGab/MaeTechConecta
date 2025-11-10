export const MAE_VALENTE_PILLAR_IDS = [
  'experiencias-reais',
  'ciencia-especialistas',
  'ferramentas-praticas',
  'cultura-tendencias',
  'autocuidado-integral',
] as const;

export const MAE_VALENTE_RITUAL_IDS = ['segunda-radar', 'quarta-toolbox', 'sexta-vitoria', 'domingo-plano'] as const;

export const MAE_VALENTE_SPRINT_IDS = ['retorno-ao-trabalho', 'sono-do-bebe', 'rede-de-apoio'] as const;

export type MaeValentePillarId = (typeof MAE_VALENTE_PILLAR_IDS)[number];
export type MaeValenteRitualId = (typeof MAE_VALENTE_RITUAL_IDS)[number];
export type MaeValenteSprintId = (typeof MAE_VALENTE_SPRINT_IDS)[number];

