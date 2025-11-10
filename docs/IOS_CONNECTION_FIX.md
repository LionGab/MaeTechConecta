# 🔧 Fix: iOS Connection Error - Unknown Error

## ⚠️ Problema

No iOS, aparece erro: "Unknown error. exp://192.168.2.2:8081"

Isso geralmente acontece quando o dispositivo iOS não consegue conectar ao servidor de desenvolvimento.

---

## 🔍 Causas Comuns

1. **Dispositivo e computador não estão na mesma rede Wi-Fi**
2. **Firewall do Windows bloqueando porta 8081**
3. **IP incorreto ou mudou**
4. **Problemas de configuração de rede**

---

## 🚀 Soluções

### Solução 1: Verificar Rede Wi-Fi

**Certifique-se de que:**

- ✅ Dispositivo iOS e computador estão na **mesma rede Wi-Fi**
- ✅ Wi-Fi está funcionando em ambos
- ✅ Não está usando VPN que possa interferir

**Teste:**

```powershell
# Ver seu IP atual
ipconfig | findstr IPv4
```

O IP deve começar com `192.168.x.x` (mesma rede do dispositivo).

---

### Solução 2: Usar Tunnel (Recomendado)

O tunnel usa o servidor do Expo para conectar, funcionando mesmo em redes diferentes:

```powershell
cd apps/mobile
pnpm dev:tunnel
```

Ou:

```powershell
npx expo start --tunnel
```

**Vantagens:**

- ✅ Funciona mesmo em redes diferentes
- ✅ Não precisa configurar firewall
- ✅ Mais confiável

**Desvantagens:**

- ⚠️ Pode ser mais lento
- ⚠️ Requer internet estável

---

### Solução 3: Configurar Firewall do Windows

**Permitir porta 8081 no Firewall:**

1. Abra **Windows Defender Firewall**
2. Clique em **Configurações Avançadas**
3. Clique em **Regras de Entrada** → **Nova Regra**
4. Selecione **Porta** → **Próximo**
5. Selecione **TCP** → Digite **8081** → **Próximo**
6. Selecione **Permitir a conexão** → **Próximo**
7. Marque todas as opções → **Próximo**
8. Nome: "Expo Metro Bundler" → **Concluir**

**Ou via PowerShell (como Administrador):**

```powershell
New-NetFirewallRule -DisplayName "Expo Metro Bundler" -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow
```

---

### Solução 4: Usar Localhost (Apenas Simulador)

Se estiver usando o **simulador iOS** (não dispositivo físico):

```powershell
cd apps/mobile
pnpm dev:localhost
```

Ou:

```powershell
npx expo start --localhost
```

**Nota:** Isso só funciona no simulador, não em dispositivos físicos.

---

### Solução 5: Verificar IP e Reiniciar

**1. Verificar IP atual:**

```powershell
ipconfig | findstr IPv4
```

**2. Se o IP mudou, reinicie o Expo:**

```powershell
# Parar processo atual
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Limpar cache
cd apps/mobile
pnpm clean

# Reiniciar
pnpm dev
```

**3. Verificar novo IP no QR code**

O QR code deve mostrar o IP correto.

---

### Solução 6: Usar LAN Explicitamente

Forçar uso de LAN:

```powershell
cd apps/mobile
pnpm dev:lan
```

Ou:

```powershell
npx expo start --lan
```

---

### Solução 7: Limpar Cache e Reinstalar

Se nada funcionar:

```powershell
cd apps/mobile

# Limpar tudo
pnpm clean:all

# Reinstalar
pnpm install

# Reiniciar
pnpm dev
```

---

## 📱 Testar no iOS

### Opção 1: Expo Go App

1. Instale **Expo Go** na App Store
2. Abra o app
3. Escaneie o QR code do terminal
4. Ou digite manualmente: `exp://192.168.2.2:8081`

### Opção 2: Câmera do iOS

1. Abra a **Câmera** do iOS
2. Aponte para o QR code no terminal
3. Toque na notificação que aparecer
4. Abre no Expo Go automaticamente

---

## 🔍 Verificações

### 1. Verificar se Metro está rodando

```powershell
netstat -ano | findstr ":8081"
```

Deve mostrar algo como:

```
TCP    0.0.0.0:8081    0.0.0.0:0    LISTENING    12345
```

### 2. Testar conexão do computador

No terminal do Expo, você deve ver:

```
Metro waiting on exp://192.168.2.2:8081
```

### 3. Testar no navegador

Abra no navegador do computador:

```
http://localhost:8081
```

Se funcionar no navegador, o problema é de rede/firewall.

---

## 🎯 Solução Rápida (Recomendada)

**Para resolver rapidamente, use TUNNEL:**

```powershell
cd apps/mobile
pnpm dev:tunnel
```

Isso resolve 90% dos problemas de conexão iOS.

---

## ✅ Checklist

- [ ] Dispositivo iOS e computador na mesma rede Wi-Fi
- [ ] Firewall permitindo porta 8081
- [ ] IP correto no QR code
- [ ] Metro bundler rodando
- [ ] Expo Go instalado no iOS
- [ ] Testado com tunnel (se LAN não funcionar)

---

## 🐛 Se Ainda Não Funcionar

1. **Tente tunnel:** `pnpm dev:tunnel`
2. **Verifique logs do Expo** no terminal
3. **Verifique logs do iOS** no Xcode (se disponível)
4. **Teste em outro dispositivo** para isolar o problema
5. **Reinicie roteador Wi-Fi** (às vezes resolve problemas de rede)

---

**Execute as soluções acima para resolver o problema de conexão iOS!** 🎉

