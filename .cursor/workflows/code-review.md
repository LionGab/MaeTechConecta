# Workflow: Code Review

Workflow otimizado para revisão de código usando Cursor 2.0.

## Fase 1: Revisão Automática

### Passo 1: Executar Comando de Revisão

```
@revisar-codigo
```

### Passo 2: Executar Validação

```
@validar-projeto
```

### Passo 3: Analisar Resultados

- Verificar erros encontrados
- Identificar problemas críticos
- Listar sugestões de melhoria

## Fase 2: Revisão Manual

### Checklist de Revisão

#### 1. TypeScript

- [ ] Sem tipos `any` desnecessários
- [ ] Interfaces usadas corretamente
- [ ] Tipos explícitos em funções
- [ ] Props tipadas corretamente
- [ ] Sem type assertions desnecessárias

#### 2. Performance

- [ ] React.memo usado quando apropriado
- [ ] useCallback para handlers
- [ ] useMemo para computações pesadas
- [ ] FlatList otimizada
- [ ] Sem re-renders desnecessários

#### 3. Acessibilidade

- [ ] accessibilityLabel presente
- [ ] accessibilityRole correto
- [ ] Contraste adequado
- [ ] Área de toque mínima respeitada

#### 4. Estilização

- [ ] Tema usado (sem cores hardcoded)
- [ ] StyleSheet.create() usado
- [ ] Dark mode suportado
- [ ] Mobile-first design

#### 5. Estrutura

- [ ] Estrutura correta (componente → helpers → tipos)
- [ ] Imports organizados
- [ ] JSDoc presente
- [ ] Código limpo e legível

#### 6. Tratamento de Erros

- [ ] Try-catch em operações assíncronas
- [ ] Logs descritivos
- [ ] Feedback visual para usuário

#### 7. Padrões do Projeto

- [ ] Segue .cursorrules
- [ ] Nomenclatura correta
- [ ] Programação funcional

#### 8. Testes

- [ ] Testes criados para componentes críticos
- [ ] Coverage adequado

## Fase 3: Sugestões

### Severidade de Problemas

#### Crítico (5)

- Quebra aplicação
- Segurança crítica
- Perda de dados

#### Alto (4)

- Funcionalidade quebrada
- Performance grave
- Acessibilidade crítica

#### Médio (3)

- Bug não crítico
- Code smell
- Violação de padrão

#### Baixo (2)

- Melhoria sugerida
- Otimização
- Refatoração sugerida

#### Info (1)

- Sugestão de estilo
- Documentação
- Comentário

### Formato de Feedback

```
## Revisão de Código

### ✅ Pontos Positivos
- Item 1
- Item 2

### ⚠️ Problemas Encontrados

#### Crítico
- [Severidade: Crítico] Descrição
  - Arquivo: caminho/do/arquivo.tsx
  - Linha: X
  - Problema: Descrição detalhada
  - Impacto: O que pode acontecer
  - Correção sugerida: Como corrigir

#### Alto
- [Severidade: Alto] Descrição
  - ...

#### Médio
- [Severidade: Médio] Descrição
  - ...

#### Baixo
- [Severidade: Baixo] Descrição
  - ...

### 💡 Sugestões de Melhoria
- Sugestão 1
- Sugestão 2

### 📊 Score Geral
- TypeScript: X/10
- Performance: X/10
- Acessibilidade: X/10
- Estilização: X/10
- Estrutura: X/10
- **Total: X/50**
```

## Fase 4: Aprovação

### Critérios de Aprovação

- [ ] Sem problemas críticos
- [ ] Sem problemas altos (ou resolvidos)
- [ ] Validação passou
- [ ] Testes passando
- [ ] Coverage adequado
- [ ] Documentação atualizada

### Aprovar ou Solicitar Mudanças

#### Aprovar

- Todos os critérios atendidos
- Código de qualidade
- Sem problemas críticos

#### Solicitar Mudanças

- Problemas críticos encontrados
- Problemas altos não resolvidos
- Validação falhou
- Testes falhando

## Comandos Úteis

```bash
# Revisar código
@revisar-codigo

# Validar projeto
@validar-projeto

# Type check
npm run type-check

# Lint
npm run lint

# Testes
npm run test
```

## O Que Revisar

### Bugs de Lógica

- Lógica incorreta
- Condições erradas
- Tratamento de edge cases

### Práticas Inseguras

- Segurança
- Validação de inputs
- Tratamento de erros

### Code Smells

- Complexidade
- Acoplamento
- Duplicação

### Violações de Estilo

- Padrões do projeto
- Nomenclatura
- Estrutura

### Performance Issues

- Re-renders desnecessários
- Operações pesadas
- Otimizações faltantes

### Problemas de Acessibilidade

- Labels faltantes
- Contraste inadequado
- Área de toque pequena

### Falta de Documentação

- JSDoc faltante
- Comentários necessários
- README desatualizado

### Testes Faltantes

- Componentes críticos sem testes
- Coverage baixo
- Testes E2E faltantes

## Tempo Estimado

- Revisão automática: 2-5 min
- Revisão manual: 10-30 min
- Sugestões: 5-10 min
- **Total: 17-45 min**

## Dicas

1. Use @revisar-codigo primeiro
2. Foque em problemas críticos primeiro
3. Seja específico nas sugestões
4. Forneça exemplos de código quando apropriado
5. Seja construtivo e educado
6. Aprecie o bom trabalho também
