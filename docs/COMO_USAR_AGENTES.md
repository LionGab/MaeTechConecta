# Como Usar Agentes do Cursor 2.0 - Guia Completo

## Visão Geral

O Cursor 2.0 oferece várias ferramentas otimizadas para desenvolvimento:

- **Composer** - Execução rápida de tarefas (< 30s)
- **Multi-Agente** - Paralelização de tarefas (até 8 agentes)
- **Browser Integrado** - Testes visuais e E2E
- **Planejamento** - Tarefas complexas com raciocínio
- **Voice Mode** - Comandos por voz
- **Comandos Personalizados** - Automações customizadas

## Configurações Otimizadas

### Arquivos de Configuração

O projeto está configurado com as melhores práticas em:

- `.cursor/settings.json` - Configurações gerais do Cursor
- `.cursor/composer-config.json` - Configurações do Composer e Multi-Agente
- `.cursor/keybindings.json` - Atalhos de teclado
- `.cursor/commands/` - Comandos personalizados
- `.cursor/workflows/` - Workflows otimizados

### Recursos Habilitados

- ✅ Composer (modelo padrão: Composer - 4x mais rápido)
- ✅ Multi-Agente (até 8 agentes em paralelo)
- ✅ Browser Integrado (testes E2E)
- ✅ Voice Mode (comandos por voz)
- ✅ Codebase Indexing (performance)
- ✅ Inline Completion (autocomplete inteligente)
- ✅ Auto Save e Format on Save

### Modelos Configurados

- **Padrão (Composer)**: Modelo ultra-rápido para tarefas comuns
- **Long (Claude 3.5 Sonnet)**: Modelo de raciocínio para tarefas complexas
- **Plan (Claude 3.5 Sonnet)**: Planejamento e análise
- **Review (Claude 3.5 Sonnet)**: Revisão de código

## 1. Composer - Verificação Rápida

### Como Ativar

1. Pressione `Ctrl+I` (Windows/Linux) ou `Cmd+I` (Mac)
2. Ou clique no ícone "Composer" na barra lateral
3. Digite sua tarefa de verificação

### Exemplos de Uso

#### Verificar Integração do Chat

```
Verifique se o chat está funcionando corretamente:
1. Teste o hook useChatOptimized
2. Verifique se mensagens são salvas no Supabase
3. Teste o carregamento de histórico
4. Verifique o fallback para Claude
```

#### Verificar Autenticação

```
Verifique o fluxo de autenticação:
1. Teste sign up com email
2. Teste sign in
3. Verifique criação de perfil
4. Teste persistência de sessão
```

#### Verificar Edge Functions

```
Verifique as Edge Functions:
1. Teste nathia-chat
2. Teste moderation-service
3. Verifique logs de erro
4. Teste rate limiting
```

## 2. Multi-Agente - Verificação Paralela

### Como Ativar

1. Use o Composer (`Ctrl+I`)
2. Digite tarefas múltiplas separadas por linhas
3. O Cursor criará agentes paralelos automaticamente

### Exemplo de Uso

```
Agente 1: Verifique a integração do chat
- Teste useChatOptimized
- Verifique salvamento de mensagens
- Teste histórico

Agente 2: Verifique autenticação
- Teste sign up/sign in
- Verifique criação de perfil
- Teste sessão

Agente 3: Verifique Edge Functions
- Teste nathia-chat
- Teste moderation-service
- Verifique logs
```

## 4. Browser Integrado - Testes Visuais e E2E

### Como Ativar

**Opção 1: Atalho de Teclado**
1. Pressione `Ctrl+Shift+B` (Windows/Linux) ou `Cmd+Shift+B` (Mac)
2. O browser integrado será aberto

**Opção 2: Command Palette**
1. Pressione `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (Mac)
2. Digite: `Cursor: Open Browser` ou `cursor.browser.open`
3. Selecione o comando

**Opção 3: Via Composer**
1. Use o Composer (`Ctrl+I`)
2. Digite: "Abra o browser e teste o app"
3. O Cursor abrirá o browser integrado

### Exemplos de Uso

```
Abra o browser e:
1. Acesse o Supabase Dashboard
2. Execute a migration SQL
3. Verifique se a tabela conversations foi criada
4. Teste a Edge Function nathia-chat
```

### Nota Importante

O browser integrado do Cursor **não requer extensão separada**. Ele é uma funcionalidade nativa do Cursor 2.0. Se você receber um erro sobre `cursor-browser-connect.testClientVersion`, isso significa que há um comando inválido configurado. Use `Ctrl+Shift+B` ou o comando `cursor.browser.open` diretamente.

## 5. Comandos Personalizados

### Comandos Disponíveis

O projeto inclui comandos personalizados em `.cursor/commands/`:

#### @criar-componente-rn

Cria um componente React Native seguindo todos os padrões:

- TypeScript com tipos explícitos
- Performance otimizada (React.memo, useCallback, useMemo)
- Acessibilidade completa (WCAG 2.1 AA)
- Tema e dark mode
- Mobile-first design
- JSDoc completo

**Uso:**

```
@criar-componente-rn Crie um componente Button com variantes primary e secondary
```

#### @revisar-codigo

Executa revisão completa de código:

- TypeScript (sem any, tipos explícitos)
- Performance (memo, hooks otimizados)
- Acessibilidade (WCAG 2.1 AA)
- Estilização (tema, dark mode)
- Estrutura e organização
- Tratamento de erros
- Padrões do projeto

**Uso:**

```
@revisar-codigo
```

#### @validar-projeto

Executa validação completa do projeto:

- Type check
- Lint
- Testes
- Format check
- Coverage

**Uso:**

```
@validar-projeto
```

#### @refatorar-performance

Refatora código para melhorar performance:

- React.memo em componentes puros
- useCallback/useMemo otimizados
- FlatList otimizada
- Lazy loading
- Imagens otimizadas
- Debounce/throttle

**Uso:**

```
@refatorar-performance
```

## 6. Workflows Otimizados

### Workflows Disponíveis

Workflows documentados em `.cursor/workflows/`:

#### Feature Development

Workflow completo para desenvolvimento de features:

1. Planejamento
2. Implementação (Composer/Multi-Agente)
3. Revisão
4. Testes
5. Documentação

#### Refatoração

Workflow para refatoração segura:

1. Análise
2. Divisão em etapas
3. Execução incremental
4. Validação

#### Code Review

Workflow para revisão de código:

1. Revisão automática
2. Revisão manual
3. Sugestões
4. Aprovação

#### Testing

Workflow para criação e execução de testes:

1. Planejamento
2. Criação
3. Execução
4. Validação

Ver arquivos em `.cursor/workflows/` para detalhes completos.

## 7. Planejamento - Tarefas Complexas

### Como Ativar

1. Use o Composer (`Ctrl+I`)
2. Digite: "Planeje uma verificação completa do sistema"
3. O Cursor criará um plano detalhado

### Exemplo de Uso

```
Planeje uma verificação completa do sistema:
1. Verificar todas as integrações
2. Testar todos os fluxos
3. Validar configurações
4. Verificar logs e erros
```

## 5. Verificação Automática via Scripts

### Scripts Disponíveis

#### Validar Tudo

```bash
npm run validate
# ou
pnpm validate
```

#### Verificar Tipos

```bash
npm run type-check
# ou
pnpm type-check
```

#### Verificar Lint

```bash
npm run lint
# ou
pnpm lint
```

#### Executar Testes

```bash
npm run test
# ou
pnpm test
```

## 9. Voice Mode - Comandos por Voz

### Como Ativar

1. Pressione `Ctrl+Shift+V` (Voice Mode)
2. Fale seu comando
3. O Cursor executará automaticamente

### Comandos de Voz Úteis

- "Criar componente Button"
- "Revisar código"
- "Validar projeto"
- "Refatorar performance"
- "Executar testes"

## 10. Verificação Manual via Browser

### Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme
2. SQL Editor - Execute scripts de verificação
3. Edge Functions - Verifique logs
4. Database - Verifique tabelas e RLS

### App Mobile

1. Execute: `cd apps/mobile && pnpm dev`
2. Teste no emulador ou dispositivo físico
3. Verifique logs no console
4. Teste todas as funcionalidades

## 11. Checklist de Verificação

### Backend

- [ ] SQL Migration executada
- [ ] Tabelas criadas
- [ ] RLS habilitado
- [ ] Edge Functions deployadas
- [ ] Secrets configurados

### Frontend

- [ ] Variáveis de ambiente configuradas
- [ ] Autenticação funcionando
- [ ] Chat funcionando
- [ ] Salvamento de mensagens funcionando
- [ ] Histórico carregando

### Integrações

- [ ] Supabase conectado
- [ ] Edge Functions respondendo
- [ ] Sentry configurado (se necessário)
- [ ] Notificações configuradas (se necessário)

## 12. Como Visualizar Resultados

### No Cursor

- **Composer** - Mostra resultados em tempo real
- **Multi-Agente** - Mostra progresso de cada agente
- **Browser** - Mostra tela do browser
- **Terminal** - Mostra logs e resultados

### No Supabase Dashboard

- **SQL Editor** - Resultados das queries
- **Edge Functions** - Logs e status
- **Database** - Estrutura e dados

### No App

- **Console** - Logs do app
- **Sentry** - Erros em produção
- **Network** - Requisições e respostas

## 13. Comandos Úteis Rápidos

### Verificar Status do Projeto

```bash
cd apps/mobile
pnpm check
# ou
node ../../verificar-status.js
```

### Validar Configuração

```bash
npm run validate
```

### Verificar Tipos

```bash
npm run type-check
```

### Executar Testes

```bash
npm run test
```

## 14. Próximos Passos

1. **Explore os Atalhos**: Use `Ctrl+I`, `Ctrl+Shift+M`, `Ctrl+Shift+B`
2. **Use Comandos Personalizados**: Experimente `@criar-componente-rn`, `@revisar-codigo`, etc.
3. **Teste Multi-Agente**: Use `Ctrl+Shift+M` para trabalhar com múltiplos agentes
4. **Valide Sempre**: Use `@validar-projeto` ou `npm run validate` antes de finalizar
5. **Consulte Workflows**: Veja `.cursor/workflows/` para workflows detalhados

## 15. Referência Rápida

### Quando Usar Cada Ferramenta

| Ferramenta       | Quando Usar                    | Tempo Esperado          |
| ---------------- | ------------------------------ | ----------------------- |
| **Composer**     | Tarefas simples a médias       | < 30 segundos           |
| **Multi-Agente** | Múltiplas features simultâneas | 5-10 minutos            |
| **Browser**      | Testes visuais, debug UI       | Variável                |
| **Planejamento** | Tarefas complexas              | 5-30 min (planejamento) |
| **Voice Mode**   | Comandos rápidos               | Instantâneo             |
| **Comandos**     | Tarefas padronizadas           | < 30 segundos           |

### Workflow Recomendado

1. **Desenvolvimento**: Use Composer (`Ctrl+I`) para implementação rápida
2. **Features Grandes**: Use Multi-Agente (`Ctrl+Shift+M`) para paralelizar
3. **UI/UX**: Use Browser (`Ctrl+Shift+B`) para ajustes visuais
4. **Revisão**: Use `@revisar-codigo` antes de commitar
5. **Validação**: Use `@validar-projeto` ou `npm run validate` sempre

## 16. Browser Automation Agent

### Agente de Automação do Browser

Agente automatizado para navegação, detecção e correção de erros:

**Como usar:**

```bash
# Via terminal
pnpm browser:automation

# Via Composer
Ctrl+I → "Execute o agente de browser automation para navegar por todas as telas, identificar erros e corrigi-los"

# Via comando personalizado
@browser-automation Execute navegação completa, detecção e correção de erros
```

**O que faz:**

1. ✅ Navega por todas as telas do app
2. ✅ Detecta erros (console, visual, performance, acessibilidade)
3. ✅ Corrige automaticamente os erros possíveis
4. ✅ Gera relatório completo

**Documentação completa:** Veja `docs/BROWSER_AUTOMATION_AGENT.md`

## 17. Documentação Adicional

- **Browser Automation Agent**: Veja `docs/BROWSER_AUTOMATION_AGENT.md` (agente de automação)
- **Configurações Otimizadas**: Veja `docs/CURSOR_CONFIGURACOES_OTIMIZADAS.md` (configurações completas)
- **Configurações**: Veja `.cursor/settings.json` e `.cursor/composer-config.json`
- **Comandos**: Veja `.cursor/commands/` para comandos personalizados
- **Workflows**: Veja `.cursor/workflows/` para workflows detalhados
- **Atalhos**: Veja `.cursor/keybindings.json` para todos os atalhos
- **Guia Rápido**: Veja `docs/CURSOR_2.0_CONFIGURACAO_OTIMIZADA.md`

## Notas Finais

- ✅ Composer é ideal para tarefas rápidas (< 30 segundos)
- ✅ Multi-Agente é ideal para múltiplas tarefas simultâneas (4-8× mais rápido)
- ✅ Browser é ideal para testes visuais e E2E
- ✅ Planejamento é ideal para tarefas complexas
- ✅ Comandos personalizados aceleram tarefas padronizadas
- ✅ Validação automática garante qualidade
- ✅ Workflows organizam processos complexos
