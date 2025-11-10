# Checklist de Validação - Nossa Maternidade

## Pré-Deploy

### Código

- [ ] Todos os testes passando
- [ ] Lint sem erros
- [ ] TypeScript sem erros
- [ ] Build local funcionando
- [ ] Todas as Edge Functions deployadas

### Configuração

- [ ] Variáveis de ambiente configuradas
- [ ] Secrets no GitHub configurados
- [ ] Secrets no Supabase configurados
- [ ] Expo EAS configurado
- [ ] Sentry configurado (opcional)

### Documentação

- [ ] README atualizado
- [ ] DOCUMENTATION.md completo
- [ ] DEPLOY_PRODUCTION.md completo
- [ ] Edge Functions documentadas

## Durante o Deploy

### Build

- [ ] Build Android bem-sucedido
- [ ] Build iOS bem-sucedido
- [ ] Build web (PWA) funcionando

### Edge Functions

- [ ] nathia-chat deployada e funcionando
- [ ] moderation-service deployada e funcionando
- [ ] risk-REDACTED deployada e funcionando
- [ ] Todas as outras funções deployadas

### Integrações

- [ ] Supabase conectado
- [ ] APIs de IA funcionando
- [ ] Autenticação funcionando

## Pós-Deploy

### Testes Funcionais

- [ ] Login/Signup funcionando
- [ ] Chat com NathIA funcionando
- [ ] Moderação funcionando
- [ ] Detecção de risco funcionando
- [ ] Guardrails bloqueando conselhos médicos
- [ ] Protocolo de crise funcionando

### Performance

- [ ] App carrega rapidamente
- [ ] Chat responde em tempo razoável
- [ ] Edge Functions respondem rápido
- [ ] Sem memory leaks

### Monitoramento

- [ ] Sentry capturando erros
- [ ] Logs funcionando
- [ ] Analytics funcionando (se configurado)

## Validação de Produção

### Testes de Usuário

- [ ] Testar fluxo completo de chat
- [ ] Testar moderação de conteúdo
- [ ] Testar detecção de crise
- [ ] Testar guardrails

### Testes de Segurança

- [ ] RLS funcionando
- [ ] Auth check funcionando
- [ ] Rate limiting funcionando
- [ ] Secrets não expostos

### Testes de Compliance

- [ ] LGPD funcionando
- [ ] Exportação de dados funcionando
- [ ] Exclusão de dados funcionando

## Suporte

Se algo falhar:

1. Verificar logs do Sentry
2. Verificar logs das Edge Functions
3. Verificar logs do GitHub Actions
4. Consultar documentação em `docs/`

