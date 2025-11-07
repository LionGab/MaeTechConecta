# 🔧 Guia de Instalação - Node.js 20 LTS

## ❌ Problema Atual

O Node.js foi removido do sistema. Nenhum comando funciona:
- `node` ❌
- `npm` ❌
- `pnpm` ❌

## ✅ Solução: Instalar Node.js 20 LTS

### Passo 1: Download do Node.js 20 LTS

**Opção A - Link direto (RECOMENDADO):**
```
https://nodejs.org/dist/v20.18.1/node-v20.18.1-x64.msi
```

**Opção B - Site oficial:**
1. Acesse: https://nodejs.org/
2. Clique no botão verde "LTS" (Long Term Support)
3. Baixe a versão Windows Installer (.msi) de 64 bits

### Passo 2: Instalar o Node.js

1. Rode o arquivo `.msi` baixado
2. Clique em "Next" em todas as telas
3. **IMPORTANTE:** Deixe marcada a opção **"Automatically install the necessary tools"**
4. **IMPORTANTE:** Deixe marcada a opção **"Add to PATH"**
5. Clique em "Install"
6. Aguarde a instalação concluir

### Passo 3: Reiniciar o Terminal

**MUITO IMPORTANTE:**
1. Feche TODAS as janelas do PowerShell/Terminal abertas
2. Abra uma NOVA janela do PowerShell
3. O PATH só é atualizado em novas sessões

### Passo 4: Verificar Instalação

Abra um NOVO PowerShell e execute:

```powershell
node -v
# Deve mostrar: v20.18.1 (ou v20.x.x)

npm -v
# Deve mostrar: 10.x.x
```

### Passo 5: Instalar pnpm

```powershell
npm install -g pnpm
```

Verifique:
```powershell
pnpm -v
# Deve mostrar: 9.x.x
```

### Passo 6: Voltar ao Projeto

```powershell
cd C:\Users\Usuario\Documents\NossaMaternidade
pnpm install
```

### Passo 7: Iniciar o App

**Para iPhone (Expo Go):**
```powershell
pnpm --filter @nossa-maternidade/mobile dev
```
Escaneie o QR code que aparecer com o app Expo Go

**Para testar no navegador:**
```powershell
pnpm --filter @nossa-maternidade/mobile dev:web
```

## 🆘 Problemas Comuns

### "node: The term 'node' is not recognized"

**Solução:** Você não reiniciou o PowerShell após a instalação
1. Feche TODAS as janelas do PowerShell
2. Abra uma NOVA janela
3. Tente novamente

### "npm install -g pnpm" dá erro de permissão

**Solução:** Execute o PowerShell como Administrador
1. Clique com botão direito no ícone do PowerShell
2. Escolha "Executar como Administrador"
3. Execute o comando novamente

### PATH não foi atualizado

**Solução manual:**
1. Abra as Configurações do Windows
2. Procure por "Variáveis de Ambiente"
3. Na seção "Variáveis de Sistema", encontre "Path"
4. Adicione: `C:\Program Files\nodejs\`
5. Clique em OK
6. Reinicie o PowerShell

## 📋 Checklist Final

Após a instalação, verifique se todos os comandos funcionam:

- [ ] `node -v` → v20.x.x
- [ ] `npm -v` → 10.x.x
- [ ] `pnpm -v` → 9.x.x
- [ ] `cd C:\Users\Usuario\Documents\NossaMaternidade`
- [ ] `pnpm install` → Instala dependências
- [ ] `pnpm --filter @nossa-maternidade/mobile dev` → Inicia Expo

## 🎯 Resultado Esperado

Ao final, você deve ver no terminal:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

## 🔗 Links Úteis

- Node.js Downloads: https://nodejs.org/en/download
- pnpm Docs: https://pnpm.io/installation
- Expo Docs: https://docs.expo.dev/get-started/installation/
- Expo Go App (iOS): https://apps.apple.com/app/expo-go/id982107779
