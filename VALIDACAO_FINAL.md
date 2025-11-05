# 📋 FASE 4: VALIDAÇÃO FINAL

## 4.1 Validação Local Completa

### Script de Validação Automatizado

```bash
npm run validate
```

Este comando executa em sequência:

- ✅ Lint (ESLint)
- ✅ Type Check (TypeScript)
- ✅ Testes (Vitest)
- ✅ Coverage (≥70%)
- ✅ Coverage Check

### Validação Manual (Passo a Passo)

Se o script automatizado não funcionar, execute manualmente:

```bash
# 1. Type Check
npm run typecheck

# 2. Lint
npm run lint

# 3. Testes
npm test

# 4. Coverage
npm run test:coverage

# 5. Verificar Coverage ≥70%
npm run test:coverage:check

# 6. Formatação
npm run format:check
```

### Checklist de Validação Local

- [ ] Type check passa (`npm run typecheck`)
- [ ] Lint passa (`npm run lint`)
- [ ] Testes passam (`npm test`)
- [ ] Coverage ≥70% (`npm run test:coverage:check`)

---

## 4.2 Testar Build Local

### Preview do Expo

```bash
npx expo start
```

### Testar em Diferentes Plataformas

```bash
# Android
npm run android

# iOS (macOS apenas)
npm run ios

# Web
npm run web
```

### Checklist de Build Local

- [ ] App inicia sem crashes
- [ ] Navegação funciona
- [ ] Componentes renderizam corretamente
- [ ] Integrações básicas funcionam (Supabase, etc.)

---

## 4.3 Validação de CI/CD

### 1. Preparar Commit

```bash
# Verificar status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "chore: consolidação completa - estrutura base"

# Push para branch
git push origin consolidation/add-ci-cd-and-tests
```

### 2. Verificar GitHub Actions

Acesse: `https://github.com/SEU-USUARIO/nossa-maternidade/actions`

### Checklist de CI/CD

- [ ] CI workflow disparado automaticamente
- [ ] Lint job passa
- [ ] Type check job passa
- [ ] Test job passa
- [ ] Coverage job passa (≥70%)
- [ ] Security scan executa sem erros críticos

### Workflows Configurados

1. **`.github/workflows/ci.yml`** - Lint, types, tests, coverage, security
2. **`.github/workflows/build.yml`** - EAS build Android/iOS
3. **`.github/workflows/deploy.yml`** - Deploy automático (tag v*.*.\*)

---

## 4.4 Testar Build EAS

### Pré-requisitos

1. Instalar EAS CLI globalmente:

```bash
npm install -g eas-cli
```

2. Fazer login:

```bash
eas login
```

3. Configurar projeto (se necessário):

```bash
eas build:configure
```

### Build Preview

```bash
# Android
npx eas-cli build --profile preview --platform android

# iOS
npx eas-cli build --profile preview --platform ios
```

### Monitorar Progresso

Acesse: `https://expo.dev/accounts/YOUR-ACCOUNT/projects/nossa-maternidade/builds`

### Checklist de Build EAS

- [ ] Build preview criado com sucesso
- [ ] APK/IPA disponível para download
- [ ] Instalável em dispositivo físico/emulador
- [ ] App funciona corretamente após instalação

---

## 🔧 Troubleshooting

### Problema: Comandos falhando com erro de path

**Solução**: Verificar se todas as dependências estão instaladas:

```bash
npm install
```

### Problema: TypeScript errors

**Solução**: Verificar se `tsconfig.json` está correto e se os paths estão configurados.

### Problema: Testes não executam

**Solução**: Verificar se `vitest.config.ts` está correto e se `vitest.setup.ts` existe.

### Problema: Coverage abaixo de 70%

**Solução**: Adicionar mais testes para aumentar a cobertura.

### Problema: CI/CD não dispara

**Solução**: Verificar se `.github/workflows/*.yml` estão corretos e se os secrets estão configurados.

### Problema: EAS build falha

**Solução**: Verificar se `eas.json` está configurado corretamente e se os secrets do EAS estão configurados.

---

## 📝 Próximos Passos Após Validação

1. ✅ Validação local completa
2. ✅ Build local funcionando
3. ✅ CI/CD configurado e passando
4. ✅ EAS build funcionando
5. 🚀 Pronto para deploy em produção!

---

## 🎯 Critérios de Aceite Final

- [x] Estrutura única criada
- [x] CI/CD configurado
- [x] Testes configurados (≥70% coverage)
- [x] Documentação consolidada
- [x] Scripts de validação criados
- [ ] Validação local completa
- [ ] Build local funcionando
- [ ] CI/CD passando
- [ ] EAS build funcionando
