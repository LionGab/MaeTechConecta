# Cursor 2.0 - Configuração Otimizada - Guia de Referência Rápida

**Guia rápido de referência para usar o Cursor 2.0 no projeto Nossa Maternidade**

## 🚀 Início Rápido

### Atalhos Essenciais

| Atalho         | Ação            | Uso                             |
| -------------- | --------------- | ------------------------------- |
| `Ctrl+I`       | Composer        | Execução rápida de tarefas      |
| `Ctrl+Shift+M` | Multi-Agente    | Trabalhar com múltiplos agentes |
| `Ctrl+Shift+B` | Browser         | Testes visuais e E2E            |
| `Ctrl+Shift+V` | Voice Mode      | Comandos por voz                |
| `Ctrl+Shift+R` | Revisar Código  | Revisão automática              |
| `Ctrl+Shift+L` | Validar Projeto | Validação completa              |

### Comandos Personalizados

| Comando                  | Descrição                     | Exemplo                       |
| ------------------------ | ----------------------------- | ----------------------------- |
| `@criar-componente-rn`   | Criar componente React Native | `@criar-componente-rn Button` |
| `@revisar-codigo`        | Revisar código completo       | `@revisar-codigo`             |
| `@validar-projeto`       | Validar projeto completo      | `@validar-projeto`            |
| `@refatorar-performance` | Refatorar para performance    | `@refatorar-performance`      |

## 📋 Scripts NPM

### Validação

```bash
# Validação completa
pnpm validate

# Validação com coverage
pnpm validate:full

# Validação rápida (sem testes)
pnpm validate:quick

# Check básico
pnpm check
```

### Desenvolvimento

```bash
# Iniciar app
pnpm dev

# Type check
pnpm type-check

# Lint
pnpm lint
pnpm lint:fix

# Testes
pnpm test
pnpm test:watch
pnpm test:coverage

# Formatação
pnpm format
pnpm format:check
```

## 🎯 Quando Usar Cada Ferramenta

### Composer (`Ctrl+I`)

- ✅ Tarefas simples a médias
- ✅ Refatorações diretas
- ✅ Correções de bugs
- ✅ Implementações pequenas
- ⏱️ Tempo: < 30 segundos

**Exemplo:**

```
Adicione validação de email no formulário de login
```

### Multi-Agente (`Ctrl+Shift+M`)

- ✅ Múltiplas features simultâneas
- ✅ Desenvolvimento paralelo
- ✅ Testar diferentes abordagens
- ✅ Dividir trabalho complexo
- ⏱️ Tempo: 5-10 minutos

**Exemplo:**

```
Agente Frontend: Implementar tela de perfil
Agente Backend: Criar API de perfil
Agente Design: Criar componentes visuais
Agente QA: Criar testes E2E
```

### Browser (`Ctrl+Shift+B`)

- ✅ Testes visuais
- ✅ Debug de UI
- ✅ Validação de estilos
- ✅ Testes E2E
- ⏱️ Tempo: Variável

**Exemplo:**

```
Abra o browser e teste o formulário de login no Supabase Dashboard
```

### Planejamento (`Ctrl+Shift+P`)

- ✅ Tarefas complexas
- ✅ Refatorações grandes
- ✅ Migrações
- ✅ Features complexas
- ⏱️ Tempo: 5-30 min (planejamento)

**Exemplo:**

```
Planeje a migração para Expo SDK 52
```

## 🔧 Configurações

### Arquivos Principais

- `.cursor/settings.json` - Configurações gerais
- `.cursor/composer-config.json` - Configurações do Composer
- `.cursor/keybindings.json` - Atalhos de teclado
- `.cursor/commands/` - Comandos personalizados
- `.cursor/workflows/` - Workflows

### Modelos Configurados

- **Padrão**: Composer (ultra-rápido)
- **Long**: Claude 3.5 Sonnet (raciocínio)
- **Plan**: Claude 3.5 Sonnet (planejamento)
- **Review**: Claude 3.5 Sonnet (revisão)

### Agentes Disponíveis

1. **Frontend** - React Native + Expo
2. **Backend** - Supabase + Edge Functions
3. **IA** - Gemini 2.0 Flash + Moderação
4. **Design** - Design System + Acessibilidade
5. **QA** - Testes E2E + Unit Tests
6. **Security** - LGPD + Compliance
7. **DevOps** - CI/CD + Monitoring
8. **Docs** - Documentação + UX Copy

## 📚 Workflows

### Feature Development

1. Planejar
2. Implementar (Composer/Multi-Agente)
3. Revisar (`@revisar-codigo`)
4. Testar
5. Validar (`@validar-projeto`)

### Refatoração

1. Analisar
2. Dividir em etapas
3. Executar incrementalmente
4. Validar após cada etapa

### Code Review

1. Revisão automática (`@revisar-codigo`)
2. Revisão manual
3. Sugestões
4. Aprovação

### Testing

1. Planejar testes
2. Criar testes
3. Executar testes
4. Validar coverage

## ✅ Checklist Rápido

### Antes de Commitar

- [ ] `@revisar-codigo` executado
- [ ] `@validar-projeto` executado
- [ ] Testes passando
- [ ] Coverage adequado
- [ ] Documentação atualizada

### Desenvolvimento

- [ ] Composer usado para tarefas rápidas
- [ ] Multi-Agente usado para features paralelas
- [ ] Browser usado para testes visuais
- [ ] Validação executada frequentemente

## 💡 Dicas

1. **Use Composer para iterações rápidas** - < 30 segundos por tarefa
2. **Use Multi-Agente para paralelizar** - 4-8× mais rápido
3. **Valide sempre** - `@validar-projeto` antes de finalizar
4. **Use comandos personalizados** - Aceleram tarefas padronizadas
5. **Consulte workflows** - Organizam processos complexos

## 🔗 Referências

- **Configurações Completas**: `docs/CURSOR_CONFIGURACOES_OTIMIZADAS.md` (configurações detalhadas)
- **Documentação Completa**: `docs/COMO_USAR_AGENTES.md`
- **Workflows**: `.cursor/workflows/`
- **Comandos**: `.cursor/commands/`
- **Configurações**: `.cursor/settings.json`, `.cursor/composer-config.json`
- **Atalhos**: `.cursor/keybindings.json`

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte `docs/COMO_USAR_AGENTES.md`
2. Veja exemplos em `.cursor/workflows/`
3. Execute `@validar-projeto` para diagnosticar problemas

---

**Última atualização**: Janeiro 2025
**Versão do Cursor**: 2.0+
**Versão da Configuração**: 2.0.0

