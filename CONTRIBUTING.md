# Guia de Contribuição - MãeTech Conecta

Obrigado por considerar contribuir para o **MãeTech Conecta**! Este documento fornece diretrizes para contribuir com o projeto de forma eficiente e consistente.

---

## 📋 Índice

- [Código de Conduta](#-código-de-conduta)
- [Como Contribuir](#-como-contribuir)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Fluxo de Trabalho](#-fluxo-de-trabalho)
- [Padrões de Código](#-padrões-de-código)
- [Convenções de Commit](#-convenções-de-commit)
- [Testes](#-testes)
- [Pull Requests](#-pull-requests)
- [Reportando Bugs](#-reportando-bugs)
- [Sugerindo Features](#-sugerindo-features)

---

## 📜 Código de Conduta

Este projeto adota um Código de Conduta que esperamos que todos os participantes sigam. Por favor, leia e siga nossas diretrizes de comportamento:

- **Seja respeitoso**: Trate todos com respeito e dignidade
- **Seja colaborativo**: Trabalhe junto com a comunidade
- **Seja inclusivo**: Dê boas-vindas a pessoas de todas as origens
- **Seja profissional**: Mantenha discussões focadas e construtivas

---

## 🤝 Como Contribuir

Existem várias formas de contribuir:

### 1. Reportar Bugs
- Use o template de issue para bugs
- Inclua passos para reproduzir o problema
- Adicione screenshots se aplicável
- Especifique seu ambiente (OS, navegador, versão)

### 2. Sugerir Melhorias
- Use o template de issue para features
- Explique o caso de uso
- Descreva a solução proposta
- Considere alternativas

### 3. Contribuir com Código
- Escolha uma issue existente ou crie uma nova
- Faça um fork do repositório
- Crie uma branch para sua feature
- Desenvolva seguindo nossos padrões
- Submeta um Pull Request

### 4. Melhorar Documentação
- Corrija erros de digitação
- Adicione exemplos
- Melhore explicações
- Traduza documentos

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Node.js >= 20.0.0
- npm >= 10.0.0
- Git
- Conta no Firebase (para desenvolvimento)

### Setup Inicial

```bash
# 1. Fork e clone o repositório
git clone https://github.com/SEU_USUARIO/MaeTechConecta.git
cd MaeTechConecta

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

### Verificação

Antes de começar a desenvolver, certifique-se de que tudo está funcionando:

```bash
# Verificar tipos
npm run typecheck

# Executar linter
npm run lint

# Fazer build
npm run build
```

---

## 🔄 Fluxo de Trabalho

### 1. Crie uma Branch

Use nomes descritivos para branches:

```bash
# Features
git checkout -b feature/nome-da-feature

# Correções de bugs
git checkout -b fix/descricao-do-bug

# Documentação
git checkout -b docs/descricao-da-mudanca

# Refatoração
git checkout -b refactor/descricao
```

### 2. Desenvolva

- Faça commits pequenos e frequentes
- Teste suas mudanças localmente
- Mantenha o código limpo e bem documentado
- Siga os padrões de código do projeto

### 3. Teste

```bash
# Verificar tipos TypeScript
npm run typecheck

# Executar linter
npm run lint

# Testar build
npm run build
```

### 4. Commit

Siga nossas [convenções de commit](#-convenções-de-commit).

### 5. Push

```bash
git push origin sua-branch
```

### 6. Pull Request

Abra um Pull Request no GitHub seguindo o template.

---

## 💻 Padrões de Código

### TypeScript

- Use tipagem estática sempre que possível
- Evite `any` - use tipos específicos ou `unknown`
- Prefira `interface` para objetos e `type` para unions/intersections
- Use `const` por padrão, `let` apenas quando necessário

```typescript
// ✅ Bom
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // ...
}

// ❌ Evite
const getUser = async (id: any): Promise<any> => {
  // ...
}
```

### React/Next.js

- Use componentes funcionais com hooks
- Prefira Server Components quando possível (Next.js 15)
- Use `'use client'` apenas quando necessário
- Extraia lógica complexa em custom hooks

```typescript
// ✅ Bom
'use client';

import { useState, useEffect } from 'react';

export default function Component() {
  const [data, setData] = useState<DataType | null>(null);

  useEffect(() => {
    // ...
  }, []);

  return <div>{/* ... */}</div>;
}

// ❌ Evite
import React from 'react';

class Component extends React.Component {
  // ...
}
```

### Estilização

- Use Tailwind CSS utility classes
- Para componentes complexos, use `cn()` helper (className merge)
- Mantenha classes organizadas (layout → spacing → typography → colors)
- Use variáveis CSS do tema quando possível

```tsx
// ✅ Bom
import { cn } from '@/lib/utils';

<div className={cn(
  "flex items-center justify-between",
  "p-4 space-x-2",
  "text-lg font-semibold",
  "bg-background text-foreground",
  isActive && "bg-primary text-primary-foreground"
)} />

// ❌ Evite
<div className="flex items-center text-lg bg-background justify-between p-4 font-semibold space-x-2 text-foreground" />
```

### Nomenclatura

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`)
- **Utilitários**: camelCase (`formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Variáveis/Funções**: camelCase (`userData`, `getUserData()`)

### Estrutura de Arquivos

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/           # Route groups
│   ├── dashboard/        # Features
│   └── api/              # API routes
├── components/            # Componentes reutilizáveis
│   ├── ui/              # Componentes base
│   └── features/        # Componentes específicos
├── hooks/                 # Custom hooks
├── lib/                   # Utilitários
├── types/                 # TypeScript types
└── config/                # Configurações
```

---

## 📝 Convenções de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `perf`: Melhoria de performance
- `test`: Adição/correção de testes
- `chore`: Tarefas de build, dependências, etc.

### Exemplos

```bash
# Feature
feat(auth): add Instagram OAuth authentication

# Bug fix
fix(marketplace): resolve image upload error

# Documentation
docs(readme): update installation instructions

# Refactor
refactor(hooks): simplify useAuth hook logic

# Performance
perf(dashboard): optimize data fetching with caching

# Chore
chore(deps): update Firebase to v11.9.1
```

### Regras

- Use o imperativo ("add" não "added")
- Primeira linha com até 72 caracteres
- Body e footer opcionais
- Referencie issues quando aplicável

```bash
feat(forum): add AI-powered content moderation

Implements automatic content filtering using Genkit AI
to detect and flag inappropriate content in forum posts.

Closes #123
```

---

## 🧪 Testes

### Verificação de Tipos

```bash
npm run typecheck
```

### Linting

```bash
npm run lint

# Corrigir automaticamente
npm run lint -- --fix
```

### Build

```bash
npm run build
```

### Antes de Submeter PR

Execute todos os comandos:

```bash
npm run typecheck && npm run lint && npm run build
```

---

## 🔀 Pull Requests

### Checklist

Antes de submeter um PR, certifique-se de que:

- [ ] O código segue os padrões do projeto
- [ ] Todos os testes passam
- [ ] TypeScript compila sem erros
- [ ] Linter não reporta problemas
- [ ] Build é bem-sucedido
- [ ] Commits seguem as convenções
- [ ] Branch está atualizada com main
- [ ] Descrição do PR está completa

### Template de PR

```markdown
## Descrição
[Breve descrição das mudanças]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Motivação
[Por que essa mudança é necessária?]

## Alterações
- [Lista de alterações principais]

## Screenshots (se aplicável)
[Adicione screenshots]

## Testes
- [ ] Testes passam localmente
- [ ] TypeCheck OK
- [ ] Lint OK
- [ ] Build OK

## Issues Relacionadas
Closes #[número]
```

### Review Process

1. Aguarde review de pelo menos 1 mantenedor
2. Responda aos comentários prontamente
3. Faça as alterações solicitadas
4. Re-solicite review após mudanças
5. Aguarde aprovação e merge

---

## 🐛 Reportando Bugs

### Template de Issue - Bug

```markdown
**Descrição do Bug**
[Descrição clara e concisa do bug]

**Para Reproduzir**
Passos para reproduzir:
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
[O que deveria acontecer]

**Comportamento Atual**
[O que está acontecendo]

**Screenshots**
[Se aplicável, adicione screenshots]

**Ambiente:**
- OS: [ex: macOS 14.0]
- Navegador: [ex: Chrome 120]
- Versão: [ex: 0.1.0]

**Informações Adicionais**
[Qualquer informação adicional]
```

---

## 💡 Sugerindo Features

### Template de Issue - Feature

```markdown
**Qual problema essa feature resolve?**
[Descrição clara do problema]

**Solução Proposta**
[Descrição da solução que você gostaria]

**Alternativas Consideradas**
[Outras soluções que você considerou]

**Detalhes Adicionais**
[Contexto adicional, mockups, etc.]

**Impacto**
- [ ] Impacta usuários existentes
- [ ] Requer migração de dados
- [ ] Breaking change

**Prioridade**
- [ ] Crítica
- [ ] Alta
- [ ] Média
- [ ] Baixa
```

---

## 🎯 Boas Práticas

### Do's ✅

- Escreva código limpo e legível
- Comente código complexo
- Use nomes descritivos
- Mantenha funções pequenas e focadas
- Teste suas mudanças
- Documente novas features
- Seja consistente com o código existente

### Don'ts ❌

- Não faça commits direto na main
- Não ignore erros do linter
- Não faça PRs muito grandes
- Não remova código sem entender o impacto
- Não adicione dependências desnecessárias
- Não commit arquivos de ambiente (.env)
- Não ignore feedback de reviews

---

## 📞 Suporte

Precisa de ajuda?

- **Issues**: Para bugs e features
- **Discussions**: Para perguntas e discussões
- **Email**: Para questões privadas

---

## 🙏 Agradecimentos

Obrigado por contribuir para o **MãeTech Conecta**! Sua ajuda é muito apreciada e faz uma grande diferença para a comunidade de mães que usam nossa plataforma.

---

**Happy Coding!** 💜✨
