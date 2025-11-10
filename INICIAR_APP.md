# 🚀 Como Iniciar o App - Nossa Maternidade

## ⚠️ Importante

O app precisa ser iniciado **manualmente no seu terminal** porque o Expo precisa de interação.

---

## 📋 Passos para Iniciar

### 1. Abra o PowerShell no diretório do projeto

```powershell
cd C:\Users\Usuario\Documents\LionNath\apps\mobile
```

### 2. Instale dependências (se necessário)

```powershell
pnpm install
```

### 3. Inicie o app

```powershell
pnpm dev
```

Ou:

```powershell
expo start
```

### 4. Escolha a plataforma

O Expo irá mostrar opções:

- Pressione `w` para abrir no navegador (web)
- Pressione `a` para abrir no emulador Android
- Pressione `i` para abrir no simulador iOS
- Escaneie o QR code com o app Expo Go no celular

---

## 🔄 Alternativas

### Iniciar com cache limpo

```powershell
pnpm dev:clear
```

Ou:

```powershell
expo start --clear
```

### Iniciar apenas para web

```powershell
pnpm dev:web
```

Ou:

```powershell
expo start --web
```

---

## 🐛 Troubleshooting

### "Port 8081 already in use"

**Solução:**

```powershell
# Encontrar processo usando a porta
netstat -ano | findstr ":8081"

# Matar processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F
```

### "Cannot find module"

**Solução:**

```powershell
# Limpar cache e reinstalar
pnpm clean:all
```

### "Expo CLI not found"

**Solução:**

```powershell
# Instalar Expo CLI globalmente
npm install -g expo-cli

# Ou usar npx
npx expo start
```

### "Metro bundler error"

**Solução:**

```powershell
# Limpar cache do Metro
pnpm clean

# Reiniciar
pnpm dev
```

---

## ✅ Verificação

Após iniciar, você deve ver:

```
Metro waiting on exp://192.168.x.x:8081
Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press w │ open web
› Press a │ open Android
› Press i │ open iOS simulator
```

---

## 📱 Testar no Celular

1. Instale o app **Expo Go** no seu celular
2. Escaneie o QR code que aparece no terminal
3. O app abrirá no seu celular

---

## 🌐 Testar no Navegador

1. Pressione `w` no terminal
2. O app abrirá em: `http://localhost:8081`

---

**Execute `pnpm dev` no terminal para iniciar o app!** 🎉
