# 🔒 Segurança - Nossa Maternidade

**Última atualização**: 2025-01-XX  
**Versão**: 1.0.0

---

## 🎯 Visão Geral

Este documento descreve as políticas de segurança, moderação, compliance LGPD e guardrails do **Nossa Maternidade**.

---

## 🔐 Segurança de Dados

### Row Level Security (RLS)

**Todas as tabelas** no Supabase devem ter RLS habilitado.

#### Políticas RLS Padrão

```sql
-- Exemplo: user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Usuário autenticado pode ler apenas seu próprio perfil
CREATE POLICY "user_read_own_profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Usuário autenticado pode atualizar apenas seu próprio perfil
CREATE POLICY "user_update_own_profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Usuário autenticado pode inserir apenas seu próprio perfil
CREATE POLICY "user_insert_own_profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

#### Checklist RLS

- [ ] Todas as tabelas têm RLS habilitado
- [ ] Políticas testadas via contract tests (ver **[CONTRACT_TESTS.md](./CONTRACT_TESTS.md)**)
- [ ] Sem uso de `SERVICE_ROLE` em handlers de usuário
- [ ] Edge Functions autenticadas via `Authorization` header (ANON key)

---

## 🛡️ Moderação de Conteúdo

### Edge Function: `moderation-service`

**Responsabilidade**: Moderar mensagens de usuário e respostas da IA.

#### Fluxo de Moderação

1. **Input**: Mensagem do usuário ou resposta da IA
2. **Moderação 3 camadas**:
   - **Camada 1**: Palavras-chave (banlist)
   - **Camada 2**: Classificação de sentimento (toxicity, spam)
   - **Camada 3**: Análise de contexto (intenção, contexto)
3. **Output**: 
   - `approved`: Conteúdo aprovado
   - `rejected`: Conteúdo rejeitado
   - `requires_review`: Requer revisão humana

#### Guardrails

- **Nunca** fornecer conselhos médicos diretos
- **Sempre** redirecionar para emergência em casos críticos
- **Sempre** validar input com Zod schemas
- **Sempre** logar eventos de moderação

---

## 🚨 Detecção de Risco

### Edge Function: `risk-classifier`

**Responsabilidade**: Classificar risco de crise (suicídio, violência, abuso).

#### Níveis de Risco

1. **LOW**: Sem risco aparente
2. **MEDIUM**: Risco moderado (monitorar)
3. **HIGH**: Risco alto (alertar time)
4. **CRITICAL**: Risco crítico (ativar protocolo de crise)

#### Protocolo de Crise

```typescript
// Pseudocódigo
if (riskLevel === 'CRITICAL') {
  // 1. Bloquear resposta automática
  // 2. Alertar time imediatamente
  // 3. Redirecionar para linha de emergência
  // 4. Logar evento crítico
  // 5. Notificar autoridades (se necessário)
}
```

---

## 📋 Compliance LGPD

### Direitos do Usuário

1. **Acesso**: Exportar todos os dados
2. **Correção**: Atualizar dados incorretos
3. **Exclusão**: Deletar todos os dados
4. **Portabilidade**: Exportar dados em formato legível

### Edge Function: `lgpd-requests`

**Responsabilidade**: Processar solicitações LGPD.

#### Endpoints

- `POST /lgpd/export` - Exportar dados do usuário
- `POST /lgpd/delete` - Deletar dados do usuário
- `GET /lgpd/status` - Status da solicitação

#### Implementação

```typescript
// Pseudocódigo
export async function handleLGPDRequest(req: Request) {
  const { userId, requestType } = await req.json();
  
  if (requestType === 'export') {
    // 1. Buscar todos os dados do usuário
    // 2. Gerar arquivo JSON
    // 3. Enviar por email
    // 4. Logar evento
  }
  
  if (requestType === 'delete') {
    // 1. Deletar todos os dados do usuário
    // 2. Anonimizar logs
    // 3. Confirmar exclusão
    // 4. Logar evento
  }
}
```

---

## 🔒 Guardrails de IA

### Sistema NatIA

**Responsabilidade**: Garantir respostas seguras e apropriadas.

#### Guardrails Obrigatórios

1. **Nunca** fornecer conselhos médicos diretos
   - ✅ Redirecionar para profissional de saúde
   - ❌ Não diagnosticar ou prescrever

2. **Sempre** validar input/output com Zod
   - ✅ Schemas de validação
   - ❌ Respostas não validadas

3. **Sempre** classificar risco antes de responder
   - ✅ Risk classifier integrado
   - ❌ Respostas sem análise de risco

4. **Sempre** moderar conteúdo
   - ✅ Moderation service integrado
   - ❌ Conteúdo não moderado

#### System Prompt

```typescript
const SYSTEM_PROMPT = `
Você é NathIA, assistente virtual para mães brasileiras.

REGRA CRÍTICA: NUNCA forneça conselhos médicos diretos.
- Se a usuária perguntar sobre sintomas, redirecione para profissional de saúde
- Se detectar emergência, redirecione para SAMU (192)

REGRA DE SEGURANÇA: Sempre classifique risco antes de responder.
- Use risk-classifier para avaliar nível de risco
- Se risco CRITICAL, ative protocolo de crise

REGRA DE MODERAÇÃO: Sempre modere conteúdo.
- Use moderation-service para validar mensagens
- Se conteúdo rejeitado, não responda

REGRA DE VALIDAÇÃO: Sempre valide I/O com Zod.
- Input: validar mensagem do usuário
- Output: validar resposta antes de enviar
`;
```

---

## 🔐 Autenticação e Autorização

### Supabase Auth

- **Autenticação**: Supabase Auth (email/password, anonymous)
- **Autorização**: RLS policies no Supabase
- **Edge Functions**: Autenticadas via `Authorization` header (ANON key)

### Rate Limiting

**Event-based** (janela deslizante) por endpoint/usuário.

```typescript
// Exemplo: rate-limit.ts
const LIMITS = {
  chat: { max: 10, windowMs: 60_000 }, // 10 req/min
  'daily-plan': { max: 5, windowMs: 60 * 60 * 1000 }, // 5 req/hora
} as const;
```

---

## 📊 Logs e Auditoria

### Logs Obrigatórios

1. **Eventos de segurança**:
   - Tentativas de acesso não autorizado
   - Moderações rejeitadas
   - Detecções de risco crítico
   - Solicitações LGPD

2. **Logs de auditoria**:
   - Acesso a dados sensíveis
   - Modificações em RLS policies
   - Deploys de Edge Functions

### Destino dos Logs

- **Sentry**: Erros e eventos críticos
- **Supabase Logs**: Edge Functions logs
- **GitHub Actions**: Logs de CI/CD (temporários)

---

## 🧪 Testes de Segurança

### Contract Tests

Ver **[CONTRACT_TESTS.md](./CONTRACT_TESTS.md)** para testes de contrato RLS e Edge Functions.

### Checklist de Testes

- [ ] RLS policies testadas (contract tests)
- [ ] Moderation service testada (unit + integration)
- [ ] Risk classifier testado (unit + integration)
- [ ] LGPD requests testadas (integration)
- [ ] Rate limiting testado (integration)
- [ ] Guardrails testados (integration)

---

## 🚨 Incidentes de Segurança

### Processo de Resposta

1. **Detecção**: Identificar incidente (< 5min)
2. **Isolamento**: Bloquear acesso se necessário (< 5min)
3. **Análise**: Investigar causa raiz (< 1h)
4. **Correção**: Aplicar hotfix se necessário (< 2h)
5. **Comunicação**: Notificar usuários afetados (< 24h)
6. **Documentação**: Atualizar este documento

### Contato de Emergência

- **Time de Segurança**: [email@exemplo.com]
- **GitHub Issues**: Label `security` + `urgent`
- **Slack**: Canal `#security-alerts`

---

## 📚 Referências

- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [LGPD](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Sentry Security](https://docs.sentry.io/product/security/)

---

## 📋 Checklist de Segurança

### Pré-Deploy

- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas RLS testadas (contract tests)
- [ ] Edge Functions autenticadas (ANON key)
- [ ] Rate limiting configurado
- [ ] Moderation service ativo
- [ ] Risk classifier ativo
- [ ] Guardrails implementados
- [ ] LGPD requests funcionando

### Pós-Deploy

- [ ] Logs de segurança ativos
- [ ] Alertas configurados (Sentry)
- [ ] Monitoramento de anomalias
- [ ] Backup de dados configurado

---

**Última atualização**: 2025-01-XX  
**Mantido por**: Time Nossa Maternidade

