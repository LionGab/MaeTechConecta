# ClubNath por MaeTech - Arquitetura Monorepo

Este é um monorepo Turborepo para o aplicativo "Nossa Maternidade", com foco em uma experiência mobile-first usando React Native (Expo).

## Estrutura

- `apps/mobile`: O aplicativo principal em React Native + Expo.
- `apps/web`: Futuro CMS ou landing page Next.js.
- `packages/shared`: Lógica de negócios compartilhada (hooks, serviços, tipos).
- `packages/api`: Clientes de API (Firebase, etc).
- `packages/ui`: Componentes de UI React Native compartilhados.

## Começando

### Ambiente EROFS (Read-Only File System)

Este projeto está configurado para funcionar em ambientes com sistema de arquivos somente leitura (EROFS), onde instalações globais de package managers não são permitidas.

**Nota:** Este projeto usa **npm** como package manager, não pnpm, devido às limitações do ambiente.

### 1. Instale as dependências:

```bash
npm install
```

### 2. Comandos disponíveis:

**Desenvolvimento:**
```bash
npm run dev          # Inicia todos os apps em modo desenvolvimento
```

**Build:**
```bash
npm run build        # Faz build de todos os projetos
```

**Lint:**
```bash
npm run lint         # Roda linting em todos os projetos
```

**Format:**
```bash
npm run format       # Formata todos os arquivos
```

### 3. Rodando apps específicos:

**Mobile (Expo):**
```bash
cd apps/mobile
npm run dev          # ou: npm start, npm run android, npm run ios
```

**Web (Next.js):**
```bash
cd apps/web
npm run dev
```

### 4. Escaneie o QR code com o app Expo Go no