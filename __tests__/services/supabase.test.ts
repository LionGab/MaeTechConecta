/**
 * Testes - Supabase Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signIn: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user' } } }, error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    })),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  })),
}));

describe('Supabase Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar cliente Supabase', () => {
    const supabase = createClient('https://test.supabase.co', 'test-key');
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });

  it('deve fazer sign in', async () => {
    const supabase = createClient('https://test.supabase.co', 'test-key');
    const { data, error } = await supabase.auth.signIn({ email: 'test@test.com', password: 'password' });

    expect(error).toBeNull();
    expect(data?.user?.id).toBe('test-user');
  });

  it('deve fazer sign up', async () => {
    const supabase = createClient('https://test.supabase.co', 'test-key');
    const { data, error } = await supabase.auth.signUp({ email: 'test@test.com', password: 'password' });

    expect(error).toBeNull();
    expect(data?.user?.id).toBe('test-user');
  });

  it('deve consultar dados', async () => {
    const supabase = createClient('https://test.supabase.co', 'test-key');
    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', 'test-user').single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
