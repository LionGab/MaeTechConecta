# 📦 Git Keep All Auto - Comandos Automáticos

Versões automáticas dos comandos git keep que **não pedem confirmação**.

## 🚀 Comandos Disponíveis

### Keep All (Adicionar Todas as Mudanças)

```bash
# Node.js (cross-platform)
npm run git:keep-all

# PowerShell (Windows)
npm run git:keep-all:ps1
```

**O que faz:**

- Adiciona todas as mudanças ao staging (`git add --all`)
- Não pede confirmação
- Mostra status antes e depois

**Com commit automático:**

```bash
# Commit automático
AUTO_COMMIT=true npm run git:keep-all "mensagem do commit"

# Commit + Push automático
AUTO_COMMIT=true AUTO_PUSH=true npm run git:keep-all "mensagem do commit"
```

### Keep Ours (Mantém Nossas Mudanças)

```bash
# Node.js
npm run git:keep-ours

# PowerShell
npm run git:keep-ours:ps1
```

**O que faz:**

- Resolve conflitos mantendo nossas mudanças (`git checkout --ours .`)
- Adiciona ao staging automaticamente
- Não pede confirmação

### Keep Theirs (Mantém Mudanças Deles)

```bash
# Node.js
npm run git:keep-theirs

# PowerShell
npm run git:keep-theirs:ps1
```

**O que faz:**

- Resolve conflitos mantendo mudanças deles (`git checkout --theirs .`)
- Adiciona ao staging automaticamente
- Não pede confirmação

## 📋 Variáveis de Ambiente

### AUTO_COMMIT

Habilita commit automático após keep all:

```bash
AUTO_COMMIT=true npm run git:keep-all "chore: auto commit"
```

### COMMIT_MESSAGE

Define mensagem do commit:

```bash
COMMIT_MESSAGE="feat: nova feature" AUTO_COMMIT=true npm run git:keep-all
```

### AUTO_PUSH

Habilita push automático após commit:

```bash
AUTO_COMMIT=true AUTO_PUSH=true npm run git:keep-all "mensagem"
```

## 🎯 Exemplos de Uso

### Fluxo Completo Automático

```bash
# 1. Adicionar todas as mudanças
npm run git:keep-all

# 2. Fazer commit automático
AUTO_COMMIT=true npm run git:keep-all "feat: adiciona nova feature"

# 3. Commit + Push automático
AUTO_COMMIT=true AUTO_PUSH=true npm run git:keep-all "feat: adiciona nova feature"
```

### Resolver Conflitos de Merge

```bash
# Manter nossas mudanças
npm run git:keep-ours

# Manter mudanças deles
npm run git:keep-theirs

# Depois fazer commit
git commit -m "resolve: merge conflicts"
```

### Integração com Outros Comandos

```bash
# Review changes + Keep all + Commit
npm run review-changes:auto && AUTO_COMMIT=true npm run git:keep-all "chore: auto update"
```

## 🔧 Scripts Disponíveis

### Node.js (Cross-Platform)

- `scripts/git-keep-all-auto.js`
- `scripts/git-keep-ours-auto.js`
- `scripts/git-keep-theirs-auto.js`

### PowerShell (Windows)

- `scripts/git-keep-all-auto.ps1`
- `scripts/git-keep-ours-auto.ps1`
- `scripts/git-keep-theirs-auto.ps1`

## 📊 Comparação

| Comando           | Script Original  | Script Auto        |
| ----------------- | ---------------- | ------------------ |
| `git:keep-all`    | Pede confirmação | ✅ Sem confirmação |
| `git:keep-ours`   | Pede "SIM"       | ✅ Sem confirmação |
| `git:keep-theirs` | Pede "SIM"       | ✅ Sem confirmação |

## ⚙️ Configuração

### Alias Git (Opcional)

```bash
# Criar aliases git
git config --global alias.keep-all "add --all"
git config --global alias.keep-ours "checkout --ours . && add -A"
git config --global alias.keep-theirs "checkout --theirs . && add -A"

# Usar
git keep-all
git keep-ours
git keep-theirs
```

## 🎉 Pronto!

Agora você pode usar keep all automaticamente:

```bash
# Adicionar todas as mudanças (sem confirmação)
npm run git:keep-all

# Com commit automático
AUTO_COMMIT=true npm run git:keep-all "mensagem"
```

---

**Criado em:** 04/11/2025  
**Versão:** 1.0
