# 🚀 Comandos PowerShell - Guia Rápido

## ⚠️ IMPORTANTE: Não cole Markdown no PowerShell!

Os arquivos `.md` são **documentação**, não comandos PowerShell!

---

## 🔧 Instalar Supabase CLI

### Opção 1: Script Automático (Recomendado)

```powershell
.\scripts\install-supabase-cli-quick.ps1
```

### Opção 2: Manual (Passo a Passo)

```powershell
# 1. Instalar Scoop (se não tiver)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# 2. Adicionar bucket do Supabase
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

# 3. Instalar Supabase CLI
scoop install supabase

# 4. Verificar
supabase --version
```

---

## 🔐 Configurar Secrets do Supabase

```powershell
# 1. Fazer login
supabase login

# 2. Link com projeto
supabase link --project-ref SEU-PROJECT-REF

# 3. Configurar secrets
.\scripts\setup-secrets.ps1
```

---

## 📋 Verificar Instalação

```powershell
# Verificar versão do Supabase CLI
supabase --version

# Verificar se está logado
supabase projects list

# Verificar secrets configurados
supabase secrets list
```

---

## ❌ Erros Comuns

### Erro: "supabase: command not found"

**Solução:**
1. Feche e reabra o PowerShell
2. Verifique se o PATH está configurado
3. Execute: `refreshenv` (se usar Chocolatey)

### Erro: "scoop: command not found"

**Solução:**
Instale o Scoop primeiro:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

### Erro: ParserError com `- [ ]` ou `---`

**Causa:** Você tentou executar Markdown no PowerShell!

**Solução:** 
- Use apenas os comandos PowerShell (sem `- [ ]`, `---`, `**`, etc.)
- Os arquivos `.md` são apenas documentação
- Execute os comandos listados acima

---

## 📝 Checklist (para referência, NÃO execute no PowerShell!)

- [ ] Scoop instalado
- [ ] Supabase CLI instalado
- [ ] Login feito (`supabase login`)
- [ ] Projeto linkado (`supabase link`)
- [ ] Secrets configurados (`supabase secrets list`)

---

**Lembrete:** Use apenas comandos PowerShell. Os arquivos `.md` são documentação!

