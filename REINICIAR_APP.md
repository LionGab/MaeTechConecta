# 🔄 Como Reiniciar o App - Nossa Maternidade

## ⚠️ Situação Atual

- ✅ Porta 8081 está em uso (Metro bundler rodando)
- ⚠️ React ainda não renderizou completamente
- ⚠️ App pode estar carregando ou com erro

---

## 🚀 Solução: Reiniciar o App

### 1. Parar processos Node

```powershell
# Matar todos os processos Node (cuidado!)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

Ou matar processo específico na porta 8081:

```powershell
# Encontrar PID na porta 8081
$port = netstat -ano | findstr ":8081" | Select-Object -First 1
$pid = ($port -split '\s+')[-1]

# Matar processo
taskkill /PID $pid /F
```

### 2. Limpar cache

```powershell
cd C:\Users\Usuario\Documents\LionNath\apps\mobile
pnpm clean
```

### 3. Verificar dependências

```powershell
# Verificar se node_modules existe
Test-Path "node_modules"
```

Se retornar `False`:

```powershell
pnpm install
```

### 4. Iniciar app novamente

```powershell
pnpm dev
```

Ou com cache limpo:

```powershell
pnpm dev:clear
```

### 5. Aguardar carregar

Aguarde alguns segundos até ver:

```
Metro waiting on exp://192.168.x.x:8081
Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press w │ open web
› Press a │ open Android
› Press i │ open iOS simulator
```

### 6. Abrir no navegador

Pressione `w` no terminal ou acesse:

- `http://localhost:8081`

---

## 🔍 Verificar se está funcionando

### No Terminal

Você deve ver:

- ✅ "Metro waiting on..."
- ✅ QR code
- ✅ Opções (w, a, i)

### No Navegador

Acesse `http://localhost:8081` e você deve ver:

- ✅ Título: "Nossa Maternidade"
- ✅ React renderizado
- ✅ App funcionando

---

## 🐛 Se ainda não funcionar

### Verificar erros no terminal

Execute e verifique se há erros:

```powershell
cd C:\Users\Usuario\Documents\LionNath\apps\mobile
pnpm dev
```

### Verificar logs

Procure por:

- ❌ "Error"
- ❌ "Cannot find module"
- ❌ "Port already in use"
- ❌ "Metro bundler error"

### Limpar tudo e reinstalar

```powershell
cd C:\Users\Usuario\Documents\LionNath\apps\mobile

# Limpar tudo
pnpm clean:all

# Reinstalar
pnpm install

# Reiniciar
pnpm dev
```

---

## ✅ Checklist

- [ ] Processos Node parados
- [ ] Cache limpo
- [ ] Dependências instaladas
- [ ] App iniciado (`pnpm dev`)
- [ ] Metro bundler rodando
- [ ] App acessível em `http://localhost:8081`
- [ ] React renderizado

---

**Execute os passos acima para reiniciar o app!** 🎉

