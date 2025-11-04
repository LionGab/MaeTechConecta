# 📊 Status do Git

## Branch Atual

- **Branch:** `master`
- **Tag:** `v0.5.3`
- **Último commit:** `chore(release): Bump to version 0.5.3 (resync)`

## Comandos Úteis do Git

### Ver Status

```powershell
git status
```

### Ver Histórico

```powershell
# Últimos 5 commits
git log --oneline -5

# Histórico completo
git log --oneline --graph --all
```

### Ver Branches

```powershell
# Branches locais
git branch

# Todas as branches (locais e remotas)
git branch -a
```

### Mudanças Pendentes

```powershell
# Ver mudanças não commitadas
git diff

# Ver mudanças staged
git diff --staged

# Ver arquivos modificados
git status --short
```

### Commits

```powershell
# Ver último commit
git show HEAD

# Ver commits de uma tag
git show v0.5.3
```

## Comandos Rápidos

### Se tiver mudanças não commitadas

```powershell
# Ver o que mudou
git status

# Adicionar todas as mudanças
git add .

# Ou adicionar arquivos específicos
git add arquivo1.txt arquivo2.txt

# Fazer commit
git commit -m "sua mensagem aqui"

# Push
git push origin master
```

### Se quiser ver o histórico completo

```powershell
git log --oneline --graph --all --decorate
```

## Próximos Passos

Se você está trabalhando na Fase 3 (Configuração de Secrets), pode ser útil:

1. **Fazer commit das mudanças:**

   ```powershell
   git add .
   git commit -m "feat: adicionar scripts e documentação de configuração de secrets"
   git push origin master
   ```

2. **Criar uma nova branch para desenvolvimento:**

   ```powershell
   git checkout -b feature/fase3-secrets
   ```

3. **Verificar mudanças pendentes:**
   ```powershell
   git status
   ```
