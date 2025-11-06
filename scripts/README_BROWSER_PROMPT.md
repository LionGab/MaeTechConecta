# 🌐 Browser no Prompt do Terminal

Sistema que mostra o browser ativo diretamente no prompt do PowerShell.

## ✨ Funcionalidades

- **Detecção automática** do browser instalado (Chrome, Edge, Firefox, Brave)
- **Status em tempo real**: 🟢 rodando | ⚪ instalado mas não rodando
- **Integração com Git**: mostra branch atual
- **Cores**: prompt colorido para melhor visualização

## 🚀 Instalação

Execute o script de setup:

```powershell
.\scripts\setup-browser-prompt.ps1
```

Isso irá:
1. Criar/atualizar o profile do PowerShell
2. Configurar o prompt customizado
3. Adicionar função `Get-ActiveBrowser`

## 📋 Uso

### Prompt Automático

O browser aparece automaticamente no prompt:

```
🌐 Chrome 🟢 | C:\Users\Usuario\Documents\LionNath 🌿 [main]
PS > 
```

### Comandos Disponíveis

**Ver detalhes do browser:**
```powershell
Get-ActiveBrowser
```

**Ver info formatada:**
```powershell
Format-BrowserPrompt
```

**Recarregar profile:**
```powershell
. $PROFILE
```

## 🔧 Configuração Manual

Se preferir configurar manualmente:

1. **Criar profile** (se não existir):
```powershell
New-Item -ItemType Directory -Path (Split-Path $PROFILE) -Force
```

2. **Adicionar ao profile:**
```powershell
# Carregar função
. "C:\caminho\para\scripts\get-browser-info.ps1"

# Função prompt já está no profile
```

## 🎨 Browsers Suportados

- **Chrome** 🌐
- **Edge** 🔷
- **Firefox** 🦊
- **Brave** 🦁

## 📝 Arquivos

- `scripts/get-browser-info.ps1` - Função de detecção do browser
- `scripts/setup-browser-prompt.ps1` - Script de instalação
- `$PROFILE` - Profile do PowerShell (criado automaticamente)

## 🐛 Troubleshooting

**Browser não aparece?**
- Verifique se o browser está instalado em caminho padrão
- Execute `Get-ActiveBrowser` para ver detalhes

**Erro ao carregar profile?**
- Verifique se o caminho do script está correto
- Execute `. $PROFILE` para ver erros

**Cores não aparecem?**
- Verifique se o terminal suporta ANSI colors
- No PowerShell 7+, cores funcionam nativamente

## 🔄 Atualizar

Para atualizar após mudanças nos scripts:

```powershell
.\scripts\setup-browser-prompt.ps1
```

Ou recarregar manualmente:

```powershell
. $PROFILE
```
