/**
 * Testes de Contrato RLS (Row Level Security)
 *
 * Verifica que as policies RLS estão funcionando corretamente
 * Testa diferentes roles (authenticated, anon, service_role)
 */

import { createClient } from '@supabase/supabase-js';

// Configuração de teste (usar variáveis de ambiente)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'test-anon-key';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-key';

describe('RLS Policies - Contract Tests', () => {
  let anonClient: ReturnType<typeof createClient>;
  let authenticatedClient: ReturnType<typeof createClient>;
  let serviceClient: ReturnType<typeof createClient>;
  let testUserId: string;

  beforeAll(async () => {
    // Criar clientes para diferentes roles
    anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    authenticatedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Criar usuário de teste (se necessário)
    // testUserId = await createTestUser();
  });

  describe('chat_messages table', () => {
    it('deve permitir usuário autenticado ler suas próprias mensagens', async () => {
      const { data, error } = await authenticatedClient.from('chat_messages').select('*').eq('user_id', testUserId);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('NÃO deve permitir usuário autenticado ler mensagens de outros usuários', async () => {
      const { data, error } = await authenticatedClient
        .from('chat_messages')
        .select('*')
        .neq('user_id', testUserId)
        .limit(1);

      // Deve retornar vazio (RLS bloqueia)
      expect(data).toEqual([]);
    });

    it('deve permitir usuário autenticado inserir suas próprias mensagens', async () => {
      const { data, error } = await authenticatedClient
        .from('chat_messages')
        .insert({
          user_id: testUserId,
          message: 'Test message',
          role: 'user',
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.user_id).toBe(testUserId);
    });

    it('NÃO deve permitir usuário autenticado inserir mensagens para outros usuários', async () => {
      const { error } = await authenticatedClient.from('chat_messages').insert({
        user_id: 'other-user-id', // Tentar inserir para outro usuário
        message: 'Test message',
        role: 'user',
      });

      expect(error).toBeDefined();
      expect(error?.message).toContain('RLS');
    });

    it('NÃO deve permitir usuário anônimo ler mensagens', async () => {
      const { data, error } = await anonClient.from('chat_messages').select('*').limit(1);

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });
  });

  describe('user_profiles table', () => {
    it('deve permitir usuário autenticado ler seu próprio perfil', async () => {
      const { data, error } = await authenticatedClient.from('user_profiles').select('*').eq('id', testUserId).single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('deve permitir usuário autenticado atualizar seu próprio perfil', async () => {
      const { data, error } = await authenticatedClient
        .from('user_profiles')
        .update({ name: 'Updated Name' })
        .eq('id', testUserId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('NÃO deve permitir usuário autenticado atualizar perfil de outros', async () => {
      const { error } = await authenticatedClient
        .from('user_profiles')
        .update({ name: 'Hacked' })
        .neq('id', testUserId)
        .limit(1);

      expect(error).toBeDefined();
    });
  });

  describe('rate_limit_events table', () => {
    it('deve permitir usuário autenticado inserir seus próprios eventos', async () => {
      const { data, error } = await authenticatedClient
        .from('rate_limit_events')
        .insert({
          user_id: testUserId,
          endpoint: 'chat',
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('NÃO deve permitir usuário autenticado inserir eventos para outros', async () => {
      const { error } = await authenticatedClient.from('rate_limit_events').insert({
        user_id: 'other-user-id',
        endpoint: 'chat',
      });

      expect(error).toBeDefined();
    });
  });
});

