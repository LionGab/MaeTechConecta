# 📦 Biblioteca de Componentes - Bubblegum Design System

> **Catálogo completo de componentes UI para Nossa Maternidade**

---

## 📚 Índice

1. [Button](#button) - Botões com variantes e acessibilidade
2. [Card](#card) - Containers de conteúdo
3. [Input](#input) - Campos de entrada de texto
4. [Logo](#logo) - Logo do app
5. [WelcomeHeader](#welcomeheader) - Cabeçalho de boas-vindas
6. [ThemeShowcase](#themeshowcase) - Demonstração do tema

---

## 🔘 Button

**Arquivo**: `src/components/Button.tsx`

### Descrição
Botão acessível e responsivo com múltiplas variantes, ícones opcionais e estados de loading.

### Variantes
- `primary` - Botão principal (fundo rosa, texto branco)
- `secondary` - Botão secundário (fundo azul pastel)
- `outline` - Botão com borda (transparente com borda rosa)
- `ghost` - Botão fantasma (transparente, texto rosa)
- `destructive` - Ação destrutiva (fundo vermelho)

### Tamanhos
- `sm` - Pequeno (padding reduzido)
- `md` - Médio (padrão)
- `lg` - Grande (padding aumentado)

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `children` | `ReactNode` | *obrigatório* | Texto do botão |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'primary'` | Variante visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do botão |
| `icon` | `string` | - | Ícone do MaterialCommunityIcons |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Posição do ícone |
| `loading` | `boolean` | `false` | Estado de carregamento |
| `disabled` | `boolean` | `false` | Botão desabilitado |
| `fullWidth` | `boolean` | `false` | Largura total (100%) |
| `accessibilityLabel` | `string` | *obrigatório* | Label de acessibilidade |
| `accessibilityHint` | `string` | - | Hint de acessibilidade |
| `onPress` | `() => void` | - | Função de toque |

### Acessibilidade
✅ Área de toque mínima: **44x44px** (WCAG 2.1 AA)
✅ `accessibilityRole="button"` automático
✅ `accessibilityState` reflete disabled/loading
✅ Contraste de cores conforme WCAG AA

### Exemplos

#### Botão Primário Simples
```typescript
import { Button } from '../components/Button';

<Button
  variant="primary"
  onPress={handleSubmit}
  accessibilityLabel="Enviar formulário"
>
  Enviar
</Button>
```

#### Botão com Ícone e Loading
```typescript
<Button
  variant="secondary"
  icon="chat"
  loading={isLoading}
  accessibilityLabel="Abrir chat"
  accessibilityHint="Conversar com assistente virtual"
>
  Conversar
</Button>
```

#### Botão Destrutivo
```typescript
<Button
  variant="destructive"
  icon="delete"
  iconPosition="right"
  onPress={handleDelete}
  accessibilityLabel="Excluir conta"
  accessibilityHint="Esta ação não pode ser desfeita"
>
  Excluir
</Button>
```

#### Botão Fullwidth
```typescript
<Button
  variant="primary"
  size="lg"
  fullWidth
  onPress={handleContinue}
  accessibilityLabel="Continuar para próxima etapa"
>
  Continuar
</Button>
```

---

## 📄 Card

**Arquivo**: `src/components/Card.tsx`

### Descrição
Container de conteúdo com bordas arredondadas, sombra e suporte para título, ícone e interação.

### Variantes
- `elevated` - Com sombra (padrão)
- `outlined` - Com borda, sem sombra
- `flat` - Sem sombra nem borda

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `children` | `ReactNode` | *obrigatório* | Conteúdo do card |
| `title` | `string` | - | Título do card |
| `subtitle` | `string` | - | Subtítulo/descrição |
| `icon` | `string` | - | Ícone do MaterialCommunityIcons |
| `iconColor` | `string` | `colors.primary` | Cor do ícone |
| `variant` | `'elevated' \| 'outlined' \| 'flat'` | `'elevated'` | Variante visual |
| `padding` | `keyof typeof spacing` | `'lg'` | Padding interno |
| `onPress` | `() => void` | - | Torna o card clicável |
| `accessibilityLabel` | `string` | - | Label (obrigatório se onPress) |
| `accessibilityHint` | `string` | - | Hint de acessibilidade |

### Acessibilidade
✅ Se `onPress` presente: `accessibilityRole="button"` automático
✅ Label de acessibilidade usa `title` como fallback
✅ Feedback tátil com `activeOpacity={0.7}`

### Exemplos

#### Card Simples
```typescript
import { Card } from '../components/Card';

<Card title="Dica do Dia" icon="lightbulb">
  <Text>Beba bastante água durante a gestação!</Text>
</Card>
```

#### Card Clicável
```typescript
<Card
  title="Seu Plano Diário"
  subtitle="3 prioridades para hoje"
  icon="calendar-check"
  variant="elevated"
  onPress={handleOpenPlan}
  accessibilityLabel="Abrir plano diário"
  accessibilityHint="Ver suas prioridades de hoje"
>
  <Text>1. Consulta médica às 14h</Text>
  <Text>2. Caminhada de 20 minutos</Text>
  <Text>3. Ler sobre amamentação</Text>
</Card>
```

#### Card com Padding Customizado
```typescript
<Card variant="outlined" padding="xl">
  <Text>Conteúdo com padding extra</Text>
</Card>
```

---

## ✏️ Input

**Arquivo**: `src/components/Input.tsx`

### Descrição
Campo de entrada de texto com label, validação, ícone opcional e feedback visual de erro.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | `string` | - | Label acima do input |
| `value` | `string` | - | Valor do input |
| `onChangeText` | `(text: string) => void` | - | Callback de mudança |
| `placeholder` | `string` | - | Placeholder |
| `error` | `string` | - | Mensagem de erro |
| `helperText` | `string` | - | Mensagem de ajuda |
| `icon` | `string` | - | Ícone à esquerda |
| `iconColor` | `string` | - | Cor do ícone |
| `required` | `boolean` | `false` | Adiciona * no label |
| `editable` | `boolean` | `true` | Input editável |
| `multiline` | `boolean` | `false` | Múltiplas linhas |
| `keyboardType` | `KeyboardTypeOptions` | `'default'` | Tipo de teclado |

### Estados Visuais
- **Normal**: Borda cinza
- **Focado**: Borda rosa (primary)
- **Erro**: Borda vermelha + texto de erro
- **Desabilitado**: Fundo cinza + opacidade

### Acessibilidade
✅ Altura mínima: **48px** para área de toque adequada
✅ `accessibilityLabel` usa `label` ou `placeholder` como fallback
✅ `accessibilityHint` usa `helperText` ou `error`
✅ `accessibilityLiveRegion="assertive"` em erros

### Exemplos

#### Input Básico
```typescript
import { Input } from '../components/Input';
import { useState } from 'react';

const [name, setName] = useState('');

<Input
  label="Seu nome"
  value={name}
  onChangeText={setName}
  placeholder="Digite seu nome completo"
/>
```

#### Input com Validação
```typescript
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (text: string) => {
  setEmail(text);
  if (!text.includes('@')) {
    setEmailError('Email inválido');
  } else {
    setEmailError('');
  }
};

<Input
  label="Email"
  value={email}
  onChangeText={validateEmail}
  error={emailError}
  icon="email"
  keyboardType="email-address"
  required
/>
```

#### Input com Helper Text
```typescript
<Input
  label="Senha"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  icon="lock"
  helperText="Mínimo 8 caracteres"
  required
/>
```

#### Input Multiline
```typescript
<Input
  label="Observações"
  value={notes}
  onChangeText={setNotes}
  placeholder="Adicione suas observações aqui..."
  multiline
  numberOfLines={4}
/>
```

---

## 🎨 Logo

**Arquivo**: `src/components/Logo.tsx`

### Descrição
Logo ilustrativo do app Nossa Maternidade com gestante e bebê.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `size` | `number` | `80` | Tamanho do logo (largura/altura) |
| `style` | `ViewStyle` | - | Estilo customizado |

### Acessibilidade
✅ `accessible={false}` - Componente decorativo, não lido por leitores de tela

### Exemplo

```typescript
import { Logo } from '../components/Logo';

<Logo size={100} />
```

---

## 👋 WelcomeHeader

**Arquivo**: `src/components/WelcomeHeader.tsx`

### Descrição
Cabeçalho de boas-vindas personalizado com logo, nome do usuário e semana de gestação.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `name` | `string` | *obrigatório* | Nome do usuário |
| `pregnancyWeek` | `number` | - | Semana de gestação (opcional) |

### Acessibilidade
✅ Título com `accessibilityRole="header"`
✅ Labels descritivas para leitores de tela

### Exemplo

```typescript
import { WelcomeHeader } from '../components/WelcomeHeader';

<WelcomeHeader name="Maria" pregnancyWeek={24} />
```

---

## 🎨 ThemeShowcase

**Arquivo**: `src/components/ThemeShowcase.tsx`

### Descrição
Componente de demonstração visual do sistema de design Bubblegum. Exibe todas as cores, espaçamentos, tipografia e sombras.

### Props
*Nenhuma prop - componente de showcase estático*

### Uso
Útil para:
- Validar tema após mudanças
- Documentação visual
- Testes de consistência

### Exemplo

```typescript
import { ThemeShowcase } from '../components/ThemeShowcase';

<ThemeShowcase />
```

---

## 🎯 Componentes Planejados (Roadmap)

### Badge
**Status**: 🔜 Planejado
**Descrição**: Tags de status (info, warning, error, success)
**Uso**: Indicadores de urgência, categorias, status

### Divider
**Status**: 🔜 Planejado
**Descrição**: Separador horizontal/vertical entre seções
**Variantes**: solid, dashed, dotted

### Avatar
**Status**: 🔜 Planejado
**Descrição**: Imagem de perfil circular com fallback para iniciais
**Tamanhos**: xs, sm, md, lg, xl

### Switch/Toggle
**Status**: 🔜 Planejado
**Descrição**: Interruptor on/off acessível
**Uso**: Configurações de perfil, preferências

### ProgressBar
**Status**: 🔜 Planejado
**Descrição**: Barra de progresso para onboarding, metas
**Variantes**: linear, circular

---

## 📏 Guia de Uso de Componentes

### Quando usar Button vs TouchableOpacity?
- **Use Button**: Para ações primárias, secundárias, formulários
- **Use TouchableOpacity**: Para elementos customizados que não se encaixam nas variantes

### Quando usar Card vs View?
- **Use Card**: Para agrupar conteúdo relacionado com destaque visual
- **Use View**: Para containers simples sem necessidade de sombra/borda

### Quando usar Input vs TextInput?
- **Use Input**: Sempre! (mais acessível, validação, feedback visual)
- **Use TextInput**: Apenas para casos extremamente customizados

---

## ✅ Checklist de Criação de Componentes

Ao criar um novo componente, garanta:

### Estrutura
- [ ] Arquivo em `src/components/[NomeComponente].tsx`
- [ ] Interface de Props exportada
- [ ] JSDoc com descrição e exemplos
- [ ] Props tipadas com TypeScript
- [ ] StyleSheet.create para estilos

### Tema Bubblegum
- [ ] 100% usando `colors.*` (0 cores hardcodadas)
- [ ] 100% usando `spacing.*` (0 valores hardcodados)
- [ ] 100% usando `typography.*` (0 fontSize/fontWeight hardcodados)
- [ ] 100% usando `borderRadius.*`
- [ ] Sombras usando `shadows.light.*`

### Acessibilidade
- [ ] `accessibilityLabel` obrigatório (ou padrão inteligente)
- [ ] `accessibilityRole` apropriado
- [ ] `accessibilityHint` quando necessário
- [ ] `accessibilityState` para estados (disabled, selected, etc.)
- [ ] Área de toque mínima: 44x44px para elementos interativos

### Documentação
- [ ] Adicionado neste arquivo (COMPONENT_LIBRARY.md)
- [ ] Exemplos de uso no código (JSDoc)
- [ ] Props documentadas em tabela
- [ ] Variantes/estados explicados

### Testes Visuais
- [ ] Testado em tela pequena (iPhone SE)
- [ ] Testado em tela grande (iPad)
- [ ] Testado com texto longo (overflow)
- [ ] Testado todos os estados (default, hover, disabled, error)

---

## 📚 Importação Rápida

### Importar um componente
```typescript
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
```

### Importar múltiplos
```typescript
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';
```

### Importar tema
```typescript
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
```

---

## 🔗 Links Úteis

- **DESIGN_AGENT_GUIDE.md** - Como usar o Design Agent
- **THEME_GUIDE.md** - Guia completo do tema Bubblegum
- **QUICK_START_THEME.md** - Referência rápida do tema

---

**Última atualização**: 2025-10-29
**Total de componentes**: 6 (3 novos criados hoje)
**Componentes planejados**: 5
**Cobertura do tema**: 100%
