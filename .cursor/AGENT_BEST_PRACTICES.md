# Diretrizes do Agente Cursor AI – Projeto Nossa Maternidade

## Princípios Gerais

- Priorize performance do app (memoização, listas otimizadas, pouco re-render)
- Garanta acessibilidade em todos os pontos (labels, hierarquia, telas auditivas)
- Testabilidade: cada hook/componente >70% de cobertura, priorize testes em features críticas
- Separe responsabilidades: lógica em hooks; interface em componentes puros
- Faça refactorings incrementais e sempre backup/branch antes de mudanças grandes
- Sempre documente aprendizados e arquitetura evolutiva (README, learnings, reports)

## Recomendações Específicas

- Use sempre callback e memoização quando expor funções a filhos/FlatList
- Não misture lógica de estado de negócio com interface direto na tela
- Não acople efeitos colaterais (ex: AsyncStorage) diretamente nas Screens; use hooks
- Use `FlatList` para qualquer lista com potencial >30 itens
- Todos os handlers devem ser memoizados via `useCallback`
- Prefira tipagem explícita nos hooks e componentes

## Checklist para Commits e PRs

- [ ] Testes automatizados cobrindo o comportamento novo/alterado
- [ ] Readme/documentação atualizados se arquitetura mudou
- [ ] Sem warnings de TS/lint CI
- [ ] Métricas de performance medidas antes e depois (quando relevante)
- [ ] Features testadas em iOS e Android
- [ ] Pull requests descrevem contexto, problema e solução
- [ ] Pergunte ao time em casos de tradeoff entre deadline e qualidade

## Processo de Refatoração

1. Faça backup/branch antes de iniciar
2. Migre estado/acoplamento para hooks/componentes customizados
3. Sempre implemente testes para lógica movida
4. Use commit mensagens semânticas e detalhadas
5. Medir e anotar resultados de performance quando otimizar

## Prompt Engineering para Times e Agentes Futuramente

- Sempre inicie um novo prompt com contexto e objetivo claros
- Liste critérios de sucesso (usuário final, código, métricas)
- Modele exemplos de código reais antes da execução
- Organize em passos (Preparação, Execução, Teste, Documentação)
- Aceite e registre aprendizados incrementais na pasta de docs/learnings

## Quando Escalar para Humanos

- Quando tradeoffs de experiência são incertos
- Arquiteturas novas (caching, grandes refactors)
- Questões éticas, legais ou de segurança/privacidade de dados

---

_Manter este documento atualizado à medida que o time aprender novas lições ou padrões._

