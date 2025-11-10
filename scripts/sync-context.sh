#!/bin/bash
# Script de sincronização rápida - Nossa Maternidade
# Uso: ./sync-context.sh

echo "🔄 Sincronizando contexto..."

# 1. Pull do Git
echo "📥 Fazendo pull do repositório..."
git pull origin main

# 2. Instalar dependências
echo "📦 Instalando dependências..."
pnpm install

# 3. Verificar versões
echo "✅ Verificando versões instaladas..."
cd apps/mobile
pnpm list expo @types/jest @sentry/react-native react-native-web

echo ""
echo "✨ Sincronização completa!"
echo "📖 Para mais detalhes, veja: docs/CONTEXTO_RAPIDO.md"

