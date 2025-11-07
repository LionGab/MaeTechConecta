# 🗄️ Agente 2 (Backend Architect) - Revisão de Serviços

## 📋 Relatório de Revisão Completa

**Data**: Janeiro 2025  
**Escopo**: src/services/  
**Status**: ✅ Análise Completa

---

## 📊 Resumo Executivo

**Serviços Analisados**: 9  
**Problemas Críticos (5)**: 3  
**Problemas Altos (4)**: 5  
**Problemas Médios (3)**: 7  
**Problemas Baixos (2)**: 4

---

## 🔴 Problemas Críticos (Severidade 5)

### 1. **supabase.ts** - Valores Dummy em Produção

**Problema**: Código usa valores dummy se variáveis de ambiente não estiverem configuradas.

```typescript
const dummyUrl = 'https://placeholder.supabase.co';
const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const supabaseUrl = rawUrl.trim() || dummyUrl;
const supabaseAnonKey = rawKey.trim() || dummyKey;
```

**Risco**: App pode rodar em produção com credenciais falsas.

**Correção**:

```typescript
if (!rawUrl || !rawKey) {
  throw new Error('FATAL: EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY devem estar configurados');
}

export const supabase = createClient(rawUrl, rawKey, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

### 2. **supabase.ts** - Sem Validação de Entrada

**Problema**: Funções não validam entrada antes de queries.

```typescript
export const saveChatMessage = async (message: Partial<ChatMessage>) => {
  const { data, error } = await supabase.from('chat_messages').insert(message).select();
  if (error) throw error;
  return data;
};
```

**Risco**: SQL Injection via objetos malformados, dados inválidos no DB.

**Correção**:

```typescript
export const saveChatMessage = async (message: Partial<ChatMessage>) => {
  // Validação de entrada
  if (!message.user_id || !message.message || !message.response) {
    throw new Error('user_id, message e response são obrigatórios');
  }

  if (typeof message.message !== 'string' || message.message.length > 5000) {
    throw new Error('message inválida');
  }

  // Sanitização
  const sanitizedMessage = {
    user_id: message.user_id.trim(),
    message: message.message.trim().substring(0, 5000),
    response: message.response.trim().substring(0, 10000),
    context_data: message.context_data || {},
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('chat_messages').insert(sanitizedMessage).select();

  if (error) {
    console.error('Erro ao salvar mensagem:', error);
    throw new Error('Falha ao salvar mensagem de chat');
  }

  return data;
};
```

---

### 3. **ai.ts** - API Keys Hardcoded em Código

**Problema**: API keys expostas em código fonte.

```typescript
headers: {
  'x-api-key': API_CONFIG.CLAUDE_API_KEY,
  Authorization: `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
}
```

**Risco**: Keys podem vazar se código for exposto.

**Correção**:

- Mover TODAS as chamadas de API para Edge Functions do Supabase
- Nunca expor API keys no código client-side
- Usar variáveis de ambiente apenas no backend

```typescript
// REMOVER chatWithAI do cliente e usar APENAS Edge Functions
export const chatWithNATIA = async (message: string, context: ChatContext, userId: string): Promise<string> => {
  // Esta é a abordagem correta - tudo via Edge Function
  const { supabase } = await import('./supabase');
  const { data, error } = await supabase.functions.invoke('nathia-chat', {
    body: { userId, message, context },
  });
  // ...
};
```

---

## 🟠 Problemas Altos (Severidade 4)

### 1. **auth.ts** - Sem Rate Limiting

**Problema**: Funções de autenticação não têm rate limiting.

**Risco**: Ataques de força bruta, DDoS.

**Correção**:

- Implementar rate limiting no Supabase (políticas RLS + Edge Functions)
- Adicionar retry com backoff exponencial
- Limitar tentativas de login (3-5 por minuto)

---

### 2. **ai.ts** - Sem Sanitização de Input

**Problema**: Input do usuário vai direto para APIs de IA.

```typescript
content: message, // ❌ Sem sanitização
```

**Risco**: Prompt injection, execução de comandos maliciosos.

**Correção**:

```typescript
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .substring(0, 2000) // Limitar tamanho
    .replace(/<[^>]*>/g, '') // Remover HTML
    .replace(/[^\w\s\u00C0-\u00FF.,!?-]/gi, ''); // Apenas caracteres seguros
};

export const chatWithNATIA = async (message: string, context: ChatContext, userId: string) => {
  const sanitizedMessage = sanitizeInput(message);
  if (!sanitizedMessage || sanitizedMessage.length < 2) {
    throw new Error('Mensagem inválida');
  }
  // ...
};
```

---

### 3. **payments.ts** - Funções Mock em Produção

**Problema**: Funções de pagamento retornam mock.

```typescript
export const subscribeToPremium = async (): Promise<boolean> => {
  return true; // ❌ Mock
};
```

**Risco**: Usuários podem obter premium gratuitamente.

**Correção**:

- Implementar integração real com Stripe
- Validar pagamento no backend (Edge Function)
- Atualizar subscription_tier apenas após confirmação

---

### 4. **contentGenerator.ts** - Sem Tratamento de Erros Adequado

**Problema**: Erros retornam string vazia.

```typescript
catch (error) {
  console.error('Erro ao gerar vídeo:', error);
  return ''; // ❌ Usuário não sabe que falhou
}
```

**Correção**:

```typescript
catch (error) {
  console.error('Erro ao gerar vídeo:', error);
  throw new Error('Falha ao gerar vídeo. Tente novamente.');
}
```

---

### 5. **supabase.ts** - Sem Verificação de RLS

**Problema**: Código não verifica se RLS está ativo.

**Correção**:

- Verificar políticas RLS no Supabase
- Adicionar testes de RLS
- Documentar políticas esperadas

---

## 🟡 Problemas Médios (Severidade 3)

### 1. **auth.ts** - Callback de OAuth Hardcoded

```typescript
redirectTo: 'nossa-maternidade://auth/callback', // ❌ Hardcoded
```

**Correção**:

```typescript
redirectTo: process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URL || 'nossa-maternidade://auth/callback',
```

---

### 2. **user.service.ts** - Tipo `any` em OnboardingData

```typescript
import { OnboardingData } from '@/types/onboarding.types'; // ❌ any em context_data
```

**Correção**: Tipar context_data corretamente.

---

### 3. **ai.ts** - Sem Timeout em Requisições

**Problema**: Requisições podem travar indefinidamente.

**Correção**:

```typescript
const response = await axios.post(url, body, {
  headers,
  timeout: 30000, // 30 segundos
});
```

---

### 4. **supabase.ts** - getChatHistory Sem Paginação

**Problema**: Busca até 50 mensagens de uma vez.

**Correção**:

```typescript
export const getChatHistory = async (
  userId: string,
  limit: number = 20, // Reduzir padrão
  offset: number = 0 // Adicionar paginação
) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  // ...
};
```

---

### 5. **Todos os Serviços** - Logs Expostos

**Problema**: `console.error` expõe detalhes de erro.

**Correção**:

- Usar Sentry para logs
- Não expor stack traces ao usuário
- Logs apenas em desenvolvimento

---

### 6. **ai.ts** - detectUrgency Incompleto

**Problema**: Lista de keywords pode perder casos.

**Correção**:

- Adicionar mais keywords
- Usar regex mais robusto
- Considerar usar IA para detecção

---

### 7. **payments.ts** - checkSubscriptionStatus Não Busca DB

**Problema**: Função não busca dados reais.

**Correção**:

```typescript
export const checkSubscriptionStatus = async (userId: string): Promise<'free' | 'premium'> => {
  try {
    const { data, error } = await supabase.from('user_profiles').select('subscription_tier').eq('id', userId).single();

    if (error) throw error;
    return data.subscription_tier || 'free';
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return 'free';
  }
};
```

---

## 🔵 Problemas Baixos (Severidade 2)

### 1. Falta de JSDoc em contentGenerator.ts

**Status**: ✅ Já identificado pelo Agente 8

---

### 2. Falta de Testes Unitários

**Recomendação**: Adicionar testes para funções críticas.

---

### 3. Falta de Documentação de RLS

**Recomendação**: Documentar políticas esperadas.

---

### 4. Código Duplicado

**Problema**: Lógica similar em vários serviços.

**Recomendação**: Criar utilitários compartilhados.

---

## ✅ Pontos Positivos

1. ✅ JSDoc bem documentado (Agente 8)
2. ✅ Uso de Edge Functions para IA
3. ✅ Estrutura de código organizada
4. ✅ TypeScript com tipagem forte
5. ✅ Uso de try-catch em lugares críticos

---

## 🎯 Plano de Ação Prioritário

### Crítico (Fazer AGORA)

1. ✅ Remover valores dummy de `supabase.ts`
2. ✅ Adicionar validação de entrada em TODAS as funções
3. ✅ Mover API keys para Edge Functions
4. ✅ Implementar sanitização de input

### Alto (Esta Semana)

5. ✅ Adicionar rate limiting
6. ✅ Implementar pagamentos reais
7. ✅ Melhorar tratamento de erros
8. ✅ Verificar e documentar RLS

### Médio (Este Mês)

9. ✅ Adicionar timeout em requisições
10. ✅ Implementar paginação
11. ✅ Melhorar logging (Sentry)
12. ✅ Adicionar testes unitários

---

## 📝 Checklist de Segurança

- [ ] Todas as API keys em variáveis de ambiente
- [ ] Validação de entrada em todas as funções
- [ ] Sanitização de input do usuário
- [ ] RLS ativo e testado
- [ ] Rate limiting implementado
- [ ] Tratamento de erros adequado
- [ ] Logs seguros (sem expor dados sensíveis)
- [ ] Timeout em todas as requisições HTTP
- [ ] Paginação em queries grandes
- [ ] Testes de segurança

---

**Relatório gerado pelo Agente 2 (Backend Architect)**
