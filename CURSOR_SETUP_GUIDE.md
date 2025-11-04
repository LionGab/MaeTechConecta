# 🎯 Guia Completo de Configuração do Cursor 2.0

## 🆕 NOVO! Cursor 2.0 (Lançado em 29/10/2025)

### Principais Novidades do Cursor 2.0:

✨ **Agent Mode** - IA autônoma que pode:

- Executar comandos no terminal
- Criar e modificar múltiplos arquivos
- Navegar pelo código automaticamente
- Aplicar mudanças sem intervenção manual

🎯 **Improved Context Window** - Contexto expandido:

- Entende projetos inteiros (não apenas arquivos abertos)
- Melhor compreensão de dependências
- Cache inteligente de contexto

🚀 **Cursor Rules (.cursorrules)** - Regras customizadas:

- Define padrões de código do projeto
- Especifica convenções e best practices
- IA segue suas regras automaticamente

💡 **Multi-file Edit** - Edição avançada:

- Edita vários arquivos simultaneamente
- Refatoração em todo o codebase
- Apply All com um clique

🔥 **Faster Autocomplete** - Performance melhorada:

- 2x mais rápido que versão anterior
- Sugestões mais precisas
- Menor latência

## O que é o Cursor 2.0?

Cursor é um editor de código baseado no VS Code, mas com IA nativa de próxima geração. Usa as mesmas configurações do VS Code, mas adiciona recursos revolucionários de IA com o novo Agent Mode.

---

## 🚀 Instalação Rápida

### 1. Baixar e Instalar

```
https://cursor.sh/
```

### 2. Copiar Configurações Automaticamente

**Opção A - PowerShell (Recomendado):**

```powershell
.\copy-to-cursor.ps1
```

**Opção B - Batch:**

```batch
copy-to-cursor.bat
```

**Opção C - Manual:**

```powershell
# Copiar configurações
copy .vscode\settings.json %APPDATA%\Cursor\User\settings.json
copy .vscode\extensions.json %APPDATA%\Cursor\User\extensions.json
```

---

## ⚙️ Configuração Manual no Cursor

### Passo 1: Abrir Configurações

**Opções:**

- `Ctrl + ,` (atalho)
- File → Preferences → Settings
- `Ctrl + Shift + P` → "Open Settings (JSON)"

### Passo 2: Configurações Específicas do Cursor

Adicione estas configurações ao `settings.json` do Cursor:

```json
{
  // ========================================
  // CURSOR AI SETTINGS - MODO EXTREMO
  // ========================================

  // Cursor AI - Ativação Total
  "cursor.ai.enabled": true,
  "cursor.ai.autoSuggest": true,
  "cursor.ai.showSuggestions": "always",
  "cursor.ai.acceptPartialSuggestions": true,

  // Cursor Chat
  "cursor.chat.enabled": true,
  "cursor.chat.model": "gpt-4",
  "cursor.chat.temperature": 0.7,

  // Cursor Tab (Autocompletar IA)
  "cursor.tab.enabled": true,
  "cursor.tab.useCache": true,
  "cursor.tab.partialAccepts": true,

  // Cursor Composer (Edição com IA)
  "cursor.composer.enabled": true,
  "cursor.composer.autoApply": true,

  // Privacy & Telemetry
  "cursor.telemetry": "all",
  "cursor.privacyMode": false,

  // Shadow Workspace (Contexto expandido)
  "cursor.general.enableShadowWorkspace": true,
  "cursor.cpp.disabledLanguages": []

  // Todas as configurações do VS Code também funcionam aqui
}
```

---

## 🎨 Recursos Exclusivos do Cursor

### 1. **Cursor Tab (Ctrl + Tab)**

- Autocompletar inteligente com IA
- Sugere código completo baseado no contexto
- Aceitar: `Tab`
- Aceitar parcial: `Ctrl + →`

### 2. **Cursor Chat (Ctrl + L)**

- Chat com IA diretamente no editor
- Pode editar código diretamente
- Entende todo o contexto do projeto

### 3. **Cursor Composer (Ctrl + K)**

- Gera código com prompts
- Edita múltiplos arquivos
- Refatora código inteiro

### 4. **Cursor CMD (Ctrl + Shift + L)**

- Execute comandos naturais
- Ex: "criar um componente React chamado Button"
- Ex: "adicionar tratamento de erro nesta função"

---

## 📁 Estrutura de Pastas do Cursor

```
%APPDATA%\Cursor\
├── User\
│   ├── settings.json          # Configurações globais
│   ├── keybindings.json       # Atalhos personalizados
│   └── snippets\              # Snippets de código
└── extensions\                # Extensões instaladas
```

---

## 🔑 Atalhos Principais do Cursor

| Ação              | Atalho             | Descrição                   |
| ----------------- | ------------------ | --------------------------- |
| Cursor Chat       | `Ctrl + L`         | Abrir chat IA               |
| Cursor Composer   | `Ctrl + K`         | Gerar/editar código         |
| Cursor CMD        | `Ctrl + Shift + L` | Comandos naturais           |
| Cursor Tab        | `Tab`              | Aceitar sugestão            |
| Aceitar Parcial   | `Ctrl + →`         | Aceitar palavra por palavra |
| Rejeitar          | `Esc`              | Rejeitar sugestão           |
| Próxima Sugestão  | `Alt + ]`          | Próxima opção               |
| Sugestão Anterior | `Alt + [`          | Opção anterior              |
| Apply             | `Ctrl + Enter`     | Aplicar mudanças            |

---

## 🎯 Configurações Recomendadas

### Para Máximo Desempenho:

```json
{
  "cursor.ai.enabled": true,
  "cursor.ai.autoSuggest": true,
  "cursor.tab.enabled": true,
  "cursor.tab.partialAccepts": true,
  "cursor.composer.enabled": true,
  "cursor.composer.autoApply": false, // Revisar antes de aplicar
  "cursor.general.enableShadowWorkspace": true,

  // Desempenho
  "cursor.ai.showSuggestions": "onDemand", // ou "always"
  "cursor.tab.useCache": true,

  // Privacidade
  "cursor.privacyMode": false, // true = não envia código para nuvem
  "cursor.telemetry": "minimal" // ou "all" para ajudar desenvolvimento
}
```

---

## 🔐 Configuração de API Keys

### OpenAI/Anthropic (Opcional)

1. **Abrir Configurações:**
   - `Ctrl + Shift + P`
   - Digite: "Cursor: Settings"

2. **Adicionar API Key:**

   ```
   Settings → Cursor → API Key
   ```

3. **Modelos Disponíveis:**
   - GPT-4 (OpenAI)
   - GPT-3.5 (OpenAI)
   - Claude (Anthropic)
   - Cursor próprio (gratuito com limites)

---

## 🎨 Temas e Aparência

O Cursor usa os mesmos temas do VS Code:

```json
{
  "workbench.colorTheme": "Default Dark+",
  "workbench.iconTheme": "vs-seti",
  "cursor.appearance.theme": "dark" // Específico do Cursor
}
```

**Temas Recomendados:**

- Dracula Official
- One Dark Pro
- GitHub Dark
- Material Theme

---

## 🔌 Extensões Compatíveis

Todas as extensões do VS Code funcionam no Cursor:

**Instalar via:**

1. `Ctrl + Shift + X`
2. Buscar extensão
3. Clicar "Install"

**Ou via settings.json:**

```json
{
  "cursor.extensions.autoUpdate": true,
  "cursor.extensions.ignoreRecommendations": false
}
```

---

## 🚨 Solução de Problemas

### Cursor não está sugerindo código:

1. **Verificar se IA está ativa:**

   ```json
   "cursor.ai.enabled": true
   ```

2. **Verificar modelo:**
   - Settings → Cursor → Model
   - Selecionar GPT-4 ou Claude

3. **Limpar cache:**
   - `Ctrl + Shift + P`
   - "Cursor: Clear Cache"

### Sugestões muito lentas:

```json
{
  "cursor.tab.useCache": true,
  "cursor.ai.showSuggestions": "onDemand",
  "cursor.general.enableShadowWorkspace": false // Desabilitar se muito lento
}
```

### Conflito com Copilot:

```json
{
  // Desabilitar Copilot se usar Cursor
  "github.copilot.enable": {
    "*": false
  },

  // Ou desabilitar Cursor Tab se preferir Copilot
  "cursor.tab.enabled": false
}
```

---

## 📊 Comparação: Cursor vs VS Code + Copilot

| Recurso                   | Cursor              | VS Code + Copilot |
| ------------------------- | ------------------- | ----------------- |
| Autocompletar IA          | ✅ Cursor Tab       | ✅ Copilot        |
| Chat no editor            | ✅ Nativo           | ✅ Extension      |
| Editar múltiplos arquivos | ✅ Composer         | ❌                |
| Comandos naturais         | ✅ CMD              | ⚠️ Limitado       |
| Contexto do projeto       | ✅ Shadow Workspace | ⚠️ Limitado       |
| Gratuito                  | ⚠️ Com limites      | ❌ Pago           |
| Extensões VS Code         | ✅ Compatível       | ✅ Nativo         |

---

## 🎓 Dicas Pro para Cursor

### 1. Use o Composer para Refatoração:

```
Ctrl + K → "refatorar esta função para usar async/await"
```

### 2. Chat com Contexto:

```
Ctrl + L → "explique este código @arquivo.ts"
```

### 3. Geração Rápida:

```
Ctrl + K → "criar um hook React para fetch de dados"
```

### 4. Edição Inline:

```
Selecionar código → Ctrl + K → "adicionar tratamento de erro"
```

### 5. Documentação Automática:

```
Ctrl + K → "adicionar JSDoc para todas as funções"
```

---

## 🔄 Migração VS Code → Cursor

### Passo a Passo:

1. **Instalar Cursor**
2. **Executar script de cópia:**
   ```powershell
   .\copy-to-cursor.ps1
   ```
3. **Verificar extensões:**
   - Abrir Cursor
   - `Ctrl + Shift + X`
   - Instalar extensões necessárias
4. **Testar configurações:**
   - Abrir projeto
   - Verificar se tudo funciona

### Manter Ambos:

Você pode usar VS Code e Cursor simultaneamente:

- VS Code: desenvolvimento normal
- Cursor: quando precisar de IA poderosa

---

## 📝 Arquivo de Configuração Completo

Todas as suas configurações do `.vscode/settings.json` já estão otimizadas para Cursor!

**Adições específicas do Cursor:**

```json
{
  "cursor.ai.enabled": true,
  "cursor.ai.autoSuggest": true,
  "cursor.tab.enabled": true,
  "cursor.composer.enabled": true,
  "cursor.general.enableShadowWorkspace": true,
  "cursor.cpp.disabledLanguages": []
}
```

---

## ✅ Checklist Final

- [ ] Cursor instalado
- [ ] Executar `copy-to-cursor.ps1`
- [ ] Reiniciar Cursor
- [ ] Abrir projeto LionNath
- [ ] Testar `Ctrl + L` (Chat)
- [ ] Testar `Ctrl + K` (Composer)
- [ ] Testar `Tab` (Autocompletar)
- [ ] Instalar extensões necessárias
- [ ] Configurar API key (opcional)

---

## 🔗 Links Úteis

- **Site Oficial:** https://cursor.sh/
- **Documentação:** https://docs.cursor.sh/
- **Discord:** https://discord.gg/cursor
- **GitHub:** https://github.com/getcursor

---

**Status:** ✅ Pronto para usar Cursor com todas as configurações otimizadas!
**Última atualização:** 30 de Outubro de 2025

**Execute agora:**

```powershell
.\copy-to-cursor.ps1
```
