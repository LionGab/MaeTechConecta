# 🚀 Comandos Prontos para Copiar e Colar

## 📋 Execução Individual (Recomendado para Memória)

### Agente 1: Frontend

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

### Agente 2: Backend

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

### Agente 3: IA

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

### Agente 4: Design

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

### Agente 5: QA

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

### Agente 6: Security

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

### Agente 7: DevOps

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

### Agente 8: Docs

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

## 📋 Execução em Paralelo (Multi-Agente)

Para executar todos os 8 agentes em paralelo, cole este comando completo:

```
Agente 1: Revisar e melhorar componentes React Native em src/components/: TypeScript, Performance, Acessibilidade WCAG 2.1 AA, Estilização (tema/dark mode), Estrutura. Aplicar correções críticas, sugerir melhorias com código. Priorizar por severidade 5→1. Salvar relatório em .cursor/agents/reports/AGENT_1_FRONTEND_REPORT.md

Agente 2: Revisar e melhorar serviços em src/services/: Autenticação, Supabase (queries/RLS), Validação, Segurança, Rate limiting. Aplicar correções de vulnerabilidades críticas, sugerir melhorias. Priorizar por severidade 5→1. Salvar relatório em .cursor/agents/reports/AGENT_2_BACKEND_REPORT.md

Agente 3: Revisar sistema NAT-AI em src/lib/nat-ai/: Guardrails, Detecção de Crise, Context Manager, System Prompts, Fallbacks. Aplicar correções críticas, sugerir melhorias. Priorizar por severidade 5→1. Salvar relatório em .cursor/agents/reports/AGENT_3_AI_REPORT.md

Agente 4: Revisar design system em src/components/ e src/theme/: Consistência, Acessibilidade Visual (contraste 4.5:1+), Dark Mode, Mobile-First, Tema. Aplicar correções de acessibilidade críticas, sugerir melhorias. Priorizar por severidade 5→1. Salvar relatório em .cursor/agents/reports/AGENT_4_DESIGN_REPORT.md

Agente 5: Revisar testes em __tests__/: Cobertura, Testes Unitários, Testes de Integração, Testes de Acessibilidade, Testes Faltantes. Criar testes críticos faltantes, sugerir melhorias. Priorizar por severidade 5→1. Salvar relatório em .cursor/agents/reports/AGENT_5_QA_REPORT.md

Agente 6: Revisar segurança e LGPD em todo código: Proteção de Dados, Validação de Inputs, Rate Limiting, Compliance LGPD, Vulnerabilidades. Aplicar correções críticas, sugerir melhorias. Priorizar por severidade 5→1. Salvar relatório em .cursor/agents/reports/AGENT_6_SECURITY_REPORT.md

Agente 7: Revisar configurações e CI/CD: Expo, Sentry, Variáveis de Ambiente, Scripts de Build, CI/CD. Aplicar correções de build/deploy críticas, sugerir melhorias. Priorizar por severidade 5→1. Salvar relatório em .cursor/agents/reports/AGENT_7_DEVOPS_REPORT.md

Agente 8: Revisar documentação e JSDoc: JSDoc em componentes públicos, Documentação de APIs, READMEs, Guias, Comentários. Adicionar JSDoc faltante, melhorar documentação. Priorizar por severidade 5→1. Salvar relatório em .cursor/agents/reports/AGENT_8_DOCS_REPORT.md
```

---

## 🎯 Como Usar

### Execução Individual (Melhor para Memória)

1. Abra Composer (`Ctrl+I`)
2. Copie um comando acima (Agente 1 a 8)
3. Cole e execute
4. Aguarde conclusão e revise relatório
5. Repita para próximo agente

### Execução Paralela (Mais Rápido)

1. Abra Composer (`Ctrl+I`)
2. Copie o comando "Execução em Paralelo" acima
3. Cole e execute
4. Aguarde todos os 8 agentes concluírem
5. Revise todos os relatórios

---

## 📊 Relatórios

Todos os relatórios serão salvos em:

- `.cursor/agents/reports/AGENT_X_REPORT.md`
- Console do Cursor mostra progresso em tempo real

---

## ⚡ Dicas

- **Para máximo desempenho**: Execute individualmente (um por vez)
- **Para velocidade**: Execute em paralelo (todos juntos)
- **Para debugging**: Execute individualmente para isolar problemas
- **Para validação rápida**: Execute apenas agentes críticos (1, 2, 6)

---

## 🌐 Browser - Visualização Ao Vivo

### Comando Browser Rápido

**Execute no Composer (`Ctrl+I`):**

```
Abra o browser integrado do Cursor (Ctrl+Shift+B) e visualize o app ao vivo:

1. Certifique-se que o app está rodando (execute: pnpm dev)
2. Abra o browser: Ctrl+Shift+B ou use comando cursor.browser.open
3. Acesse: http://localhost:8081 (Expo app) ou http://localhost:19002 (Expo DevTools)
4. Configure viewport para iPhone 13 (390x844) via DevTools
5. Abra DevTools (F12 ou Ctrl+Shift+I) para monitorar:
   - Console (erros, warnings)
   - Network (requisições, tempo de resposta)
   - Performance (FPS, memória)
6. Navegue por todas as telas do app e teste interações
7. Capture screenshots (Ctrl+Shift+U) quando encontrar problemas
8. Monitore hot reload: faça mudanças no código e veja atualizações em tempo real
9. Documente problemas encontrados

CONFIGURAÇÃO AUTOMÁTICA:
- Viewport: 390x844 (iPhone 13)
- Device: Mobile com touch
- DevTools: Habilitado
- Screenshots: Automáticos em erros
```

**Veja mais comandos de browser em:** `.cursor/agents/comando-browser-visualizacao.md`
