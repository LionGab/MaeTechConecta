# 🔧 Instalar Supabase CLI no Windows

**Problema:** `npm install -g supabase` não funciona no Windows.

**Solução:** Use um dos métodos abaixo:

## ✅ Método 1: Scoop (Recomendado - Mais Fácil)

### Passo 1: Instalar Scoop (se não tiver)

```powershell
# Abra PowerShell como usuário normal (não precisa ser Admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

### Passo 2: Instalar Supabase CLI

```powershell
# Adicionar bucket do Supabase
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

# Instalar Supabase CLI
scoop install supabase
```

### Passo 3: Verificar Instalação

```powershell
supabase --version
```

---

## ✅ Método 2: Chocolatey (Alternativa)

### Passo 1: Instalar Chocolatey (se não tiver)

**Execute PowerShell como Administrador:**

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString("https://community.chocolatey.org/install.ps1"))
```

### Passo 2: Instalar Supabase CLI

```powershell
choco install supabase -y
```

### Passo 3: Verificar Instalação

```powershell
supabase --version
```

---

## ✅ Método 3: Script Automático

Use o script fornecido no projeto:

```powershell
.\scripts\install-supabase-cli.ps1
```

O script oferece os 3 métodos e instala automaticamente.

---

## 🚀 Após Instalar

### 1. Fazer Login

```powershell
supabase login
```

Isso abrirá o navegador para autenticação.

### 2. Link com Projeto

```powershell
supabase link --project-ref SEU-PROJECT-REF
```

**Como obter o PROJECT-REF:**
- Acesse: https://supabase.com/dashboard
- Selecione seu projeto
- Settings > General > Reference ID

### 3. Verificar Link

```powershell
supabase projects list
```

### 4. Configurar Secrets

```powershell
.\scripts\setup-secrets.ps1
```

---

## 🔍 Verificar Instalação

```powershell
# Verificar versão
supabase --version

# Verificar se está logado
supabase projects list

# Verificar secrets configurados
supabase secrets list
```

---

## ⚠️ Troubleshooting

### Erro: "supabase: command not found"

**Solução:**
1. Feche e reabra o terminal/PowerShell
2. Verifique se o PATH está configurado corretamente
3. Tente reiniciar o computador (último recurso)

### Erro: "Scoop/choco: command not found"

**Solução:**
- Instale Scoop ou Chocolatey primeiro (veja Método 1 ou 2)

### Erro: "Permission denied"

**Solução:**
- Se usar Chocolatey, execute PowerShell como Administrador
- Se usar Scoop, não precisa ser Admin (usa diretório do usuário)

---

## 📋 Checklist

- [ ] Scoop ou Chocolatey instalado
- [ ] Supabase CLI instalado
- [ ] `supabase --version` funciona
- [ ] Login feito (`supabase login`)
- [ ] Projeto linkado (`supabase link`)
- [ ] Secrets configurados (`supabase secrets list`)

---

**Última atualização:** 2025-01-04

