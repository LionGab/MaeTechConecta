# Branch Protection - Configuração GitHub

## Configuração Recomendada

**No GitHub:** Settings → Branches → Add rule

### Branch name pattern
```
main
```
(ou `master` se for sua branch principal)

### Configurações

#### ✅ Require a pull request before merging
- ✅ Require approvals: **2**
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners

#### ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Status checks:
  - ✅ `ci` (do workflow `.github/workflows/ci.yml`)

#### ✅ Restrict who can push to matching branches
- ✅ Restrict pushes that create files matching: Administrators only

#### ✅ Do not allow bypassing the above settings
- ✅ Incluir administradores

### Salvar

---

## Resultado Esperado

Após configurar:

✅ PRs requerem **2 approvals**  
✅ PRs requerem **CI verde**  
✅ Aprovações antigas são descartadas em novos commits  
✅ Apenas admins podem push direto em `main`  
✅ Auto-approve não pode bypassar proteções  

---

## Verificação

1. Criar PR de teste
2. Verificar que status check `ci` aparece
3. Tentar merge sem approval → deve bloquear
4. Tentar merge sem CI verde → deve bloquear

