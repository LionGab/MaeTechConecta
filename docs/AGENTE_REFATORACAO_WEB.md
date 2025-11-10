# 🔧 Agente de Refatoração Web

**Agente pronto para refatorar componentes e garantir dimensões corretas no iPhone 13 (390x844)**

---

## ✅ O que o Agente Faz

### 1. Escaneia Arquivos

- Escaneia todos os arquivos `.ts`, `.tsx`, `.js`, `.jsx` em `src/` e `apps/mobile/`
- Identifica problemas de dimensões, viewport, área de toque e visibilidade

### 2. Detecta Problemas

- **Dimensões hardcoded**: Detecta dimensões antigas (375x812 - iPhone X/11) e sugere atualização para iPhone 13 (390x844)
- **Área de toque**: Verifica se elementos têm área de toque mínima WCAG 2.1 AA (44x44px)
- **Viewport**: Verifica se viewport meta tag está configurado corretamente para mobile
- **Visibilidade**: Detecta elementos que podem estar ocultos na web

### 3. Corrige Automaticamente

- Atualiza dimensões hardcoded para iPhone 13
- Ajusta área de toque mínima para WCAG 2.1 AA
- Adiciona/atualiza viewport meta tag
- Adiciona comentários para revisão manual quando necessário

### 4. Gera Relatório

- Relatório completo em Markdown com todos os problemas encontrados
- Status de correção (corrigido/pendente)
- Recomendações para próximos passos

---

## 🚀 Como Usar

### 1. Executar o Agente

```bash
pnpm refactor:web
```

Ou:

```bash
tsx scripts/refactor-web-agent.ts
```

### 2. Verificar Relatório

O relatório é salvo em:

```
.cursor/agents/reports/refactor-web-report.md
```

### 3. Abrir Browser Integrado

Após a refatoração, abra o browser integrado para verificar:

**Opção 1: Atalho**

```
Ctrl+Shift+B
```

**Opção 2: Command Palette**

```
Ctrl+Shift+P → cursor.browser.open
```

**Opção 3: Via Composer**

```
Ctrl+I → "Abra o browser e verifique o app em formato mobile"
```

---

## ⚙️ Configurações

### Browser Integrado

O browser integrado está configurado com:

- **Viewport**: iPhone 13 (390×844)
- **Device Scale Factor**: 3x
- **DevTools**: Ativado
- **Headless**: false (visual)
- **User Agent**: iPhone iOS 17 Safari

### Dimensões Esperadas

- **Viewport**: 390×844 (iPhone 13)
- **Área de toque mínima**: 44×44px (iOS) / 48×48dp (Android)
- **Padding padrão**: 16px (spacing.md)
- **Border radius**: 8px (sm), 16px (md), 24px (lg), 32px (xl)

---

## 📋 Checklist de Refatoração

### Antes de Executar

- [ ] App está rodando (`pnpm dev`)
- [ ] Browser integrado está habilitado
- [ ] DevTools está ativado

### Após Executar

- [ ] Relatório gerado em `.cursor/agents/reports/refactor-web-report.md`
- [ ] Problemas corrigidos automaticamente
- [ ] Problemas pendentes revisados manualmente
- [ ] Browser integrado aberto (Ctrl+Shift+B)
- [ ] App visível no browser (iPhone 13 - 390×844)
- [ ] Todas as telas testadas

---

## 🔍 Tipos de Problemas Detectados

### 1. Dimensões Hardcoded

**Problema**: Dimensões antigas (375×812 - iPhone X/11)

**Exemplo**:

```typescript
// ❌ Antes
const styles = StyleSheet.create({
  container: {
    width: 375, // iPhone X/11
    height: 812,
  },
});

// ✅ Depois
const styles = StyleSheet.create({
  container: {
    width: 390, // iPhone 13
    height: 844,
  },
});
```

### 2. Área de Toque Mínima

**Problema**: Área de toque menor que 44×44px (WCAG 2.1 AA)

**Exemplo**:

```typescript
// ❌ Antes
const styles = StyleSheet.create({
  button: {
    minHeight: 36, // Muito pequeno
    minWidth: 36,
  },
});

// ✅ Depois
const styles = StyleSheet.create({
  button: {
    minHeight: 44, // WCAG 2.1 AA
    minWidth: 44,
  },
});
```

### 3. Viewport Meta Tag

**Problema**: Viewport não configurado para mobile

**Exemplo**:

```javascript
// ❌ Antes
web: {
  favicon: './assets/favicon.png',
  bundler: 'metro',
}

// ✅ Depois
web: {
  favicon: './assets/favicon.png',
  bundler: 'metro',
  meta: {
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
  },
}
```

### 4. Visibilidade na Web

**Problema**: Elementos que podem estar ocultos na web

**Exemplo**:

```typescript
// ❌ Antes
const styles = StyleSheet.create({
  hidden: {
    display: 'none', // Pode estar oculto na web
  },
});

// ✅ Depois
const styles = StyleSheet.create({
  hidden: {
    display: 'none', // TODO: Verificar se display: none é necessário na web
  },
});
```

---

## 📊 Exemplo de Relatório

```markdown
# 🔧 Relatório de Refatoração Web

**Data**: 15/01/2025 14:30:00

---

## 📋 Resumo Executivo

- **Total de Arquivos**: 45
- **Arquivos Escaneados**: 45
- **Total de Problemas**: 12
- **Problemas Corrigidos**: 10
- **Problemas Pendentes**: 2

## 🔍 Problemas por Tipo

- **dimension**: 5
- **touch-target**: 3
- **viewport**: 2
- **visibility**: 2

## 📝 Detalhes dos Problemas

### src/components/Button.tsx

- **Linha 219** - touch-target
  - Problema: Área de toque 36px menor que mínimo WCAG (44px)
  - Atual: `minHeight: 36`
  - Esperado: `minHeight: 44`
  - Status: ✅ Corrigido
  - Correção: Área de toque atualizada para WCAG 2.1 AA

...
```

---

## 💡 Recomendações

### Após Refatoração

1. **Verificar Browser Integrado**
   - Abrir browser (Ctrl+Shift+B)
   - Verificar se app está visível
   - Testar todas as telas

2. **Testar Dimensões**
   - Verificar se componentes estão nas dimensões corretas
   - Testar área de toque (mínimo 44×44px)
   - Verificar responsividade

3. **Revisar Problemas Pendentes**
   - Revisar problemas que não foram corrigidos automaticamente
   - Aplicar correções manuais quando necessário

4. **Validar Acessibilidade**
   - Verificar WCAG 2.1 AA
   - Testar com screen readers
   - Verificar contraste de cores

---

## 🐛 Troubleshooting

### Agente não encontra arquivos

**Solução**:

```bash
# Verificar se arquivos existem
ls src/**/*.{ts,tsx}

# Verificar padrões de busca no script
cat scripts/refactor-web-agent.ts | grep "patterns"
```

### Problemas não são corrigidos

**Solução**:

1. Verificar permissões de escrita nos arquivos
2. Verificar se arquivos não estão em uso
3. Revisar relatório para detalhes do erro

### Browser não abre

**Solução**:

1. Verificar se browser integrado está habilitado em `.cursor/settings.json`
2. Verificar se devtools está ativado
3. Tentar abrir manualmente (Ctrl+Shift+B)

---

## 📚 Documentação Relacionada

- **Browser Integrado**: `docs/BROWSER_IPHONE13_CONFIG.md`
- **Configurações Otimizadas**: `docs/CURSOR_CONFIGURACOES_OTIMIZADAS.md`
- **Melhores Práticas**: `docs/CURSOR_2.0_BEST_PRACTICES.md`

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0  
**Dispositivo alvo**: iPhone 13 (390×844)
