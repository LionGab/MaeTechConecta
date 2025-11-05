# Migração Incremental - Nossa Maternidade

## Estratégia: Branch Consolidada

### Fase 1: Preparação (Sem Impacto)

1. **Criar branch**:

   ```bash
   git checkout -b consolidation/monorepo
   ```

2. **Criar estrutura**:
   - Criar pastas `src/`, `supabase/functions/`, etc.
   - Não mover código ainda

3. **Configurar CI/CD**:
   - Adicionar workflows
   - Testar em branch separada

### Fase 2: Migração Gradual (Sem Parar Releases)

1. **Migrar Edge Functions primeiro**:

   ```bash
   # Copiar (não mover)
   cp -r <legacy-functions> supabase/functions/
   ```

2. **Validar Edge Functions**:

   ```bash
   supabase functions deploy nathia-chat
   # Testar em staging
   ```

3. **Migrar código React Native**:

   ```bash
   # Copiar código
   cp -r <legacy-src> src/
   ```

4. **Atualizar imports gradualmente**:
   - Um arquivo por vez
   - Testar após cada mudança

### Fase 3: Integração (Clean Code)

1. **Remover duplicações**:
   - Identificar código duplicado
   - Consolidar em utils/ ou services/

2. **Aplicar padrões modernos**:
   - TypeScript strict
   - ESLint rules
   - Prettier formatting

3. **Adicionar testes**:
   - Testes unitários para serviços críticos
   - E2E smoke tests

### Fase 4: Merge e Deploy

1. **Validar tudo**:

   ```bash
   npm run validate
   ```

2. **Merge para main**:

   ```bash
   git checkout main
   git merge consolidation/monorepo
   ```

3. **Deploy gradual**:
   - Deploy em staging primeiro
   - Validar em staging
   - Deploy em produção

## Clean Code - Legado

### Identificar Duplicações

```bash
# Usar ferramentas
npm install -g jscpd
jscpd src/ --min-lines 5 --min-tokens 50
```

### Consolidar Utils

```typescript
// src/utils/helpers.ts (consolidado)
export function formatDate(date: Date): string {
  // ... implementação única
}

export function normalizeString(str: string): string {
  // ... implementação única
}
```

### Remover Código Morto

```bash
# Usar ferramentas
npm install -g unimported
unimported
```

## Pitfalls Comuns

### 1. Imports Quebrados

**Problema**: Imports relativos quebram após mover arquivos

**Solução**: Usar paths aliases (`@/*`) desde o início

### 2. Dependências Circulares

**Problema**: A depende de B, B depende de A

**Solução**: Extrair dependência comum para utils/

### 3. Coverage < 70%

**Problema**: Testes não cobrem código suficiente

**Solução**: Adicionar testes gradualmente, focar em código crítico primeiro

### 4. Secrets Não Configurados

**Problema**: Builds falham por falta de secrets

**Solução**: Documentar todos os secrets em `docs/ENVIRONMENTS.md`

### 5. Edge Functions Não Funcionam

**Problema**: Edge Functions não encontram módulos

**Solução**: Validar imports e paths relativos nas Edge Functions

## Checklist Incremental

- [ ] Branch criada
- [ ] Estrutura criada
- [ ] CI/CD configurado
- [ ] Edge Functions migradas e testadas
- [ ] Código React Native migrado
- [ ] Imports atualizados
- [ ] Duplicações removidas
- [ ] Testes adicionados
- [ ] Coverage ≥70%
- [ ] Validado localmente
- [ ] Validado em staging
- [ ] Merge para main
- [ ] Deploy em produção
