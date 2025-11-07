# 🤖 Agente de Automação do Browser - Guia Completo

**Agente automatizado para navegação, detecção e correção de erros no browser integrado**

---

## 🚀 Quick Start

### Executar via Terminal

```bash
pnpm browser:automation
```

### Executar via Composer

```
Ctrl+I → "Execute o agente de browser automation para navegar por todas as telas, identificar erros e corrigi-los"
```

### Executar via Comando Personalizado

```
@browser-automation Execute navegação completa, detecção e correção de erros
```

---

## 📋 O Que o Agente Faz

### 1. Navegação Automática

O agente navega por todas as telas do app:

- ✅ **Onboarding** - Tela inicial de onboarding
- ✅ **Home** - Tela principal (Tab Navigator)
- ✅ **Chat** - Tela de chat com NathIA
- ✅ **Habits** - Tela de hábitos
- ✅ **Content** - Tela de conteúdo
- ✅ **Profile** - Tela de perfil
- ✅ **DailyPlan** - Tela de plano diário
- ✅ **ContentDetail** - Tela de detalhes de conteúdo

### 2. Detecção de Erros

O agente detecta erros em:

- 🔍 **Console Errors** - Erros JavaScript, warnings, unhandled promises
- 👁️ **Visual Errors** - Elementos não renderizados, layout quebrado, imagens não carregadas
- ⚡ **Performance Errors** - Tempo de carregamento > 3s, memory leaks, re-renders excessivos
- ♿ **Acessibilidade Errors** - Elementos sem accessibilityLabel, contraste inadequado, área de toque < 44x44px
- 🌐 **Network Errors** - Requisições falhadas, timeouts, erros de API

### 3. Correção Automática

O agente corrige automaticamente:

- ✅ **Console Errors** - Adiciona try-catch, validações, corrige imports
- ✅ **Visual Errors** - Ajusta estilos, corrige layouts, adiciona fallbacks
- ✅ **Performance Errors** - Adiciona memoização, otimiza renders, lazy loading
- ✅ **Acessibilidade Errors** - Adiciona accessibilityLabel, ajusta contraste, corrige áreas de toque

### 4. Geração de Relatório

O agente gera um relatório completo em:

```
.cursor/agents/reports/browser-automation-report.md
```

---

## 📊 Relatório Gerado

### Resumo Executivo

- Total de telas navegadas
- Total de erros encontrados
- Total de erros corrigidos
- Total de erros pendentes

### Detalhes por Tela

- Status da navegação
- Erros encontrados
- Correções aplicadas
- Screenshots

### Erros por Categoria

- Console errors
- Visual errors
- Performance errors
- Acessibilidade errors
- Network errors

### Recomendações

- Melhorias sugeridas
- Próximos passos
- Ações pendentes

---

## ⚙️ Configuração

### Configurações do Agente

As configurações estão em `.cursor/composer-config.json`:

```json
{
  "browser": {
    "automationAgent": {
      "enabled": true,
      "autoFix": true,
      "screenshotOnError": true,
      "generateReport": true,
      "screens": ["Onboarding", "Home", "Chat", "Habits", "Content", "Profile", "DailyPlan", "ContentDetail"],
      "errorDetection": {
        "console": true,
        "visual": true,
        "performance": true,
        "accessibility": true,
        "network": true
      },
      "autoFix": {
        "console": true,
        "visual": true,
        "performance": true,
        "accessibility": true
      }
    }
  }
}
```

### Personalizar Telas

Para adicionar ou remover telas, edite o array `screens` em `.cursor/composer-config.json`.

### Personalizar Detecção

Para habilitar ou desabilitar tipos de detecção, edite `errorDetection` em `.cursor/composer-config.json`.

### Personalizar Correção

Para habilitar ou desabilitar tipos de correção, edite `autoFix` em `.cursor/composer-config.json`.

---

## 🎯 Exemplos de Uso

### Navegação Completa

```bash
pnpm browser:automation
```

### Via Composer

```
Ctrl+I → "Execute o agente de browser automation para navegar por todas as telas, identificar erros e corrigi-los"
```

### Apenas Detecção (Sem Correção)

```
Ctrl+I → "Execute o agente de browser automation apenas para detectar erros sem correção automática"
```

### Tela Específica

```
Ctrl+I → "Execute o agente de browser automation apenas na tela de Chat"
```

### Apenas Performance

```
Ctrl+I → "Execute o agente de browser automation apenas para detectar erros de performance"
```

---

## 🔧 Troubleshooting

### Browser não abre

1. Verifique se o browser integrado está habilitado em `.cursor/settings.json`
2. Verifique as configurações do browser em `.cursor/composer-config.json`
3. Reinicie o Cursor

### Navegação falha

1. Verifique se o app está rodando (`pnpm dev`)
2. Verifique as rotas em `src/navigation/`
3. Verifique os deep links configurados em `src/navigation/linking.ts`

### Erros não detectados

1. Verifique as configurações de detecção em `.cursor/composer-config.json`
2. Verifique os logs do console
3. Verifique os screenshots gerados em `.cursor/agents/reports/screenshots/`

### Correções não aplicadas

1. Verifique se `autoFix` está habilitado em `.cursor/composer-config.json`
2. Verifique os logs de correção no relatório
3. Verifique se há erros bloqueantes que requerem intervenção manual

---

## 📚 Referências

- **Agente**: `.cursor/agents/browser-automation-agent.md`
- **Script**: `scripts/browser-automation-agent.ts`
- **Comando**: `.cursor/commands/browser-automation.md`
- **Configuração**: `.cursor/composer-config.json`
- **Navegação**: `src/navigation/`
- **Telas**: `src/screens/`

---

## ✅ Checklist

Antes de executar o agente:

- [ ] App está rodando (`pnpm dev`)
- [ ] Browser integrado está habilitado
- [ ] Configurações do agente estão corretas
- [ ] Rotas de navegação estão configuradas
- [ ] Deep links estão configurados

Após executar o agente:

- [ ] Relatório foi gerado
- [ ] Screenshots foram gerados
- [ ] Erros foram identificados
- [ ] Correções foram aplicadas (se habilitado)
- [ ] Relatório foi revisado

---

**Última atualização**: Janeiro 2025  
**Versão do Agente**: 1.0.0
