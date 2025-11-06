# Como Verificar o Sistema - Guia Completo

## Métodos de Verificação

### 1. Usando Composer do Cursor (Recomendado)

#### Ativar Composer
- Pressione `Ctrl+I` (Windows) ou `Cmd+I` (Mac)
- Ou clique no ícone "Composer" na barra lateral

#### Comandos de Verificação

**Verificar Chat:**
```
Verifique se o chat está funcionando:
1. Teste useChatOptimized
2. Verifique salvamento de mensagens
3. Teste histórico
4. Verifique Edge Function
```

**Verificar Autenticação:**
```
Verifique autenticação:
1. Teste sign up
2. Teste sign in
3. Verifique criação de perfil
4. Teste sessão
```

**Verificar Backend:**
```
Verifique o backend:
1. Execute VALIDAR_SCHEMA.sql no Supabase
2. Verifique Edge Functions
3. Verifique secrets
4. Teste nathia-chat
```

### 2. Usando Multi-Agente (Paralelo)

#### Ativar Multi-Agente
- Use o Composer (`Ctrl+I`)
- Digite múltiplas tarefas separadas

#### Exemplo:
```
Agente 1: Verifique integração do chat
Agente 2: Verifique autenticação
Agente 3: Verifique Edge Functions
Agente 4: Verifique configurações
```

### 3. Usando Browser Integrado

#### Ativar Browser
- Use o Composer (`Ctrl+I`)
- Digite: "Abra o browser e verifique o Supabase"

#### Exemplo:
```
Abra o browser e:
1. Acesse Supabase Dashboard
2. Execute VALIDAR_SCHEMA.sql
3. Verifique tabelas
4. Teste Edge Functions
```

### 4. Scripts de Verificação

#### Executar Validação Completa
```bash
npm run validate
```

#### Verificar Tipos
```bash
npm run type-check
```

#### Verificar Lint
```bash
npm run lint
```

#### Executar Testes
```bash
npm run test
```

### 5. Verificação Manual

#### No Supabase Dashboard
1. Acesse: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme
2. SQL Editor - Execute `VALIDAR_SCHEMA.sql`
3. Edge Functions - Verifique logs
4. Database - Verifique tabelas

#### No App Mobile
1. Execute: `cd apps/mobile && pnpm dev`
2. Teste no emulador/dispositivo
3. Verifique logs no console
4. Teste funcionalidades

## Scripts de Verificação Criados

### 1. VALIDAR_SCHEMA.sql
- Verifica extensões
- Verifica tabelas
- Verifica RLS
- Verifica políticas
- Verifica índices
- Verifica funções

### 2. VERIFICAR_MIGRATION_COMPLETA.sql
- Verifica migration 001_gemini_memory.sql
- Mostra status de cada componente
- Resumo final

### 3. VERIFICAR_RAPIDO.sql
- Verificação rápida
- Status de cada item
- Resumo final

## Como Visualizar Resultados

### No Cursor
- **Composer** - Resultados em tempo real
- **Multi-Agente** - Progresso de cada agente
- **Browser** - Tela do browser
- **Terminal** - Logs e resultados

### No Supabase Dashboard
- **SQL Editor** - Resultados das queries
- **Edge Functions** - Logs e status
- **Database** - Estrutura e dados

### No App
- **Console** - Logs do app
- **Sentry** - Erros em produção
- **Network Tab** - Requisições

## Checklist de Verificação

### Backend ✅
- [x] SQL Migration executada
- [x] Tabelas criadas
- [x] RLS habilitado
- [x] Edge Functions deployadas
- [x] Secrets configurados

### Frontend ✅
- [x] Variáveis de ambiente configuradas
- [x] Autenticação implementada
- [x] Chat implementado
- [x] Salvamento de mensagens implementado
- [x] Histórico implementado

### Integrações ✅
- [x] Supabase conectado
- [x] Edge Functions configuradas
- [x] Sentry integrado
- [x] Notificações configuradas

## Próximos Passos

1. Use o Composer para verificar cada funcionalidade
2. Execute scripts de validação
3. Teste o app manualmente
4. Verifique logs e erros

