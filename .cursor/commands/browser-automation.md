# 🌐 Browser Automation Agent

**Comando para executar o agente de automação do browser**

## Uso

```
@browser-automation Execute navegação completa, detecção e correção de erros
```

## Descrição

Este comando executa o agente de automação do browser que:

1. ✅ Navega por todas as telas do app
2. ✅ Detecta erros (console, visual, performance, acessibilidade)
3. ✅ Corrige automaticamente os erros possíveis
4. ✅ Gera relatório completo

## Telas Navegadas

- Onboarding
- Home
- Chat
- Habits
- Content
- Profile
- DailyPlan
- ContentDetail

## Relatório

O relatório é salvo em:

```
.cursor/agents/reports/browser-automation-report.md
```

## Exemplos

### Navegação Completa

```
@browser-automation Execute navegação completa
```

### Apenas Detecção

```
@browser-automation Execute apenas detecção de erros sem correção
```

### Tela Específica

```
@browser-automation Execute apenas na tela de Chat
```
