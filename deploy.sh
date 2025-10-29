#!/bin/bash

# Configura o Git com informações de usuário (substitua pelos seus dados)
git config --global user.name "Maé Tech"
git config --global user.email "suporte@maetech.com.br"

# Inicializa um novo repositório Git
git init

# Adiciona todos os arquivos ao stage
git add .

# Cria o commit inicial
git commit -m "🎉 Primeiro commit: Iniciando o projeto ClubNath"

# Informa ao usuário os próximos passos
echo "✅ Repositório Git inicializado e commit criado com sucesso!"
echo "🚀 Agora, siga estes passos para enviar para o GitHub:"
echo "1. Crie um novo repositório no GitHub (não inicialize com README ou .gitignore)."
echo "2. Copie o URL do seu repositório (ex: https://github.com/seu-usuario/seu-repo.git)."
echo "3. Execute os seguintes comandos no seu terminal:"
echo ""
echo "   git remote add origin SEU_URL_DO_REPOSITORIO_AQUI"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
