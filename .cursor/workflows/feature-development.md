# Workflow: Desenvolvimento de Feature

Workflow otimizado para desenvolvimento de features usando Cursor 2.0.

## Fase 1: Planejamento

### Passo 1: Analisar Requisitos

- Entender completamente o que precisa ser implementado
- Identificar dependências e integrações necessárias
- Verificar padrões similares no codebase

### Passo 2: Criar Plano

Use o Plan Mode do Cursor:

```
Planeje a implementação da feature X:
1. Análise de requisitos
2. Estrutura de arquivos
3. Componentes necessários
4. Integrações necessárias
5. Testes necessários
```

### Passo 3: Dividir em Tarefas

- Dividir feature em tarefas menores
- Identificar tarefas que podem ser paralelizadas
- Definir ordem de implementação

## Fase 2: Implementação

### Opção A: Composer (Tarefas Simples)

Para tarefas simples a médias (< 30 segundos):

```
Use Ctrl+I (Composer) e descreva a tarefa diretamente
```

### Opção B: Multi-Agente (Tarefas Paralelas)

Para múltiplas tarefas simultâneas:

```
Use Ctrl+Shift+M (Multi-Agente) e divida o trabalho:

Agente Frontend: Implementar componente X
Agente Backend: Criar endpoint Y
Agente Design: Criar estilos e tema
Agente QA: Criar testes
```

### Opção C: Browser Integrado (UI)

Para desenvolvimento de UI:

```
Use Ctrl+Shift+B (Browser) e:
1. Carregue o app
2. Selecione elementos visualmente
3. Comande o agente para fazer ajustes
```

## Fase 3: Revisão

### Passo 1: Revisão de Código

Use o comando de revisão:

```
@revisar-codigo
```

### Passo 2: Validar Projeto

Execute validação completa:

```
@validar-projeto
```

### Passo 3: Correções

- Corrigir problemas identificados
- Re-executar validação
- Garantir que tudo passa

## Fase 4: Testes

### Passo 1: Testes Unitários

- Criar testes para componentes críticos
- Executar `npm run test`
- Garantir coverage >= 70%

### Passo 2: Testes E2E

- Criar testes E2E para fluxos principais
- Executar `npm run e2e:android` (se aplicável)
- Validar comportamento completo

### Passo 3: Testes Manuais

- Testar no dispositivo/emulador
- Verificar acessibilidade
- Validar dark mode
- Testar diferentes tamanhos de tela

## Fase 5: Documentação

### Passo 1: JSDoc

- Adicionar JSDoc em componentes públicos
- Documentar props e métodos
- Incluir exemplos de uso

### Passo 2: README

- Atualizar README se necessário
- Documentar nova feature
- Adicionar exemplos

## Checklist Final

- [ ] Feature implementada completamente
- [ ] Código revisado (@revisar-codigo)
- [ ] Validação passou (@validar-projeto)
- [ ] Testes criados e passando
- [ ] Coverage >= 70%
- [ ] Documentação atualizada
- [ ] Acessibilidade verificada
- [ ] Dark mode funcionando
- [ ] Performance otimizada
- [ ] Sem erros de tipo ou lint

## Comandos Rápidos

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

## Atalhos do Cursor

- `Ctrl+I` → Composer
- `Ctrl+Shift+M` → Multi-Agente
- `Ctrl+Shift+B` → Browser
- `Ctrl+Shift+R` → Revisar Código
- `Ctrl+Shift+L` → Validar Projeto

## Tempo Estimado

- Planejamento: 5-10 min
- Implementação: 10-30 min (dependendo da complexidade)
- Revisão: 5-10 min
- Testes: 10-20 min
- Documentação: 5-10 min
- **Total: 35-80 min**

## Dicas

1. Use Plan Mode para features complexas
2. Use Multi-Agente para paralelizar trabalho
3. Use Browser para ajustes visuais
4. Valide frequentemente
5. Documente enquanto desenvolve
