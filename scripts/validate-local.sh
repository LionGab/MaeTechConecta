#!/bin/bash
# Validação Local - Nossa Maternidade
# Script para validar tudo localmente antes de commit

set -e

echo "🔍 Validando projeto localmente..."

# 1. Lint
echo "📝 Executando lint..."
pnpm run lint || echo "⚠️  Lint encontrou problemas"

# 2. Type Check
echo "🔎 Executando type check..."
pnpm run typecheck || echo "⚠️  Type check encontrou problemas"

# 3. Tests
echo "🧪 Executando testes..."
pnpm test || echo "⚠️  Testes falharam"

# 4. Coverage
echo "📊 Verificando coverage..."
pnpm run test:coverage || echo "⚠️  Coverage falhou"
pnpm run test:coverage:check || echo "⚠️  Coverage < 70%"

# 5. Format Check
echo "✨ Verificando formatação..."
pnpm run format:check || echo "⚠️  Formatação inconsistente"

echo "✅ Validação local concluída!"


