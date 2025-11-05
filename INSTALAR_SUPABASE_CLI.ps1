# COPIAR E COLAR ESTES COMANDOS NO POWERSHELL (UM POR VEZ)

# 1. Verificar se Scoop está instalado
scoop --version

# Se der erro, instale o Scoop primeiro:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# 2. Adicionar bucket do Supabase
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

# 3. Instalar Supabase CLI
scoop install supabase

# 4. Verificar instalação
supabase --version

# 5. Fazer login (abrirá o navegador)
supabase login

# 6. Link com projeto (substitua SEU-PROJECT-REF pelo seu Reference ID)
supabase link --project-ref SEU-PROJECT-REF

# 7. Verificar projetos linkados
supabase projects list

# 8. Configurar secrets
.\scripts\setup-secrets.ps1

