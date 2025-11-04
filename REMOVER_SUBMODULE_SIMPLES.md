# 🗑️ Remover Submodule LionNath-archive - Comandos Simples

## ✅ Solução Rápida

Execute este script que faz tudo automaticamente:

```powershell
.\scripts\remove-submodule-complete.ps1
```

O script:
1. Remove o submodule
2. Remove do .gitmodules
3. Remove do .git/config
4. Faz commit
5. Faz push para main

## Ou Execute Manualmente (Copie e Cole)

```powershell
# 1. Desinicializar submodule
git submodule deinit -f LionNath-archive

# 2. Remover módulo do Git
Remove-Item -Recurse -Force ".git/modules/LionNath-archive" -ErrorAction SilentlyContinue

# 3. Remover do índice
git rm -f LionNath-archive

# 4. Remover diretório local
Remove-Item -Recurse -Force "LionNath-archive" -ErrorAction SilentlyContinue

# 5. Adicionar mudanças
git add .

# 6. Fazer commit
git commit -m "chore: remover submodule LionNath-archive"

# 7. Push para main
git push origin main
```

## ✅ Verificar

```powershell
# Verificar se foi removido
git status
```

Não deve aparecer mais "LionNath-archive" no status.

---

**Status:** ✅ Script criado | Execute: `.\scripts\remove-submodule-complete.ps1`

