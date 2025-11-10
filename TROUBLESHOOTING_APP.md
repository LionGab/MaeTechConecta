# 🔧 Troubleshooting - App Não Está Rodando

## ⚠️ Problema

O app não está rodando ou não está acessível.

---

## 🔍 Verificações

### 1. Verificar se há processo rodando

```powershell
# Ver processos Node
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Select-Object ProcessName, Id

# Verificar porta 8081
netstat -ano | findstr ":8081"
```

### 2. Verificar se dependências estão instaladas

```powershell
cd C:\Users\Usuario\Documents\LionNath\apps\mobile
Test-Path "node_modules"
```

Se retornar `False`, instale:

```powershell
pnpm install
```

### 3. Verificar se Expo está instalado

```powershell
npx expo --version
```

Se não estiver, instale:

```powershell
npm install -g expo-cli
```

---

## 🚀 Soluções

### Solução 1: Matar processos antigos e reiniciar

```powershell
# Matar todos os processos Node (cuidado!)
Get-Process node | Stop-Process -Force

# Ou matar processo específico na porta 8081
$port = netstat -ano | findstr ":8081" | Select-Object -First 1
$pid = ($port -split '\s+')[-1]
taskkill /PID $pid /F

# Reiniciar app
cd C:\Users\Usuario\Documents\LionNath\apps\mobile
pnpm dev
```

### Solução 2: Limpar cache e reinstalar

```powershell
cd C:\Users\Usuario\Documents\LionNath\apps\mobile

# Limpar cache
pnpm clean

# Reinstalar dependências
pnpm install

# Reiniciar
pnpm dev
```

### Solução 3: Iniciar com cache limpo

```powershell
cd C:\Users\Usuario\Documents\LionNath\apps\mobile
pnpm dev:clear
```

### Solução 4: Verificar erros no terminal

Execute o comando e verifique se há erros:

```powershell
cd C:\Users\Usuario\Documents\LionNath\apps\mobile
pnpm dev
```

**Erros comuns:**

- "Cannot find module" → Execute `pnpm install`
- "Port already in use" → Mate o processo na porta 8081
- "Metro bundler error" → Execute `pnpm clean` e reinicie

---

## 📋 Passos Recomendados

### 1. Parar todos os processos Node

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2. Limpar cache

```powershell
cd C:\Users\Usuario\Documents\LionNath\apps\mobile
pnpm clean
```

### 3. Verificar dependências

```powershell
Test-Path "node_modules"
```

Se `False`:

```powershell
pnpm install
```

### 4. Iniciar app

```powershell
pnpm dev
```

### 5. Escolher plataforma

- Pressione `w` para web
- Pressione `a` para Android
- Pressione `i` para iOS
- Escaneie QR code para celular

---

## 🐛 Erros Comuns

### "Port 8081 already in use"

**Solução:**

```powershell
# Encontrar processo
netstat -ano | findstr ":8081"

# Matar processo (substitua PID)
taskkill /PID <PID> /F
```

### "Cannot find module '@expo/metro-runtime'"

**Solução:**

```powershell
pnpm install
```

### "Metro bundler error"

**Solução:**

```powershell
pnpm clean
pnpm dev
```

### "Expo CLI not found"

**Solução:**

```powershell
npm install -g expo-cli
# Ou usar npx
npx expo start
```

### "Unknown error. exp://192.168.x.x:8081" (iOS)

**Problema:** iOS não consegue conectar ao servidor de desenvolvimento.

**Soluções:**

1. **Usar TUNNEL (Recomendado):**

```powershell
cd apps/mobile
pnpm dev:tunnel
```

2. **Verificar rede Wi-Fi:**
   - Certifique-se de que iOS e PC estão na mesma rede Wi-Fi
   - Verifique IP: `ipconfig | findstr IPv4`

3. **Configurar Firewall:**

```powershell
# Como Administrador
New-NetFirewallRule -DisplayName "Expo Metro Bundler" -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow
```

4. **Usar script de ajuda:**

```powershell
.\scripts\fix-ios-connection.ps1
```

**Mais detalhes:** Veja `docs/IOS_CONNECTION_FIX.md`

---

## ✅ Verificação Final

Após iniciar, você deve ver:

```
Metro waiting on exp://192.168.x.x:8081
Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press w │ open web
› Press a │ open Android
› Press i │ open iOS simulator
```

E o app deve estar acessível em:

- Web: `http://localhost:8081`
- QR Code: Escaneie com Expo Go

---

**Execute os passos acima para iniciar o app!** 🎉

