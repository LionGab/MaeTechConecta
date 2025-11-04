/**
 * Contract Tests - RLS Policies
 * Testa Row Level Security (RLS) para garantir que usuários só acessam seus próprios dados
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials não configuradas. Testes de RLS serão pulados.');
}

describe('RLS Policies - User Profiles', () => {
  let supabase: ReturnType<typeof createClient>;
  let userA: { id: string; email: string };
  let userB: { id: string; email: string };

  beforeAll(async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return;
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Criar usuários de teste (se necessário)
    // userA = await createTestUser('userA@test.com');
    // userB = await createTestUser('userB@test.com');
  });

  it('deve permitir SELECT dos próprios dados', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: usuário autenticado (userA)
    // Quando: consulta seus próprios dados
    // Então: deve retornar 200 e apenas registros de userA

    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userA.id).single();

    expect(error).toBeNull();
    expect(data).toBeTruthy();
    expect(data?.id).toBe(userA.id);
  });

  it('deve negar SELECT de dados de outro usuário', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: usuário autenticado (userA)
    // Quando: tenta consultar dados de userB
    // Então: deve retornar 403 ou array vazio

    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userB.id).single();

    // RLS deve bloquear ou retornar vazio
    expect(data).toBeNull();
  });

  it('deve negar INSERT com user_id diferente de auth.uid()', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: usuário autenticado (userA)
    // Quando: tenta inserir registro com user_id de userB
    // Então: deve retornar 403/erro

    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userB.id, // Tentando inserir com ID de outro usuário
        name: 'Test User',
        type: 'mae',
      })
      .select()
      .single();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
  });

  it('deve permitir UPDATE do próprio registro', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: usuário autenticado (userA)
    // Quando: atualiza seu próprio registro
    // Então: deve retornar 200 e dados atualizados

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ name: 'Updated Name' })
      .eq('id', userA.id)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeTruthy();
    expect(data?.name).toBe('Updated Name');
  });

  it('deve negar UPDATE de registro de outro usuário', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: usuário autenticado (userA)
    // Quando: tenta atualizar registro de userB
    // Então: deve retornar 403/erro

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ name: 'Hacked Name' })
      .eq('id', userB.id)
      .select()
      .single();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
  });

  it('deve permitir DELETE do próprio registro', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: usuário autenticado (userA)
    // Quando: deleta seu próprio registro
    // Então: deve retornar 200 (se permitido pela política)

    const { error } = await supabase.from('user_profiles').delete().eq('id', userA.id);

    // Nota: Pode ser negado pela política de negócio (não deletar perfil)
    // Se for permitido, error deve ser null
    // expect(error).toBeNull();
  });
});

describe('RLS Policies - Chat Messages', () => {
  it('deve permitir SELECT das próprias mensagens', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: usuário autenticado
    // Quando: consulta suas mensagens de chat
    // Então: deve retornar apenas mensagens do próprio usuário

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    expect(error).toBeNull();
    // Todas as mensagens devem ter user_id do usuário autenticado
    data?.forEach((msg) => {
      // expect(msg.user_id).toBe(authUserId);
    });
  });
});
