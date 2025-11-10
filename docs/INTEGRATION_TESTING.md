# Testes de Integração - Nossa Maternidade

## Visão Geral

Testes de integração para validar o funcionamento completo do sistema: app + Edge Functions + sistema de IA.

## Fluxos Testados

### 1. Chat Flow Completo

1. Usuário envia mensagem
2. App chama Edge Function `nathia-chat`
3. Moderation Service verifica conteúdo
4. Guardrails bloqueia conselhos médicos (se necessário)
5. Risk Analyzer analisa risco emocional
6. Gemini gera resposta empática
7. Resposta salva no Supabase
8. Resposta retornada ao app

### 2. Moderation Flow

1. Mensagem passa por Safety Settings (Gemini)
2. Análise contextual (Gemini)
3. Flag Queue (se necessário)
4. Ação: allow, block ou flag

### 3. Risk Detection Flow

1. Mensagem analisada por Risk Analyzer
2. Classificação de risco (0-10)
3. Flags detectados
4. Recursos sugeridos
5. Resposta de intervenção (se risco ≥ 7)

## Como Executar

```bash
# Executar todos os testes de integração
npm test __tests__/integration/

# Executar teste específico
npm test __tests__/integration/chat-flow.test.ts
```

## Estrutura de Testes

```
__tests__/
├── integration/
│   ├── chat-flow.test.ts          # Fluxo de chat completo
│   ├── edge-functions.test.ts     # Testes das Edge Functions
│   └── ai-system.test.ts          # Testes do sistema de IA
└── unit/
    └── ...                         # Testes unitários
```

## Cobertura Esperada

- ✅ Chat flow completo
- ✅ Moderation em 3 camadas
- ✅ Risk detection
- ✅ Guardrails
- ✅ Context management
- ✅ Edge Functions individuais

