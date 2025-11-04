# LGPD e Segurança - Nossa Maternidade

## 📋 Princípios

### PII Mínima

- **Só o essencial**: Email, nome (opcional)
- **Dados sensíveis**: Apenas com consentimento explícito
  - Luto/diário: Requer consentimento
  - Dados de saúde: Requer consentimento
  - Dados de localização: Requer consentimento

### Retenção

- **Logs**: 30-90 dias
- **Dados de usuário**: Permitir opt-out/anonimização
- **Dados de chat**: 90 dias (configurável)
- **Dados de risco**: 365 dias (requisito legal)

### RLS by Default

- **Toda tabela de dados pessoais**: RLS ativado
- **Políticas por `auth.uid()`**: Usuário só acessa seus próprios dados
- **Testes contratuais**: Validar RLS em todos os casos

### Secrets

- **Nunca em código**: Apenas em ambientes (GitHub/Expo/Supabase)
- **Rotação**: 90 dias
- **Documentação**: Manter histórico em `docs/ENVIRONMENTS.md`

## 🔒 Segurança

### Checklist de PR (Obrigatório)

Antes de mergear PR, verificar:

- [ ] Este PR adiciona/expõe PII?
  - Se sim: Adicionar consentimento explícito
  - Se sim: Atualizar política de privacidade
  - Se sim: Documentar retenção

- [ ] RLS/Policies atualizadas e testadas?
  - Se sim: Adicionar testes contratuais
  - Se sim: Validar em staging

- [ ] Envs/documentação revisadas?
  - Se sim: Atualizar `.env.example`
  - Se sim: Atualizar `docs/ENVIRONMENTS.md`

- [ ] Observabilidade não traz PII em logs?
  - Se sim: Remover PII dos logs
  - Se sim: Usar identificadores não-PII

### Dados Sensíveis

- **Email**: PII (requer proteção)
- **Nome**: PII (requer proteção)
- **Telefone**: PII (requer proteção)
- **Mensagens de chat**: PII (requer proteção)
- **Nível de risco**: Dado sensível (requer proteção)
- **Flags de risco**: Dado sensível (requer proteção)

### Proteção de Dados

- **Criptografia em trânsito**: HTTPS obrigatório
- **Criptografia em repouso**: Supabase PostgreSQL
- **Backup**: Criptografado
- **Access logs**: Retenção de 90 dias

## 📝 Notas LGPD

### Direitos do Usuário

- **Acesso**: Usuário pode solicitar cópia dos dados
- **Correção**: Usuário pode corrigir dados incorretos
- **Exclusão**: Usuário pode solicitar exclusão
- **Portabilidade**: Usuário pode solicitar portabilidade
- **Anonimização**: Usuário pode solicitar anonimização

### Implementação

- **LGPD Requests**: Edge Function `lgpd-requests`
- **Exportação**: Gerar ZIP com todos os dados
- **Exclusão**: Remover todos os dados (soft delete ou hard delete)
- **Anonimização**: Substituir PII por identificadores

## 🔐 Segurança Técnica

### RLS Policies

Todas as tabelas com dados pessoais devem ter RLS:

```sql
-- Exemplo
CREATE POLICY "Users can only see their own data"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);
```

### Testes Contratuais

Validar RLS em todos os casos:

- ✅ SELECT próprio usuário (permitido)
- ✅ SELECT outro usuário (negado)
- ✅ INSERT com user_id diferente (negado)
- ✅ UPDATE próprio registro (permitido)
- ✅ UPDATE outro registro (negado)
- ✅ DELETE próprio registro (permitido)

### Secrets Management

- **GitHub**: Secrets em Settings > Secrets and variables > Actions
- **Expo**: Secrets via `eas secret:create`
- **Supabase**: Secrets em Dashboard > Edge Functions > Secrets

## 📊 Auditoria

### Logs de Acesso

- **Login/Logout**: Logar com timestamp
- **Acesso a dados**: Logar com user_id
- **Alterações**: Logar com user_id e timestamp

### Retenção de Logs

- **Access logs**: 90 dias
- **Error logs**: 30 dias
- **Audit logs**: 365 dias (requisito legal)

## ✅ Checklist de Compliance

- [ ] RLS ativado em todas as tabelas
- [ ] Testes contratuais RLS implementados
- [ ] LGPD requests implementados
- [ ] Consentimento explícito para dados sensíveis
- [ ] Política de privacidade atualizada
- [ ] Documentação de retenção atualizada
- [ ] Secrets não expostos em código
- [ ] Logs não contêm PII
- [ ] Backup criptografado
- [ ] Rotação de secrets configurada
