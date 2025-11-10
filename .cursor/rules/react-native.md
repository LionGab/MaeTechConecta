## Padrões React Native

- Componentes funcionais com Hooks; evitar classes.
- Extrair estilos para `StyleSheet.create` ou tema centralizado.
- Usar `FlatList/SectionList` para listas longas; evitar `.map` em arrays grandes.
- Gerenciar estado global com solução definida (ex.: Zustand/Redux) quando necessário.
- Evitar lógica complexa dentro do JSX; criar helpers/memoization (`useMemo`, `useCallback`).
- Acessibilidade: `accessibilityLabel`, `accessible`, toques e foco adequados.

