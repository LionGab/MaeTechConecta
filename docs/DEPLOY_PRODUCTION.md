# Deploy em Produção - Nossa Maternidade

## Release Train

### Versionamento

- **Formato**: `vMAJOR.MINOR.PATCH`
- **Tags**: `v1.0.0`, `v1.1.0`, `v2.0.0`
- **Trigger**: Tag `v*.*.*` dispara deploy automático

### Processo

1. **Versionar**:

   ```bash
   npm version patch|minor|major
   git push --tags
   ```

2. **Build Automático**:
   - GitHub Actions detecta tag
   - EAS build Android + iOS
   - EAS submit para tracks internas
   - Edge Functions deployadas

3. **Validação**:
   - Testar em staging
   - Validar Edge Functions
   - Verificar logs Sentry

## EAS Build

### Configuração

Arquivo `eas.json`:

```json
{
  "build": {
    "production": {
      "android": { "buildType": "app-bundle" },
      "ios": { "bundleIdentifier": "com.nossa.maternidade" }
    }
  }
}
```

### Builds

```bash
# Android
npx eas build --platform android --profile production

# iOS
npx eas build --platform ios --profile production
```

### Submit

```bash
# Android
npx eas submit --platform android

# iOS
npx eas submit --platform ios
```

## Edge Functions

### Deploy

```bash
# Deploy individual
supabase functions deploy nathia-chat

# Deploy todas
supabase functions deploy
```

### Secrets

Configurar no Supabase Dashboard:

- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Sentry Releases

### Automático

GitHub Actions cria release automaticamente em:

- Push para `main`
- Tag `v*.*.*`

### Manual

```bash
sentry-cli releases new $VERSION
sentry-cli releases set-commits --auto $VERSION
sentry-cli releases finalize $VERSION
```

## Checklist

- [ ] Version atualizado
- [ ] Tag criada
- [ ] Builds bem-sucedidos
- [ ] Edge Functions deployadas
- [ ] Secrets configurados
- [ ] Sentry release criada
