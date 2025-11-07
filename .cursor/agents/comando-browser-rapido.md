# ⚡ Comando Browser Rápido - Copiar e Colar

## 🚀 Comando Principal (Copiar e Colar)

### Visualização Ao Vivo Completa

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

---

## 📋 Comandos Alternativos

### Comando Curto (Apenas Abrir)

```
Abra o browser integrado (Ctrl+Shift+B) e acesse http://localhost:8081 para visualizar o app ao vivo.
```

---

### Comando com Debug

```
Abra o browser integrado (Ctrl+Shift+B), acesse http://localhost:8081, abra DevTools (F12), configure viewport para iPhone 13 (390x844), e monitore console, network e performance enquanto navega pelo app.
```

---

### Comando para Tela Específica

```
Abra o browser integrado (Ctrl+Shift+B), acesse http://localhost:8081/chat, e teste todas as funcionalidades da tela de chat monitorando console e network para erros.
```

**Telas disponíveis para testar:**

- `/` ou `/home` - Home
- `/onboarding` - Onboarding
- `/chat` - Chat
- `/habits` - Hábitos
- `/content` - Conteúdo
- `/profile` - Perfil
- `/daily-plan` - Plano Diário
- `/component-validation` - Validação de Componentes

---

## ⚡ Atalhos

- **Abrir Browser**: `Ctrl+Shift+B`
- **Screenshot**: `Ctrl+Shift+U`
- **Nova Aba**: `Ctrl+Shift+N`
- **Fechar Browser**: `Ctrl+Shift+W`
- **DevTools**: `F12` ou `Ctrl+Shift+I`

---

## 🔗 URLs

- **Expo App**: http://localhost:8081
- **Expo DevTools**: http://localhost:19002 (pode variar, verifique no terminal do Expo)
- **Metro Bundler UI**: http://localhost:8081/\_debugger-ui

---

## ✅ Pré-requisitos

1. App rodando: `pnpm dev` (na raiz do projeto)
2. Browser integrado habilitado
3. Porta 8081 disponível

---

## 🐛 Troubleshooting Rápido

### App não carrega

- Verifique se `pnpm dev` está rodando
- Confirme que a porta 8081 está livre: `netstat -ano | findstr ":8081"`
- Tente limpar cache: `pnpm -C apps/mobile dev:clear` ou `cd apps/mobile && pnpm dev:clear`

### Browser não abre

- Use atalho: `Ctrl+Shift+B`
- Ou comando: `cursor.browser.open`
- Verifique se o browser integrado está habilitado nas configurações

### Viewport não funciona

- Abra DevTools (F12)
- Use Device Toolbar (Ctrl+Shift+M)
- Configure manualmente: 390x844

---

## 🔗 Deep Links

O app suporta deep links:

- `nossa-maternidade://onboarding` - Onboarding
- `nossa-maternidade://chat` - Chat
- `nossa-maternidade://habits` - Hábitos
- `nossa-maternidade://content` - Conteúdo
- `nossa-maternidade://profile` - Perfil
- `nossa-maternidade://daily-plan` - Plano Diário
- `nossa-maternidade://component-validation` - Validação de Componentes

Teste no browser: `nossa-maternidade://chat`

---

**Use este comando no Composer (`Ctrl+I`) para visualização rápida!**
