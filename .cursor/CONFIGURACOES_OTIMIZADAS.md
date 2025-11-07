# ⚙️ Configurações Otimizadas Cursor 2.0

**Configurações baseadas em [cursor.com/docs](https://cursor.com/docs) - Melhores Práticas para Desenvolvedores**

---

## 📋 Resumo das Configurações

### ✅ Recursos Habilitados

- ✅ **Composer** - Execução rápida (< 30s)
- ✅ **Multi-Agente** - Até 8 agentes paralelos
- ✅ **Browser Integrado** - Testes E2E e visuais
- ✅ **Voice Mode** - Comandos por voz (pt-BR)
- ✅ **Sandbox** - Execução segura
- ✅ **Codebase Indexing** - Indexação otimizada
- ✅ **Inline Completion** - Autocomplete inteligente

### ⚡ Performance

- **Requests por segundo**: 20 (otimizado)
- **Token limit**: 200.000
- **Agentes concorrentes**: 8
- **Requests concorrentes**: 4
- **Codebase index delay**: 500ms (otimizado)
- **Inline completion delay**: 200ms (otimizado)

### 🎯 Modelos Configurados

- **Padrão**: Composer (ultra-rápido)
- **Long**: Claude 3.5 Sonnet (raciocínio)
- **Plan**: Claude 3.5 Sonnet (planejamento)
- **Review**: Claude 3.5 Sonnet (revisão)
- **Chat**: Claude 3.5 Sonnet (conversação)

---

## 🖥️ Browser Integrado

### Configurações

- **Headless**: false (visual)
- **Timeout**: 30s
- **Screenshot on failure**: true
- **Video recording**: false

### Viewport (Mobile-First - iPhone 13)

- **Width**: 390px
- **Height**: 844px
- **Device Scale Factor**: 3
- **Touch**: true
- **User Agent**: iPhone iOS 17

### Geolocalização

- **Latitude**: -23.5505 (São Paulo)
- **Longitude**: -46.6333 (São Paulo)
- **Accuracy**: 100m

### Permissões

- Geolocation
- Notifications

---

## ⌨️ Atalhos de Teclado

### Composer e Multi-Agente

| Atalho         | Comando                          | Descrição                 |
| -------------- | -------------------------------- | ------------------------- |
| `Ctrl+I`       | `cursor.composer.open`           | Abrir Composer            |
| `Ctrl+Shift+M` | `cursor.multiAgent.open`         | Abrir Multi-Agente        |
| `Ctrl+Shift+P` | `cursor.composer.openWithPlan`   | Composer com Planejamento |
| `Ctrl+Shift+C` | `cursor.composer.openChat`       | Abrir Chat                |
| `Ctrl+Shift+D` | `cursor.composer.openWithDebug`  | Composer com Debug        |
| `Ctrl+Shift+F` | `cursor.composer.openWithFiles`  | Composer com Arquivos     |
| `Ctrl+Shift+G` | `cursor.composer.openWithGit`    | Composer com Git          |
| `Ctrl+Shift+E` | `cursor.composer.openWithErrors` | Composer com Erros        |

### Browser

| Atalho         | Comando                     | Descrição      |
| -------------- | --------------------------- | -------------- |
| `Ctrl+Shift+B` | `cursor.browser.open`       | Abrir Browser  |
| `Ctrl+Shift+N` | `cursor.browser.newTab`     | Nova Aba       |
| `Ctrl+Shift+W` | `cursor.browser.close`      | Fechar Browser |
| `Ctrl+Shift+U` | `cursor.browser.screenshot` | Screenshot     |

### Validação e Testes

| Atalho         | Comando                  | Descrição       |
| -------------- | ------------------------ | --------------- |
| `Ctrl+Shift+R` | `cursor.reviewCode`      | Revisar Código  |
| `Ctrl+Shift+T` | `cursor.runTests`        | Executar Testes |
| `Ctrl+Shift+L` | `cursor.validateProject` | Validar Projeto |

### Voice Mode

| Atalho         | Comando               | Descrição          |
| -------------- | --------------------- | ------------------ |
| `Ctrl+Shift+V` | `cursor.voice.toggle` | Toggle Voice Mode  |
| `Ctrl+Shift+S` | `cursor.voice.start`  | Iniciar Voice Mode |

### Outros

| Atalho          | Comando                     | Descrição       |
| --------------- | --------------------------- | --------------- |
| `Ctrl+K Ctrl+K` | `cursor.commandK`           | Command K       |
| `F1`            | `cursor.showCommandPalette` | Command Palette |
| `Ctrl+Shift+H`  | `cursor.showHelp`           | Ajuda           |

---

## 🔧 Configurações Avançadas

### Codebase Indexing

- **Delay**: 500ms (otimizado)
- **Max file size**: 100KB
- **Exclude patterns**:
  - `**/node_modules/**`
  - `**/dist/**`
  - `**/build/**`
  - `**/.git/**`
  - `**/coverage/**`
  - `**/.expo/**`
  - `**/.next/**`
  - `**/ios/**`
  - `**/android/**`

### Auto-save e Formatação

- ✅ Auto-save habilitado
- ✅ Format on save
- ✅ Format on paste

### Privacidade

- ❌ Telemetry desabilitado
- ❌ Error reporting desabilitado

### Validação

- ✅ Validação habilitada
- ✅ Pre-commit hooks
- ✅ Auto-fix habilitado
- ✅ Comandos: `pnpm type-check`, `pnpm lint`, `pnpm test`

### Sandbox

- ✅ Sandbox habilitado
- ✅ Audit logs
- ✅ Domínios permitidos:
  - supabase.com
  - expo.dev
  - github.com
  - npmjs.com
  - vercel.com
  - netlify.com

### Workspace Trust (Segurança)

- ✅ Workspace trust habilitado
- ✅ Banner desabilitado (conforme cursor.com/docs)

---

## 📝 Arquivos de Configuração

### `.cursor/settings.json`

Configurações gerais do Cursor:

- Recursos habilitados
- Performance
- Modelos
- Browser
- Sandbox
- Validação
- Workspace Trust

### `.cursor/keybindings.json`

Atalhos de teclado personalizados:

- Composer
- Multi-Agente
- Browser
- Voice Mode
- Validação
- Testes

### `.vscode/settings.json`

Configurações do workspace:

- Segurança (Workspace Trust)
- Editor (formatação, auto-save)
- TypeScript/JavaScript
- ESLint/Prettier
- Files (exclusões para performance)
- Git
- Performance

### `.vscode/extensions.json`

Extensões recomendadas e não recomendadas:

- **Recomendadas**: ESLint, Prettier, Expo Tools, GitLens
- **Não Recomendadas**: Extensões que conflitam com Cursor (Copilot, Playwright, etc.)

---

## 🚀 Como Usar

### 1. Abrir Browser Integrado

**Opção 1: Atalho**

```
Ctrl+Shift+B
```

**Opção 2: Command Palette**

```
Ctrl+Shift+P → cursor.browser.open
```

**Opção 3: Via Composer**

```
Ctrl+I → "Abra o browser e teste o app"
```

### 2. Usar Composer

```
Ctrl+I → Descreva sua tarefa
```

### 3. Usar Multi-Agente

```
Ctrl+Shift+M → Descreva múltiplas tarefas
```

### 4. Validar Projeto

```
Ctrl+Shift+L
```

### 5. Revisar Código

```
Ctrl+Shift+R
```

---

## 🔒 Segurança

### Workspace Trust

Conforme [cursor.com/docs](https://docs.cursor.com/pt-BR/account/agent-security?utm_source=openai):

- ✅ Workspace trust habilitado
- ✅ Banner desabilitado (modo confiança)
- ✅ Arquivos não confiáveis: prompt

Isso permite que o Cursor funcione de forma otimizada em projetos confiáveis.

---

## 🚫 Extensões Desabilitadas

As seguintes extensões foram marcadas como não recomendadas porque conflitam com funcionalidades nativas do Cursor:

- ❌ GitHub Copilot (Cursor já tem AI Code Completion)
- ❌ Playwright Extension (Cursor já tem Browser Automation)
- ❌ TypeScript Next (Cursor já tem TypeScript integrado)
- ❌ Auto Rename/Close Tag (Cursor já tem essas funcionalidades)
- ❌ Outras extensões de AI que conflitam

---

## 📚 Documentação Adicional

- **Guia Completo**: `docs/COMO_USAR_AGENTES.md`
- **Melhores Práticas**: `docs/CURSOR_2.0_BEST_PRACTICES.md`
- **Setup Prático**: `docs/CURSOR_2.0_SETUP.md`
- **Configuração Otimizada**: `docs/CURSOR_2.0_CONFIGURACAO_OTIMIZADA.md`
- **Cursor Docs**: [cursor.com/docs](https://cursor.com/docs)

---

## ✅ Checklist de Configuração

- [x] Recursos habilitados
- [x] Performance otimizada
- [x] Modelos configurados
- [x] Browser integrado configurado
- [x] Atalhos de teclado configurados
- [x] Codebase indexing otimizado
- [x] Validação habilitada
- [x] Sandbox configurado
- [x] Voice Mode configurado (pt-BR)
- [x] Privacidade configurada
- [x] Workspace Trust configurado
- [x] Extensões desnecessárias desabilitadas

---

**Última atualização**: Janeiro 2025  
**Versão do Cursor**: 2.0+  
**Versão da Configuração**: 2.0.0  
**Baseado em**: [cursor.com/docs](https://cursor.com/docs)
