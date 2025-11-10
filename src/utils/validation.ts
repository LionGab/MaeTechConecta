/**
 * Validation Utilities
 *
 * 🔐 SEGURANÇA: Validações de entrada para prevenir SQL injection e ataques
 *
 * Todas as funções de banco de dados devem validar inputs antes de processar.
 */

/**
 * Valida se uma string é um UUID válido (formato v4)
 *
 * @param value - String a ser validada
 * @returns true se for um UUID válido, false caso contrário
 *
 * @example
 * isValidUUID('550e8400-e29b-41d4-a716-446655440000') // true
 * isValidUUID('invalid-uuid') // false
 */
export function isValidUUID(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Valida se uma string não está vazia e tem tamanho aceitável
 *
 * @param value - String a ser validada
 * @param minLength - Tamanho mínimo (padrão: 1)
 * @param maxLength - Tamanho máximo (padrão: 10000)
 * @returns true se for válida, false caso contrário
 *
 * @example
 * isValidString('Olá!', 1, 100) // true
 * isValidString('', 1, 100) // false
 * isValidString('x'.repeat(10001), 1, 10000) // false
 */
export function isValidString(value: string, minLength: number = 1, maxLength: number = 10000): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

/**
 * Valida se um número está dentro de um intervalo
 *
 * @param value - Número a ser validado
 * @param min - Valor mínimo (padrão: 0)
 * @param max - Valor máximo (padrão: 100)
 * @returns true se for válido, false caso contrário
 *
 * @example
 * isValidNumber(25, 1, 42) // true
 * isValidNumber(-5, 0, 100) // false
 */
export function isValidNumber(value: number, min: number = 0, max: number = 100): boolean {
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }

  return value >= min && value <= max;
}

/**
 * Valida se uma data está no formato ISO 8601 (YYYY-MM-DD)
 *
 * @param value - String de data a ser validada
 * @returns true se for uma data válida, false caso contrário
 *
 * @example
 * isValidDate('2025-01-15') // true
 * isValidDate('15/01/2025') // false
 * isValidDate('invalid') // false
 */
export function isValidDate(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }

  // Regex para YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    return false;
  }

  // Validar que é uma data real
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Valida dados de uma mensagem de chat antes de salvar
 *
 * @param message - Objeto com dados da mensagem
 * @throws {Error} Se algum campo for inválido
 *
 * @example
 * validateChatMessage({
 *   user_id: '550e8400-e29b-41d4-a716-446655440000',
 *   message: 'Olá!',
 *   response: 'Oi, como posso ajudar?'
 * }) // OK
 *
 * validateChatMessage({
 *   user_id: 'invalid',
 *   message: '',
 *   response: ''
 * }) // Throws Error
 */
export function validateChatMessage(message: {
  user_id?: string;
  message?: string;
  response?: string;
  context_data?: any;
}): void {
  // Validar user_id
  if (!message.user_id || !isValidUUID(message.user_id)) {
    throw new Error('user_id inválido: deve ser um UUID válido');
  }

  // Validar message
  if (!message.message || !isValidString(message.message, 1, 5000)) {
    throw new Error('message inválido: deve ter entre 1 e 5000 caracteres');
  }

  // Validar response
  if (!message.response || !isValidString(message.response, 1, 10000)) {
    throw new Error('response inválido: deve ter entre 1 e 10000 caracteres');
  }

  // context_data é opcional, mas se fornecido deve ser um objeto
  if (message.context_data !== undefined && typeof message.context_data !== 'object') {
    throw new Error('context_data inválido: deve ser um objeto');
  }
}

/**
 * Valida dados de um perfil de usuário antes de salvar
 *
 * @param profile - Objeto com dados do perfil
 * @throws {Error} Se algum campo for inválido
 *
 * @example
 * validateUserProfile({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   name: 'Maria Silva',
 *   type: 'gestante',
 *   preferences: ['amamentação'],
 *   subscription_tier: 'free'
 * }) // OK
 */
export function validateUserProfile(profile: {
  id?: string;
  name?: string;
  type?: string;
  pregnancy_week?: number;
  preferences?: string[];
  subscription_tier?: string;
  [key: string]: any;
}): void {
  // Validar id (se fornecido)
  if (profile.id && !isValidUUID(profile.id)) {
    throw new Error('id inválido: deve ser um UUID válido');
  }

  // Validar name (se fornecido)
  if (profile.name !== undefined && !isValidString(profile.name, 1, 100)) {
    throw new Error('name inválido: deve ter entre 1 e 100 caracteres');
  }

  // Validar type (se fornecido)
  const validTypes = ['gestante', 'mae', 'tentante', 'puerperio', 'mae_estabelecida'];
  if (profile.type && !validTypes.includes(profile.type)) {
    throw new Error(`type inválido: deve ser um de: ${validTypes.join(', ')}`);
  }

  // Validar pregnancy_week (se fornecido)
  if (profile.pregnancy_week !== undefined && !isValidNumber(profile.pregnancy_week, 1, 42)) {
    throw new Error('pregnancy_week inválido: deve estar entre 1 e 42');
  }

  // Validar preferences (se fornecido)
  if (profile.preferences !== undefined) {
    if (!Array.isArray(profile.preferences)) {
      throw new Error('preferences inválido: deve ser um array');
    }
    if (profile.preferences.length > 50) {
      throw new Error('preferences inválido: máximo de 50 itens');
    }
  }

  // Validar subscription_tier (se fornecido)
  const validTiers = ['free', 'premium'];
  if (profile.subscription_tier && !validTiers.includes(profile.subscription_tier)) {
    throw new Error(`subscription_tier inválido: deve ser um de: ${validTiers.join(', ')}`);
  }
}

/**
 * Valida um userId antes de consultas ao banco
 *
 * @param userId - ID do usuário a ser validado
 * @throws {Error} Se userId for inválido
 *
 * @example
 * validateUserId('550e8400-e29b-41d4-a716-446655440000') // OK
 * validateUserId('invalid') // Throws Error
 */
export function validateUserId(userId: string): void {
  if (!userId || !isValidUUID(userId)) {
    throw new Error('userId inválido: deve ser um UUID válido');
  }
}

/**
 * Sanitiza uma string removendo caracteres perigosos
 *
 * Remove caracteres que podem ser usados em SQL injection ou XSS
 *
 * @param value - String a ser sanitizada
 * @returns String sanitizada
 *
 * @example
 * sanitizeString("Hello'; DROP TABLE users;--") // "Hello DROP TABLE users"
 * sanitizeString("<script>alert('xss')</script>") // "scriptalert'xss'script"
 */
export function sanitizeString(value: string): string {
  if (!value || typeof value !== 'string') {
    return '';
  }

  // Remove caracteres perigosos comuns em SQL injection e XSS
  return value
    .replace(/[;'"<>{}()\\]/g, '') // Remove caracteres perigosos
    .replace(/--/g, '') // Remove comentários SQL
    .replace(/\/\*/g, '') // Remove início de comentário SQL
    .replace(/\*\//g, '') // Remove fim de comentário SQL
    .trim();
}

/**
 * Valida um limite de paginação
 *
 * @param limit - Número de itens por página
 * @param max - Limite máximo permitido (padrão: 100)
 * @throws {Error} Se limite for inválido
 *
 * @example
 * validateLimit(50, 100) // OK
 * validateLimit(150, 100) // Throws Error
 */
export function validateLimit(limit: number, max: number = 100): void {
  if (!isValidNumber(limit, 1, max)) {
    throw new Error(`limit inválido: deve estar entre 1 e ${max}`);
  }
}

/**
 * Alias para validateUserProfile (compatibilidade)
 */
export const validateProfile = validateUserProfile;

/**
 * Valida dados de um plano diário antes de salvar
 *
 * @param plan - Objeto com dados do plano diário
 * @throws {Error} Se algum campo for inválido
 */
export function validateDailyPlan(plan: {
  user_id?: string;
  date?: string;
  priorities?: string[];
  tip?: string;
  recipe?: string;
  [key: string]: any;
}): void {
  // Validar user_id (se fornecido)
  if (plan.user_id && !isValidUUID(plan.user_id)) {
    throw new Error('user_id inválido: deve ser um UUID válido');
  }

  // Validar date (se fornecido)
  if (plan.date && !isValidDate(plan.date)) {
    throw new Error('date inválido: deve estar no formato YYYY-MM-DD');
  }

  // Validar priorities (se fornecido)
  if (plan.priorities !== undefined) {
    if (!Array.isArray(plan.priorities)) {
      throw new Error('priorities inválido: deve ser um array');
    }
    if (plan.priorities.length > 20) {
      throw new Error('priorities inválido: máximo de 20 itens');
    }
  }

  // Validar tip (se fornecido)
  if (plan.tip !== undefined && !isValidString(plan.tip, 1, 2000)) {
    throw new Error('tip inválido: deve ter entre 1 e 2000 caracteres');
  }

  // Validar recipe (se fornecido)
  if (plan.recipe !== undefined && !isValidString(plan.recipe, 1, 2000)) {
    throw new Error('recipe inválido: deve ter entre 1 e 2000 caracteres');
  }
}

/**
 * Sanitiza um objeto removendo caracteres perigosos de todas as strings
 *
 * @param obj - Objeto a ser sanitizado
 * @param maxLength - Tamanho máximo para strings (padrão: 10000)
 * @returns Objeto sanitizado
 *
 * @example
 * const safe = sanitizeObject({
 *   name: "Maria'; DROP TABLE--",
 *   message: "Hello<script>alert('xss')</script>"
 * }, 1000);
 * // { name: "Maria DROP TABLE", message: "Helloscriptalert'xss'script" }
 */
export function sanitizeObject(obj: any, maxLength: number = 10000): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Se for array, sanitizar cada elemento
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === 'string' ? sanitizeString(item).slice(0, maxLength) : sanitizeObject(item, maxLength)
    );
  }

  // Se for objeto, sanitizar cada propriedade
  const sanitized: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value).slice(0, maxLength);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value, maxLength);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

