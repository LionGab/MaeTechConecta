# 🔄 Como Usar o Mesmo Contexto em Outro Terminal

## 📋 Guia Rápido

### 1. Navegar para o Mesmo Diretório

```powershell
# No novo terminal, navegue para o projeto
cd C:\Users\Usuario\Documents\NossaMaternidade
```

### 2. Carregar Variáveis de Ambiente (.env.local)

```powershell
# Carregar variáveis do .env.local manualmente
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}

# Ou usar o script de setup
.\scripts\setup-mvp-ultrathin.ps1
```

### 3. Verificar Configurações

```powershell
# Verificar diretório atual
pwd

# Verificar Git remotes
git remote -v

# Verificar branch atual
git branch

# Verificar variáveis de ambiente importantes
$env:EXPO_PUBLIC_SUPABASE_URL
$env:EXPO_PUBLIC_GEMINI_API_KEY
```

### 4. Configurar Ambiente Completo

```powershell
# Script completo para configurar novo terminal
cd C:\Users\Usuario\Documents\NossaMaternidade

# Carregar .env.local
if (Test-Path .env.local) {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
    Write-Host "✅ Variáveis de ambiente carregadas" -ForegroundColor Green
}

# Verificar Node/pnpm
node --version
pnpm --version

# Verificar Git
git status
```

---

## 🚀 Script Automático

Crie um arquivo `setup-terminal.ps1` na raiz do projeto:

```powershell
# setup-terminal.ps1
# Script para configurar novo terminal com mesmo contexto

Write-Host "🔧 Configurando terminal..." -ForegroundColor Cyan

# 1. Navegar para o projeto
Set-Location C:\Users\Usuario\Documents\NossaMaternidade
Write-Host "✅ Diretório: $(Get-Location)" -ForegroundColor Green

# 2. Carregar variáveis de ambiente
if (Test-Path .env.local) {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
    Write-Host "✅ Variáveis de ambiente carregadas" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local não encontrado" -ForegroundColor Yellow
}

# 3. Verificar ferramentas
Write-Host "`n📋 Verificando ferramentas:" -ForegroundColor Cyan
Write-Host "  Node: $(node --version)" -ForegroundColor White
Write-Host "  pnpm: $(pnpm --version)" -ForegroundColor White
Write-Host "  Git: $(git --version)" -ForegroundColor White

# 4. Status do Git
Write-Host "`n📦 Status do Git:" -ForegroundColor Cyan
git status --short

# 5. Remotes configurados
Write-Host "`n🔗 Remotes:" -ForegroundColor Cyan
git remote -v

Write-Host "`n✅ Terminal configurado!" -ForegroundColor Green
Write-Host "💡 Comandos úteis:" -ForegroundColor Yellow
Write-Host "  - pnpm dev          # Iniciar app" -ForegroundColor Gray
Write-Host "  - pnpm validate     # Validar código" -ForegroundColor Gray
Write-Host "  - git status        # Ver status Git" -ForegroundColor Gray
```

---

## 📝 Uso do Script

```powershell
# No novo terminal, execute:
.\setup-terminal.ps1

# Ou adicione ao seu perfil PowerShell para executar automaticamente:
# C:\Users\Usuario\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
```

---

## 🔄 Compartilhar Contexto Entre Terminais

### Opção 1: Variáveis de Ambiente do Sistema

```powershell
# Definir variáveis para todos os terminais (permanente)
[Environment]::SetEnvironmentVariable("EXPO_PUBLIC_SUPABASE_URL", "https://bbcwitnbnosyfpfjtzkr.supabase.co", "User")
[Environment]::SetEnvironmentVariable("EXPO_PUBLIC_GEMINI_API_KEY", "sua_chave", "User")

# Recarregar no novo terminal
$env:EXPO_PUBLIC_SUPABASE_URL = [Environment]::GetEnvironmentVariable("EXPO_PUBLIC_SUPABASE_URL", "User")
```

### Opção 2: Arquivo de Perfil PowerShell

Crie/edite: `C:\Users\Usuario\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`

```powershell
# Auto-carregar contexto do projeto
function Set-NossaMaternidadeContext {
    Set-Location C:\Users\Usuario\Documents\NossaMaternidade

    if (Test-Path .env.local) {
        Get-Content .env.local | ForEach-Object {
            if ($_ -match '^([^#][^=]+)=(.*)$') {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim()
                [Environment]::SetEnvironmentVariable($name, $value, 'Process')
            }
        }
    }
}

# Alias rápido
Set-Alias -Name nm -Value Set-NossaMaternidadeContext

# Auto-executar ao abrir terminal (opcional)
# Set-NossaMaternidadeContext
```

Uso:

```powershell
# No novo terminal, execute:
nm
```

---

## 🎯 Comandos Úteis para Novo Terminal

```powershell
# 1. Navegar para o projeto
cd C:\Users\Usuario\Documents\NossaMaternidade

# 2. Carregar .env.local
.\setup-terminal.ps1

# 3. Verificar status
git status
pnpm --version

# 4. Iniciar desenvolvimento
pnpm dev

# 5. Verificar remotes Git
git remote -v

# 6. Ver branch atual
git branch
```

---

## 📋 Checklist Rápido

- [ ] Navegar para `C:\Users\Usuario\Documents\NossaMaternidade`
- [ ] Carregar `.env.local` (usar script ou manualmente)
- [ ] Verificar Node/pnpm instalados
- [ ] Verificar Git configurado
- [ ] Verificar remotes Git (`git remote -v`)
- [ ] Testar comando `pnpm dev`

---

## 💡 Dicas

1. **Use o script `setup-terminal.ps1`** para configurar rapidamente
2. **Adicione ao perfil PowerShell** para auto-configuração
3. **Mantenha `.env.local` atualizado** em todos os terminais
4. **Use `git remote -v`** para verificar remotes configurados
5. **Use `git status`** para ver estado atual do repositório

---

**Última atualização:** 2025-11-10
