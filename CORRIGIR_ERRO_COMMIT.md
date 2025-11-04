# 🔧 Corrigir Erro ao Fazer Commit

## ❌ Erro: "❌ Erro ao fazer commit"

### Possíveis Causas

1. **Configuração do Git incompleta**
   - `user.name` não configurado
   - `user.email` não configurado

2. **Nenhuma mudança foi adicionada**
   - `git add .` não funcionou
   - Arquivos já estão commitados

3. **Mensagem de commit inválida**
   - Caracteres especiais não escapados
   - Mensagem muito longa

### ✅ Solução

#### 1. Verificar Configuração do Git

```powershell
# Verificar configuração atual
git config --list

# Configurar user.name (se não estiver configurado)
git config --global user.name "Seu Nome"

# Configurar user.email (se não estiver configurado)
git config --global user.email "seu@email.com"
```

#### 2. Verificar Status do Git

```powershell
# Ver status detalhado
git status

# Ver mudanças não commitadas
git status --short

# Ver arquivos no staging
git diff --cached
```

#### 3. Adicionar Arquivos Manualmente

```powershell
# Adicionar todos os arquivos
git add .

# Ou adicionar arquivos específicos
git add arquivo1.ts arquivo2.ts

# Verificar o que foi adicionado
git status
```

#### 4. Fazer Commit Manualmente

```powershell
# Commit simples
git commit -m "sua mensagem aqui"

# Commit com mensagem multi-linha
git commit -m "Título

Descrição detalhada do commit"
```

#### 5. Usar o Script Melhorado

```powershell
# O script agora tem melhor tratamento de erros
.\scripts\git-commit-push.ps1 "sua mensagem aqui"
```

### 🔍 Diagnóstico

Se o erro persistir, execute:

```powershell
# 1. Verificar configuração do Git
git config --list | Select-String "user"

# 2. Verificar status
git status

# 3. Verificar se há arquivos para commitar
git diff --name-only

# 4. Verificar se há arquivos no staging
git diff --cached --name-only

# 5. Tentar commit com mensagem simples
git commit -m "test"
```

### 💡 Dicas

- **Sempre configure `user.name` e `user.email`** antes de fazer commits
- **Use mensagens de commit claras e descritivas**
- **Verifique `git status` antes de commitar**
- **Use o script `git-commit-push.ps1`** para commits automatizados com melhor tratamento de erros

### 📋 Checklist

- [ ] `user.name` configurado: `git config --global user.name "Seu Nome"`
- [ ] `user.email` configurado: `git config --global user.email "seu@email.com"`
- [ ] Verificou `git status` antes de commitar
- [ ] Executou `git add .` antes de commitar
- [ ] Mensagem de commit não tem caracteres problemáticos
- [ ] Tentou fazer commit manualmente para ver o erro específico

