# 🔧 Executar Sentry Wizard

## ⚠️ Importante

O Sentry Wizard precisa ser executado **manualmente no seu terminal** porque requer interação (TTY).

---

## 📋 Passos

### 1. Abra o PowerShell no diretório do projeto

```powershell
cd C:\Users\Usuario\Documents\LionNath
```

### 2. Execute o Sentry Wizard

```powershell
npx @sentry/wizard@latest -i reactNative --saas --org nossamaternidade --project react-native
```

O wizard irá:

- ✅ Detectar o projeto React Native/Expo
- ✅ Instalar dependências necessárias (`@sentry/react-native`)
- ✅ Configurar arquivos de configuração
- ✅ Criar arquivo `sentry.properties`
- ✅ Configurar DSN automaticamente

### 3. Siga as instruções do wizard

O wizard irá fazer perguntas interativas:

- Confirmar instalação de dependências (Y/n)
- Configurar DSN (se necessário)
- Configurar arquivos de configuração

---

## ✅ O Que Será Configurado

### Arquivos que serão criados/atualizados:

1. **`apps/mobile/sentry.properties`** - Configuração do Sentry
2. **`apps/mobile/sentry.config.js`** - Já existe, será atualizado
3. **`apps/mobile/package.json`** - Dependências adicionadas
4. **`src/services/sentry.ts`** - Inicialização do Sentry (já existe)

### Dependências que serão instaladas:

- `@sentry/react-native` - SDK principal (já instalado: 7.5.0)
- `@sentry/cli` - CLI para upload de source maps

---

## 🔄 Após Executar o Wizard

### 1. Verificar configuração

Verifique se o arquivo `apps/mobile/sentry.properties` foi criado:

```properties
defaults.url=https://sentry.io/
defaults.org=nossamaternidade
defaults.project=react-native
auth.token=seu_token_aqui
```

### 2. Verificar inicialização

O arquivo `src/services/sentry.ts` já existe. Verifique se está configurado corretamente.

### 3. Configurar variáveis de ambiente

Adicione ao arquivo `apps/mobile/.env`:

```env
EXPO_PUBLIC_SENTRY_DSN=sua_dsn_aqui
SENTRY_DSN=sua_dsn_aqui
```

---

## 🐛 Troubleshooting

### "TTY initialization failed"

- Execute o comando no seu terminal PowerShell (não via script)
- O wizard precisa de interação do usuário

### "Cannot find module @sentry/react-native"

- Já está instalado (versão 7.5.0)
- Se necessário: `cd apps/mobile && pnpm install`

### "DSN not configured"

- Configure no arquivo `.env` ou `sentry.properties`
- Ou configure via wizard

---

## 📚 Documentação

- [Sentry React Native Docs](https://docs.sentry.io/platforms/react-native/)
- [Sentry Wizard Docs](https://docs.sentry.io/platforms/react-native/guides/expo/manual-setup/)

---

**Execute o comando no seu terminal para configurar o Sentry!** 🎉
