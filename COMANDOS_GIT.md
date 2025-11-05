# 🔧 Comandos Git - Commit e Push

## 📦 Fazer Commit e Push na Main

### Opção 1: Script Automático (Recomendado)

```powershell
.\scripts\commit-to-main.ps1
```

### Opção 2: Manual (Passo a Passo)

```powershell
# 1. Verificar status
git status

# 2. Adicionar mudanças
git add .

# 3. Fazer commit
git commit -m "feat: adicionar sistema de temas múltiplos e tema v0.app

- Criar sistema de gerenciamento de temas múltiplos
- Adicionar tema v0.app (estrutura pronta para preencher cores)
- Atualizar ThemeContext para suportar múltiplos temas
- Criar componente ThemeSelector para seleção de tema
- Adicionar helpers para gerar escalas de cores dinamicamente
- Criar documentação completa do sistema de temas
- Adicionar scripts e documentação para configuração de secrets (Fase 3)
- Corrigir script install-supabase-cli.ps1 (PATH comparison)
- Criar documentação para instalação do Supabase CLI no Windows"

# 4. Push para main
git push origin main
```

## 📋 Resumo das Mudanças

### Tema v0.app

- Sistema de temas múltiplos
- Tema v0.app criado (estrutura)
- ThemeContext atualizado
- Componente ThemeSelector

### Configuração de Secrets (Fase 3)

- Scripts de setup (setup-secrets.ps1, setup-secrets.sh)
- Scripts de validação (validate-secrets.sh)
- Documentação completa (FASE3_CONFIGURACAO_SECRETS.md)
- Scripts de instalação do Supabase CLI

### Correções

- Script install-supabase-cli.ps1 (PATH comparison corrigida)

## ✅ Verificar Após Push

```powershell
# Verificar último commit
git log -1

# Verificar status
git status
```

---

**Status:** ✅ Pronto para commit e push
