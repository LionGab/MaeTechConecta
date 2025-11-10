/**
 * Guardrails da NAT-AI
 *
 * Sistema de proteção e filtros para garantir que NAT-AI não dê conselhos médicos
 * ou perca sinais de crise
 */

/**
 * Termos proibidos - relacionados a conselhos médicos, medicamentos e diagnósticos
 */
export const FORBIDDEN_TOPICS: string[] = [
  // Medicamentos e remédios
  'remedio',
  'remédio',
  'medicamento',
  'medicação',
  'comprimido',
  'pílula',
  'cápsula',
  'gotas',
  'antibiotico',
  'antibiótico',
  'anti-inflamatório',
  'antidepressivo',
  'ansiolítico',
  'analgésico',
  'paracetamol',
  'dipirona',
  'ibuprofeno',
  'aspirina',
  'omeprazol',
  'omeprazol',
  'ranitidina',
  // Diagnósticos médicos
  'diagnostico',
  'diagnóstico',
  'diagnosticar',
  'doença',
  'doenca',
  'patologia',
  'sintoma',
  'sintomas',
  'síndrome',
  'transtorno',
  'infecção',
  'infeccao',
  'bacteriana',
  'viral',
  'pressão alta',
  'pressao alta',
  'hipertensão',
  'diabetes',
  'glicose',
  'insulina',
  'anemia',
  'deficiencia',
  'deficiência',
  // Procedimentos médicos
  'exame',
  'exames',
  'teste',
  'testes',
  'ultrassom',
  'ultra-som',
  'ecografia',
  'sangue',
  'urina',
  'fezes',
  'biopsia',
  'biópsia',
  'cirurgia',
  'tratamento',
  'terapia medicamentosa',
  // Ações médicas
  'tomar',
  'usar',
  'aplicar',
  'administrar',
  'dose',
  'dosagem',
  'posologia',
  'receita',
  'prescrição',
  'prescrever',
  'indicar',
  'recomendar remédio',
  'sugerir remédio',
  // Termos relacionados a gravidez/bebê que exigem médico
  'contração',
  'contração',
  'dilatação',
  'bolsa estourou',
  'bolsa rompeu',
  'sangramento',
  'sangramento vaginal',
  'movimento do bebê',
  'bebê não mexeu',
];

const FORBIDDEN_TOPICS_NORMALIZED = FORBIDDEN_TOPICS.map((topic) => normalizeString(topic));

const MEDICAL_INDICATORS = [
  'remedio',
  'remédio',
  'medicamento',
  'medicação',
  'comprimido',
  'pílula',
  'cápsula',
  'gota',
  'gotas',
  'dose',
  'dosagem',
  'posologia',
  'receita',
  'prescrição',
  'antibiotico',
  'antibiótico',
  'antiinflamatorio',
  'anti-inflamatório',
  'analgésico',
  'ansiolitico',
  'ansiolítico',
  'antidepressivo',
  'dipirona',
  'ibuprofeno',
  'paracetamol',
  'ranitidina',
  'omeprazol',
];

const MEDICAL_INDICATORS_NORMALIZED = MEDICAL_INDICATORS.map((indicator) => normalizeString(indicator));

const MEDICAL_VERBS = ['tomar', 'usar', 'aplicar', 'administrar', 'prescrever', 'indicar', 'recomendar', 'sugerir'];
const MEDICAL_VERBS_NORMALIZED = MEDICAL_VERBS.map((verb) => normalizeString(verb));

/**
 * Palavras-chave de risco - sinais de crise emocional ou perigo
 */
export const RISK_KEYWORDS: string[] = [
  // Ideação suicida
  'suicidio',
  'suicídio',
  'suicida',
  'me matar',
  'quero morrer',
  'vou morrer',
  'não vale a pena viver',
  'sem sentido',
  'quero sumir',
  'acabar com tudo',
  'fim de tudo',
  'não aguento mais viver',
  // Pensamentos de harm ao bebê
  'machucar o bebê',
  'fazer mal ao bebê',
  'quero fazer mal',
  'quero machucar',
  'tenho vontade de machucar',
  // Psicose e alucinações
  'ouvir vozes',
  'ouço vozes',
  'ver coisas',
  'vejo coisas',
  'não é real',
  'delírio',
  // Violência
  'ele me bate',
  'ele me agride',
  'violência',
  'abuso',
  'me machuca',
  'me agride',
  // Depressão severa
  'não consigo levantar',
  'não saio da cama',
  'não consigo cuidar do bebê',
  'não me importo mais',
  'nada importa',
  // Negligência
  'não estou cuidando',
  'deixei de cuidar',
  'não tenho forças para cuidar',
];

const RISK_KEYWORDS_NORMALIZED = RISK_KEYWORDS.map((keyword) => normalizeString(keyword));

const SUICIDAL_PATTERNS = [
  'suicidio',
  'suicida',
  'me matar',
  'quero morrer',
  'vou morrer',
  'não vale a pena viver',
  'acabar com tudo',
  'não aguento mais viver',
].map((pattern) => normalizeString(pattern));

const HARM_TO_BABY_PATTERNS = [
  'machucar o bebê',
  'machucar o bebe',
  'fazer mal ao bebê',
  'fazer mal ao bebe',
  'quero machucar o bebê',
  'quero machucar o bebe',
  'tenho vontade de machucar',
].map((pattern) => normalizeString(pattern));

const PSYCHOSIS_PATTERNS = [
  'ouvir vozes',
  'ouço vozes',
  'ver coisas',
  'vejo coisas',
  'não é real',
  'delirio',
  'delírio',
].map((pattern) => normalizeString(pattern));

const SEVERE_DEPRESSION_PATTERNS = [
  'não consigo levantar',
  'não saio da cama',
  'não consigo cuidar do bebê',
  'não consigo cuidar do bebe',
  'não me importo mais',
  'nada importa',
].map((pattern) => normalizeString(pattern));

const OVERLOAD_PATTERNS = ['não aguento mais', 'não tenho forças', 'sem energia', 'exausta'].map((pattern) =>
  normalizeString(pattern)
);

const ANXIETY_PATTERNS = ['muito ansiosa', 'pânico', 'panico', 'ataque de pânico', 'ataque de panico'].map((pattern) =>
  normalizeString(pattern)
);

const SELF_HARM_PATTERNS = ['me cortar', 'me machucar', 'autoagressao', 'auto-agressão', 'auto agressao'].map(
  (pattern) => normalizeString(pattern)
);

const PPD_PATTERNS = ['depressão pós-parto', 'depressao pos parto', 'ppd'].map((pattern) => normalizeString(pattern));
const BURNOUT_PATTERNS = ['não aguento mais', 'sem energia', 'exausta'].map((pattern) => normalizeString(pattern));
const NORMAL_STRESS_PATTERNS = ['desabafo', 'cansada', 'preciso desabafar'].map((pattern) => normalizeString(pattern));

/**
 * Verifica se a mensagem contém tópicos proibidos (conselhos médicos)
 */
export function containsForbiddenTopic(message: string): boolean {
  const normalizedMessage = normalizeString(message);
  const normalizedTokens = new Set(normalizedMessage.split(' '));

  if (FORBIDDEN_TOPICS_NORMALIZED.some((topic) => normalizedMessage.includes(topic))) {
    return true;
  }

  const hasMedicalVerb = MEDICAL_VERBS_NORMALIZED.some((verb) => normalizedTokens.has(verb));
  if (!hasMedicalVerb) {
    return false;
  }

  const hasMedicalIndicator = MEDICAL_INDICATORS_NORMALIZED.some((indicator) => normalizedMessage.includes(indicator));
  return hasMedicalIndicator;
}

/**
 * Verifica se a mensagem contém palavras-chave de risco
 */
export function containsRiskKeywords(message: string): boolean {
  const normalizedMessage = normalizeString(message);

  return RISK_KEYWORDS_NORMALIZED.some((keyword) => normalizedMessage.includes(keyword));
}

/**
 * Calcula o nível de risco da mensagem (0-10)
 *
 * 0-2: Normal
 * 3-4: Estresse elevado
 * 5-6: Sobrecarga significativa
 * 7-8: Depressão/ansiedade clínica
 * 9-10: CRISE - requer intervenção imediata
 */
export function getRiskLevel(message: string): number {
  const signals = detectRiskSignals(message);
  let riskLevel = 0;

  // Ideação suicida ou pensamentos de morte
  if (signals.suicidalIdeation) {
    riskLevel = Math.max(riskLevel, 10);
  }

  // Pensamentos de machucar o bebê
  if (signals.harmToBaby) {
    riskLevel = Math.max(riskLevel, 10);
  }

  // Psicose ou alucinações
  if (signals.psychosis) {
    riskLevel = Math.max(riskLevel, 9);
  }

  // Depressão severa
  if (signals.severeDepression) {
    riskLevel = Math.max(riskLevel, 8);
  }

  // Estresse elevado / sobrecarga
  if (signals.overload) {
    riskLevel = Math.max(riskLevel, 5);
  }

  // Ansiedade / preocupação
  if (signals.anxiety) {
    riskLevel = Math.max(riskLevel, 4);
  }

  return Math.min(riskLevel, 10);
}

export interface RiskSignals {
  suicidalIdeation: boolean;
  harmToBaby: boolean;
  psychosis: boolean;
  selfHarm: boolean;
  severeDepression: boolean;
  postpartumDepression: boolean;
  burnout: boolean;
  overload: boolean;
  anxiety: boolean;
  normalStress: boolean;
}

export function detectRiskSignals(message: string): RiskSignals {
  const normalizedMessage = normalizeString(message);

  return {
    suicidalIdeation: matchesAny(normalizedMessage, SUICIDAL_PATTERNS),
    harmToBaby: matchesAny(normalizedMessage, HARM_TO_BABY_PATTERNS),
    psychosis: matchesAny(normalizedMessage, PSYCHOSIS_PATTERNS),
    selfHarm: matchesAny(normalizedMessage, SELF_HARM_PATTERNS),
    severeDepression: matchesAny(normalizedMessage, SEVERE_DEPRESSION_PATTERNS),
    postpartumDepression: matchesAny(normalizedMessage, PPD_PATTERNS),
    burnout: matchesAny(normalizedMessage, BURNOUT_PATTERNS),
    overload: matchesAny(normalizedMessage, OVERLOAD_PATTERNS),
    anxiety: matchesAny(normalizedMessage, ANXIETY_PATTERNS),
    normalStress: matchesAny(normalizedMessage, NORMAL_STRESS_PATTERNS),
  };
}

/**
 * Normaliza string removendo acentos e caracteres especiais
 * para melhor detecção de variações
 */
export function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesAny(text: string, patterns: string[]): boolean {
  return patterns.some((pattern) => pattern.length > 0 && text.includes(pattern));
}

/**
 * Resposta quando tópico proibido é detectado
 */
export const BLOCKED_RESPONSE = `Oi querida! Entendo sua preocupação ou curiosidade, mas preciso ser honesta: não sou médica e não posso te ajudar com questões de saúde, medicamentos ou diagnósticos.

Para qualquer dúvida sobre sintomas, medicamentos, tratamentos ou sua saúde, é essencial você conversar com seu médico ou buscar atendimento profissional. Eles têm a formação e experiência necessárias para te orientar adequadamente.

O que posso fazer é te acolher emocionalmente enquanto você busca esse apoio. Como você está se sentindo com essa situação? 🤗`;

/**
 * Resposta de crise para alto risco
 */
export const CRISIS_RESPONSE_TEMPLATE = (
  userName: string
) => `Querida ${userName}, preciso ser direta com você agora. O que você compartilhou é muito sério, e você precisa de ajuda profissional urgente. Por favor:

🚨 **Se você estiver em perigo imediato**: Ligue para o SAMU - 192

💝 **Se você estiver pensando em se machucar**: Ligue para o CVV - 188 (disponível 24h, gratuito e anônimo)

🏥 **Procure um CAPS** (Centro de Atenção Psicossocial) mais próximo de você

Se você tiver um plano concreto de se machucar, vá imediatamente ao hospital mais próximo ou ligue 192.

Você não está sozinha. Há ajuda disponível, e você merece cuidado e apoio profissional agora. Não hesite em buscar ajuda.

Estou aqui para você, mas a ajuda profissional é essencial neste momento. 💝`;

