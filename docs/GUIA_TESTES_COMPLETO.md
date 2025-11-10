# 🧪 GUIA COMPLETO DE TESTES - Nossa Maternidade

## 📋 Índice

1. [Testes Locais](#testes-locais)
2. [Testes no Repositório Público (MaeTechConecta)](#testes-no-repositório-público)
3. [Testes no Repositório Privado (NossaMaternidade-Private)](#testes-no-repositório-privado)
4. [Testes de CI/CD](#testes-de-cicd)
5. [Testes de Funcionalidades](#testes-de-funcionalidades)

---

## 🏠 Testes Locais

### Pré-requisitos

```powershell
# 1. Verificar Node.js
node --version  # Deve ser >= 18.0.0

# 2. Verificar pnpm
pnpm --version  # Deve ser >= 8.0.0

# 3. Verificar Git
git --version

# 4. Verificar Expo CLI
npx expo --version
```

### Passo 1: Clonar Repositório (se necessário)

```powershell
# Se ainda não tem o projeto localmente
cd C:\Users\Usuario\Documents
git clone https://github.com/LionGab/MaeTechConecta.git NossaMaternidade
cd NossaMaternidade
```

### Passo 2: Instalar Dependências

```powershell
# Instalar todas as dependências
pnpm install

# Verificar instalação
pnpm list --depth=0
```

### Passo 3: Configurar Variáveis de Ambiente

```powershell
# Verificar se .env.local existe
Test-Path .env.local

# Se não existir, criar baseado no .env.example
Copy-Item .env.example .env.local

# Editar .env.local com suas credenciais
notepad .env.local
```

**Variáveis obrigatórias:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
EXPO_PUBLIC_GEMINI_API_KEY=sua_gemini_key_aqui
```

### Passo 4: Conectar Supabase

```powershell
# Conectar ao projeto Supabase
supabase link --project-ref bbcwitnbnosyfpfjtzkr

# Verificar conexão
supabase status
```

### Passo 5: Executar Testes Unitários

```powershell
# Executar todos os testes
pnpm test

# Executar testes com coverage
pnpm test:coverage

# Executar testes em modo watch
pnpm test:watch
```

### Passo 6: Verificar Tipos TypeScript

```powershell
# Verificar tipos sem compilar
pnpm type-check

# Compilar e verificar erros
pnpm build
```

### Passo 7: Verificar Lint

```powershell
# Verificar código
pnpm lint

# Corrigir automaticamente
pnpm lint:fix
```

### Passo 8: Iniciar App em Desenvolvimento

```powershell
# Iniciar Metro Bundler
pnpm dev

# Ou especificamente para mobile
pnpm -C apps/mobile dev
```

**O que esperar:**
- QR Code no terminal
- Metro Bundler iniciado
- App disponível em `exp://192.168.x.x:8081`
- Web disponível em `http://localhost:8081`

### Passo 9: Testar no Dispositivo/Emulador

**Android:**
```powershell
# Pressionar 'a' no terminal do Expo
# Ou escanear QR Code com Expo Go
```

**iOS:**
```powershell
# Pressionar 'i' no terminal do Expo
# Ou escanear QR Code com Camera app
```

**Web:**
```powershell
# Pressionar 'w' no terminal do Expo
# Ou acessar http://localhost:8081
```

---

## 🌐 Testes no Repositório Público (MaeTechConecta)

### URL: https://github.com/LionGab/MaeTechConecta

### Passo 1: Clonar Repositório

```powershell
cd C:\Users\Usuario\Documents
git clone https://github.com/LionGab/MaeTechConecta.git MaeTechConecta-Test
cd MaeTechConecta-Test
```

### Passo 2: Verificar Branch e Commits

```powershell
# Verificar branch atual
git branch

# Verificar últimos commits
git log --oneline -10

# Verificar status
git status
```

### Passo 3: Verificar Workflows CI/CD

```powershell
# Verificar workflows disponíveis
Get-ChildItem .github\workflows\*.yml

# Deve ter:
# - ci.yml
# - vercel-preview.yml
# - eas-preview.yml
```

### Passo 4: Criar Branch de Teste

```powershell
# Criar branch para testes
git checkout -b teste-funcionalidades

# Fazer uma mudança pequena
echo "# Teste" >> TESTE.md
git add TESTE.md
git commit -m "test: adicionar arquivo de teste"
```

### Passo 5: Criar Pull Request

```powershell
# Push da branch
git push origin teste-funcionalidades

# No GitHub:
# 1. Acessar: https://github.com/LionGab/MaeTechConecta
# 2. Clicar em "Compare & pull request"
# 3. Preencher título e descrição
# 4. Clicar em "Create pull request"
```

### Passo 6: Verificar CI/CD no PR

**No GitHub:**
1. Acessar o PR criado
2. Verificar se os workflows estão rodando:
   - ✅ `ci.yml` (lint, type-check, test, build)
   - ✅ `vercel-preview.yml` (deploy preview web)
   - ✅ `eas-preview.yml` (build preview mobile)

**O que verificar:**
- ✅ Todos os jobs passando (verde)
- ✅ Sem erros de lint
- ✅ Sem erros de TypeScript
- ✅ Testes passando
- ✅ Build concluído

### Passo 7: Testar Preview Deploy (Vercel)

**Se `vercel-preview.yml` passou:**
1. No PR, procurar por "Deployments" ou "Preview"
2. Clicar no link do preview
3. Testar funcionalidades web:
   - ✅ App carrega
   - ✅ Navegação funciona
   - ✅ Chat NathIA funciona
   - ✅ Onboarding funciona

### Passo 8: Testar Preview Build (EAS)

**Se `eas-preview.yml` passou:**
1. No PR, procurar por "Artifacts" ou "Build"
2. Baixar o APK/IPA gerado
3. Instalar no dispositivo
4. Testar funcionalidades mobile:
   - ✅ App abre
   - ✅ Navegação funciona
   - ✅ Chat NathIA funciona
   - ✅ Push notifications funcionam

### Passo 9: Merge e Verificação Final

```powershell
# Após merge no GitHub, atualizar local
git checkout main
git pull origin main

# Verificar que tudo está atualizado
git log --oneline -5
```

---

## 🔒 Testes no Repositório Privado (NossaMaternidade-Private)

### URL: https://github.com/LionGab/NossaMaternidade-Private

### Passo 1: Clonar Repositório Privado

```powershell
cd C:\Users\Usuario\Documents
git clone https://github.com/LionGab/NossaMaternidade-Private.git NossaMaternidade-Private-Test
cd NossaMaternidade-Private-Test
```

### Passo 2: Verificar Conteúdo

```powershell
# Verificar estrutura
Get-ChildItem -Recurse -Directory | Select-Object FullName

# Verificar arquivos principais
Get-ChildItem *.json, *.md, *.yml -Recurse | Select-Object Name, Directory
```

### Passo 3: Verificar Secrets Não Bloqueados

**Vantagem do repositório privado:**
- ✅ Não há bloqueio de secrets
- ✅ Pode fazer push direto na main
- ✅ Histórico completo disponível

```powershell
# Verificar histórico completo
git log --oneline --all

# Verificar branches
git branch -a
```

### Passo 4: Testar Push Direto

```powershell
# Criar arquivo de teste
echo "# Teste Repositório Privado" >> TESTE_PRIVADO.md
git add TESTE_PRIVADO.md
git commit -m "test: teste push direto no privado"
git push origin main

# Deve funcionar sem bloqueios!
```

### Passo 5: Verificar Workflows (se configurados)

```powershell
# Verificar se workflows existem
Test-Path .github\workflows

# Se existirem, verificar conteúdo
Get-ChildItem .github\workflows\*.yml | ForEach-Object { Write-Host $_.Name; Get-Content $_.FullName | Select-Object -First 20 }
```

### Passo 6: Testar Funcionalidades Específicas

**Testar Edge Functions:**
```powershell
# Deploy Edge Functions
supabase functions deploy nathia-chat
supabase functions deploy personalize-tip

# Testar função
curl -X POST https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/nathia-chat \
  -H "Authorization: Bearer sua_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá"}'
```

**Testar Migrations:**
```powershell
# Verificar migrations pendentes
supabase migration list

# Aplicar migrations (se necessário)
supabase db push
```

---

## 🔄 Testes de CI/CD

### Teste 1: Workflow `ci.yml`

**O que testa:**
- ✅ Lint (ESLint)
- ✅ Type-check (TypeScript)
- ✅ Testes (Vitest)
- ✅ Build (Expo)

**Como testar:**

```powershell
# 1. Criar branch de teste
git checkout -b teste-ci

# 2. Fazer mudança que quebra lint
echo "const x = 1" >> apps/mobile/src/test-lint.ts
git add .
git commit -m "test: quebrar lint"
git push origin teste-ci

# 3. Criar PR e verificar que CI falha

# 4. Corrigir
Remove-Item apps/mobile/src/test-lint.ts
git add .
git commit -m "fix: remover arquivo de teste"
git push origin teste-ci

# 5. Verificar que CI passa agora
```

### Teste 2: Workflow `vercel-preview.yml`

**O que testa:**
- ✅ Deploy preview na Vercel
- ✅ Build web funcionando

**Como testar:**

```powershell
# 1. Verificar se VERCEL_TOKEN está configurado no GitHub
# Settings > Secrets and variables > Actions > VERCEL_TOKEN

# 2. Criar PR
git checkout -b teste-vercel-preview
echo "# Teste Vercel" >> TESTE_VERCEL.md
git add .
git commit -m "test: teste vercel preview"
git push origin teste-vercel-preview

# 3. Criar PR no GitHub
# 4. Verificar que workflow roda
# 5. Verificar link de preview no PR
```

### Teste 3: Workflow `eas-preview.yml`

**O que testa:**
- ✅ Build preview no EAS
- ✅ APK/IPA gerado

**Como testar:**

```powershell
# 1. Verificar se EAS_TOKEN está configurado no GitHub
# Settings > Secrets and variables > Actions > EAS_TOKEN

# 2. Criar PR
git checkout -b teste-eas-preview
echo "# Teste EAS" >> TESTE_EAS.md
git add .
git commit -m "test: teste eas preview"
git push origin teste-eas-preview

# 3. Criar PR no GitHub
# 4. Verificar que workflow roda
# 5. Verificar artifacts gerados
```

---

## 🎯 Testes de Funcionalidades

### Teste 1: Chat NathIA

**Passo a passo:**

1. **Abrir app**
   ```powershell
   pnpm dev
   # Pressionar 'w' para web ou escanear QR code
   ```

2. **Navegar para Chat**
   - Clicar em "NathIA" na navegação inferior
   - Ou acessar diretamente: `/chat`

3. **Enviar mensagem**
   - Digitar: "Olá, como você está?"
   - Clicar em enviar
   - ✅ Verificar resposta da IA

4. **Verificar histórico**
   - ✅ Mensagens aparecem na tela
   - ✅ Scroll funciona
   - ✅ Formatação correta

5. **Testar diferentes tipos de mensagem**
   - Pergunta médica: "Estou com 20 semanas, é normal sentir..."
   - Desabafo emocional: "Estou muito ansiosa..."
   - Pergunta prática: "Como preparar o enxoval?"

### Teste 2: Onboarding

**Passo a passo:**

1. **Limpar dados locais** (se necessário)
   ```powershell
   # No app, limpar AsyncStorage ou reinstalar
   ```

2. **Abrir app pela primeira vez**
   - ✅ Tela de onboarding aparece

3. **Preencher cada step**
   - **Step 1 - Identity:** Nome, tipo de usuária
   - **Step 2 - Emotional:** Estado emocional
   - **Step 3 - Challenges:** Desafios enfrentados
   - **Step 4 - Support:** Rede de apoio
   - **Step 5 - Preferences:** Preferências

4. **Finalizar onboarding**
   - ✅ Dados salvos no Supabase
   - ✅ Redirecionamento para Home
   - ✅ Personalização aplicada

### Teste 3: Plano do Dia

**Passo a passo:**

1. **Acessar Home**
   - ✅ Plano do dia aparece

2. **Verificar conteúdo**
   - ✅ Prioridades do dia
   - ✅ Dica personalizada
   - ✅ Receita (se disponível)

3. **Testar "Por que isso?"**
   - Clicar no botão
   - ✅ Modal abre
   - ✅ Explicação aparece

4. **Atualizar plano**
   - Pull to refresh
   - ✅ Novo plano carrega

### Teste 4: Hábitos

**Passo a passo:**

1. **Acessar tela de Hábitos**
   - Navegar para "Hábitos"

2. **Verificar hábitos disponíveis**
   - ✅ Lista de hábitos aparece
   - ✅ Status de cada hábito visível

3. **Marcar hábito como completo**
   - Clicar no checkbox
   - ✅ Hábito marcado
   - ✅ Streak atualizado

4. **Verificar histórico**
   - ✅ Histórico de completions visível
   - ✅ Estatísticas corretas

### Teste 5: Conteúdos

**Passo a passo:**

1. **Acessar tela de Conteúdos**
   - Navegar para "Conteúdos"

2. **Verificar lista**
   - ✅ Conteúdos aparecem
   - ✅ Categorias funcionam
   - ✅ Busca funciona

3. **Abrir conteúdo**
   - Clicar em um item
   - ✅ Detalhes aparecem
   - ✅ Conteúdo renderizado

4. **Favoritar**
   - Clicar em favoritar
   - ✅ Adicionado aos favoritos

### Teste 6: Perfil

**Passo a passo:**

1. **Acessar Perfil**
   - Navegar para "Perfil"

2. **Verificar informações**
   - ✅ Dados do onboarding aparecem
   - ✅ Estatísticas corretas

3. **Editar perfil**
   - Clicar em editar
   - ✅ Formulário abre
   - ✅ Salvar funciona

4. **Configurações**
   - ✅ Notificações
   - ✅ Privacidade
   - ✅ Sair da conta

---

## ✅ Checklist de Validação Final

### Repositório Público (MaeTechConecta)
- [ ] Clone funciona
- [ ] Dependências instalam
- [ ] Lint passa
- [ ] Type-check passa
- [ ] Testes passam
- [ ] Build funciona
- [ ] CI/CD workflows funcionam
- [ ] Preview deploy funciona
- [ ] Preview build funciona

### Repositório Privado (NossaMaternidade-Private)
- [ ] Clone funciona
- [ ] Push direto funciona (sem bloqueios)
- [ ] Histórico completo disponível
- [ ] Edge Functions deployam
- [ ] Migrations aplicam

### Funcionalidades do App
- [ ] Chat NathIA funciona
- [ ] Onboarding completo funciona
- [ ] Plano do dia aparece e atualiza
- [ ] Hábitos funcionam
- [ ] Conteúdos carregam
- [ ] Perfil funciona
- [ ] Navegação funciona
- [ ] Dark mode funciona
- [ ] Offline funciona (se implementado)

---

## 🐛 Troubleshooting

### Problema: CI/CD não roda

**Solução:**
```powershell
# Verificar se workflows estão no lugar certo
Test-Path .github\workflows\ci.yml

# Verificar sintaxe YAML
# Usar validador online: https://www.yamllint.com/
```

### Problema: Secrets não configurados

**Solução:**
1. GitHub > Settings > Secrets and variables > Actions
2. Adicionar secrets necessários:
   - `VERCEL_TOKEN`
   - `EAS_TOKEN`
   - `SUPABASE_SERVICE_ROLE_KEY` (se necessário)

### Problema: Build falha

**Solução:**
```powershell
# Limpar cache
pnpm store prune
rm -rf node_modules
rm -rf apps/mobile/node_modules
pnpm install

# Verificar versões
node --version
pnpm --version
```

### Problema: App não conecta ao Supabase

**Solução:**
```powershell
# Verificar .env.local
Get-Content .env.local | Select-String "SUPABASE"

# Verificar conexão
supabase status

# Testar conexão manual
curl https://bbcwitnbnosyfpfjtzkr.supabase.co/rest/v1/ \
  -H "apikey: sua_anon_key"
```

---

**Última atualização:** 2025-11-10  
**Versão:** 1.0.0

