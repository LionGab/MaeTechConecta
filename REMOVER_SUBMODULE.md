# 🗑️ Remover Submodule LionNath-archive

## ⚠️ Problema

O Netlify está falhando porque o repositório referencia um submodule `LionNath-archive` que não tem URL configurada no `.gitmodules`.

## ✅ Solução

### Opção 1: Script Automático (Recomendado)

```powershell
.\scripts\remove-submodule.ps1
```

O script remove o submodule corretamente e depois você faz commit.

### Opção 2: Manual (Passo a Passo)

```powershell
# 1. Desinicializar o submodule
git submodule deinit -f LionNath-archive

# 2. Remover módulo do Git
Remove-Item -Recurse -Force ".git/modules/LionNath-archive" -ErrorAction SilentlyContinue

# 3. Remover do índice do Git
git rm -f LionNath-archive

# 4. Remover diretório local (se existir)
Remove-Item -Recurse -Force "LionNath-archive" -ErrorAction SilentlyContinue

# 5. Verificar e remover do .gitmodules (se existir)
# Abra .gitmodules e remova a entrada [submodule "LionNath-archive"]
# Se ficar vazio, pode deletar o arquivo
```

## 📦 Após Remover

```powershell
# 1. Adicionar mudanças
git add .

# 2. Fazer commit
git commit -m "chore: remover submodule LionNath-archive

- Remover submodule LionNath-archive que causava erro no Netlify
- Submodule não tinha URL configurada no .gitmodules
- Não é mais necessário para o projeto"

# 3. Push para main
git push origin main
```

## ✅ Verificar

```powershell
# Verificar se foi removido
git ls-files | Select-String -Pattern "LionNath-archive"

# Não deve aparecer nada (submodule removido)
```

## 🔍 Se o Erro Persistir

Se o Netlify ainda der erro após remover:

1. **Verificar se há referências no .git/config:**

   ```powershell
   cat .git/config | Select-String -Pattern "LionNath-archive"
   ```

2. **Remover manualmente do .git/config se necessário**

3. **Fazer novo commit e push**

---

**Status:** ✅ Script criado | ⚠️ Execute o script para remover
