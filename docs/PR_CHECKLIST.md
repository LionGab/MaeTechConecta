# PR Checklist - Nossa Maternidade

Checklist obrigatório antes de abrir Pull Request.

## ✅ Code Quality

- [ ] **TypeScript**: Sem erros de tipo (`pnpm typecheck`)
- [ ] **Linting**: Sem warnings/errors (`pnpm lint`)
- [ ] **Formatting**: Código formatado (`pnpm format`)
- [ ] **Testes**: Todos passando (`pnpm test`)
- [ ] **Coverage**: >= 70% nas mudanças (`pnpm test:coverage`)

## ✅ Funcionalidade

- [ ] **Funciona corretamente**: Testado localmente
- [ ] **Edge cases**: Tratados e testados
- [ ] **Error handling**: Erros tratados adequadamente
- [ ] **Loading states**: Feedback visual para usuário

## ✅ Mobile-First

- [ ] **Android**: Testado no emulator/dispositivo
- [ ] **iOS**: Testado no simulator/dispositivo (se possível)
- [ ] **Touch targets**: Mínimo 44x44px (iOS) / 48dp (Android)
- [ ] **Acessibilidade**: `accessibilityLabel` e `accessibilityRole` presentes
- [ ] **Dark Mode**: Suporta tema claro e escuro

## ✅ Performance

- [ ] **React.memo**: Componentes puros memoizados
- [ ] **useCallback**: Handlers passados como props
- [ ] **useMemo**: Computações pesadas memoizadas
- [ ] **FlatList**: Otimizado com `windowSize`, `maxToRenderPerBatch`
- [ ] **Images**: Otimizadas (tamanho e formato)

## ✅ Segurança

- [ ] **RLS**: Políticas de segurança configuradas (se mudanças no banco)
- [ ] **Input validation**: Sanitização de inputs
- [ ] **API keys**: Não expostas no client-side
- [ ] **Auth**: Verificação de autenticação onde necessário

## ✅ Documentação

- [ ] **JSDoc**: Componentes e funções públicas documentadas
- [ ] **README**: Atualizado se necessário
- [ ] **CHANGELOG**: Mudanças registradas
- [ ] **Comentários**: Lógica complexa explicada

## ✅ Git

- [ ] **Branch**: Nome descritivo (`feat/`, `fix/`, `refactor/`)
- [ ] **Commits**: Mensagens claras e descritivas
- [ ] **Conventional Commits**: Segue padrão (feat, fix, chore, docs)
- [ ] **Squash**: Commits desnecessários consolidados (opcional)

## ✅ Testing

- [ ] **Unitários**: Features críticas testadas
- [ ] **Integration**: Fluxos principais testados
- [ ] **E2E**: Smoke test passa (`pnpm e2e:android`)

## ✅ Database (se aplicável)

- [ ] **Migration**: Criada e testada
- [ ] **Rollback**: Possível reverter mudanças
- [ ] **RLS**: Políticas de segurança atualizadas
- [ ] **Índices**: Criados para queries frequentes

## ✅ Edge Functions (se aplicável)

- [ ] **Zod**: Validação de input
- [ ] **Retry**: Retry logic implementado
- [ ] **Error handling**: Erros tratados e logados
- [ ] **CORS**: Headers corretos
- [ ] **Rate limiting**: Implementado onde necessário

## ✅ UI/UX

- [ ] **Design System**: Usa componentes do sistema (`src/components/`)
- [ ] **Tema**: Usa `colors`, `spacing`, `typography` do tema
- [ ] **Responsivo**: Funciona em diferentes tamanhos de tela
- [ ] **Loading**: Estados de loading visíveis
- [ ] **Empty states**: Mensagens amigáveis quando vazio
- [ ] **Error states**: Mensagens de erro amigáveis

## ✅ Accessibility (WCAG 2.1 AA)

- [ ] **Screen readers**: Funciona com VoiceOver/TalkBack
- [ ] **Contraste**: 4.5:1+ para texto normal, 3:1+ para texto grande
- [ ] **Keyboard**: Navegável via teclado (web)
- [ ] **Live regions**: `accessibilityLiveRegion` para mudanças dinâmicas

## ✅ Review

- [ ] **Self-review**: Revisei meu próprio código
- [ ] **Description**: PR tem descrição clara
- [ ] **Screenshots**: Incluídos se mudanças visuais
- [ ] **Breaking changes**: Documentadas se houver

## Template de PR

```markdown
## Descrição

Breve descrição das mudanças.

## Tipo de Mudança

- [ ] 🐛 Bug fix
- [ ] ✨ Nova feature
- [ ] 🔨 Refactor
- [ ] 📝 Documentação
- [ ] 🚀 Performance
- [ ] 🎨 Estilo/UI

## Testes

- [ ] Unitários adicionados/atualizados
- [ ] E2E adicionados/atualizados
- [ ] Testado manualmente

## Screenshots (se aplicável)

...

## Checklist

- [ ] Todas as verificações acima foram completadas
- [ ] `pnpm validate` passa sem erros
```

## Comandos Úteis

```bash
# Validação completa
pnpm validate

# Type check
pnpm typecheck

# Lint
pnpm lint

# Testes
pnpm test

# Coverage
pnpm test:coverage

# E2E
pnpm e2e:android
```

## Aprovação

- ✅ **1 aprovação** mínima obrigatória
- ✅ **CI/CD** passa (GitHub Actions)
- ✅ **Deploy preview** funcional (Netlify/Vercel)

## Merge

- ✅ **Squash and merge**: Preferido para features pequenas
- ✅ **Rebase**: Para manter histórico linear
- ❌ **Merge commit**: Evitar

---

**Lembre-se**: Qualidade > Velocidade. É melhor revisar bem do que ter que corrigir depois! 🚀
