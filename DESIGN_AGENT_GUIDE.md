# 🎨 Design Agent - Guia de Uso

> **Seu especialista em UI/UX para apps mobile focado em mães brasileiras (público C-D)**

---

## 📋 O que é o Design Agent?

O Design Agent é um assistente especializado em design de interfaces que:

- ✅ **Analisa** telas e componentes seguindo o sistema Bubblegum
- ✅ **Detecta** problemas de acessibilidade, hierarquia visual e responsividade
- ✅ **Sugere** melhorias com exemplos práticos em React Native + TypeScript
- ✅ **Gera** componentes novos seguindo padrões estabelecidos
- ✅ **Valida** consistência com o tema (cores, espaçamentos, tipografia)

---

## 🎯 Como usar

### 1. **Análise de Tela Existente**

**Quando usar**: Você quer revisar uma tela e receber feedback sobre problemas e melhorias.

```
👤 Você: "Analise o HomeScreen e aponte problemas de acessibilidade"

🤖 Design Agent:
✅ Contraste: Todos textos passam WCAG AA
⚠️ Hierarquia: Título muito próximo do subtítulo (usar spacing.lg ao invés de spacing.md)
❌ Botão "Chat" com 41x41px (mínimo WCAG: 44x44px)
💡 Sugestão: Adicionar sombra nos cards usando shadows.light.md

Código corrigido:
...
```

---

### 2. **Criar Componente Novo**

**Quando usar**: Você precisa de um novo componente que não existe ainda.

```
👤 Você: "Crie um componente Badge para status de urgência (info, warning, error)"

🤖 Design Agent:
Vou criar Badge.tsx com 3 variantes seguindo Bubblegum:
- info (azul secundário)
- warning (amarelo accent)
- error (vermelho destructive)

Props:
- children (texto)
- variant ('info' | 'warning' | 'error')
- size ('sm' | 'md')

Código gerado:
...
```

---

### 3. **Análise de Screenshot**

**Quando usar**: Você tem uma captura de tela e quer feedback visual.

```
👤 Você: [envia screenshot] "Revise esta tela"

🤖 Design Agent:
Analisando screenshot...

❌ Contraste insuficiente: Texto cinza #999 em fundo branco (4.2:1, mínimo 4.5:1)
⚠️ Espaçamento inconsistente: Botões com 12px e 16px de padding
✅ Ícones claros e compreensíveis para o público-alvo
💡 Sugestão: Aumentar fontSize dos labels de 14px → 16px (typography.sizes.base)
```

---

### 4. **Validar Consistência com Tema**

**Quando usar**: Você quer garantir que tudo usa o design system Bubblegum.

```
👤 Você: "Encontre cores hardcodadas no projeto"

🤖 Design Agent:
Encontradas 8 ocorrências de cores hardcodadas:

Logo.tsx:39 → backgroundColor: '#FFB6D4' ❌
Deve usar: colors.secondary ✅

WelcomeHeader.tsx:30 → color: '#E91E63' ❌
Deve usar: colors.primary ✅

[lista completa...]
```

---

### 5. **Gerar Variantes de Componente**

**Quando usar**: Você tem um componente base e quer criar variantes.

```
👤 Você: "Adicione variante 'ghost' no Button.tsx"

🤖 Design Agent:
Adicionando variante ghost ao Button:
- Fundo transparente
- Texto em colors.primary
- Sem sombra
- Hover com opacity 0.7

Código:
...
```

---

## ✅ Checklist de Aprovação de Design

Use este checklist antes de considerar uma tela/componente pronto:

### **Acessibilidade** (WCAG 2.1 AA)
- [ ] Contraste de texto ≥ 4.5:1 (normal) ou ≥ 3:1 (large text 18px+)
- [ ] Área de toque mínima: 44x44px para botões/links
- [ ] Todos elementos interativos têm `accessibilityLabel`
- [ ] Elementos interativos têm `accessibilityRole` correto
- [ ] Elementos decorativos têm `accessible={false}`
- [ ] Inputs têm `accessibilityHint` descrevendo o propósito

### **Tema Bubblegum**
- [ ] **0 cores hardcodadas** (hex/rgb) → usar `colors.*`
- [ ] **0 espaçamentos hardcodados** → usar `spacing.*`
- [ ] **0 tipografia hardcodada** → usar `typography.sizes.*` e `typography.weights.*`
- [ ] **0 borderRadius hardcodado** → usar `borderRadius.*`
- [ ] Sombras usando `shadows.light.*` (ou `shadows.dark.*`)

### **Hierarquia Visual**
- [ ] Título principal: `typography.sizes['2xl']` ou maior
- [ ] Subtítulos: `typography.sizes.lg`
- [ ] Corpo de texto: `typography.sizes.base` (16px mínimo)
- [ ] Labels/hints: `typography.sizes.sm` ou `typography.sizes.xs`
- [ ] Espaçamento entre seções: `spacing.xl` ou `spacing['2xl']`
- [ ] Espaçamento interno de componentes: `spacing.lg` (padrão)

### **Responsividade**
- [ ] Textos não quebram de forma estranha em telas pequenas
- [ ] Botões com `fullWidth` em telas estreitas quando apropriado
- [ ] Imagens/ícones escaláveis (usar proporções, não px fixo)
- [ ] ScrollView quando conteúdo pode exceder viewport

### **Público-Alvo (Classe C-D)**
- [ ] Linguagem **simples e clara** (evitar jargões técnicos)
- [ ] Ícones **intuitivos** (evitar símbolos abstratos)
- [ ] Botões com **texto descritivo** (não apenas ícone)
- [ ] Feedback visual **imediato** em ações (loading, success, error)
- [ ] Tamanho de fonte **generoso** (mínimo 16px para corpo)

---

## 🔍 Comandos Rápidos

### Análise Completa
```
/design-review [nome-da-tela]
```
Executa auditoria completa de acessibilidade, tema e hierarquia.

### Buscar Problemas
```
"Encontre hardcoded values em [arquivo.tsx]"
"Valide contraste em [tela]"
"Cheque acessibilidade em todos os botões"
```

### Gerar Código
```
"Crie componente [Nome] com [props]"
"Adicione variante [nome] em [Componente]"
"Refatore [arquivo] para usar tema Bubblegum"
```

---

## 📚 Referências Rápidas

### Cores do Tema
```typescript
colors.primary              // #DD5B9A - Rosa vibrante
colors.primaryForeground    // #FFFFFF - Branco
colors.secondary            // #B8D8E8 - Azul pastel
colors.accent               // #EDD8B1 - Amarelo pastel
colors.background           // #F0E7F0 - Rosa muito claro
colors.card                 // #F2F1E8 - Bege claro
colors.foreground           // #121212 - Preto
colors.muted                // #E1E5EC - Cinza claro
colors.mutedForeground      // #696969 - Cinza
colors.destructive          // #D65152 - Vermelho
colors.border               // #DD5B9A - Rosa
colors.input                // #F5F1F5 - Branco rosa
```

### Espaçamentos
```typescript
spacing.xs    // 4px   - Micro espaçamentos
spacing.sm    // 8px   - Pequeno
spacing.md    // 12px  - Médio
spacing.lg    // 16px  - Padrão (use este por padrão)
spacing.xl    // 20px  - Grande
spacing['2xl'] // 24px - Muito grande
spacing['3xl'] // 32px - Seções
```

### Tipografia
```typescript
// Tamanhos
typography.sizes.xs     // 12px - Hints
typography.sizes.sm     // 14px - Labels
typography.sizes.base   // 16px - Corpo (padrão)
typography.sizes.lg     // 18px - Subtítulos
typography.sizes.xl     // 20px - Destaque
typography.sizes['2xl'] // 24px - Títulos
typography.sizes['3xl'] // 28px - Títulos grandes
typography.sizes['4xl'] // 32px - Hero

// Pesos
typography.weights.normal    // 400
typography.weights.medium    // 500
typography.weights.semibold  // 600
typography.weights.bold      // 700
```

### Border Radius
```typescript
borderRadius.sm    // 4px  - Pequeno
borderRadius.md    // 8px  - Médio
borderRadius.lg    // 12px - Padrão
borderRadius.xl    // 16px - Grande
borderRadius.full  // 999px - Circular
```

### Sombras
```typescript
shadows.light.xs  // Sutil
shadows.light.sm  // Pequena
shadows.light.md  // Padrão
shadows.light.lg  // Grande
```

---

## 🚨 Erros Comuns

### ❌ **Não fazer**
```typescript
// Cores hardcodadas
backgroundColor: '#DD5B9A'
color: '#E91E63'

// Espaçamento hardcodado
padding: 16
marginTop: 20

// Tipografia hardcodada
fontSize: 24
fontWeight: 'bold'
```

### ✅ **Fazer**
```typescript
// Usar tema
backgroundColor: colors.primary
color: colors.primary

// Usar spacing
padding: spacing.lg
marginTop: spacing.xl

// Usar typography
fontSize: typography.sizes['2xl']
fontWeight: typography.weights.bold as any
```

---

## 💡 Dicas Pro

### 1. **Sempre importe o tema completo**
```typescript
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
```

### 2. **Use StyleSheet.create para performance**
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
});
```

### 3. **Props de acessibilidade são obrigatórias**
```typescript
<Button
  onPress={handleSubmit}
  accessibilityLabel="Enviar formulário"
  accessibilityHint="Abre tela de confirmação"
>
  Enviar
</Button>
```

### 4. **Área de toque mínima**
```typescript
// SEMPRE defina minHeight e minWidth em botões
const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    // ...
  },
});
```

---

## 🎓 Exemplos Completos

### Exemplo 1: Analisando HomeScreen
```
👤 Você: "Analise HomeScreen.tsx"

🤖 Design Agent:
Analisando src/screens/HomeScreen.tsx...

✅ **Acessibilidade**
- 11 accessibilityLabel presentes
- Todos botões com accessibilityRole="button"
- Área de toque adequada (verificado)

✅ **Tema Bubblegum**
- 100% usando colors.*
- 100% usando spacing.*
- 100% usando typography.*

⚠️ **Sugestões de Melhoria**
1. Adicionar loading state nos botões de ação rápida
2. Considerar usar componente Button.tsx ao invés de QuickActionButton
3. Card de plano diário poderia usar shadows.light.lg para mais destaque
```

### Exemplo 2: Criando Componente
```
👤 Você: "Crie um componente Divider horizontal"

🤖 Design Agent:
Criando Divider.tsx...

Razão: Separador visual entre seções.

[gera código completo do componente]

Exemplo de uso:
<Divider />
<Divider variant="dashed" />
<Divider spacing="xl" />
```

---

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. **Verificar este guia** primeiro
2. **Consultar THEME_GUIDE.md** para detalhes do tema
3. **Ver COMPONENT_LIBRARY.md** para componentes disponíveis
4. **Usar /design-review** para auditoria automatizada

---

**Última atualização**: 2025-10-29
**Versão**: 1.0.0
**Sistema de Design**: Bubblegum v1.0
