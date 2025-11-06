# Como Usar Agentes do Cursor 2.0 para Verificação

## Visão Geral

O Cursor 2.0 oferece várias ferramentas para verificação e testes:
- **Composer** - Execução rápida de tarefas
- **Multi-Agente** - Paralelização de tarefas
- **Browser Integrado** - Testes visuais
- **Planejamento** - Tarefas complexas

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

## 3. Browser Integrado - Testes Visuais

### Como Ativar
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

## 4. Planejamento - Verificação Completa

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

## 6. Verificação Manual via Browser

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

## 7. Checklist de Verificação

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

## 8. Como Visualizar Resultados

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

## 9. Comandos Úteis

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

## 10. Próximos Passos

1. Use o Composer para verificar cada funcionalidade
2. Use Multi-Agente para verificar em paralelo
3. Use o Browser para testes visuais
4. Execute scripts de validação
5. Teste o app manualmente

## Notas

- Composer é ideal para tarefas rápidas (< 30 segundos)
- Multi-Agente é ideal para múltiplas tarefas simultâneas
- Browser é ideal para testes visuais
- Planejamento é ideal para tarefas complexas

