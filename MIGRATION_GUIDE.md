# 🔄 Guia de Migração para Design System Bubblegum

> **Como migrar do código antigo para os novos componentes**

---

## 📋 Visão Geral

Este guia mostra como substituir código antigo (hardcoded, TouchableOpacity manual, TextInput manual) pelos **novos componentes do Design System Bubblegum**.

---

## ✅ Componentes Migrados

### **Telas Completamente Refatoradas**
- ✅ **OnboardingScreen.tsx** - 100% migrado
- ✅ **HomeScreen.tsx** - 100% migrado

### **Telas Pendentes de Migração**
- ⏳ **ChatScreen.tsx** - Aguardando migração
- ⏳ **DailyPlanScreen.tsx** - Aguardando migração
- ⏳ **ProfileScreen.tsx** - Aguardando migração

---

## 🔄 Migrações Realizadas

### **1. Botões: TouchableOpacity → Button**

#### **Antes**
```typescript
<TouchableOpacity
  style={{
    backgroundColor: '#DD5B9A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  }}
  onPress={handleSubmit}
>
  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>
    Enviar
  </Text>
</TouchableOpacity>
```

#### **Depois**
```typescript
import { Button } from '../components';

<Button
  variant="primary"
  onPress={handleSubmit}
  accessibilityLabel="Enviar formulário"
>
  Enviar
</Button>
```

#### **Benefícios**
- ✅ 12 linhas → 1 linha
- ✅ 100% tema Bubblegum
- ✅ Acessibilidade completa (accessibilityRole, accessibilityState)
- ✅ 5 variantes prontas (primary, secondary, outline, ghost, destructive)
- ✅ Estados de loading automáticos

---

### **2. Inputs: TextInput → Input**

#### **Antes**
```typescript
<Text>Nome:</Text>
<TextInput
  style={{
    backgroundColor: '#F2F1E8',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DD5B9A',
  }}
  placeholder="Digite seu nome"
  value={name}
  onChangeText={setName}
/>
```

#### **Depois**
```typescript
import { Input } from '../components';

<Input
  label="Nome"
  value={name}
  onChangeText={setName}
  placeholder="Digite seu nome"
  icon="account"
  required
/>
```

#### **Benefícios**
- ✅ 100% tema Bubblegum
- ✅ Label integrada
- ✅ Ícones opcionais
- ✅ Estados de erro automáticos
- ✅ Helper text embutido
- ✅ Validação visual
- ✅ Altura mínima de 48px (WCAG)

---

### **3. Cards: View manual → Card**

#### **Antes**
```typescript
<View
  style={{
    backgroundColor: '#F2F1E8',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }}
>
  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#DD5B9A' }}>
    Título
  </Text>
  <Text style={{ fontSize: 16, color: '#696969' }}>
    Conteúdo do card...
  </Text>
</View>
```

#### **Depois**
```typescript
import { Card } from '../components';

<Card
  title="Título"
  icon="heart"
  variant="elevated"
>
  <Text style={styles.content}>Conteúdo do card...</Text>
</Card>
```

#### **Benefícios**
- ✅ 100% tema Bubblegum
- ✅ 3 variantes (elevated, outlined, flat)
- ✅ Título e ícone integrados
- ✅ Sombras consistentes
- ✅ Clicável opcional (onPress)

---

### **4. Emojis → Ícones**

#### **Antes**
```typescript
<Text>👋 Olá, Maria!</Text>
<Text>💕 Semana 24 de gestação</Text>
<Text>🥗 Alimentação saudável</Text>
```

#### **Depois**
```typescript
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

<View style={styles.greetingContainer}>
  <Icon name="hand-wave" size={24} color={colors.primary} />
  <Text>Olá, Maria!</Text>
</View>

<View style={styles.subGreetingContainer}>
  <Icon name="heart-pulse" size={18} color={colors.destructive} />
  <Text>Semana 24 de gestação</Text>
</View>

<View style={styles.preferenceContainer}>
  <Icon name="food-apple" size={20} color={colors.primary} />
  <Text>Alimentação saudável</Text>
</View>
```

#### **Benefícios**
- ✅ Ícones profissionais
- ✅ Escaláveis (SVG)
- ✅ Cores temáticas
- ✅ Melhor para leitores de tela

---

## 📝 Checklist de Migração

Use esta checklist ao migrar uma tela:

### **Imports**
- [ ] Remover `TextInput` se não for mais usado
- [ ] Adicionar `import { Button, Card, Input, Badge } from '../components'`
- [ ] Adicionar `import Icon from 'react-native-vector-icons/MaterialCommunityIcons'`

### **Estrutura**
- [ ] Adicionar `SafeAreaView` como container principal
- [ ] Adicionar `StatusBar` com `barStyle="dark-content"`
- [ ] Manter `ScrollView` se conteúdo for dinâmico

### **Botões**
- [ ] Substituir todos `TouchableOpacity` por `<Button>`
- [ ] Adicionar `accessibilityLabel` obrigatório
- [ ] Escolher variante apropriada (primary, secondary, outline, ghost, destructive)
- [ ] Adicionar `icon` quando relevante

### **Inputs**
- [ ] Substituir todos `TextInput` por `<Input>`
- [ ] Adicionar `label` descritiva
- [ ] Adicionar `icon` relevante
- [ ] Marcar `required` quando obrigatório
- [ ] Adicionar `error` para validação

### **Cards**
- [ ] Substituir `View` de containers por `<Card>`
- [ ] Extrair títulos para prop `title`
- [ ] Adicionar `icon` quando relevante
- [ ] Escolher `variant` (elevated, outlined, flat)

### **Emojis**
- [ ] Substituir todos emojis por `<Icon>`
- [ ] Escolher ícone apropriado do MaterialCommunityIcons
- [ ] Aplicar `color` do tema (colors.primary, colors.destructive, etc.)
- [ ] Definir `size` apropriado (16, 20, 24, 32)

### **Estilos**
- [ ] Remover hardcoded colors → usar `colors.*`
- [ ] Remover hardcoded spacing → usar `spacing.*`
- [ ] Remover hardcoded fontSize → usar `typography.sizes.*`
- [ ] Remover hardcoded borderRadius → usar `borderRadius.*`
- [ ] Adicionar `fontFamily: typography.fontFamily.sans` em textos

### **Acessibilidade**
- [ ] Todos botões com `accessibilityLabel`
- [ ] Todos botões com `accessibilityHint` (recomendado)
- [ ] Inputs com `accessibilityLabel`
- [ ] Cards clicáveis com `accessibilityLabel`
- [ ] Componentes decorativos com `accessible={false}`

---

## 🎯 Exemplos Completos de Migração

### **Exemplo 1: OnboardingScreen (Step 1 - Input de Nome)**

#### **Antes**
```typescript
<TextInput
  style={styles.input}
  placeholder="Digite seu nome"
  value={name}
  onChangeText={setName}
/>

// Estilos
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F2F1E8',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DD5B9A',
  },
});
```

#### **Depois**
```typescript
<Input
  label="Nome completo"
  value={name}
  onChangeText={setName}
  placeholder="Digite seu nome"
  icon="account"
  required
/>

// Estilos: Não necessário! Componente já estilizado
```

---

### **Exemplo 2: HomeScreen (Botão de Emergência)**

#### **Antes**
```typescript
<TouchableOpacity
  style={styles.emergencyButton}
  onPress={() =>
    Alert.alert(
      'Emergência',
      'Ligue para o SAMU: 192',
      [{ text: 'Entendi' }]
    )
  }
>
  <Icon name="alert-circle" size={24} color="#FFF" />
  <Text style={styles.emergencyButtonText}>Emergência - SAMU 192</Text>
</TouchableOpacity>

// Estilos
const styles = StyleSheet.create({
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#D65152',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 56,
  },
  emergencyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

#### **Depois**
```typescript
import { Linking } from 'react-native';

<Button
  variant="destructive"
  size="lg"
  fullWidth
  icon="phone-alert"
  onPress={() => {
    Alert.alert(
      '🚨 Emergência',
      'Você será direcionado para ligar para o SAMU (192).',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar Agora',
          style: 'destructive',
          onPress: () => Linking.openURL('tel:192')
        }
      ]
    );
  }}
  accessibilityLabel="Botão de emergência"
  accessibilityHint="Ligar para SAMU 192 em caso de emergência médica"
  style={styles.emergencyButton}
>
  Emergência - SAMU 192
</Button>

// Estilos
const styles = StyleSheet.create({
  emergencyButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing['3xl'],
  },
});
```

---

### **Exemplo 3: HomeScreen (Card de Plano Diário)**

#### **Antes**
```typescript
<View style={styles.dailyPlanCard}>
  <View style={styles.dailyPlanHeader}>
    <Icon name="target" size={24} color="#DD5B9A" />
    <Text style={styles.dailyPlanTitle}>Seu Plano de Hoje</Text>
  </View>
  <Text style={styles.priorityItem}>1. Consulta médica</Text>
  <Text style={styles.priorityItem}>2. Caminhada</Text>
</View>

// Estilos
const styles = StyleSheet.create({
  dailyPlanCard: {
    backgroundColor: '#F2F1E8',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dailyPlanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DD5B9A',
  },
  priorityItem: {
    fontSize: 16,
    color: '#696969',
    marginTop: 8,
  },
});
```

#### **Depois**
```typescript
<Card
  title="Seu Plano de Hoje"
  icon="target"
  variant="elevated"
  style={styles.dailyPlanCard}
>
  <Text style={styles.priorityItem}>• Consulta médica</Text>
  <Text style={styles.priorityItem}>• Caminhada</Text>
</Card>

// Estilos
const styles = StyleSheet.create({
  dailyPlanCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  priorityItem: {
    fontSize: typography.sizes.base,
    color: colors.mutedForeground,
    marginTop: spacing.sm,
    lineHeight: 24,
    fontFamily: typography.fontFamily.sans,
  },
});
```

---

## 🔧 Ferramentas de Migração

### **Buscar Padrões Antigos**
Use estes comandos para encontrar código que precisa migração:

```bash
# Buscar cores hardcodadas
grep -r "#[0-9A-Fa-f]\{6\}" src/screens/

# Buscar TextInput sem componente
grep -r "TextInput" src/screens/ | grep -v "import"

# Buscar TouchableOpacity
grep -r "TouchableOpacity" src/screens/

# Buscar emojis
grep -r "[😀-🙏]" src/screens/
```

---

## 📊 Progresso de Migração

### **OnboardingScreen.tsx** ✅ 100%
- ✅ 4 TextInput → Input
- ✅ 2 TouchableOpacity → Button (Próximo, Voltar)
- ✅ 3 opções de tipo (Gestante, Mãe, Tentante) com ícones
- ✅ 7 preferências com ícones
- ✅ SafeAreaView + StatusBar
- ✅ Todos emojis → ícones

### **HomeScreen.tsx** ✅ 100%
- ✅ 3 Cards manuais → Card component
- ✅ 2 TouchableOpacity → Button (Plano Diário, Emergência)
- ✅ QuickActionButton ainda manual (aceitável)
- ✅ SafeAreaView + StatusBar já presente
- ✅ Emoji no greeting → ícone
- ✅ Botão emergência funcional (liga para 192)

### **ChatScreen.tsx** ⏳ 0%
- ⏳ Botão SOS → Button component
- ⏳ Mensagens → Card (opcional)
- ⏳ SafeAreaView + StatusBar
- ⏳ Emojis → ícones

### **DailyPlanScreen.tsx** ⏳ 0%
- ⏳ 3 Cards manuais → Card component
- ⏳ Botão refresh → Button
- ⏳ SafeAreaView + StatusBar

### **ProfileScreen.tsx** ⏳ 0%
- ⏳ Cards de info → Card component
- ⏳ Botões de ação → Button
- ⏳ Inputs (se houver edição) → Input

---

## 🎯 Próximos Passos

1. **ChatScreen** (próxima prioridade)
   - Migrar botão SOS para `<Button variant="destructive">`
   - Adicionar SafeAreaView
   - Substituir emojis por ícones

2. **DailyPlanScreen**
   - Migrar cards para `<Card>`
   - Migrar botão refresh para `<Button>`

3. **ProfileScreen**
   - Migrar cards de informação para `<Card>`
   - Migrar botões de ação para `<Button>`
   - Se houver edição, usar `<Input>`

4. **Testes End-to-End**
   - Testar navegação entre telas
   - Validar acessibilidade
   - Verificar performance

5. **Commit Final**
   - Versionar código
   - Atualizar CHANGELOG
   - Documentar breaking changes

---

## 💡 Dicas de Migração

### **1. Migre Incrementalmente**
- Não migre tudo de uma vez
- Migre uma tela por vez
- Teste após cada migração

### **2. Use Find & Replace com Cuidado**
- Cores hexadecimais são seguras de substituir
- Estilos complexos requerem revisão manual

### **3. Mantenha Estilos Customizados**
- Nem tudo precisa ser componente
- `QuickActionButton` pode ficar interno na HomeScreen
- Layout específico pode ficar em estilos locais

### **4. Teste Acessibilidade**
- Use leitor de tela (TalkBack/VoiceOver)
- Valide contraste com ferramentas online
- Teste área de toque (mínimo 44x44px)

---

**Última atualização**: 2025-10-29
**Versão do Design System**: Bubblegum 1.0
**Telas Migradas**: 2/5 (40%)
**Componentes Criados**: 7 (Button, Card, Input, Badge, Logo, WelcomeHeader, ThemeShowcase)
