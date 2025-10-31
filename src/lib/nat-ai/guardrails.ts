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
  'remedio', 'remédio', 'medicamento', 'medicação',
  'comprimido', 'pílula', 'cápsula', 'gotas',
  'antibiotico', 'antibiótico', 'anti-inflamatório',
  'antidepressivo', 'ansiolítico', 'analgésico',
  'paracetamol', 'dipirona', 'ibuprofeno', 'aspirina',
  'omeprazol', 'omeprazol', 'ranitidina',
  // Diagnósticos médicos
  'diagnostico', 'diagnóstico', 'diagnosticar',
  'doença', 'doenca', 'patologia', 'sintoma',
  'sintomas', 'síndrome', 'transtorno',
  'infecção', 'infeccao', 'bacteriana', 'viral',
  'pressão alta', 'pressao alta', 'hipertensão',
  'diabetes', 'glicose', 'insulina',
  'anemia', 'deficiencia', 'deficiência',
  // Procedimentos médicos
  'exame', 'exames', 'teste', 'testes',
  'ultrassom', 'ultra-som', 'ecografia',
  'sangue', 'urina', 'fezes',
  'biopsia', 'biópsia', 'cirurgia',
  'tratamento', 'terapia medicamentosa',
  // Ações médicas
  'tomar', 'usar', 'aplicar', 'administrar',
  'dose', 'dosagem', 'posologia',
  'receita', 'prescrição', 'prescrever',
  'indicar', 'recomendar remédio', 'sugerir remédio',
  // Termos relacionados a gravidez/bebê que exigem médico
  'contração', 'contração', 'dilatação',
  'bolsa estourou', 'bolsa rompeu',
  'sangramento', 'sangramento vaginal',
  'movimento do bebê', 'bebê não mexeu',
];

/**
 * Palavras-chave de risco - sinais de crise emocional ou perigo
 */
export const RISK_KEYWORDS: string[] = [
  // Ideação suicida
  'suicidio', 'suicídio', 'suicida',
  'me matar', 'quero morrer', 'vou morrer',
  'não vale a pena viver', 'sem sentido',
  'quero sumir', 'acabar com tudo',
  'fim de tudo', 'não aguento mais viver',
  // Pensamentos de harm ao bebê
  'machucar o bebê', 'fazer mal ao bebê',
  'quero fazer mal', 'quero machucar',
  'tenho vontade de machucar',
  // Psicose e alucinações
  'ouvir vozes', 'ouço vozes', 'ver coisas',
  'vejo coisas', 'não é real', 'delírio',
  // Violência
  'ele me bate', 'ele me agride', 'violência',
  'abuso', 'me machuca', 'me agride',
  // Depressão severa
  'não consigo levantar', 'não saio da cama',
  'não consigo cuidar do bebê',
  'não me importo mais', 'nada importa',
  // Negligência
  'não estou cuidando', 'deixei de cuidar',
  'não tenho forças para cuidar',
];

/**
 * Verifica se a mensagem contém tópicos proibidos (conselhos médicos)
 */
export function containsForbiddenTopic(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const normalizedMessage = normalizeString(lowerMessage);

  return FORBIDDEN_TOPICS.some(topic => {
    const normalizedTopic = normalizeString(topic.toLowerCase());
    return normalizedMessage.includes(normalizedTopic);
  });
}

/**
 * Verifica se a mensagem contém palavras-chave de risco
 */
export function containsRiskKeywords(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const normalizedMessage = normalizeString(lowerMessage);

  return RISK_KEYWORDS.some(keyword => {
    const normalizedKeyword = normalizeString(keyword.toLowerCase());
    return normalizedMessage.includes(normalizedKeyword);
  });
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
  const lowerMessage = message.toLowerCase();
  const normalizedMessage = normalizeString(lowerMessage);

  let riskLevel = 0;

  // Ideação suicida ou pensamentos de morte
  if (
    normalizedMessage.includes('suicidio') ||
    normalizedMessage.includes('me matar') ||
    normalizedMessage.includes('quero morrer') ||
    normalizedMessage.includes('não vale a pena viver') ||
    normalizedMessage.includes('acabar com tudo')
  ) {
    riskLevel = Math.max(riskLevel, 10);
  }

  // Pensamentos de machucar o bebê
  if (
    normalizedMessage.includes('machucar o bebe') ||
    normalizedMessage.includes('fazer mal ao bebe') ||
    normalizedMessage.includes('quero machucar o bebe')
  ) {
    riskLevel = Math.max(riskLevel, 10);
  }

  // Psicose ou alucinações
  if (
    normalizedMessage.includes('ouvir vozes') ||
    normalizedMessage.includes('ver coisas') ||
    normalizedMessage.includes('delirio')
  ) {
    riskLevel = Math.max(riskLevel, 9);
  }

  // Depressão severa
  if (
    normalizedMessage.includes('não consigo levantar') ||
    normalizedMessage.includes('não consigo cuidar do bebe') ||
    normalizedMessage.includes('não saio da cama')
  ) {
    riskLevel = Math.max(riskLevel, 8);
  }

  // Estresse elevado / sobrecarga
  if (
    normalizedMessage.includes('não aguento mais') ||
    normalizedMessage.includes('não tenho forças') ||
    normalizedMessage.includes('sem energia') ||
    normalizedMessage.includes('exausta')
  ) {
    riskLevel = Math.max(riskLevel, 5);
  }

  // Ansiedade / preocupação
  if (
    normalizedMessage.includes('muito ansiosa') ||
    normalizedMessage.includes('pânico') ||
    normalizedMessage.includes('ataque de panico')
  ) {
    riskLevel = Math.max(riskLevel, 4);
  }

  return Math.min(riskLevel, 10);
}

/**
 * Normaliza string removendo acentos e caracteres especiais
 * para melhor detecção de variações
 */
function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase();
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
export const CRISIS_RESPONSE_TEMPLATE = (userName: string) => `Querida ${userName}, preciso ser direta com você agora. O que você compartilhou é muito sério, e você precisa de ajuda profissional urgente. Por favor:

🚨 **Se você estiver em perigo imediato**: Ligue para o SAMU - 192

💝 **Se você estiver pensando em se machucar**: Ligue para o CVV - 188 (disponível 24h, gratuito e anônimo)

🏥 **Procure um CAPS** (Centro de Atenção Psicossocial) mais próximo de você

Se você tiver um plano concreto de se machucar, vá imediatamente ao hospital mais próximo ou ligue 192.

Você não está sozinha. Há ajuda disponível, e você merece cuidado e apoio profissional agora. Não hesite em buscar ajuda.

Estou aqui para você, mas a ajuda profissional é essencial neste momento. 💝`;
