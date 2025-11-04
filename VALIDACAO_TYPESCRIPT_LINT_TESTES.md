# Validação TypeScript, Lint e Testes - Nossa Maternidade

## 📋 Checklist de Validação

### 1.4 Validação TypeScript

```bash
# Verificar configuração TypeScript
npm run typecheck

# Se houver erros, salvar em arquivo
npm run typecheck 2>&1 | tee typescript-errors.log
```

**Checklist**:

- [ ] `npm run typecheck` passa sem erros
- [ ] Todos os imports estão resolvendo
- [ ] Paths aliases (`@/*`) funcionando

#### ✅ Configuração TypeScript Atualizada

O `tsconfig.json` foi atualizado com os seguintes paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@services/*": ["./src/services/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],
      "@theme/*": ["./src/theme/*"],
      "@nossa/shared/*": ["./packages/shared/src/*"]
    }
  }
}
```

#### ❌ Possíveis Erros e Soluções

**Erro: Cannot find module '@/...'**

**Solução**: Verificar se o `tsconfig.json` tem os paths configurados corretamente.

**Erro: Cannot find module '@nossa/shared/...'**

**Solução**: Verificar se o package `@nossa/shared` existe em `packages/shared/`.

---

### 1.5 Validação de Testes

```bash
# Executar testes
npm test

# Executar com coverage
npm run test:coverage

# Verificar threshold de 70%
npm run test:coverage:check
```

**Checklist**:

- [ ] Pelo menos 1 teste passa
- [ ] Coverage é calculado
- [ ] Nenhum teste falha
- [ ] Coverage ≥70% (pode ser ajustado inicialmente)

#### 📊 Testes Configurados

- **Vitest**: Framework de testes unitários
- **Coverage**: V8 provider com threshold de 70%
- **Testes existentes**:
  - `__tests__/services/supabase.test.ts`
  - `__tests__/services/ai.test.ts`
  - `__tests__/lib/nat-ai/guardrails.test.ts`

#### ⚠️ Nota sobre Coverage

Se o coverage inicial for menor que 70%, isso é normal. Continue implementando testes para aumentar a cobertura.

---

### 1.6 Validação de Lint

```bash
# Executar ESLint
npm run lint

# Se houver erros, tentar fix automático
npm run lint:fix
```

**Checklist**:

- [ ] ESLint configurado corretamente
- [ ] Regras do Expo aplicadas
- [ ] Sem erros críticos

#### 🔧 Configuração ESLint

O projeto usa:

- **ESLint**: Configuração padrão do Expo
- **Prettier**: Para formatação de código
- **Husky**: Para pre-commit hooks

---

## 🚀 Script de Validação Completa

Criei um script automatizado que executa todas as validações:

```bash
# Executar validação completa
node scripts/validate-all.js
```

Este script:

1. ✅ Executa TypeScript type check
2. ✅ Executa ESLint
3. ✅ Executa testes unitários
4. ✅ Calcula coverage
5. ✅ Verifica threshold de 70%

---

## 📝 Comandos Rápidos

```bash
# Validação completa (tudo de uma vez)
npm run validate

# Ou manualmente:
npm run lint && npm run typecheck && npm run test:coverage && npm run test:coverage:check
```

---

## ✅ Resultado Esperado

Após executar todas as validações, você deve ver:

```
✅ TypeScript configurado corretamente
✅ Lint configurado corretamente
✅ Testes executando
✅ Coverage calculado
```

Se houver erros, o script `validate-all.js` indicará quais ações tomar para corrigi-los.

---

## 🔍 Próximos Passos

1. **Executar validação**: `npm run validate`
2. **Corrigir erros**: Seguir as instruções do script
3. **Aumentar coverage**: Implementar mais testes
4. **Configurar CI/CD**: Adicionar secrets no GitHub Actions
