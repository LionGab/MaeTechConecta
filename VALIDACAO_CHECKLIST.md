# 📊 Validação do Checklist - Nossa Maternidade

## Como Validar Todos os Itens

Execute o script de validação:

```bash
npm run validate:checklist
```

Ou diretamente:

```bash
node scripts/validate-checklist.js
```

## ✅ Itens do Checklist

### 1. Estrutura Consolidada ✅

**Status:** Verificado automaticamente
**Validação:**

```bash
ls -la
# Deve mostrar: src/, packages/, supabase/, docs/
```

### 2. CI/CD Configurado ✅

**Status:** Verificado automaticamente
**Validação:**

```bash
ls .github/workflows/
# Deve mostrar: deploy.yml
```

### 3. Testes Configurados ✅

**Status:** Verificado automaticamente
**Validação:**

```bash
npm test
```

### 4. Coverage ≥70% ⏳

**Status:** Requer execução de testes
**Validação:**

```bash
npm run test:coverage
npm run test:coverage:check
```

**Se falhar:**

- Adicione mais testes
- Meta mínima: 70% de cobertura

### 5. Type Check Passa ⏳

**Status:** Requer verificação
**Validação:**

```bash
npm run type-check
```

**Problemas Comuns:**

#### Erro: Cannot find module '@/components/...'

**Solução:** Verifique `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Erro: Module not found

**Solução:**

1. Verifique se o arquivo existe
2. Verifique os imports (use `@/` para paths relativos)
3. Execute: `npm run type-check` para ver erros detalhados

### 6. Build EAS Funciona ⏳

**Status:** Requer configuração manual
**Validação:**

```bash
# 1. Instalar EAS CLI (se não tiver)
npm install -g eas-cli

# 2. Login
eas login

# 3. Configurar projeto
eas build:configure

# 4. Testar build preview
eas build --platform android --profile preview
```

**Problemas Comuns:**

#### Erro: Invalid credentials

**Solução:**

```bash
eas logout
eas login
```

#### Erro: eas.json não encontrado

**Solução:** Já existe em `eas.json`. Se falhar, verifique:

- Permissões do arquivo
- Estrutura JSON válida

### 7. Documentação Completa ✅

**Status:** Verificado automaticamente
**Validação:**

```bash
ls docs/
# Deve mostrar: ARCHITECTURE.md, DEPLOY_PRODUCTION.md, EDGE_FUNCTIONS.md
```

### 8. Edge Functions Deployadas ⏳

**Status:** Requer deploy manual
**Validação:**

#### Via Supabase Dashboard:

1. Acesse: https://supabase.com/dashboard
2. Vá em **Edge Functions**
3. Verifique se as funções estão deployadas:
   - `nathia-chat`
   - `moderation-service`
   - `risk-classifier`
   - `behavior-analysis`
   - `lgpd-requests`
   - `transcribe-audio`

#### Via CLI:

```bash
# 1. Instalar Supabase CLI (se não tiver)
npm install -g supabase

# 2. Login
supabase login

# 3. Linkar projeto
supabase link --project-ref seu-project-ref

# 4. Deploy
supabase functions deploy nathia-chat
supabase functions deploy moderation-service
supabase functions deploy risk-classifier
supabase functions deploy behavior-analysis
supabase functions deploy lgpd-requests
supabase functions deploy transcribe-audio
```

**Problemas Comuns:**

#### Erro: Not authenticated

**Solução:**

```bash
supabase login
supabase link --project-ref seu-project-ref
```

#### Erro: Function not found

**Solução:** Verifique se a função existe em `supabase/functions/`

## 🔧 Soluções Rápidas

### Problema 1: Type Check Falha

**Sintoma:**

```bash
npm run type-check
# Error: Cannot find module '@/components/...'
```

**Solução:**
O `tsconfig.json` já está configurado com paths. Se ainda falhar:

1. Verifique se o arquivo existe
2. Verifique o import (use `@/` ao invés de `../`)
3. Reinicie o TypeScript server (VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server")

### Problema 2: Testes Falham

**Sintoma:**

```bash
npm test
# ReferenceError: fetch is not defined
```

**Solução:**
O `vitest.setup.ts` já deve ter os polyfills. Se não tiver, adicione:

```typescript
// vitest.setup.ts
import { vi } from 'vitest';

global.fetch = vi.fn();
```

### Problema 3: Build EAS Falha

**Sintoma:**

```bash
eas build
# Error: Invalid credentials
```

**Solução:**

```bash
eas logout
eas login
eas build:configure
```

### Problema 4: Edge Functions Não Deployam

**Sintoma:**

```bash
supabase functions deploy nathia-chat
# Error: Not authenticated
```

**Solução:**

```bash
supabase login
supabase link --project-ref seu-project-ref
supabase functions deploy nathia-chat
```

## 📋 Checklist Manual

Execute este checklist após rodar `npm run validate:checklist`:

- [ ] Type check passa (`npm run type-check`)
- [ ] Testes passam (`npm test`)
- [ ] Coverage ≥70% (`npm run test:coverage:check`)
- [ ] EAS build funciona (`eas build --platform android --profile preview`)
- [ ] Edge Functions deployadas (verificar no Supabase Dashboard)
- [ ] CI/CD passa no GitHub (push para verificar)
- [ ] Documentação atualizada

## 🚀 Próximos Passos

1. **Validar localmente:**

   ```bash
   npm run validate:checklist
   ```

2. **Corrigir itens com ❌**

3. **Validar manualmente itens com ⏳**

4. **Executar validação completa:**

   ```bash
   npm run validate
   ```

5. **Commit e push:**
   ```bash
   git add .
   git commit -m "feat: adiciona validação completa do checklist"
   git push
   ```

## 📊 Status Atual

Execute `npm run validate:checklist` para ver o status atualizado de todos os itens.

---

**Última atualização:** 04/11/2025
**Versão:** 1.0
