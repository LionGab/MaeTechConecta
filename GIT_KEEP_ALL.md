# Git Commands - Keep All Changes

## 🔄 Git Keep All Commands

### 1. Keep All (Stage All Changes)

```powershell
# Adicionar todas as mudanças (tracked + untracked)
git add --all
# ou
git add -A
# ou
git add .
```

### 2. Keep All During Merge Conflict (Theirs)

```powershell
# Manter todas as mudanças DELES (incoming changes)
git checkout --theirs .
git add -A
```

### 3. Keep All During Merge Conflict (Ours)

```powershell
# Manter todas as mudanças NOSSAS (current changes)
git checkout --ours .
git add -A
```

### 4. Keep All Untracked Files

```powershell
# Adicionar arquivos não rastreados
git add -A
```

### 5. Discard All Local Changes (Opposite)

```powershell
# Descartar TODAS as mudanças locais
git reset --hard HEAD
git clean -fd
```

---

## 📋 Scripts Úteis

### Script PowerShell - Git Keep All

```powershell
# keep-all.ps1
git add --all
Write-Host "✅ Todas as mudanças foram adicionadas!" -ForegroundColor Green
git status
```

### Script PowerShell - Git Keep Theirs (Merge Conflicts)

```powershell
# keep-theirs.ps1
git checkout --theirs .
git add -A
Write-Host "✅ Mantidas todas as mudanças deles (theirs)!" -ForegroundColor Green
```

### Script PowerShell - Git Keep Ours (Merge Conflicts)

```powershell
# keep-ours.ps1
git checkout --ours .
git add -A
Write-Host "✅ Mantidas todas as mudanças nossas (ours)!" -ForegroundColor Green
```

---

## 🎯 Atalhos VS Code / Cursor

### Configuração de Atalhos (keybindings.json)

```json
[
  {
    "key": "ctrl+shift+alt+a",
    "command": "git.stageAll",
    "when": "!inDebugMode"
  },
  {
    "key": "ctrl+shift+alt+k",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
      "text": "git add --all\n"
    }
  }
]
```

---

## 🚀 Comando Rápido

Execute este comando no terminal:

```powershell
git add --all && git status
```

Ou use o alias:

```powershell
# Criar alias
git config --global alias.keep-all "add --all"

# Usar
git keep-all
```
