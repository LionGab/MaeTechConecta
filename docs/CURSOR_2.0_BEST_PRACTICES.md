# 🚀 Cursor 2.0 - Guia Completo de Melhores Práticas

**Fonte:** [cursor.com](https://cursor.com) - Novembro 2025

## 📋 Índice

1. [Recursos Principais](#recursos-principais)
2. [Configuração e Setup](#configuração-e-setup)
3. [Workflows Recomendados](#workflows-recomendados)
4. [Comandos de Equipe](#comandos-de-equipe)
5. [Automações e Scripts](#automações-e-scripts)
6. [Segurança e Integridade](#segurança-e-integridade)
7. [Dicas Avançadas](#dicas-avançadas)

---

## 🎯 Recursos Principais

### 1. Composer - Modelo de Codificação Ultra-Rápido

**O que é:**

- Primeiro modelo de codificação agentic do Cursor
- **4× mais rápido** que modelos similares
- Completa maioria das tarefas em **menos de 30 segundos**
- Ideal para iterações ágeis em código

**Como usar:**

- Use o Composer para execução rápida de tarefas
- Ideal para refatorações, correções e implementações diretas
- Não requer planejamento complexo - executa imediatamente

**Quando usar:**

- ✅ Tarefas simples a médias (< 30 segundos)
- ✅ Refatorações diretas
- ✅ Correções de bugs
- ✅ Implementações de features pequenas
- ❌ Não use para tarefas que exigem planejamento complexo

---

### 2. Interface Multi-Agente

**O que é:**

- Gerencie **até 8 agentes em paralelo**
- Cada agente opera em cópia isolada do código
- Usa worktrees do Git ou máquinas remotas
- Evita conflitos de arquivos

**Como usar:**

```bash
# Cada agente trabalha em seu próprio worktree
# Execute múltiplos prompts simultaneamente
# Revisar mudanças de cada agente separadamente
```

**Casos de uso:**

- Desenvolver múltiplas features simultaneamente
- Testar diferentes abordagens em paralelo
- Revisar múltiplas implementações
- Dividir trabalho complexo entre agentes

**Benefícios:**

- ⚡ Produtividade 8× maior
- 🔒 Isolamento de mudanças
- 🔄 Sem conflitos de merge
- 📊 Comparação de soluções

---

### 3. Navegador Integrado (GA)

**O que é:**

- Navegador embutido no editor
- Ferramentas para selecionar elementos DOM
- Encaminha informações do DOM para o agente
- Disponível para todos os usuários

**Como usar:**

- Abra o navegador integrado no Cursor
- Selecione elementos da página
- Envie contexto do DOM para o agente
- Teste e itere diretamente no editor

**Casos de uso:**

- Testar interfaces web
- Debug visual de componentes
- Extrair estilos e estrutura
- Validar implementações frontend

---

### 4. Revisão de Código Aprimorada

**O que é:**

- Visualize todas as alterações em múltiplos arquivos
- Sem necessidade de alternar entre arquivos
- Interface unificada de revisão

**Como usar:**

- Abra o painel de revisão após execução do agente
- Veja todas as mudanças em um só lugar
- Aprove ou rejeite mudanças em lote
- Compare versões lado a lado

---

### 5. Terminais Sandboxed (GA - macOS)

**O que é:**

- Comandos executados em ambiente seguro
- Acesso restrito ao workspace
- Sem acesso à internet por padrão
- Permissões controladas

**Segurança:**

- ✅ Acesso apenas ao workspace
- ✅ Sem acesso à internet
- ✅ Permissões limitadas
- ✅ Isolamento completo

**Configuração:**

- Ativado por padrão no macOS
- Configurável no painel de administração (empresas)
- Controles de equipe disponíveis

---

### 6. Modo de Voz

**O que é:**

- Controle o agente com comandos de voz
- Conversão de fala para texto integrada
- Palavras-chave personalizadas

**Como configurar:**

1. Vá em Settings → Voice Mode
2. Ative o modo de voz
3. Configure palavras-chave personalizadas
4. Use comandos de voz para acionar o agente

**Exemplos de comandos:**

- "Cursor, adicione um botão aqui"
- "Refatore esta função"
- "Crie um componente de card"

---

### 7. Modo de Plano em Segundo Plano

**O que é:**

- Crie planos com um modelo
- Execute com outro modelo
- Planeje em segundo plano enquanto trabalha
- Múltiplos planos paralelos

**Workflow recomendado:**

1. **Planejar:** Use modelo de raciocínio (GPT-4, Claude)
2. **Executar:** Use Composer para implementação rápida
3. **Revisar:** Revise planos em paralelo

**Quando usar:**

- ✅ Tarefas complexas que exigem planejamento
- ✅ Múltiplas features simultâneas
- ✅ Refatorações grandes
- ✅ Migrações complexas

---

### 8. Agentes na Nuvem

**O que é:**

- 99,9% de confiabilidade
- Inicialização instantânea
- Acesso de qualquer dispositivo
- Interface web melhorada

**Como usar:**

- Acesse [cursor.com/agents](https://cursor.com/agents)
- Inicie agentes na nuvem
- Trabalhe de desktop ou móvel
- Compartilhe links com equipe

**Benefícios:**

- 🌐 Acesso remoto
- ⚡ Performance consistente
- 🔄 Sincronização automática
- 👥 Colaboração facilitada

---

### 9. Comandos de Equipe

**O que é:**

- Defina comandos e regras no painel do Cursor
- Aplicado automaticamente a todos os membros
- Sem necessidade de arquivos locais
- Compartilhável via deeplinks

**Como configurar:**

1. Acesse o painel do Cursor (web)
2. Vá em Team Settings → Commands
3. Crie comandos personalizados
4. Compartilhe com equipe via deeplinks

**Exemplos:**

- Regras de código compartilhadas
- Templates de prompts
- Workflows padronizados
- Padrões de revisão

---

### 10. UI de Prompt Aprimorada

**O que é:**

- Arquivos e diretórios como "pills" inline
- Cópia/colagem melhorada com contexto
- Agente reúne contexto automaticamente
- Interface mais limpa

**Melhorias:**

- 📎 Contexto visual inline
- 📋 Cola contexto automaticamente
- 🔍 Busca semântica automática
- 🎯 Foco no que importa

---

### 11. Desempenho Aprimorado

**O que é:**

- LSPs otimizados para todas as linguagens
- Melhorias especialmente em Python e TypeScript
- Carregamento mais rápido
- Uso otimizado de memória

**Benefícios:**

- ⚡ 2-3× mais rápido em projetos grandes
- 💾 Menor uso de memória
- 🔍 "Ir para definição" instantâneo
- 💡 Hover tips mais rápidos

---

### 12. Bugbot

**O que é:**

- Revisa pull requests automaticamente
- Identifica bugs, vulnerabilidades e problemas
- Comentários explicativos
- Sugestões de correção

**Como usar:**

- Integre com seu repositório
- Bugbot revisa PRs automaticamente
- Receba comentários no PR
- Corrija problemas sugeridos

**Disponibilidade:**

- ✅ Planos gratuitos e pagos
- ✅ Revisões automáticas e manuais
- ✅ Integração com GitHub/GitLab

---

## ⚙️ Configuração e Setup

### Configuração Inicial

#### 1. Ativar Recursos Avançados

```json
// .vscode/settings.json (Cursor usa configurações do VS Code)
{
  "cursor.general.enableComposer": true,
  "cursor.general.enableMultiAgent": true,
  "cursor.general.enableVoiceMode": true,
  "cursor.general.enableBrowser": true,
  "cursor.general.enableSandbox": true
}
```

#### 2. Configurar Modelos

**Para Planejamento:**

- GPT-4 / Claude Sonnet (raciocínio complexo)
- Use para criar planos detalhados

**Para Execução:**

- Composer (rápido, < 30s)
- Use para implementação direta

**Para Revisão:**

- GPT-4 Codex (qualidade)
- Use para revisão de código

#### 3. Configurar Atalhos

```json
// keybindings.json
[
  {
    "key": "cmd+shift+c",
    "command": "cursor.composer.open"
  },
  {
    "key": "cmd+shift+v",
    "command": "cursor.voice.toggle"
  },
  {
    "key": "cmd+shift+b",
    "command": "cursor.browser.open"
  }
]
```

---

## 🔄 Workflows Recomendados

### Workflow 1: Desenvolvimento Rápido (Composer)

**Quando usar:** Tarefas simples a médias

1. Abra o Composer (`Cmd+Shift+C`)
2. Descreva a tarefa diretamente
3. Aguarde < 30 segundos
4. Revise mudanças
5. Aprove e continue

**Exemplo:**

```
"Adicione validação de email no formulário de cadastro"
```

---

### Workflow 2: Planejamento + Execução

**Quando usar:** Tarefas complexas

1. **Planejar (Background):**
   - Use modelo de raciocínio
   - Crie plano detalhado
   - Execute em segundo plano

2. **Executar (Foreground):**
   - Use Composer
   - Implemente baseado no plano
   - Itere rapidamente

3. **Revisar:**
   - Compare implementação com plano
   - Ajuste se necessário

**Exemplo:**

```
Plano: "Refatore sistema de autenticação para usar Supabase Auth"
Execução: Implementa passo a passo usando Composer
```

---

### Workflow 3: Multi-Agente Paralelo

**Quando usar:** Múltiplas features simultâneas

1. Divida trabalho em 2-8 tarefas
2. Inicie agentes paralelos
3. Cada agente trabalha em worktree isolado
4. Revise mudanças de cada agente
5. Merge seletivo das melhores soluções

**Exemplo:**

```
Agente 1: Implementa feature A
Agente 2: Implementa feature B
Agente 3: Implementa feature C
...
Revisar e integrar melhores soluções
```

---

### Workflow 4: Desenvolvimento Web com Browser

**Quando usar:** Desenvolvimento frontend

1. Abra navegador integrado
2. Carregue sua aplicação
3. Selecione elementos visualmente
4. Envie contexto para agente
5. Teste mudanças em tempo real

**Exemplo:**

```
1. Abre app no browser integrado
2. Seleciona botão que precisa melhorar
3. "Cursor, adicione animação neste botão"
4. Testa diretamente no browser
```

---

## 👥 Comandos de Equipe

### Criar Comandos Compartilhados

#### 1. Via Painel Web

1. Acesse [cursor.com/settings](https://cursor.com/settings)
2. Vá em Team → Commands
3. Crie novo comando
4. Compartilhe via deeplink

#### 2. Via .cursorrules

```markdown
# .cursorrules

## Comandos da Equipe

### Revisar PR

- Verificar tipos TypeScript
- Executar testes
- Verificar acessibilidade
- Validar performance

### Criar Componente

- Usar React.memo
- Incluir acessibilidade
- Adicionar testes
- Documentar props
```

#### 3. Compartilhar via Deeplinks

```
cursor://command?name=review-pr&team=your-team
```

---

### Exemplos de Comandos Úteis

#### Comando: "Criar Componente React Native"

```markdown
Crie um componente React Native seguindo:

1. Usar TypeScript com tipos explícitos
2. Usar React.memo para otimização
3. Incluir acessibilidade (accessibilityLabel, accessibilityRole)
4. Usar tema (colors, spacing, typography)
5. Adicionar JSDoc
6. Seguir estrutura: componente → helpers → tipos
```

#### Comando: "Revisar Código"

```markdown
Revise o código seguindo:

1. Verificar tipos TypeScript (sem any)
2. Verificar performance (memo, useCallback, useMemo)
3. Verificar acessibilidade (WCAG 2.1 AA)
4. Verificar padrões do projeto (.cursorrules)
5. Sugerir melhorias
```

#### Comando: "Refatorar para Performance"

```markdown
Refatore para melhorar performance:

1. Adicionar React.memo onde necessário
2. Usar useCallback para handlers
3. Usar useMemo para computações pesadas
4. Otimizar FlatList (windowSize, maxToRenderPerBatch)
5. Lazy load screens
```

---

## 🤖 Automações e Scripts

### Integrar com Scripts NPM

#### package.json

```json
{
  "scripts": {
    "check": "npm run type-check && npm run lint && npm run test",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "test": "vitest run",
    "format": "prettier --write .",
    "validate": "npm run check && npm run format"
  }
}
```

#### Usar no Cursor

```
"Execute npm run validate antes de finalizar"
```

---

### Makefile para Automação

```makefile
# Makefile
.PHONY: check test format validate

check:
	npm run type-check
	npm run lint

test:
	npm run test

format:
	npm run format

validate: check test format
	@echo "✅ Validação completa"
```

**Usar no Cursor:**

```
"Execute make validate antes de finalizar"
```

---

### Scripts PowerShell (Windows)

```powershell
# scripts/validate-all.ps1
Write-Host "🔍 Validando projeto..." -ForegroundColor Cyan

# Type check
Write-Host "📝 Type checking..." -ForegroundColor Yellow
npm run type-check
if ($LASTEXITCODE -ne 0) { exit 1 }

# Lint
Write-Host "🔧 Linting..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) { exit 1 }

# Tests
Write-Host "🧪 Testing..." -ForegroundColor Yellow
npm run test
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "✅ Validação completa!" -ForegroundColor Green
```

**Usar no Cursor:**

```
"Execute scripts/validate-all.ps1 antes de finalizar"
```

---

## 🔒 Segurança e Integridade

### 1. Ativar Terminais Sandboxed

**macOS:**

- Ativado por padrão
- Configurável em Settings → Security

**Windows/Linux:**

- Em desenvolvimento
- Use com cautela comandos de terminal

### 2. Configurar CI Gates

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

**Bloquear builds sem testes:**

```yaml
# Requer que CI passe antes de merge
required_status_checks:
  - validate
```

### 3. Revisar Mudanças do Agente

**Sempre:**

- ✅ Revise todas as mudanças antes de aprovar
- ✅ Execute testes localmente
- ✅ Verifique tipos e lint
- ✅ Teste funcionalidade manualmente

**Nunca:**

- ❌ Aprove mudanças sem revisar
- ❌ Pule testes
- ❌ Ignore erros de tipo/lint

---

## 💡 Dicas Avançadas

### 1. Centralizar Padrões

**Criar .cursorrules compartilhável:**

```markdown
# .cursorrules

# Compartilhe via deeplink: cursor://rules?repo=your-repo
```

**Usar no painel do Cursor:**

- Team Settings → Rules
- Compartilhe com equipe
- Atualize centralmente

---

### 2. Otimizar para Projetos Grandes

**Configurações recomendadas:**

```json
{
  "cursor.general.maxContextLength": 100000,
  "cursor.general.enableSemanticSearch": true,
  "cursor.general.cacheSize": 1000
}
```

**Usar busca semântica:**

- Composer usa busca semântica automaticamente
- Encontra código relacionado mesmo sem referências explícitas
- Melhor para projetos grandes

---

### 3. Métricas e Otimização

**Acompanhar:**

- Tempo médio de execução
- Taxa de aprovação de mudanças
- Qualidade de código gerado
- Produtividade da equipe

**Otimizar:**

- Ajuste comandos baseado em métricas
- Refine prompts que não funcionam bem
- Documente padrões que funcionam

---

### 4. Modo Ultra (Business)

**Quando considerar:**

- Volume alto de uso
- Equipes grandes
- Projetos complexos

**Benefícios:**

- Muito mais uso mensal
- Prioridade em recursos
- Suporte dedicado

---

### 5. Integração com Ferramentas

**Git:**

- Worktrees para multi-agente
- Branches isolados
- Merge seletivo

**CI/CD:**

- Gates de validação
- Testes automáticos
- Deploy condicional

**Monitoramento:**

- Sentry para erros
- Analytics para uso
- Logs de auditoria

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [Cursor Docs](https://docs.cursor.com)
- [Cursor Changelog](https://cursor.com/changelog)
- [Cursor Blog](https://cursor.com/blog)

### Comunidade

- [Cursor Discord](https://discord.gg/cursor)
- [Cursor GitHub](https://github.com/getcursor/cursor)

### Tutoriais

- [Getting Started](https://docs.cursor.com/get-started)
- [Best Practices](https://docs.cursor.com/best-practices)
- [Team Setup](https://docs.cursor.com/teams)

---

## ✅ Checklist de Configuração

### Configuração Inicial

- [ ] Ativar Composer
- [ ] Configurar multi-agente
- [ ] Ativar navegador integrado
- [ ] Configurar modo de voz
- [ ] Ativar terminais sandboxed (macOS)

### Comandos e Regras

- [ ] Criar .cursorrules
- [ ] Configurar comandos de equipe
- [ ] Compartilhar via deeplinks
- [ ] Documentar padrões

### Automações

- [ ] Configurar scripts npm
- [ ] Criar Makefile (opcional)
- [ ] Integrar com CI/CD
- [ ] Configurar gates de validação

### Segurança

- [ ] Revisar mudanças sempre
- [ ] Configurar CI gates
- [ ] Ativar sandbox (macOS)
- [ ] Documentar processos

### Otimização

- [ ] Configurar busca semântica
- [ ] Ajustar contexto máximo
- [ ] Otimizar cache
- [ ] Acompanhar métricas

---

## 🎯 Resumo Executivo

### Use Composer Para:

- ✅ Execução rápida (< 30s)
- ✅ Tarefas simples a médias
- ✅ Iterações ágeis

### Use Multi-Agente Para:

- ✅ Múltiplas features simultâneas
- ✅ Comparar soluções
- ✅ Dividir trabalho complexo

### Use Planejamento Para:

- ✅ Tarefas complexas
- ✅ Refatorações grandes
- ✅ Migrações

### Use Browser Para:

- ✅ Desenvolvimento frontend
- ✅ Testes visuais
- ✅ Debug de UI

### Configure Equipe Para:

- ✅ Padrões compartilhados
- ✅ Comandos centralizados
- ✅ Colaboração eficiente

---

**Última atualização:** Novembro 2025
**Versão do Cursor:** 2.0+

