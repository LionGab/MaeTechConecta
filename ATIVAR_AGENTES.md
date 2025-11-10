# 🚀 Ativar Todos os Agentes - Revisão e Melhorias

## Método 1: Via Composer (Recomendado)

Abra o Composer (`Ctrl+I` ou `Cmd+I`) e cole este comando:

```
Ative todos os agentes para revisão e melhorias no código:

Agente 1 (Frontend): Revisar componentes React Native em src/components/
- Verificar TypeScript (sem any, tipos explícitos)
- Verificar performance (React.memo, useCallback, useMemo)
- Verificar acessibilidade (WCAG 2.1 AA)
- Verificar estilização (tema, dark mode)
- Verificar estrutura e organização
- Sugerir melhorias e correções

Agente 2 (Backend): Revisar serviços e integrações em src/services/
- Verificar autenticação e segurança
- Verificar integração com Supabase
- Verificar tratamento de erros
- Verificar validações e sanitização
- Verificar RLS e privacidade
- Sugerir melhorias e correções

Agente 3 (IA): Revisar sistema NAT-AI em src/lib/nat-ai/
- Verificar guardrails e segurança
- Verificar detecção de crise
- Verificar context manager
- Verificar system prompts
- Verificar fallbacks
- Sugerir melhorias e correções

Agente 4 (Design): Revisar componentes e tema em src/components/ e src/theme/
- Verificar design system
- Verificar acessibilidade visual
- Verificar dark mode
- Verificar mobile-first
- Verificar contraste e legibilidade
- Sugerir melhorias e correções

Agente 5 (QA): Revisar testes e qualidade em __tests__/
- Verificar cobertura de testes
- Verificar testes unitários
- Verificar testes de integração
- Verificar testes de acessibilidade
- Sugerir testes faltantes
- Sugerir melhorias e correções

Agente 6 (Security): Revisar segurança e LGPD em todo o código
- Verificar proteção de dados sensíveis
- Verificar validação de inputs
- Verificar rate limiting
- Verificar compliance LGPD
- Verificar vulnerabilidades
- Sugerir melhorias e correções

Agente 7 (DevOps): Revisar configurações e CI/CD
- Verificar configurações do Expo
- Verificar Sentry
- Verificar variáveis de ambiente
- Verificar scripts de build
- Verificar CI/CD
- Sugerir melhorias e correções

Agente 8 (Docs): Revisar documentação e JSDoc
- Verificar JSDoc em componentes públicos
- Verificar documentação de APIs
- Verificar READMEs
- Verificar guias de usuário
- Sugerir melhorias e correções

Code Reviewer: Executar revisão completa multi-stage
- STAGE 1: Code Inspector (lógica, segurança, code smells, estilo)
- STAGE 2: Test Runner (cobertura, testes necessários)
- STAGE 3: Performance Analyzer (re-renders, otimizações)
- STAGE 4: Accessibility Auditor (WCAG 2.1 AA)
- STAGE 5: Security Auditor (vulnerabilidades, LGPD)
- STAGE 6: Type Safety Checker (TypeScript, tipos explícitos)
- STAGE 7: Documentation Checker (JSDoc, documentação)
- STAGE 8: Final Report (relatório consolidado)

Para cada agente:
1. Analise o código sistematicamente
2. Identifique bugs, code smells, violações de padrão
3. Sugira correções com código específico
4. Priorize por severidade (Crítico 5 → Info 1)
5. Gere relatório estruturado
6. Aplique correções quando apropriado (com aprovação)
```

## Método 2: Via Script

Execute o script de agentes:

```bash
cd LionNath
pnpm start-agents
```

Ou execute agentes individuais:

```bash
cd LionNath
pnpm agent:refactor
pnpm agent:performance
pnpm agent:type-safety
pnpm agent:accessibility
pnpm agent:security
pnpm agent:cleanup
```

## Método 3: Via Comandos Personalizados

Use os comandos personalizados do Cursor:

```
@revisar-codigo
@validar-projeto
@refatorar-performance
```

## Relatórios

Os relatórios serão gerados em:

- `.cursor/agents/reports/` - Relatórios individuais por agente
- `.cursor/review-logs/` - Logs de revisão
- Console do Cursor - Progresso em tempo real

## Agentes Configurados

### Multi-Agente (8 agentes em paralelo)

- ✅ Frontend (React Native + Expo)
- ✅ Backend (Supabase + Edge Functions)
- ✅ IA (NAT-AI + Gemini)
- ✅ Design (Design System + Acessibilidade)
- ✅ QA (Testes + Coverage)
- ✅ Security (LGPD + Segurança)
- ✅ DevOps (CI/CD + Monitoring)
- ✅ Docs (Documentação + JSDoc)

### Code Reviewer (Multi-Stage)

- ✅ Code Inspector
- ✅ Test Runner
- ✅ Performance Analyzer
- ✅ Accessibility Auditor
- ✅ Security Auditor
- ✅ Type Safety Checker
- ✅ Documentation Checker
- ✅ Final Report

### Script Agents (8 agentes)

- ✅ Refactor
- ✅ Performance
- ✅ Test
- ✅ Docs
- ✅ Type Safety
- ✅ Accessibility
- ✅ Security
- ✅ Cleanup

## Próximos Passos

1. Execute o comando no Composer
2. Aguarde todos os agentes concluírem
3. Revise os relatórios gerados
4. Aplique as correções sugeridas
5. Valide com `npm run validate`

