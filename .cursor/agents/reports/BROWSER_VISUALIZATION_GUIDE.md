# 🌐 Guia de Visualização no Browser Integrado - Cursor

## ⚡ Quick Start

**3 passos para começar**:

1. **Abrir browser**: `Ctrl+Shift+B` (Cursor integrado) ou executar `.\.cursor\agents\scripts\abrir-browser.ps1`
2. **Acessar app**: `http://localhost:8081`
3. **Configurar viewport**: `F12` → `Ctrl+Shift+M` → Selecionar iPhone 13 (390x844)

**Verificar se app está rodando**:

```powershell
netstat -ano | findstr :8081
```

Se não estiver rodando:

```powershell
cd apps/mobile
pnpm dev
```

---

## ✅ Status Atual

- ✅ **App rodando**: Porta 8081 ativa
- ✅ **Metro Bundler**: Ativo e escutando conexões
- ✅ **Pronto para visualização**

---

## 🚀 Passos para Visualização

### 1. Abrir Browser Integrado do Cursor

**Atalho**: `Ctrl+Shift+B`

**Via PowerShell Script** (abre browser padrão):

```powershell
# Do diretório raiz do projeto
.\.cursor\agents\scripts\abrir-browser.ps1
```

**Via Composer** (`Ctrl+I`):

```
Abra o browser integrado do Cursor
```

### 2. Acessar o App

**URLs disponíveis:**

- **Expo App**: `http://localhost:8081`
- **Expo App - Onboarding**: `http://localhost:8081/onboarding`
- **Expo App - Chat**: `http://localhost:8081/chat`
- **Expo App - Habits**: `http://localhost:8081/habits`
- **Expo App - Content**: `http://localhost:8081/content`
- **Expo App - Profile**: `http://localhost:8081/profile`
- **Expo DevTools**: `http://localhost:19002`
- **Metro Bundler UI**: `http://localhost:8081/_debugger-ui`

### 3. Configurar Viewport para iPhone 13

**Via DevTools (F12 ou Ctrl+Shift+I):**

1. Abra DevTools
2. Pressione `Ctrl+Shift+M` para modo mobile
3. Configure viewport:
   - **Width**: 390px
   - **Height**: 844px
   - **Device**: iPhone 13
   - **Device Scale Factor**: 3
   - **Touch**: Habilitado

**Ou via Console:**

```javascript
// Configurar viewport programaticamente
Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 390 });
Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 844 });
```

### 4. Abrir DevTools para Monitoramento

**Atalho**: `F12` ou `Ctrl+Shift+I`

**Abas importantes:**

- **Console**: Erros, warnings, logs
- **Network**: Requisições, tempo de resposta
- **Performance**: FPS, memória, renderização
- **Accessibility**: Árvore de acessibilidade
- **Lighthouse**: Auditoria de performance e acessibilidade

---

## 📱 Telas para Testar

### Navegação Principal

1. **Onboarding** (`/onboarding`)
   - Tour das funcionalidades
   - Slides de apresentação
   - Navegação entre slides
   - Botão de completar onboarding
   - Integração com AsyncStorage

2. **Home** (`/` ou `/home`)
   - Renderização inicial
   - Componentes principais
   - Interações básicas
   - Navegação para outras telas

3. **Chat** (`/chat`)
   - Input de mensagem
   - Envio de mensagem
   - Resposta da NAT-IA
   - Scroll de mensagens
   - Integração com Supabase
   - Histórico de conversas

4. **Habits** (`/habits`)
   - Lista de hábitos
   - Criação de hábito
   - Marcação de conclusão
   - Scroll e interações
   - Estatísticas de hábitos

5. **Content** (`/content`)
   - Lista de conteúdo
   - Visualização de artigo
   - Navegação entre conteúdos
   - Filtros e busca

6. **Profile** (`/profile`)
   - Dados do usuário
   - Configurações
   - Logout
   - Edição de perfil

7. **Daily Plan** (`/daily-plan`)
   - Plano diário personalizado
   - Tarefas e atividades
   - Progresso do dia

8. **Content Detail** (`/content/:contentId`)
   - Visualização completa de artigo
   - Navegação de volta
   - Compartilhamento

---

## 🔍 Checklist de Monitoramento

### Console (F12 → Console)

- [ ] **Erros JavaScript**: Verificar erros vermelhos
- [ ] **Warnings**: Verificar avisos amarelos
- [ ] **Logs**: Verificar logs de debug
- [ ] **Network errors**: Verificar erros de rede

**Filtros úteis:**

- `Errors only`: Apenas erros
- `Warnings`: Apenas warnings
- `Info`: Apenas informações

### Network (F12 → Network)

- [ ] **Requisições ao Supabase**: Verificar chamadas à API
- [ ] **Tempo de resposta**: Verificar latência
- [ ] **Status codes**: Verificar 200, 400, 500, etc.
- [ ] **Payload**: Verificar dados enviados/recebidos
- [ ] **Edge Functions**: Verificar chamadas às funções

**Filtros úteis:**

- `XHR`: Apenas requisições AJAX
- `Fetch`: Apenas fetch requests
- `WS`: WebSocket connections

### Performance (F12 → Performance)

- [ ] **FPS**: Deve ser 60fps constante
- [ ] **Memory**: Verificar vazamentos de memória
- [ ] **Render time**: Tempo de renderização
- [ ] **Script time**: Tempo de execução de scripts
- [ ] **Layout time**: Tempo de layout

**Como gravar:**

1. Clique em "Record" (círculo vermelho)
2. Interaja com o app
3. Pare a gravação
4. Analise o relatório

### Accessibility (F12 → Accessibility)

- [ ] **Árvore de acessibilidade**: Verificar estrutura
- [ ] **Labels**: Verificar labels descritivos
- [ ] **Roles**: Verificar roles corretos
- [ ] **Contraste**: Verificar contraste de cores (4.5:1+)

---

## 📸 Captura de Screenshots

### Atalho do Cursor

- **Screenshot**: `Ctrl+Shift+U`

### Via DevTools

1. Abra DevTools (F12)
2. Pressione `Ctrl+Shift+P` (Command Palette)
3. Digite "Capture screenshot"
4. Escolha opção desejada:
   - **Capture screenshot**: Tela visível
   - **Capture full size screenshot**: Tela completa
   - **Capture node screenshot**: Elemento específico

### Quando Capturar

- ❌ **Erros visuais**: Layout quebrado, elementos desalinhados
- ❌ **Erros de renderização**: Componentes não renderizados
- ❌ **Problemas de responsividade**: Layout em tamanhos diferentes
- ❌ **Problemas de acessibilidade**: Contraste, tamanhos
- ❌ **Problemas de performance**: Lag, travamentos

**Localização dos screenshots**: `.cursor/agents/reports/screenshots/`

---

## 🔄 Hot Reload

### Como Funciona

1. **Mantenha o browser aberto** durante desenvolvimento
2. **Faça mudanças no código**
3. **Salve o arquivo** (Ctrl+S)
4. **Observe atualizações** em tempo real

### Monitorar Hot Reload

- ✅ **Mudanças aparecem instantaneamente**
- ✅ **Estado preservado** (se aplicável)
- ❌ **Erros de hot reload** aparecem no console
- ❌ **Falhas de atualização** aparecem como erros

### Troubleshooting

**Se hot reload não funcionar:**

1. Verifique console para erros
2. Recarregue a página manualmente (F5)
3. Limpe cache do browser
4. Reinicie o Metro bundler (`pnpm dev`)

---

## 📊 Documentação de Problemas

### Template de Documentação

```markdown
## Problema: [Título]

**Severidade**: [Crítico (5) | Alto (4) | Médio (3) | Baixo (2) | Info (1)]

**Tela**: [Nome da tela]

**Descrição**: [Descrição detalhada do problema]

**Passos para reproduzir**:

1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Comportamento esperado**: [O que deveria acontecer]

**Comportamento atual**: [O que está acontecendo]

**Screenshot**: [Link ou caminho do screenshot]

**Console errors**: [Erros do console]

**Network errors**: [Erros de rede]

**Performance**: [Métricas de performance se aplicável]

**Acessibilidade**: [Problemas de acessibilidade se aplicável]
```

### Exemplo

```markdown
## Problema: Botão de enviar não funciona

**Severidade**: Alto (4)

**Tela**: Chat (/chat)

**Descrição**: O botão de enviar mensagem não responde ao clique

**Passos para reproduzir**:

1. Abrir tela de Chat
2. Digitar mensagem no input
3. Clicar no botão "Enviar"

**Comportamento esperado**: Mensagem deve ser enviada e aparecer na lista

**Comportamento atual**: Nada acontece ao clicar no botão

**Screenshot**: `.cursor/agents/reports/screenshots/chat-button-issue.png`

**Console errors**:
```

Error: Cannot read property 'sendMessage' of undefined
at ChatScreen.sendMessage (ChatScreen.tsx:45)

```

**Network errors**: Nenhuma requisição é feita ao clicar no botão

**Performance**: N/A

**Acessibilidade**: Botão não tem accessibilityLabel
```

---

## 🎯 Configuração Automática

### Script PowerShell para Abrir Browser

Crie um atalho ou execute diretamente:

```powershell
# Do diretório raiz do projeto
.\.cursor\agents\scripts\abrir-browser.ps1
```

**O script faz**:

- ✅ Verifica se porta 8081 está ativa
- ✅ Abre browser em `http://localhost:8081`
- ✅ Mostra próximos passos (viewport, monitoramento)

### Viewport iPhone 13

**Configuração manual (DevTools)**:

1. Abra DevTools (F12)
2. Pressione `Ctrl+Shift+M` (modo mobile)
3. Selecione "iPhone 13" ou configure manualmente:
   - Width: 390px
   - Height: 844px
   - Device Scale Factor: 3

**Configuração via console**:

```javascript
// Executar no console do browser (F12)
Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 390 });
Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 844 });
navigator.__defineGetter__(
  'userAgent',
  () =>
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
);
```

**JSON de referência**:

```json
{
  "viewport": {
    "width": 390,
    "height": 844,
    "deviceScaleFactor": 3,
    "isMobile": true,
    "hasTouch": true
  },
  "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
}
```

### DevTools Config

```json
{
  "devtools": {
    "enabled": true,
    "autoOpen": false,
    "position": "bottom",
    "tabs": ["console", "network", "performance", "accessibility"]
  }
}
```

### Screenshot Config

```json
{
  "screenshots": {
    "autoCapture": true,
    "onError": true,
    "onWarning": false,
    "format": "png",
    "quality": 90,
    "savePath": ".cursor/agents/reports/screenshots/"
  }
}
```

---

## ⚡ Atalhos Rápidos

### Browser

- **Abrir (Cursor integrado)**: `Ctrl+Shift+B`
- **Abrir (Browser padrão)**: `.\.cursor\agents\scripts\abrir-browser.ps1`
- **Fechar**: `Ctrl+Shift+W`
- **Nova aba**: `Ctrl+Shift+N`
- **Screenshot**: `Ctrl+Shift+U`

### DevTools

- **Abrir/Fechar**: `F12` ou `Ctrl+Shift+I`
- **Modo Mobile**: `Ctrl+Shift+M`
- **Command Palette**: `Ctrl+Shift+P`
- **Console**: `Ctrl+Shift+J`
- **Network**: `Ctrl+Shift+E`
- **Performance**: `Ctrl+Shift+P` → "Performance"

### Navegação

- **Recarregar**: `F5` ou `Ctrl+R`
- **Recarregar sem cache**: `Ctrl+Shift+R` ou `Ctrl+F5`
- **Voltar**: `Alt+←`
- **Avançar**: `Alt+→`

---

## 📝 Relatório Final

Após completar a visualização, salve o relatório em:

`.cursor/agents/reports/BROWSER_VISUALIZATION_REPORT.md`

**Estrutura do relatório:**

1. **Resumo Executivo**: Visão geral dos problemas encontrados
2. **Problemas Críticos**: Severidade 5
3. **Problemas Altos**: Severidade 4
4. **Problemas Médios**: Severidade 3
5. **Problemas Baixos**: Severidade 2
6. **Sugestões**: Severidade 1
7. **Screenshots**: Links para screenshots
8. **Métricas**: Performance, acessibilidade, etc.

---

## ✅ Checklist Completo

### Antes de Começar

- [ ] App está rodando (`pnpm dev` ou verificar porta 8081)
- [ ] Browser integrado habilitado (Ctrl+Shift+B) ou browser padrão aberto
- [ ] DevTools disponível (F12)
- [ ] Viewport configurado (iPhone 13: 390x844)
- [ ] Diretório de screenshots existe (`.cursor/agents/reports/screenshots/`)

**Verificar app rodando**:

```powershell
netstat -ano | findstr :8081
```

Se não estiver rodando:

```powershell
cd apps/mobile
pnpm dev
```

### Durante Visualização

- [ ] Console monitorado (erros, warnings)
- [ ] Network monitorado (requisições, latência)
- [ ] Performance monitorado (FPS, memória)
- [ ] Todas as telas testadas
- [ ] Interações testadas
- [ ] Screenshots capturados de problemas
- [ ] Hot reload testado

### Após Visualização

- [ ] Problemas documentados
- [ ] Screenshots salvos
- [ ] Relatório criado
- [ ] Issues criados (se necessário)

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0

