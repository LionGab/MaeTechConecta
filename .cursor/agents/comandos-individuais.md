# 🚀 Comandos Multi-Agente Individuais - Otimizados

## Como Usar

Execute cada comando **separadamente** no Composer (`Ctrl+I`). Cada comando ativa um agente isolado para máxima eficiência e uso de memória otimizado.

---

## 📋 Agente 1: Frontend - Componentes React Native

**Execute no Composer:**
```
Revisar e melhorar componentes React Native em src/components/:

ANÁLISE OBRIGATÓRIA:
1. TypeScript: Verificar tipos explícitos, eliminar `any`, validar interfaces
2. Performance: Verificar React.memo, useCallback, useMemo onde necessário
3. Acessibilidade: Validar WCAG 2.1 AA (labels, roles, hints, área toque 44x44px)
4. Estilização: Verificar uso do tema (colors, spacing, typography), dark mode
5. Estrutura: Verificar organização, imports, exports

CORREÇÕES:
- Aplicar correções imediatas para bugs críticos (severidade 5)
- Sugerir melhorias com código específico para outros issues
- Priorizar por severidade: Crítico (5) → Alto (4) → Médio (3) → Baixo (2) → Info (1)

RELATÓRIO:
- Listar todos os issues encontrados com severidade
- Incluir código específico das correções sugeridas
- Salvar em .cursor/agents/reports/AGENT_1_FRONTEND_REPORT.md
```

---

## 📋 Agente 2: Backend - Serviços e Integrações

**Execute no Composer:**
```
Revisar e melhorar serviços e integrações em src/services/:

ANÁLISE OBRIGATÓRIA:
1. Autenticação: Verificar verificação de sessão, tokens, refresh
2. Supabase: Verificar queries, RLS, tratamento de erros
3. Validação: Verificar sanitização de inputs, validação de dados
4. Segurança: Verificar proteção de dados sensíveis, rate limiting
5. RLS: Verificar políticas de segurança do Supabase

CORREÇÕES:
- Aplicar correções imediatas para vulnerabilidades de segurança (severidade 5)
- Sugerir melhorias com código específico para outros issues
- Priorizar por severidade: Crítico (5) → Alto (4) → Médio (3) → Baixo (2) → Info (1)

RELATÓRIO:
- Listar todos os issues encontrados com severidade
- Incluir código específico das correções sugeridas
- Salvar em .cursor/agents/reports/AGENT_2_BACKEND_REPORT.md
```

---

## 📋 Agente 3: IA - Sistema NAT-AI

**Execute no Composer:**
```
Revisar e melhorar sistema NAT-AI em src/lib/nat-ai/:

ANÁLISE OBRIGATÓRIA:
1. Guardrails: Verificar filtros de segurança, bloqueio de conteúdo perigoso
2. Detecção de Crise: Verificar análise de risco, alertas, ações apropriadas
3. Context Manager: Verificar gerenciamento de contexto, histórico, memória
4. System Prompts: Verificar prompts do sistema, instruções, tom
5. Fallbacks: Verificar tratamento de erros, fallback para Claude, retry logic

CORREÇÕES:
- Aplicar correções imediatas para vulnerabilidades de segurança (severidade 5)
- Sugerir melhorias com código específico para outros issues
- Priorizar por severidade: Crítico (5) → Alto (4) → Médio (3) → Baixo (2) → Info (1)

RELATÓRIO:
- Listar todos os issues encontrados com severidade
- Incluir código específico das correções sugeridas
- Salvar em .cursor/agents/reports/AGENT_3_AI_REPORT.md
```

---

## 📋 Agente 4: Design - Design System e Tema

**Execute no Composer:**
```
Revisar e melhorar design system e tema em src/components/ e src/theme/:

ANÁLISE OBRIGATÓRIA:
1. Design System: Verificar consistência de componentes, padrões
2. Acessibilidade Visual: Verificar contraste (4.5:1+), legibilidade, tamanhos
3. Dark Mode: Verificar suporte completo, transições, consistência
4. Mobile-First: Verificar responsividade, diferentes tamanhos de tela
5. Tema: Verificar uso consistente de colors, spacing, typography, borderRadius

CORREÇÕES:
- Aplicar correções imediatas para problemas de acessibilidade (severidade 5)
- Sugerir melhorias com código específico para outros issues
- Priorizar por severidade: Crítico (5) → Alto (4) → Médio (3) → Baixo (2) → Info (1)

RELATÓRIO:
- Listar todos os issues encontrados com severidade
- Incluir código específico das correções sugeridas
- Salvar em .cursor/agents/reports/AGENT_4_DESIGN_REPORT.md
```

---

## 📋 Agente 5: QA - Testes e Qualidade

**Execute no Composer:**
```
Revisar e melhorar testes e qualidade em __tests__/:

ANÁLISE OBRIGATÓRIA:
1. Cobertura: Verificar cobertura de testes, arquivos sem testes
2. Testes Unitários: Verificar qualidade, assertivas, mocks
3. Testes de Integração: Verificar fluxos completos, edge cases
4. Testes de Acessibilidade: Verificar testes de acessibilidade automatizados
5. Testes Faltantes: Identificar componentes/serviços sem testes

CORREÇÕES:
- Criar testes faltantes para componentes críticos
- Sugerir melhorias para testes existentes
- Priorizar por severidade: Crítico (5) → Alto (4) → Médio (3) → Baixo (2) → Info (1)

RELATÓRIO:
- Listar todos os issues encontrados com severidade
- Incluir código específico dos testes sugeridos/criados
- Salvar em .cursor/agents/reports/AGENT_5_QA_REPORT.md
```

---

## 📋 Agente 6: Security - Segurança e LGPD

**Execute no Composer:**
```
Revisar segurança e compliance LGPD em todo o código:

ANÁLISE OBRIGATÓRIA:
1. Proteção de Dados: Verificar dados sensíveis, criptografia, armazenamento seguro
2. Validação de Inputs: Verificar sanitização, validação, prevenção de injection
3. Rate Limiting: Verificar limites de requisições, prevenção de abuse
4. Compliance LGPD: Verificar consentimento, privacidade, direitos do usuário
5. Vulnerabilidades: Verificar dependências, segurança de APIs, tokens

CORREÇÕES:
- Aplicar correções imediatas para vulnerabilidades críticas (severidade 5)
- Sugerir melhorias com código específico para outros issues
- Priorizar por severidade: Crítico (5) → Alto (4) → Médio (3) → Baixo (2) → Info (1)

RELATÓRIO:
- Listar todos os issues encontrados com severidade
- Incluir código específico das correções sugeridas
- Salvar em .cursor/agents/reports/AGENT_6_SECURITY_REPORT.md
```

---

## 📋 Agente 7: DevOps - Configurações e CI/CD

**Execute no Composer:**
```
Revisar e melhorar configurações e CI/CD:

ANÁLISE OBRIGATÓRIA:
1. Expo: Verificar app.json, app.config.js, configurações corretas
2. Sentry: Verificar integração, configuração, error tracking
3. Variáveis de Ambiente: Verificar .env, secrets, configurações
4. Scripts de Build: Verificar package.json, scripts, builds
5. CI/CD: Verificar workflows, validações, deploy

CORREÇÕES:
- Aplicar correções imediatas para problemas de build/deploy (severidade 5)
- Sugerir melhorias com código específico para outros issues
- Priorizar por severidade: Crítico (5) → Alto (4) → Médio (3) → Baixo (2) → Info (1)

RELATÓRIO:
- Listar todos os issues encontrados com severidade
- Incluir código específico das correções sugeridas
- Salvar em .cursor/agents/reports/AGENT_7_DEVOPS_REPORT.md
```

---

## 📋 Agente 8: Docs - Documentação e JSDoc

**Execute no Composer:**
```
Revisar e melhorar documentação e JSDoc:

ANÁLISE OBRIGATÓRIA:
1. JSDoc: Verificar JSDoc em componentes públicos, funções, tipos
2. Documentação de APIs: Verificar documentação de serviços, hooks, utils
3. READMEs: Verificar READMEs atualizados, instruções claras
4. Guias de Usuário: Verificar documentação de uso, exemplos
5. Comentários: Verificar comentários explicativos, lógica complexa

CORREÇÕES:
- Adicionar JSDoc faltante em componentes públicos
- Melhorar documentação existente
- Criar/atualizar READMEs quando necessário
- Priorizar por severidade: Crítico (5) → Alto (4) → Médio (3) → Baixo (2) → Info (1)

RELATÓRIO:
- Listar todos os issues encontrados com severidade
- Incluir código específico das documentações sugeridas/criadas
- Salvar em .cursor/agents/reports/AGENT_8_DOCS_REPORT.md
```

---

## 📋 Code Reviewer - Revisão Completa Multi-Stage

**Execute no Composer (após todos os outros agentes):**
```
Executar revisão completa multi-stage do código:

STAGE 1: Code Inspector
- Lógica de negócio, code smells, estilo de código
- Violações de padrões do projeto
- Complexidade ciclomática

STAGE 2: Test Runner
- Cobertura de testes, testes necessários
- Qualidade dos testes existentes

STAGE 3: Performance Analyzer
- Re-renders desnecessários, otimizações
- Performance de listas, imagens, animações

STAGE 4: Accessibility Auditor
- WCAG 2.1 AA compliance
- Acessibilidade completa

STAGE 5: Security Auditor
- Vulnerabilidades, segurança, LGPD
- Análise de risco

STAGE 6: Type Safety Checker
- TypeScript, tipos explícitos, type safety
- Eliminação de `any`

STAGE 7: Documentation Checker
- JSDoc, documentação, comentários
- READMEs atualizados

STAGE 8: Final Report
- Relatório consolidado de todas as stages
- Priorização de ações
- Métricas e scores

RELATÓRIO:
- Salvar em .cursor/agents/reports/CODE_REVIEWER_FINAL_REPORT.md
- Consolidar findings de todos os agentes
- Gerar executive summary
```

---

## 🚀 Execução em Paralelo

Para executar **todos os agentes em paralelo**, use o Multi-Agente do Cursor:

1. Abra o Composer (`Ctrl+I`)
2. Cole os 8 comandos acima, um por linha, começando com "Agente 1:", "Agente 2:", etc.
3. O Cursor criará 8 agentes paralelos automaticamente
4. Cada agente trabalha isoladamente para máxima eficiência

**Exemplo de comando paralelo:**
```
Agente 1: [Cole comando do Agente 1]
Agente 2: [Cole comando do Agente 2]
Agente 3: [Cole comando do Agente 3]
Agente 4: [Cole comando do Agente 4]
Agente 5: [Cole comando do Agente 5]
Agente 6: [Cole comando do Agente 6]
Agente 7: [Cole comando do Agente 7]
Agente 8: [Cole comando do Agente 8]
```

---

## 📊 Relatórios

Todos os relatórios serão salvos em:
- `.cursor/agents/reports/` - Relatórios individuais por agente
- `.cursor/review-logs/` - Logs de revisão
- Console do Cursor - Progresso em tempo real

---

## ✅ Vantagens desta Abordagem

1. **Memória Otimizada**: Cada agente trabalha isoladamente, reduzindo uso de memória
2. **Performance**: Contexto menor = processamento mais rápido
3. **Foco**: Cada agente foca apenas em sua área de especialidade
4. **Escalabilidade**: Fácil adicionar/remover agentes
5. **Debugging**: Mais fácil identificar problemas em agentes específicos
6. **Reutilização**: Comandos podem ser executados individualmente quando necessário

