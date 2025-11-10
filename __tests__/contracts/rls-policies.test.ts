/**
 * Testes de Contrato RLS (Row Level Security)
 *
 * Valida as policies RLS essenciais utilizando Supabase real.
 * O teste cria usuários reais, autentica sessões e garante que
 * somente operações autorizadas são permitidas.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase environment variables are required for RLS contract tests.');
}

type UserFixture = {
  id: string;
  email: string;
  client: SupabaseClient;
};

describe('RLS Policies - Contract Tests', () => {
  let anonClient: SupabaseClient;
  let serviceClient: SupabaseClient;
  let userA: UserFixture;
  let userB: UserFixture;

  beforeAll(async () => {
    anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    });

    serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    });

    userA = await createAuthenticatedUser('tester-a');
    userB = await createAuthenticatedUser('tester-b');

    await seedProfiles();
    await seedChatMessages();
  });

  async function createAuthenticatedUser(suffix: string): Promise<UserFixture> {
    const email = `qa-${suffix}-${Date.now()}@example.com`;
    const password = 'QaPass123!';

    const { data: created, error: createError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError || !created?.user?.id) {
      throw new Error(`Falha ao criar usuário de teste (${suffix}): ${createError?.message}`);
    }

    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    });

    const { error: signInError } = await client.auth.signInWithPassword({ email, password });
    if (signInError) {
      throw new Error(`Falha ao autenticar usuário de teste (${suffix}): ${signInError.message}`);
    }

    return {
      id: created.user.id,
      email,
      client,
    };
  }

  async function seedProfiles(): Promise<void> {
    await serviceClient.from('user_profiles').upsert(
      [
        {
          id: userA.id,
          email: userA.email,
          name: 'QA User A',
          type: 'gestante',
        },
        {
          id: userB.id,
          email: userB.email,
          name: 'QA User B',
          type: 'mae',
        },
      ],
      { onConflict: 'id' }
    );
  }

  async function seedChatMessages(): Promise<void> {
    await serviceClient.from('chat_messages').insert(
      [
        {
          user_id: userA.id,
          message: 'Olá assistente!',
          response: 'Olá! Como posso ajudar?',
          role: 'user',
        },
        {
          user_id: userB.id,
          message: 'Mensagem usuário B',
          response: 'Resposta usuário B',
          role: 'user',
        },
      ],
      { count: 'exact' }
    );
  }

  describe('chat_messages table', () => {
    it('permite usuário autenticado ler suas próprias mensagens', async () => {
      const { data, error } = await userA.client
        .from('chat_messages')
        .select('id, user_id, message')
        .eq('user_id', userA.id);

      expect(error).toBeNull();
      expect(data?.every((row) => row.user_id === userA.id)).toBe(true);
      expect(data?.length).toBeGreaterThan(0);
    });

    it('bloqueia leitura de mensagens de outros usuários', async () => {
      const { data, error } = await userA.client
        .from('chat_messages')
        .select('id, user_id, message')
        .eq('user_id', userB.id);

      expect(error).toBeNull();
      expect(data).toEqual([]);
    });

    it('permite inserir mensagens do próprio usuário', async () => {
      const insertResponse = await userA.client
        .from('chat_messages')
        .insert({
          user_id: userA.id,
          message: 'Mensagem autorizada',
          response: 'Resposta gerada',
          role: 'user',
        })
        .select('user_id')
        .single();

      expect(insertResponse.error).toBeNull();
      expect(insertResponse.data?.user_id).toBe(userA.id);
    });

    it('bloqueia inserção de mensagens atribuídas a outro usuário', async () => {
      const { error } = await userA.client.from('chat_messages').insert({
        user_id: userB.id,
        message: 'Tentativa indevida',
        response: 'Resposta inválida',
        role: 'user',
      });

      expect(error?.message.toLowerCase()).toContain('permission');
    });

    it('impede usuários anônimos de ler mensagens', async () => {
      const { data, error } = await anonClient.from('chat_messages').select('id').limit(1);

      expect(error?.message.toLowerCase()).toContain('permission');
      expect(data).toBeNull();
    });
  });

  describe('user_profiles table', () => {
    it('permite usuário autenticado ler seu próprio perfil', async () => {
      const { data, error } = await userA.client.from('user_profiles').select('*').eq('id', userA.id).single();

      expect(error).toBeNull();
      expect(data?.id).toBe(userA.id);
    });

    it('permite usuário autenticado atualizar seu próprio perfil', async () => {
      const { data, error } = await userA.client
        .from('user_profiles')
        .update({ name: 'QA User A Updated' })
        .eq('id', userA.id)
        .select('id, name')
        .single();

      expect(error).toBeNull();
      expect(data?.name).toBe('QA User A Updated');
    });

    it('bloqueia atualização de perfis de outros usuários', async () => {
      const { error } = await userA.client
        .from('user_profiles')
        .update({ name: 'Hacked Name' })
        .eq('id', userB.id)
        .select('id');

      expect(error?.message.toLowerCase()).toContain('permission');
    });
  });

  describe('rate_limit_events table', () => {
    it('permite registro de eventos do próprio usuário', async () => {
      const { data, error } = await userA.client
        .from('rate_limit_events')
        .insert({
          user_id: userA.id,
          endpoint: 'chat',
        })
        .select('user_id')
        .single();

      expect(error).toBeNull();
      expect(data?.user_id).toBe(userA.id);
    });

    it('bloqueia registro de eventos atribuídos a outro usuário', async () => {
      const { error } = await userA.client.from('rate_limit_events').insert({
        user_id: userB.id,
        endpoint: 'chat',
      });

      expect(error?.message.toLowerCase()).toContain('permission');
    });
  });
});
