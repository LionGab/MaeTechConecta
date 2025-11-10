# 🚀 Contexto Rápido - Nossa Maternidade

## 📋 Últimas Mudanças

### ✅ Atualização de Pacotes (2024)
- **expo**: `54.0.22` → `54.0.23`
- **@types/jest**: `^30.0.0` → `29.5.14`
- **@sentry/react-native**: `^7.5.0` → `~7.2.0` (compatível com SDK 54)
- **Override adicionado**: `@sentry/browser: ^10.23.0` (resolve erro pnpm)

### ✅ Correção Shadows (React Native Web)
- **Problema**: Warning "shadow* style props are deprecated"
- **Solução**: Função `createShadowStyle()` em `src/theme/nathTheme.ts`
  - Web: usa `boxShadow` automaticamente
  - Mobile: mantém `shadow*` (React Native nativo)

## 🔧 Setup Rápido

```bash
# 1. Clone/pull
git pull origin main

# 2. Instalar dependências
pnpm install

# 3. Rodar app
pnpm dev
```

## 📦 Versões Atuais

- **expo**: `~54.0.23`
- **react-native**: `0.81.5`
- **react-native-web**: `0.21.2`
- **@sentry/react-native**: `~7.2.0`
- **@types/jest**: `29.5.14`

## 🎨 Tema

- Shadows agora suportam web automaticamente via `createShadowStyle()`
- Arquivo: `src/theme/nathTheme.ts`

## ⚠️ Warnings Conhecidos

1. **Touch events**: Warning "Cannot record touch end without a touch start"
   - Não crítico, geralmente não quebra funcionalidade
   - Pode ser causado por re-renders durante gestos

2. **Deprecated packages**: Alguns warnings de pacotes deprecados (não críticos)

## 🔗 Arquivos Importantes

- `apps/mobile/package.json` - Dependências mobile
- `package.json` - Dependências raiz + overrides
- `src/theme/nathTheme.ts` - Tema com shadows corrigidas
- `.env.local` - Variáveis de ambiente (não commitado)

## 💡 Dicas Rápidas

- **Problemas de instalação**: Limpar cache `pnpm store prune`
- **Shadows no web**: Agora automático via `createShadowStyle()`
- **Versões incompatíveis**: Verificar `package.json` para overrides

