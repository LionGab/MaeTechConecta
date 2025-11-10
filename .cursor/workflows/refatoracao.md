# Workflow: Refatoração

Workflow otimizado para refatoração de código usando Cursor 2.0.

## Fase 1: Análise

### Passo 1: Identificar Áreas para Refatorar

- Código duplicado
- Componentes muito complexos
- Problemas de performance
- Violações de padrões
- Code smells

### Passo 2: Analisar Impacto

- Identificar dependências
- Verificar testes existentes
- Analisar risco de quebrar funcionalidade
- Estimar esforço necessário

### Passo 3: Criar Plano de Refatoração

Use Plan Mode:

```
Planeje a refatoração do módulo X:
1. Análise do código atual
2. Identificação de problemas
3. Estratégia de refatoração
4. Divisão em etapas
5. Plano de testes
```

## Fase 2: Divisão

### Dividir em Etapas Pequenas

- Refatorar uma parte por vez
- Manter código sempre funcionando
- Commitar após cada etapa
- Testar após cada etapa

### Exemplo de Divisão

```
Etapa 1: Extrair lógica de negócio para hooks
Etapa 2: Refatorar componentes para usar hooks
Etapa 3: Otimizar performance
Etapa 4: Melhorar acessibilidade
Etapa 5: Atualizar testes
```

## Fase 3: Execução

### Opção A: Refatoração Manual (Composer)

```
Use Ctrl+I e descreva a refatoração específica:
"Refatore o componente X para usar hooks e melhorar performance"
```

### Opção B: Refatoração com Performance

```
@refatorar-performance
```

### Opção C: Multi-Agente (Refatoração Paralela)

```
Use Ctrl+Shift+M:

Agente Frontend: Refatorar componentes
Agente Backend: Refatorar serviços
Agente QA: Atualizar testes
Agente Docs: Atualizar documentação
```

## Fase 4: Validação

### Passo 1: Validação Automática

```
@validar-projeto
```

### Passo 2: Revisão de Código

```
@revisar-codigo
```

### Passo 3: Testes

- Executar testes existentes
- Criar novos testes se necessário
- Garantir que nada quebrou

### Passo 4: Teste Manual

- Testar funcionalidade manualmente
- Verificar comportamento em diferentes cenários
- Validar performance

## Checklist de Refatoração

### Antes de Começar

- [ ] Análise completa feita
- [ ] Plano criado
- [ ] Testes existentes identificados
- [ ] Backup do código atual

### Durante a Refatoração

- [ ] Refatorar uma etapa por vez
- [ ] Testar após cada etapa
- [ ] Commitar após cada etapa
- [ ] Manter código sempre funcionando

### Após a Refatoração

- [ ] Todos os testes passando
- [ ] Validação passou (@validar-projeto)
- [ ] Revisão feita (@revisar-codigo)
- [ ] Performance melhorada
- [ ] Código mais limpo
- [ ] Documentação atualizada
- [ ] Nada quebrou

## Comandos Úteis

```bash
# Validação
npm run validate

# Testes
npm run test

# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format
```

## Tipos de Refatoração

### 1. Extração de Lógica

- Extrair lógica de negócio para hooks
- Extrair componentes menores
- Extrair utilitários

### 2. Otimização de Performance

- Adicionar React.memo
- Usar useCallback/useMemo
- Otimizar FlatList
- Lazy loading

### 3. Melhoria de Acessibilidade

- Adicionar accessibilityLabel
- Melhorar accessibilityRole
- Garantir contraste adequado
- Área de toque mínima

### 4. Padronização

- Seguir .cursorrules
- Usar tema consistentemente
- Padronizar nomenclatura
- Organizar imports

### 5. Limpeza de Código

- Remover código duplicado
- Remover código morto
- Simplificar lógica complexa
- Melhorar nomes de variáveis

## Princípios

1. **Refatoração Incremental**: Uma coisa por vez
2. **Testes Primeiro**: Ter testes antes de refatorar
3. **Commits Pequenos**: Commitar frequentemente
4. **Validação Contínua**: Validar após cada etapa
5. **Sem Quebrar**: Manter funcionalidade sempre

## Tempo Estimado

- Análise: 10-20 min
- Divisão: 5-10 min
- Execução: 20-60 min (dependendo do tamanho)
- Validação: 10-20 min
- **Total: 45-110 min**

## Dicas

1. Use Plan Mode para refatorações grandes
2. Refatore em etapas pequenas
3. Teste após cada etapa
4. Use Multi-Agente para refatorações paralelas
5. Valide frequentemente
6. Mantenha funcionalidade sempre funcionando

