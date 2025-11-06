# Comando: Validar Projeto

Execute validação completa do projeto antes de finalizar mudanças:

## Scripts de Validação

Execute na seguinte ordem:

1. **Type Check**
   ```bash
   npm run type-check
   ```
   - Verifica erros de tipo TypeScript
   - Deve passar sem erros

2. **Lint**
   ```bash
   npm run lint
   ```
   - Verifica padrões de código
   - Deve passar sem warnings críticos

3. **Testes**
   ```bash
   npm run test
   ```
   - Executa todos os testes
   - Coverage deve ser >= 70%

4. **Format Check**
   ```bash
   npm run format:check
   ```
   - Verifica formatação do código
   - Deve passar sem erros

## Validação Completa

Execute o comando completo:
```bash
npm run validate
```

Isso executa:
- Type check
- Lint
- Testes
- Format check

## Validação com Coverage

Para validação completa com coverage:
```bash
npm run validate:full
```

## Correções Automáticas

Se houver problemas:

1. **Corrigir formatação automaticamente:**
   ```bash
   npm run format
   ```

2. **Corrigir lint automaticamente (quando possível):**
   ```bash
   npm run lint:fix
   ```

## Checklist de Validação

- [ ] Type check passou sem erros
- [ ] Lint passou sem warnings críticos
- [ ] Todos os testes passaram
- [ ] Coverage >= 70%
- [ ] Formatação correta
- [ ] Sem erros de build

## Instruções para o Cursor

1. Execute `npm run validate`
2. Se houver erros, corrija-os
3. Execute novamente até passar
4. Se houver erros que não podem ser corrigidos automaticamente, liste-os e explique o motivo
5. Só finalize quando TODOS os checks passarem

## Integração CI/CD

Esta validação deve ser executada:
- Antes de cada commit (pre-commit hook)
- No CI/CD pipeline
- Antes de fazer merge para main

## Relatório Final

Após validação, forneça:
```
## Validação do Projeto

### ✅ Checks Passados
- Type check: ✅
- Lint: ✅
- Testes: ✅
- Format: ✅

### 📊 Métricas
- Coverage: X%
- Arquivos validados: X
- Testes executados: X
- Tempo total: Xs

### ⚠️ Avisos (se houver)
- Aviso 1
- Aviso 2

### ❌ Erros (se houver)
- Erro 1 (com correção sugerida)
- Erro 2 (com correção sugerida)
```

## Instruções para o Cursor

Execute a validação completa e corrija todos os erros antes de finalizar. Não pule nenhum passo.

