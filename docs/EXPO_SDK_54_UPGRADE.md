# 🚀 Upgrade Expo SDK 52 → 54

## ⚠️ Importante

Este documento descreve o processo de upgrade do Expo SDK de 52 para 54.

---

## 📋 Passos do Upgrade

### 1. Atualizar Expo SDK

```bash
cd apps/mobile

# Atualizar expo para SDK 54
pnpm add expo@~54.0.0

# Atualizar jest-expo
pnpm add -D jest-expo@~54.0.0
```

### 2. Atualizar Dependências do Expo

O comando `expo install --fix` atualiza automaticamente todas as dependências do Expo para versões compatíveis com SDK 54:

```bash
cd apps/mobile

# Atualizar todas as dependências do Expo para versões compatíveis
npx expo install --fix
```

Este comando atualiza automaticamente:

- ✅ `expo-av`
- ✅ `expo-constants`
- ✅ `expo-linear-gradient`
- ✅ `expo-notifications`
- ✅ `expo-speech`
- ✅ `expo-status-bar`
- ✅ E outras dependências do Expo

### 3. Verificar Integridade do Projeto

```bash
cd apps/mobile

# Verificar problemas comuns
npx expo-doctor
```

Este comando identifica e sugere correções para problemas comuns.

### 4. Limpar Cache e Reinstalar

```bash
cd apps/mobile

# Limpar cache
pnpm clean

# Reinstalar dependências
pnpm install
```

### 5. Atualizar Projetos Nativos (se necessário)

Se você usa **Continuous Native Generation** (CNG), exclua os diretórios `android` e `ios`:

```bash
cd apps/mobile

# Remover projetos nativos (serão regenerados)
rm -rf android ios
```

Os projetos nativos serão regenerados automaticamente na próxima vez que você executar:

- `npx expo run:ios`
- `npx expo run:android`
- `npx expo prebuild`
- Ou EAS Build

**Se você NÃO usa CNG**, execute:

```bash
cd apps/mobile/ios

# Instalar pods atualizados
pod install
```

---

## 🔍 Verificações Pós-Upgrade

### 1. Verificar Versões

```bash
cd apps/mobile

# Verificar versão do Expo
npx expo --version

# Verificar versões instaladas
pnpm list expo
pnpm list expo-av
pnpm list expo-constants
```

### 2. Testar Build

```bash
cd apps/mobile

# Testar build web
pnpm dev:web

# Testar build iOS (se tiver Mac)
pnpm ios

# Testar build Android
pnpm android
```

### 3. Verificar Funcionalidades

Teste as funcionalidades principais do app:

- ✅ Navegação
- ✅ Notificações
- ✅ Áudio/Vídeo
- ✅ Câmera
- ✅ Permissões
- ✅ Integrações (Supabase, Sentry, etc.)

---

## 🐛 Troubleshooting

### "Module not found" ou "Cannot find module"

**Solução:**

```bash
cd apps/mobile

# Limpar cache e reinstalar
pnpm clean:all
pnpm install
```

### "Incompatible dependency versions"

**Solução:**

```bash
cd apps/mobile

# Forçar atualização de dependências
npx expo install --fix --check
```

### "Build failed" no iOS/Android

**Soluções:**

1. **Limpar projetos nativos:**

```bash
cd apps/mobile

# Remover e regenerar
rm -rf android ios
npx expo prebuild
```

2. **Limpar cache do Metro:**

```bash
cd apps/mobile
pnpm clean
```

3. **Reinstalar pods (iOS):**

```bash
cd apps/mobile/ios
pod deintegrate
pod install
```

### "Expo CLI version mismatch"

**Solução:**

```bash
# Atualizar Expo CLI globalmente
npm install -g expo-cli@latest

# Ou usar npx (recomendado)
npx expo@latest --version
```

---

## 📚 Referências

- [Expo SDK 54 Changelog](https://expo.dev/changelog/sdk-54)
- [Expo SDK 53 Changelog](https://expo.dev/changelog/sdk-53)
- [Expo Upgrade Guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
- [Expo Doctor](https://docs.expo.dev/more/developer-tools/#expo-doctor)

---

## ✅ Checklist de Upgrade

- [ ] Expo atualizado para `~54.0.0`
- [ ] `jest-expo` atualizado para `~54.0.0`
- [ ] Dependências do Expo atualizadas (`npx expo install --fix`)
- [ ] `expo-doctor` executado sem erros críticos
- [ ] Cache limpo e dependências reinstaladas
- [ ] Projetos nativos atualizados (se necessário)
- [ ] Build web funcionando
- [ ] Build iOS funcionando (se aplicável)
- [ ] Build Android funcionando (se aplicável)
- [ ] Funcionalidades principais testadas
- [ ] Sem erros de runtime

---

## 🎯 Comandos Rápidos

```bash
# Upgrade completo
cd apps/mobile
pnpm add expo@~54.0.0
pnpm add -D jest-expo@~54.0.0
npx expo install --fix
npx expo-doctor
pnpm clean
pnpm install

# Testar
pnpm dev
```

---

**Execute os passos acima para fazer o upgrade do SDK 52 para 54!** 🎉

