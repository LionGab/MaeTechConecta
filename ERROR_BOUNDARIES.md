# Error Boundaries - Nossa Maternidade

## Onde Implementar

### 1. App Root (`App.tsx`)

```typescript
import React from 'react';
import { ErrorBoundary } from './src/shared/components/ErrorBoundary';
import { AppNavigator } from './src/navigation/index';
import { initSentry } from './src/services/sentry';

export default function App() {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      initSentry();
    }
  }, []);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Erro capturado:', error, errorInfo);
        // Sentry capturará automaticamente
      }}
    >
      <AppNavigator />
    </ErrorBoundary>
  );
}
```

### 2. Screens Críticas

```typescript
// src/screens/ChatScreen.tsx
import { ErrorBoundary } from '../shared/components/ErrorBoundary';

export function ChatScreen() {
  return (
    <ErrorBoundary
      fallback={<ChatErrorFallback />}
      onError={(error) => {
        // Log específico para chat
        console.error('Erro no chat:', error);
      }}
    >
      <ChatContent />
    </ErrorBoundary>
  );
}
```

## Implementação

### ErrorBoundary Component

```typescript
// src/shared/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.props.onError?.(error, errorInfo);
    // Sentry captura automaticamente se inicializado
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <View style={{ padding: 20 }}>
          <Text>Ops! Algo deu errado.</Text>
          <Button title="Tentar novamente" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }
    return this.props.children;
  }
}
```

## Edge Functions

### Try-Catch em Todas as Functions

```typescript
// supabase/functions/nathia-chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    // ... lógica da função
    return new Response(JSON.stringify({ response: '...' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na Edge Function:', error);
    // Sentry captura se configurado
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

## Índices no Banco

### Criar Índices Essenciais

```sql
-- Supabase SQL Editor
-- Índices para performance

-- User Profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_type ON user_profiles(type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_risk_level ON user_profiles(risk_level);

-- Chat Messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_risk_level ON chat_messages(risk_level);

-- Conversation History
CREATE INDEX IF NOT EXISTS idx_conversation_history_user_id ON conversation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_history_updated_at ON conversation_history(updated_at DESC);
```

## Migração NAT-AI para lib Central

### Estrutura Atual

```
src/lib/nat-ai/
├── system-prompt.ts
├── guardrails.ts
├── risk-analyzer.ts
├── context-manager.ts
└── team-notifier.ts
```

### Imports Atualizados

```typescript
// Antes (código legado)
import { getRiskLevel } from '../lib/nat-ai/guardrails';
import { analyzeRisk } from '../lib/nat-ai/risk-analyzer';

// Depois (código consolidado)
import { getRiskLevel, analyzeRisk } from '@/lib/nat-ai';
```

### Index Central

```typescript
// src/lib/nat-ai/index.ts
export * from './system-prompt';
export * from './guardrails';
export * from './risk-analyzer';
export * from './context-manager';
export * from './team-notifier';
```

## Orquestração CI/CD

### Fluxo Completo

1. **Push/PR** → CI workflow
   - Lint
   - Type check
   - Tests + Coverage (≥70%)
   - Security scan

2. **Push main** → Build workflow
   - EAS build Android
   - EAS build iOS

3. **Tag v*.*.\*** → Deploy workflow
   - EAS submit Android/iOS
   - Deploy Edge Functions
   - Sentry release

### Scripts Auxiliares

```bash
# scripts/validate-local.sh
#!/bin/bash
npm run lint && npm run typecheck && npm run test:coverage && npm run test:coverage:check
```
