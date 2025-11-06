# 🌐 Comando Browser - Visualização Ao Vivo e Imediata

## 🚀 Quick Start

### Abrir Browser e Visualizar App ao Vivo

**Execute no Composer (`Ctrl+I`):**

```
Abra o browser integrado e visualize o app ao vivo:
1. Abra o browser (Ctrl+Shift+B ou comando cursor.browser.open)
2. Navegue para http://localhost:8081 (se o app estiver rodando)
3. Ou acesse o Expo DevTools em http://localhost:19002
4. Visualize o app em tempo real
5. Monitore erros no console do browser
6. Capture screenshots se necessário (Ctrl+Shift+U)
7. Teste interações e navegação
8. Verifique performance e acessibilidade

CONFIGURAÇÃO:
- Viewport: iPhone 13 (390x844)
- Device: Mobile com touch
- DevTools: Habilitado
- Screenshots: Automáticos em erros

AÇÕES:
- Abrir DevTools automaticamente
- Monitorar console para erros
- Capturar tela inicial
- Testar scroll e interações
- Verificar responsividade
```

---

## 📋 Comandos Prontos

### Comando 1: Visualização Básica

```
Abra o browser integrado do Cursor (Ctrl+Shift+B) e:
1. Acesse http://localhost:8081 para ver o app Expo
2. Ou acesse http://localhost:19002 para Expo DevTools
3. Visualize o app em tempo real
4. Monitore o console para erros
5. Teste interações básicas (scroll, toque, navegação)
```

---

### Comando 2: Visualização com Debug

```
Abra o browser integrado e visualize o app com debug completo:

1. Abra browser (Ctrl+Shift+B)
2. Acesse http://localhost:8081
3. Abra DevTools (F12 ou Ctrl+Shift+I)
4. Ative modo mobile (Ctrl+Shift+M)
5. Configure viewport para iPhone 13 (390x844)
6. Monitore:
   - Console (erros, warnings)
   - Network (requisições, tempo de resposta)
   - Performance (FPS, memória)
   - Acessibilidade (elementos, contraste)
7. Teste todas as telas do app
8. Capture screenshots de problemas
```

---

### Comando 3: Visualização Multi-Tela

```
Abra o browser e navegue por todas as telas do app:

1. Abra browser (Ctrl+Shift+B)
2. Acesse http://localhost:8081
3. Navegue para cada tela:
   - Home (/)
   - Chat (/chat)
   - Habits (/habits)
   - Content (/content)
   - Profile (/profile)
4. Para cada tela:
   - Verifique renderização correta
   - Teste interações
   - Verifique erros no console
   - Capture screenshot
   - Verifique performance
5. Documente problemas encontrados
```

---

### Comando 4: Visualização com Supabase

```
Abra o browser e teste integração com Supabase:

1. Abra browser (Ctrl+Shift+B)
2. Acesse http://localhost:8081
3. Abra DevTools → Network
4. Teste fluxos que usam Supabase:
   - Login/Autenticação
   - Chat (NAT-IA)
   - Carregar dados do perfil
   - Salvar hábitos
5. Verifique:
   - Requisições ao Supabase
   - Tempo de resposta
   - Erros de autenticação
   - Dados retornados
6. Capture screenshots de problemas
```

---

### Comando 5: Visualização Mobile-First

```
Abra o browser e teste visualização mobile-first:

1. Abra browser (Ctrl+Shift+B)
2. Configure viewport para iPhone 13 (390x844)
3. Acesse http://localhost:8081
4. Teste:
   - Layout responsivo
   - Áreas de toque (mínimo 44x44px)
   - Scroll suave
   - Animações
   - Dark mode (se aplicável)
5. Verifique acessibilidade:
   - Contraste de cores (4.5:1+)
   - Tamanho de texto (mínimo 16px)
   - Labels acessíveis
6. Teste em diferentes tamanhos:
   - iPhone SE (375x667)
   - iPhone 13 (390x844)
   - iPhone 14 Pro Max (430x932)
```

---

## 🎯 Comandos Especializados

### Visualização de Tela Específica

```
Abra o browser e visualize especificamente a tela de Chat:

1. Abra browser (Ctrl+Shift+B)
2. Acesse http://localhost:8081/chat
3. Teste funcionalidades:
   - Enviar mensagem
   - Receber resposta da NAT-IA
   - Scroll de mensagens
   - Input de texto
   - Botão enviar
4. Monitore:
   - Console para erros
   - Network para chamadas à Edge Function
   - Performance para renderização
5. Capture screenshots de problemas
```

---

### Visualização com Hot Reload

```
Abra o browser e monitore hot reload em tempo real:

1. Abra browser (Ctrl+Shift+B)
2. Acesse http://localhost:8081
3. Mantenha o browser aberto
4. Faça mudanças no código
5. Salve o arquivo (Ctrl+S)
6. Observe:
   - Hot reload automático
   - Mudanças aparecendo instantaneamente
   - Estado preservado (se aplicável)
   - Erros de hot reload (se houver)
7. Documente problemas de hot reload
```

---

### Visualização de Performance

```
Abra o browser e monitore performance do app:

1. Abra browser (Ctrl+Shift+B)
2. Acesse http://localhost:8081
3. Abra DevTools → Performance
4. Grave sessão de uso:
   - Navegação entre telas
   - Interações (scroll, toque)
   - Carregamento de dados
5. Analise:
   - FPS (deve ser 60fps)
   - Tempo de carregamento
   - Memory leaks
   - Re-renders desnecessários
6. Capture relatório de performance
```

---

## ⚡ Atalhos Rápidos

### Abrir Browser
- **Atalho**: `Ctrl+Shift+B`
- **Comando**: `cursor.browser.open`
- **Via Composer**: `Ctrl+I` → "Abra o browser"

### Screenshot
- **Atalho**: `Ctrl+Shift+U`
- **Comando**: `cursor.browser.screenshot`

### Nova Aba
- **Atalho**: `Ctrl+Shift+N`
- **Comando**: `cursor.browser.newTab`

### Fechar Browser
- **Atalho**: `Ctrl+Shift+W`
- **Comando**: `cursor.browser.close`

---

## 🔧 Configuração do Browser

O browser está configurado para visualização mobile-first:

```json
{
  "viewport": {
    "width": 390,
    "height": 844,
    "deviceScaleFactor": 3,
    "isMobile": true,
    "hasTouch": true
  },
  "userAgent": "iPhone 13",
  "devtools": true,
  "screenshotOnFailure": true
}
```

---

## 📊 URLs Úteis

### Desenvolvimento
- **Expo App**: `http://localhost:8081`
- **Expo DevTools**: `http://localhost:19002`
- **Metro Bundler**: `http://localhost:8081/_debugger-ui`

### Produção
- **Supabase Dashboard**: `https://supabase.com/dashboard`
- **Sentry**: `https://sentry.io/`

---

## ✅ Checklist de Visualização

Antes de visualizar:
- [ ] App está rodando (`pnpm dev`)
- [ ] Browser integrado habilitado
- [ ] DevTools disponível

Durante visualização:
- [ ] Verificar console para erros
- [ ] Testar todas as telas
- [ ] Verificar responsividade
- [ ] Testar interações
- [ ] Capturar screenshots de problemas
- [ ] Monitorar performance

Após visualização:
- [ ] Documentar problemas encontrados
- [ ] Salvar screenshots relevantes
- [ ] Criar issues para correções necessárias

---

## 🎯 Dicas

1. **Mantenha o browser aberto** durante desenvolvimento para ver mudanças em tempo real
2. **Use DevTools** para debug profundo de problemas
3. **Capture screenshots** quando encontrar problemas visuais
4. **Monitore console** para erros JavaScript
5. **Teste em diferentes viewports** para garantir responsividade
6. **Use Network tab** para debug de requisições
7. **Use Performance tab** para otimização

---

## 🚀 Exemplo Completo de Uso

```
Abra o browser integrado do Cursor e execute visualização completa:

1. PRÉ-REQUISITO: Certifique-se que o app está rodando (pnpm dev)
2. Abra browser: Ctrl+Shift+B ou comando cursor.browser.open
3. Acesse: http://localhost:8081
4. Configure viewport para iPhone 13 (390x844)
5. Abra DevTools (F12)
6. Navegue por todas as telas:
   - Home (/)
   - Chat (/chat)
   - Habits (/habits)
   - Content (/content)
   - Profile (/profile)
7. Para cada tela:
   - Verifique renderização
   - Teste interações
   - Monitore console
   - Verifique network
   - Capture screenshots se necessário
8. Documente problemas encontrados
9. Salve relatório em .cursor/agents/reports/BROWSER_VISUALIZATION_REPORT.md
```

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0

