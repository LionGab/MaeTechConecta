# 🤖 Agente de Automação do Browser

**Agente automatizado para navegação, detecção e correção de erros no browser integrado**

---

## 🎯 Objetivo

Este agente automatiza:
1. ✅ Navegação entre todas as telas do app
2. ✅ Detecção de erros (console, visual, performance)
3. ✅ Correção automática de erros identificados
4. ✅ Geração de relatório completo

---

## 🚀 Como Usar

### Via Composer

```
Ctrl+I → "Execute o agente de browser automation para navegar por todas as telas, identificar erros e corrigi-los"
```

### Via Terminal

```bash
# Executar agente de browser automation
pnpm browser:automation
```

### Via Command Palette

```
Ctrl+Shift+P → "Cursor: Browser Automation Agent"
```

---

## 📋 Telas a Navegar

### 1. Onboarding
- **Rota**: `/onboarding`
- **Elementos**: Botões de navegação, slides
- **Ações**: Navegar pelos slides, completar onboarding

### 2. Home (Tab Navigator)
- **Rota**: `/home`
- **Elementos**: Cards, botões, lista de conteúdo
- **Ações**: Scroll, clicar em cards, navegar para outras tabs

### 3. Chat
- **Rota**: `/chat`
- **Elementos**: Input de mensagem, lista de mensagens, botão enviar
- **Ações**: Enviar mensagem, scroll na lista, verificar histórico

### 4. Hábitos
- **Rota**: `/habits`
- **Elementos**: Lista de hábitos, checkboxes, botões
- **Ações**: Marcar hábitos, adicionar hábito, scroll

### 5. Conteúdo
- **Rota**: `/content`
- **Elementos**: Lista de conteúdo, cards, botões
- **Ações**: Scroll, clicar em conteúdo, navegar para detalhes

### 6. Perfil
- **Rota**: `/profile`
- **Elementos**: Informações do usuário, botões de ação
- **Ações**: Visualizar perfil, editar perfil, configurações

### 7. Plano Diário
- **Rota**: `/daily-plan`
- **Elementos**: Cards de atividades, botões
- **Ações**: Scroll, marcar atividades, navegar

### 8. Detalhes de Conteúdo
- **Rota**: `/content/:contentId`
- **Elementos**: Conteúdo completo, botões
- **Ações**: Visualizar conteúdo, voltar

---

## 🔍 Detecção de Erros

### Console Errors
- Erros JavaScript
- Warnings
- Network errors
- Unhandled promises

### Visual Errors
- Elementos não renderizados
- Layout quebrado
- Imagens não carregadas
- Textos cortados

### Performance Errors
- Tempo de carregamento > 3s
- Memory leaks
- Re-renders excessivos
- Scroll lento

### Acessibilidade Errors
- Elementos sem accessibilityLabel
- Contraste inadequado
- Área de toque < 44x44px
- Navegação por teclado quebrada

---

## 🛠️ Correção Automática

### Erros Corrigíveis Automaticamente

1. **Console Errors**
   - Adicionar try-catch
   - Adicionar validações
   - Corrigir imports

2. **Visual Errors**
   - Ajustar estilos
   - Corrigir layouts
   - Adicionar fallbacks

3. **Performance Errors**
   - Adicionar memoização
   - Otimizar renders
   - Lazy loading

4. **Acessibilidade Errors**
   - Adicionar accessibilityLabel
   - Ajustar contraste
   - Corrigir áreas de toque

### Erros que Requerem Intervenção Manual

- Erros de lógica de negócio
- Erros de integração com APIs
- Erros de autenticação
- Erros de permissões

---

## 📊 Relatório

O agente gera um relatório completo em:

```
.cursor/agents/reports/browser-automation-report.md
```

### Conteúdo do Relatório

1. **Resumo Executivo**
   - Total de telas navegadas
   - Total de erros encontrados
   - Total de erros corrigidos
   - Total de erros pendentes

2. **Detalhes por Tela**
   - Status da navegação
   - Erros encontrados
   - Correções aplicadas
   - Screenshots

3. **Erros por Categoria**
   - Console errors
   - Visual errors
   - Performance errors
   - Acessibilidade errors

4. **Recomendações**
   - Melhorias sugeridas
   - Próximos passos
   - Ações pendentes

---

## ⚙️ Configuração

### Configurações do Agente

```json
{
  "browserAutomation": {
    "enabled": true,
    "headless": false,
    "screenshotOnError": true,
    "autoFix": true,
    "timeout": 30000,
    "waitForTimeout": 5000,
    "viewport": {
      "width": 375,
      "height": 812,
      "deviceScaleFactor": 2
    }
  }
}
```

### Configurações de Navegação

```json
{
  "navigation": {
    "screens": [
      "Onboarding",
      "Home",
      "Chat",
      "Habits",
      "Content",
      "Profile",
      "DailyPlan",
      "ContentDetail"
    ],
    "deepLinks": true,
    "waitForAnimations": true,
    "scrollDelay": 500
  }
}
```

### Configurações de Detecção

```json
{
  "errorDetection": {
    "consoleErrors": true,
    "visualErrors": true,
    "performanceErrors": true,
    "accessibilityErrors": true,
    "networkErrors": true
  }
}
```

### Configurações de Correção

```json
{
  "autoFix": {
    "enabled": true,
    "consoleErrors": true,
    "visualErrors": true,
    "performanceErrors": true,
    "accessibilityErrors": true,
    "createBackup": true
  }
}
```

---

## 📝 Exemplo de Uso

### Executar Navegação Completa

```
Execute o agente de browser automation:
1. Navegue por todas as telas do app
2. Identifique todos os erros
3. Corrija automaticamente os erros possíveis
4. Gere relatório completo
```

### Executar Navegação Específica

```
Execute o agente de browser automation apenas na tela de Chat:
1. Navegue para /chat
2. Identifique erros
3. Corrija automaticamente
4. Gere relatório
```

### Executar Apenas Detecção

```
Execute o agente de browser automation apenas para detectar erros:
1. Navegue por todas as telas
2. Identifique todos os erros
3. Gere relatório (sem correção)
```

---

## 🔧 Troubleshooting

### Browser não abre

1. Verifique se o browser integrado está habilitado
2. Verifique as configurações em `.cursor/settings.json`
3. Reinicie o Cursor

### Navegação falha

1. Verifique se o app está rodando
2. Verifique as rotas em `src/navigation/`
3. Verifique os deep links configurados

### Erros não detectados

1. Verifique as configurações de detecção
2. Verifique os logs do console
3. Verifique os screenshots gerados

### Correções não aplicadas

1. Verifique se auto-fix está habilitado
2. Verifique os logs de correção
3. Verifique se há erros bloqueantes

---

## 📚 Referências

- **Browser Integrado**: `docs/CURSOR_CONFIGURACOES_OTIMIZADAS.md`
- **Navegação**: `src/navigation/`
- **Telas**: `src/screens/`
- **Configurações**: `.cursor/composer-config.json`

---

**Última atualização**: Janeiro 2025  
**Versão do Agente**: 1.0.0

