# Status da Autenticação e Criação de Perfil

## Status Geral

✅ **Serviços de autenticação implementados**
⏳ **Criação automática de perfil precisa ser verificada**

## Serviços Implementados

### 1. Autenticação (`src/services/auth.ts`)

✅ **Completo** - Implementa:

- Sign up com email/senha
- Sign in com email/senha
- Magic link (OTP por email)
- SMS OTP
- OAuth (Google, GitHub, Facebook, Apple)
- Recuperação de senha
- Sign in anônimo (para onboarding rápido)
- Gerenciamento de sessão

### 2. Perfil de Usuário (`src/services/user.service.ts`)

✅ **Completo** - Implementa:

- `createUserProfile()` - Criar perfil inicial
- `getUserProfile()` - Buscar perfil
- `updateUserProfile()` - Atualizar perfil
- `upsertUserProfile()` - Criar ou atualizar
- `incrementDailyInteractions()` - Incrementar interações

### 3. Onboarding (`src/services/onboarding.service.ts`)

✅ **Completo** - Implementa:

- `saveOnboardingData()` - Salva dados do onboarding e cria perfil
- Cria perfil automaticamente quando onboarding é completado

## Fluxo Atual

### Fluxo de Registro/Login

1. Usuário faz sign up/sign in via `auth.ts`
2. Usuário é redirecionado para onboarding
3. Onboarding coleta dados do usuário
4. `saveOnboardingData()` cria perfil em `user_profiles`

### Fluxo de Sign In Anônimo

1. Usuário faz sign in anônimo
2. Pode usar app sem perfil completo
3. Perfil é criado quando completa onboarding

## Verificações Necessárias

### 1. Trigger Automático no Banco

⏳ **Verificar se existe trigger para criar perfil automaticamente**

**Recomendação:** Criar trigger no Supabase que cria perfil básico quando usuário é criado em `auth.users`:

```sql
-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, type, subscription_tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuária'),
    COALESCE(NEW.raw_user_meta_data->>'type', 'mae'),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Sincronização AsyncStorage ↔ Supabase

⏳ **Verificar se há sincronização**

**Status:** `useUserProfile` hook carrega apenas do AsyncStorage. Precisa sincronizar com Supabase.

### 3. Verificação de Perfil ao Fazer Login

⏳ **Verificar se app verifica existência de perfil ao fazer login**

**Recomendação:** Adicionar verificação no fluxo de login:

- Se perfil não existe, redirecionar para onboarding
- Se perfil existe, carregar do Supabase e salvar no AsyncStorage

## Próximos Passos

1. ✅ Serviços de autenticação implementados
2. ✅ Serviços de perfil implementados
3. ⏳ Criar trigger automático no banco (opcional, mas recomendado)
4. ⏳ Adicionar verificação de perfil no fluxo de login
5. ⏳ Sincronizar AsyncStorage com Supabase

## Notas

- O fluxo atual depende do onboarding para criar perfil
- Sign in anônimo permite usar app sem perfil completo
- Recomendado criar trigger automático para garantir perfil sempre existe

