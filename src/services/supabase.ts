import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_CONFIG } from '@/config/api';

// ⚠️ CONFIGURE SUAS CREDENCIAIS DO SUPABASE
// Substitua pelos valores do seu projeto Supabase no arquivo .env.local

// Obter valores das variáveis de ambiente (ou usar valores dummy)
const rawUrl = SUPABASE_CONFIG.URL || '';
const rawKey = SUPABASE_CONFIG.ANON_KEY || '';

// Valores dummy válidos do Supabase (apenas para evitar erro de inicialização)
// Em produção, essas variáveis DEVE estar configuradas no Netlify
const dummyUrl = 'https://placeholder.supabase.co';
const dummyKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Garantir que sempre temos valores não-vazios (usar dummy se necessário)
const supabaseUrl = rawUrl.trim() || dummyUrl;
const supabaseAnonKey = rawKey.trim() || dummyKey;

// Avisar se usando valores dummy
if (!rawUrl || !rawKey) {
  console.warn('⚠️ Supabase não configurado. Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY');
  console.warn('⚠️ Usando valores dummy para evitar erro. Configure as variáveis de ambiente no Netlify para produção');
}

// Criar cliente Supabase (sempre com valores válidos)
// IMPORTANTE: Configure as variáveis de ambiente no Netlify para produção
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Usar AsyncStorage apenas se não estiver no web (web usa localStorage automaticamente)
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Types
export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  type: 'gestante' | 'mae' | 'tentante' | 'puerperio' | 'mae_estabelecida';
  pregnancy_week?: number;
  baby_name?: string;
  preferences: string[];
  subscription_tier: 'free' | 'premium';
  created_at: string;
  daily_interactions: number;
  last_interaction_date: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
  context_data?: any;
}

export interface DailyPlan {
  id: string;
  user_id: string;
  date: string;
  priorities: string[];
  tip: string;
  tip_video_url?: string;
  recipe: string;
  created_at: string;
}

/**
 * Cria um usuário temporário/anônimo para testes ou uso sem autenticação
 *
 * Usa autenticação anônima do Supabase para criar um usuário temporário
 * que pode ser usado para testes ou funcionalidades que não requerem login.
 *
 * @returns Dados do usuário criado (incluindo id, access_token, etc)
 * @throws {Error} Se a criação do usuário anônimo falhar
 *
 * @example
 * const user = await createTemporaryUser();
 * console.log("Usuário temporário criado:", user.id);
 */
export const createTemporaryUser = async () => {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user;
};

/**
 * Salva ou atualiza o perfil do usuário
 *
 * Usa upsert para criar um novo perfil ou atualizar um existente.
 * Se o perfil já existir (baseado no id), será atualizado.
 * Caso contrário, será criado um novo perfil.
 *
 * @param profile - Dados parciais do perfil do usuário para salvar/atualizar
 * @returns Array com o perfil salvo/atualizado
 * @throws {Error} Se a operação de upsert falhar
 *
 * @example
 * const profile = await saveUserProfile({
 *   id: userId,
 *   name: "Maria",
 *   type: "gestante",
 *   pregnancy_week: 20
 * });
 * console.log("Perfil salvo:", profile[0]);
 */
export const saveUserProfile = async (profile: Partial<UserProfile>) => {
  const { data, error } = await supabase.from('user_profiles').upsert(profile).select();

  if (error) throw error;
  return data;
};

/**
 * Salva uma mensagem de chat no banco de dados
 *
 * Insere uma nova mensagem de chat (pergunta do usuário e resposta da NAT-IA)
 * na tabela chat_messages do Supabase.
 *
 * @param message - Dados parciais da mensagem de chat (user_id, message, response, context_data)
 * @returns Array com a mensagem salva
 * @throws {Error} Se a inserção falhar
 *
 * @example
 * const chatMessage = await saveChatMessage({
 *   user_id: userId,
 *   message: "Olá!",
 *   response: "Olá! Como posso ajudar?",
 *   context_data: { pregnancy_week: 20 }
 * });
 * console.log("Mensagem salva:", chatMessage[0].id);
 */
export const saveChatMessage = async (message: Partial<ChatMessage>) => {
  const { data, error } = await supabase.from('chat_messages').insert(message).select();

  if (error) throw error;
  return data;
};

/**
 * Busca o histórico de mensagens de chat do usuário
 *
 * Retorna as mensagens de chat ordenadas cronologicamente (mais antigas primeiro).
 * Por padrão, retorna até 50 mensagens, mas o limite pode ser customizado.
 *
 * @param userId - ID do usuário para buscar o histórico
 * @param limit - Número máximo de mensagens a retornar (padrão: 50)
 * @returns Array de mensagens de chat ordenadas cronologicamente (mais antigas primeiro)
 * @throws {Error} Se a busca falhar
 *
 * @example
 * const history = await getChatHistory(userId, 20);
 * console.log(`Histórico com ${history.length} mensagens`);
 * history.forEach(msg => console.log(msg.message));
 */
export const getChatHistory = async (userId: string, limit: number = 50) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data?.reverse() || [];
};

/**
 * Salva ou atualiza o plano diário do usuário
 *
 * Usa upsert para criar um novo plano diário ou atualizar um existente.
 * O plano diário contém prioridades, dicas, receitas e outras informações
 * personalizadas para o dia específico.
 *
 * @param plan - Dados parciais do plano diário (user_id, date, priorities, tip, recipe, etc)
 * @returns Array com o plano diário salvo/atualizado
 * @throws {Error} Se a operação de upsert falhar
 *
 * @example
 * const dailyPlan = await saveDailyPlan({
 *   user_id: userId,
 *   date: "2025-01-15",
 *   priorities: ["Descansar", "Hidratar"],
 *   tip: "Dica do dia",
 *   recipe: "Receita saudável"
 * });
 * console.log("Plano diário salvo:", dailyPlan[0].id);
 */
export const saveDailyPlan = async (plan: Partial<DailyPlan>) => {
  const { data, error } = await supabase.from('daily_plans').upsert(plan).select();

  if (error) throw error;
  return data;
};

/**
 * Busca o plano diário do usuário para uma data específica
 *
 * Retorna o plano diário do usuário para a data especificada.
 * Se não houver plano para a data, retorna null (sem lançar erro).
 *
 * @param userId - ID do usuário para buscar o plano
 * @param date - Data no formato YYYY-MM-DD para buscar o plano
 * @returns Plano diário encontrado ou null se não existir
 * @throws {Error} Se a busca falhar (exceto quando não encontrar registro)
 *
 * @example
 * const plan = await getDailyPlan(userId, "2025-01-15");
 * if (plan) {
 *   console.log("Prioridades:", plan.priorities);
 * } else {
 *   console.log("Nenhum plano encontrado para esta data");
 * }
 */
export const getDailyPlan = async (userId: string, date: string) => {
  const { data, error } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};
