# 🦁 Como Criar o Repositório LionNath no GitHub

## 📋 Opção 1: Via GitHub CLI (Recomendado)

### Passo 1: Instalar GitHub CLI

```bash
# Windows (PowerShell)
winget install --id GitHub.cli

# Verificar instalação
gh --version
```

### Passo 2: Login

```bash
gh auth login
```

Escolha:
- GitHub.com
- HTTPS
- Autenticar Git com suas credenciais GitHub
- Login via navegador

### Passo 3: Criar Repositório

```bash
# Criar repositório público
gh repo create LionNath --public --description "🦁 Nossa Maternidade - Assistente Virtual de Maternidade"

# OU criar repositório privado
gh repo create LionNath --private --description "🦁 Nossa Maternidade - Assistente Virtual de Maternidade"

# Navegar para pasta do projeto
cd C:\Users\User\Desktop\Projetos\Correto

# Inicializar Git
git init
git add .
git commit -m "feat: versão inicial do app Nossa Maternidade"

# Conectar ao repositório remoto
git remote add origin https://github.com/seu-usuario/LionNath.git
git branch -M main
git push -u origin main
```

---

## 🌐 Opção 2: Via Navegador (Manual)

### Passo 1: Fazer Login no GitHub

1. Acesse https://github.com/login
2. Faça login com suas credenciais
3. Ou use "Continue with Google"

### Passo 2: Criar Novo Repositório

1. Clique em **"New repository"** (botão verde no canto superior direito)
2. Ou acesse diretamente: https://github.com/new

### Passo 3: Configurar Repositório

Preencha os campos:

- **Repository name**: `LionNath`
- **Description**: `🦁 Nossa Maternidade - Assistente Virtual de Maternidade`
- **Visibility**: 
  - ☑️ Public (público)
  - ⬜ Private (privado)
- **⚠️ NÃO marque**: "Add a README file" (já temos um)
- **⚠️ NÃO marque**: "Add .gitignore" (já temos um)
- **⚠️ NÃO marque**: "Choose a license" (já temos um)

### Passo 4: Criar e Conectar

1. Clique em **"Create repository"**
2. Copie o comando que aparecer (deve ser algo como):

```bash
git remote add origin https://github.com/seu-usuario/LionNath.git
git branch -M main
git push -u origin main
```

### Passo 5: Enviar Código

No terminal, na pasta do projeto:

```bash
cd C:\Users\User\Desktop\Projetos\Correto

# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "feat: versão inicial do app Nossa Maternidade"

# Adicionar remote
git remote add origin https://github.com/seu-usuario/LionNath.git

# Enviar para GitHub
git branch -M main
git push -u origin main
```

---

## 🎨 Personalizar o Repositório

Após criar o repositório, personalize-o:

### Adicionar Tópicos
Adicione tópicos no repositório:
- `react-native`
- `expo`
- `typescript`
- `ai`
- `maternidade`
- `brasil`
- `mobile-app`

### Configurar About
Adicione informações no "About":
- Website: `https://nossa-maternidade.com` (ou deixe em branco)
- Description: `🦁 Assistente virtual personalizada 24/7 para gravidez e maternidade`

### Configurar Social Preview
Adicione uma imagem de preview (1200x630px) na pasta `.github/`:
- `.github/social-preview.png`

---

## 📝 Arquivos Já Incluídos

O projeto já possui:
- ✅ `README.md` - Documentação principal
- ✅ `README_GITHUB.md` - README completo para GitHub
- ✅ `.gitignore` - Arquivos ignorados
- ✅ `LICENSE` - Licença MIT
- ✅ `CONTRIBUTING.md` - Guia de contribuição
- ✅ `.github/workflows/` - CI/CD pipelines
- ✅ `.github/ISSUE_TEMPLATE/` - Templates de issues
- ✅ `.github/PULL_REQUEST_TEMPLATE.md` - Template de PR

---

## 🚀 Após Publicar

### Verificar se Funcionou

```bash
gh repo view seu-usuario/LionNath
```

### Adicionar Badge no README

Edite o `README.md` para adicionar o link do repositório:

```markdown
[![GitHub](https://img.shields.io/badge/GitHub-LionNath-181717?logo=github)](https://github.com/seu-usuario/LionNath)
```

### Primeira Release

Após publicar, crie a primeira release:

```bash
# Criar tag
git tag -a v1.0.0 -m "Primeira versão do app"
git push origin v1.0.0

# Ou via GitHub CLI
gh release create v1.0.0 --title "v1.0.0" --notes "Primeira versão do app Nossa Maternidade"
```

---

## 🆘 Problemas Comuns

### Erro: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/seu-usuario/LionNath.git
```

### Erro: "failed to push some refs"

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Esqueci meu nome de usuário

```bash
git config user.name "Seu Nome"
git config user.email "seu.email@example.com"
```

---

## ✅ Checklist

- [ ] Login no GitHub feito
- [ ] Repositório "LionNath" criado
- [ ] Código enviado para o GitHub
- [ ] README aparece corretamente
- [ ] Tópicos adicionados
- [ ] About configurado
- [ ] Tags criadas (opcional)

---

**URL do Repositório**: https://github.com/seu-usuario/LionNath

Desenvolvido com 💕 para mães e gestantes no Brasil

