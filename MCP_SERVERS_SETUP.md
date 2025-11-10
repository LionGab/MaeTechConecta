# 📡 CONFIGURAÇÃO DE MCP SERVERS - NOSSA MATERNIDADE

## ✅ ARQUIVO DE CONFIGURAÇÃO ATUALIZADO

**Localização:** `C:\Users\Usuario\AppData\Roaming\Claude\claude_desktop_config.json`

**Status:** ✅ Atualizado com 12 MCP Servers

---

## 🔑 CREDENCIAIS NECESSÁRIAS

### 1. SUPABASE (CRÍTICO - Banco de Dados)

**Já configurado:**
- ✅ `SUPABASE_URL`: `https://bbcwitnbnosyfpfjtzkry.supabase.co`
- ❌ `SUPABASE_SERVICE_ROLE_KEY`: PRECISA ATUALIZAR

**Como obter:**
1. Acesse: https://app.supabase.com
2. Selecione projeto **"nossa-maternidade"**
3. Vá para: **Settings → API**
4. Copie: **Service Role Key** (não é a anon key)
5. Substitua em: `claude_desktop_config.json`

**Teste:**
```
No Claude: "List all tables in my Supabase database"
```

---

### 2. GITHUB (ALTO - Repositório)

**Status:** ❌ PRECISA CONFIGURAR

**Como obter novo token:**
1. Acesse: https://github.com/settings/tokens
2. Clique: **Generate new token (classic)**
3. Nome: "Claude MCP"
4. Validade: 90 dias
5. Scopes necessários:
   - ✅ `repo` (acesso ao repositório)
   - ✅ `read:org` (leitura de organizações)
   - ❌ NÃO precisa de admin:org_hook

6. Clique: **Generate token**
7. **COPIE IMEDIATAMENTE** (não aparece novamente)
8. Substitua em: `claude_desktop_config.json`

**Teste:**
```
No Claude: "Show me the recent commits in nossa-maternidade repo"
```

---

### 3. GIT (MÉDIO - Operações Locais)

**Status:** ✅ JÁ CONFIGURADO

**Caminho:** `C:\Users\Usuario\Documents\NossaMaternidade`

**Teste:**
```
No Claude: "What is the git status of nossa-maternidade?"
```

---

### 4. PLAYWRIGHT (MÉDIO-ALTO - Testes E2E)

**Status:** ✅ CONFIGURADO (sem credenciais necessárias)

**Teste:**
```
No Claude: "Navigate to https://www.google.com and take a screenshot"
```

---

### 5. NOTION (MÉDIO - Documentação)

**Status:** ❌ OPCIONAL (se usar Notion para docs)

**Como obter:**
1. Acesse: https://www.notion.so/profile/integrations
2. Clique: **Develop or manage integrations**
3. Clique: **New integration**
4. Nome: "Claude MCP"
5. Capacidades: Read content, Update content
6. Clique: **Submit**
7. Copie: **Internal Integration Token**
8. Substitua em: `claude_desktop_config.json`

**Teste:**
```
No Claude: "List all Notion databases I have access to"
```

---

### 6. LINEAR (MÉDIO - Gerenciar Tasks)

**Status:** ❌ OPCIONAL (se usar Linear para issues)

**Como obter:**
1. Acesse: https://app.linear.app/settings/api
2. Clique: **Create API key**
3. Nome: "Claude MCP"
4. Copie a chave
5. Substitua em: `claude_desktop_config.json`

**Teste:**
```
No Claude: "List my Linear issues in progress"
```

---

### 7. FIGMA (MÉDIO - Design System)

**Status:** ❌ OPCIONAL (se usar Figma para design)

**Como obter:**
1. Acesse: https://www.figma.com/settings/account/tokens
2. Clique: **Create new token**
3. Nome: "Claude MCP"
4. Clique: **Create token**
5. **COPIE IMEDIATAMENTE**
6. Substitua em: `claude_desktop_config.json`

**Teste:**
```
No Claude: "Show me all Figma files I have access to"
```

---

### 8. SENTRY (MÉDIO - Error Tracking)

**Status:** ❌ OPCIONAL (se usar Sentry)

**Como obter:**
1. Acesse: https://sentry.io/settings/account/api/auth-tokens/
2. Clique: **Create New Token**
3. Scopes: `project:read`, `event:read`, `issue:read`
4. Copie o token
5. Substitua em: `claude_desktop_config.json`

**Teste:**
```
No Claude: "Show me recent errors in Nossa Maternidade project"
```

---

### 9. BRAVE SEARCH (BAIXO - Busca Web)

**Status:** ❌ OPCIONAL

**Como obter:**
1. Acesse: https://api.search.brave.com/
2. Clique: **Create Account**
3. Gere uma chave de API
4. Substitua em: `claude_desktop_config.json`

---

## 📋 PRIORIDADE DE CONFIGURAÇÃO

### FASE 1: ESSENCIAL (faça agora)
- ✅ Supabase (atualizar SERVICE_ROLE_KEY)
- ✅ GitHub (gerar novo PAT)

### FASE 2: RECOMENDADO (faça depois)
- ✅ Playwright (já pronto)
- ✅ Git (já pronto)
- ⏳ Notion (se documentar em Notion)
- ⏳ Linear (se usar Linear para issues)

### FASE 3: OPCIONAL (faça se precisar)
- ⏳ Figma (se design system em Figma)
- ⏳ Sentry (se usar Sentry para erros)
- ⏳ Brave Search (se quiser busca web)

---

## 🔄 COMO ATUALIZAR O ARQUIVO

1. **Localize:** `C:\Users\Usuario\AppData\Roaming\Claude\claude_desktop_config.json`

2. **Abra com:** Notepad, VS Code, ou editor de texto

3. **Localize a seção do servidor:** Ex. `"supabase": { ... }`

4. **Substitua o valor da chave:**
```json
"SUPABASE_SERVICE_ROLE_KEY": "COLE_AQUI_A_CHAVE"
```

5. **Salve o arquivo** (Ctrl+S)

6. **Reinicie Claude Desktop** (feche e abra novamente)

---

## ✅ COMO TESTAR CADA SERVIDOR

Após atualizar as credenciais, reinicie Claude Desktop e teste:

### Teste Supabase
```
Prompt: "What are the main tables in my Supabase database? Show me their schemas."
Esperado: Lista de tabelas com schemas
```

### Teste GitHub
```
Prompt: "Show me the last 5 commits in nossa-maternidade"
Esperado: Lista de commits recentes
```

### Teste Playwright
```
Prompt: "Navigate to https://nossa-maternidade.app and take a screenshot of the home page"
Esperado: Screenshot da página
```

### Teste Git
```
Prompt: "What files were modified in the last commit?"
Esperado: Lista de arquivos modificados
```

### Teste Notion
```
Prompt: "List all Notion databases"
Esperado: Lista de databases Notion
```

### Teste Linear
```
Prompt: "Show me my open issues in Linear"
Esperado: Lista de issues abertas
```

### Teste Figma
```
Prompt: "Show me all Figma files I have access to"
Esperado: Lista de arquivos Figma
```

### Teste Sentry
```
Prompt: "List recent errors in Nossa Maternidade project"
Esperado: Lista de erros recentes
```

---

## 📊 RESUMO DE CONFIGURAÇÃO

| Servidor | Tipo | Status | Prioridade | Credencial |
|----------|------|--------|-----------|-----------|
| Supabase | stdio | ❌ Precisa chave | CRÍTICA | SERVICE_ROLE_KEY |
| GitHub | stdio | ❌ Precisa token | ALTA | PAT |
| Git | stdio | ✅ Pronto | MÉDIA | - |
| Playwright | stdio | ✅ Pronto | MÉDIA-ALTA | - |
| Notion | stdio | ❌ Opcional | MÉDIA | API_KEY |
| Linear | stdio | ❌ Opcional | MÉDIA | API_KEY |
| Figma | stdio | ❌ Opcional | MÉDIA | ACCESS_TOKEN |
| Sentry | stdio | ❌ Opcional | BAIXA | AUTH_TOKEN |
| Filesystem (3x) | stdio | ✅ Pronto | BAIXA | - |
| Brave Search | stdio | ❌ Opcional | BAIXA | API_KEY |

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ **Obter credenciais Supabase e GitHub** (ESSENCIAL)
2. ✅ **Atualizar o arquivo `claude_desktop_config.json`**
3. ✅ **Reiniciar Claude Desktop**
4. ✅ **Testar cada servidor** com os prompts acima
5. ⏳ **Configurar servidores opcionais** conforme necessário

---

## 💡 DICAS

- **Tokens não aparecem novamente:** Salve em lugar seguro quando gerar
- **Erros de conexão:** Reinicie Claude Desktop após atualizar arquivo
- **Tokens vencidos:** GitHub tokens expiram, Linear não. GitHub = 90 dias
- **Backups:** Faça backup do arquivo antes de atualizar

---

**Status:** 🟡 Aguardando entrada de credenciais

