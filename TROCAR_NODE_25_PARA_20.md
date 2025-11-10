# 🔄 Trocar Node.js 25 → Node.js 20 LTS

## ❌ Problema

Você instalou o **Node.js 25** (muito recente), mas o projeto precisa do **Node.js 20 LTS**.

**Por que Node 20?**

- Expo e React Native são testados com LTS (Long Term Support)
- Node 25 é experimental e pode ter bugs
- Dependências podem não funcionar corretamente

## ✅ Solução: Desinstalar Node 25 e Instalar Node 20

### Passo 1: Desinstalar Node.js 25

**Opção A - Via Configurações do Windows (RECOMENDADO):**

1. Pressione `Win + I` para abrir Configurações
2. Vá em **"Aplicativos"** → **"Aplicativos instalados"**
3. Procure por **"Node.js"**
4. Clique nos 3 pontinhos → **"Desinstalar"**
5. Confirme a desinstalação
6. Aguarde concluir

**Opção B - Via Painel de Controle:**

1. Pressione `Win + R`
2. Digite: `appwiz.cpl` e pressione Enter
3. Procure **"Node.js"** na lista
4. Clique com botão direito → **"Desinstalar"**
5. Confirme a desinstalação

### Passo 2: Limpar Resíduos (IMPORTANTE)

Abra o PowerShell e execute:

```powershell
# Remover cache do npm
Remove-Item -Path "$env:APPDATA\npm" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\npm-cache" -Recurse -Force -ErrorAction SilentlyContinue

# Remover pnpm antigo
Remove-Item -Path "$env:LOCALAPPDATA\pnpm" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\pnpm" -Recurse -Force -ErrorAction SilentlyContinue
```

### Passo 3: Baixar Node.js 20 LTS

**Link direto do instalador:**

```
https://nodejs.org/dist/v20.18.1/node-v20.18.1-x64.msi
```

**Ou pelo site oficial:**

- https://nodejs.org/
- Clique no botão verde **"20.18.1 LTS"** (Recommended For Most Users)

### Passo 4: Instalar Node.js 20

1. Execute o arquivo `.msi` baixado
2. Clique em "Next"
3. Aceite os termos → "Next"
4. **IMPORTANTE:** Deixe todas as opções marcadas, especialmente:
   - ✅ **"Add to PATH"**
   - ✅ **"npm package manager"**
5. Clique em "Install"
6. Aguarde a instalação
7. Clique em "Finish"

### Passo 5: Reiniciar o PowerShell (OBRIGATÓRIO)

**MUITO IMPORTANTE:**

1. Feche **TODAS** as janelas do PowerShell/Terminal
2. Abra uma **NOVA** janela do PowerShell
3. O PATH só atualiza em novas sessões

### Passo 6: Verificar Instalação

```powershell
node -v
# Deve mostrar: v20.18.1
# ❌ Se mostrar v25.x.x, você não reiniciou o PowerShell

npm -v
# Deve mostrar: 10.8.2 (ou 10.x.x)
```

### Passo 7: Reinstalar pnpm

```powershell
npm install -g pnpm
```

Verifique:

```powershell
pnpm -v
# Deve mostrar: 9.x.x
```

### Passo 8: Voltar ao Projeto

```powershell
cd C:\Users\Usuario\Documents\NossaMaternidade

# Limpar instalações antigas
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "packages\mobile\node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# Instalar com Node 20
pnpm install
```

### Passo 9: Iniciar o App

```powershell
pnpm --filter @nossa-maternidade/mobile dev
```

## 🆘 Problemas Comuns

### "node -v" ainda mostra v25.x.x

**Causa:** Você não reiniciou o PowerShell

**Solução:**

1. Feche TODAS as janelas do PowerShell
2. Abra uma NOVA janela
3. Execute `node -v` novamente

### Erro "EACCES" ou "permission denied" ao instalar pnpm

**Solução:**

1. Feche o PowerShell
2. Clique com botão direito no ícone do PowerShell
3. Escolha **"Executar como Administrador"**
4. Execute: `npm install -g pnpm`

### "pnpm install" dá erro de compatibilidade

**Solução:**

```powershell
# Limpar cache
pnpm store prune

# Reinstalar
pnpm install --force
```

## 📋 Checklist Final

Após completar todos os passos:

- [ ] Node.js 25 foi desinstalado
- [ ] Node.js 20.18.1 foi instalado
- [ ] `node -v` mostra `v20.18.1`
- [ ] `npm -v` mostra `10.x.x`
- [ ] `pnpm -v` mostra `9.x.x`
- [ ] `pnpm install` funcionou sem erros
- [ ] Expo iniciou com `pnpm --filter @nossa-maternidade/mobile dev`

## 🎯 Versões Corretas

```
Node.js:  v20.18.1  ✅
npm:      10.8.2    ✅
pnpm:     9.x.x     ✅
```

## ⚠️ Por Que Não Usar Node 25?

| Node 25                       | Node 20 LTS             |
| ----------------------------- | ----------------------- |
| ❌ Experimental               | ✅ Estável              |
| ❌ Bugs conhecidos            | ✅ Testado              |
| ❌ Sem suporte de bibliotecas | ✅ Totalmente suportado |
| ❌ Pode quebrar builds        | ✅ Builds confiáveis    |
| ❌ Sem garantias              | ✅ Suporte até 2026     |

## 🔗 Links Úteis

- Node.js 20 Downloads: https://nodejs.org/en/download
- Release Schedule: https://nodejs.org/en/about/previous-releases
- Expo Requirements: https://docs.expo.dev/get-started/installation/#requirements

