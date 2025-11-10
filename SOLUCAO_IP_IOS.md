# 🔧 Solução: IP iOS - Unknown Error

## ⚠️ Problema Identificado

- **IP mostrado no Expo:** `192.168.2.2:8081` (IP privado da rede local)
- **Seu IP público:** `138.118.160.181`
- **Problema:** iOS não consegue acessar IP privado se não estiver na mesma rede Wi-Fi

---

## ✅ Solução: Usar TUNNEL

O **TUNNEL** usa o servidor do Expo para conectar, funcionando mesmo em redes diferentes.

### Passo 1: Parar o Expo atual

Se o Expo estiver rodando, pare-o (Ctrl+C no terminal).

### Passo 2: Iniciar com TUNNEL

```powershell
cd apps/mobile
pnpm dev:tunnel
```

Ou diretamente:

```powershell
cd apps/mobile
npx expo start --tunnel
```

### Passo 3: Aguardar conexão

O Expo irá:

1. Conectar ao servidor do Expo (pode levar alguns segundos)
2. Mostrar um novo QR code com URL tipo: `exp://xxx-xxx.xxx.exp.direct:80`
3. Essa URL funciona de qualquer rede!

### Passo 4: Escanear no iOS

1. Abra o **Expo Go** no iOS
2. Escaneie o novo QR code (ou digite a URL manualmente)
3. O app deve conectar!

---

## 🔍 Por Que Funciona?

- **IP Privado (192.168.x.x):** Só funciona na mesma rede Wi-Fi
- **TUNNEL:** Usa servidor do Expo, funciona de qualquer lugar
- **Vantagem:** Não precisa configurar firewall ou rede

---

## ⚠️ Observações

- **Pode ser mais lento:** Tunnel passa pelo servidor do Expo
- **Requer internet:** Precisa de conexão estável
- **Mais confiável:** Funciona mesmo em redes diferentes

---

## 🚀 Alternativa: Configurar Rede Local

Se preferir usar LAN (mais rápido), você precisa:

1. **iOS e PC na mesma rede Wi-Fi**
2. **Configurar Firewall** (permitir porta 8081)
3. **Verificar IP correto** da rede local

Mas para resolver rapidamente, **TUNNEL é a melhor opção!**

---

## 📋 Comandos Rápidos

```powershell
# Parar Expo atual
# (Ctrl+C no terminal)

# Iniciar com TUNNEL
cd apps/mobile
pnpm dev:tunnel

# Ou com cache limpo
pnpm dev:clear && pnpm dev:tunnel
```

---

**Execute `pnpm dev:tunnel` e o iOS deve conectar!** 🎉

