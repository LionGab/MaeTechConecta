# Configuração para Ambiente EROFS (Read-Only File System)

## Problema Resolvido

Este projeto estava configurado para usar **pnpm**, mas o ambiente tem um sistema de arquivos somente leitura (EROFS) que impede:
- Instalação global de package managers via Corepack
- Criação de symlinks em `/usr/bin`
- Instalação de binários globais

## Solução Implementada

O projeto foi reconfigurado para usar **npm** (que já está disponível em `/usr/bin/npm`):

### Mudanças realizadas:

1. **package.json principal:**
   - Alterado `packageManager` de `pnpm@9.0.0` para `npm@10.8.2`
   - Scripts atualizados para usar comandos nativos do npm/turbo
   - Removida referência a `npx pnpm`

2. **Arquivos removidos:**
   - `pnpm-lock.yaml` (substituído por `package-lock.json`)
   - `pnpm-workspace.yaml` (npm usa o campo `workspaces` no package.json)

3. **Apps atualizados:**
   - `apps/mobile/package.json`: Adicionado script `dev`
   - Todos os workspaces mantêm compatibilidade com npm

## Como usar

### Instalação:
```bash
npm install
```

### Desenvolvimento:
```bash
npm run dev          # Todos os apps
npm run build        # Build de produção
npm run lint         # Linting
```

### Apps individuais:
```bash
# Mobile (Expo)
cd apps/mobile && npm run dev

# Web (Next.js)
cd apps/web && npm run dev
```

## Verificação

Tudo está funcionando corretamente:
- ✅ npm instalado e funcional
- ✅ Turborepo detectando workspaces
- ✅ Build executado com sucesso
- ✅ Todos os packages detectados (mobile, web, api, shared, ui)

## Nota Importante

Se você mover este projeto para um ambiente com permissões normais de escrita, pode optar por voltar a usar pnpm:

```bash
npm install -g pnpm
# Alterar packageManager de volta para pnpm@9.0.0
pnpm install
```

Mas no ambiente atual (EROFS), **npm é a única opção viável**.
