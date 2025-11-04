# Guia de Rollback - Nossa Maternidade

## 🔄 Como Reverter a Consolidação

### Opção 1: Reverter Commits

```bash
# Criar branch de rollback
git checkout -b rollback/consolidation

# Reverter últimos commits (ajustar número conforme necessário)
git revert HEAD~10..HEAD

# Commit
git commit -m "Reverte consolidação monorepo"

# Push
git push origin rollback/consolidation
```

### Opção 2: Remover Arquivos Criados

```bash
# Remover estrutura monorepo
rm -rf apps/
rm -rf infra/
rm -rf packages/
rm -rf __tests__/contracts/
rm -rf e2e/maestro/

# Remover workflows novos
rm .github/workflows/e2e-android.yml
rm .github/workflows/release.yml
rm .github/workflows/observability.yml

# Remover scripts
rm scripts/check-coverage.js
rm scripts/validate-local.sh
rm scripts/validate-local.ps1

# Restaurar package.json original (se necessário)
git checkout HEAD -- package.json
```

### Opção 3: Restaurar Estrutura Original

```bash
# Mover arquivos de volta
mv apps/mobile/src src
mv apps/mobile/App.tsx App.tsx
mv apps/mobile/app.json app.json
mv apps/mobile/babel.config.js babel.config.js
mv apps/mobile/assets assets

mv infra/supabase/functions supabase/functions
mv infra/supabase/migrations supabase/migrations
mv infra/supabase/schema/*.sql supabase/

# Remover estrutura monorepo
rm -rf apps/
rm -rf infra/
rm -rf packages/
```

## ⚠️ Atenção

- **Backup**: Sempre fazer backup antes de rollback
- **Testar**: Validar funcionamento após rollback
- **Commits**: Manter commits organizados para facilitar rollback

## 📝 Checklist de Rollback

- [ ] Backup feito
- [ ] Estrutura monorepo removida
- [ ] Arquivos originais restaurados
- [ ] Imports atualizados (se necessário)
- [ ] Dependências instaladas
- [ ] Build local funcionando
- [ ] Testes passando
