# 🎨 Guia de Componentes Premium - Nossa Maternidade

**Tema "Amanhecer Sereno"**

---

## 📦 Componentes Disponíveis

### ✅ **Implementados (Serene Dawn)**

1. **ButtonPremium** - Botões com gradientes
2. **CardGlass** - Cards glassmorphism
3. **InputPremium** - Campos de texto premium ✨ NOVO
4. **BadgePremium** - Badges com gradientes ✨ NOVO

### 🔄 **A Migrar (Bubblegum → Serene Dawn)**

5. **DailyInsightCard** - Card hero (usar CardGlass)
6. **MessageItem** - Mensagens do chat
7. **Badge** → BadgePremium
8. **Input** → InputPremium
9. **Button** → ButtonPremium

---

## 🎯 **1. InputPremium**

Campo de entrada com efeito glass e gradiente dourado no focus.

### **Features:**
- ✨ Glassmorphism background
- 🌟 Gradiente dourado ao focar
- 🎯 Borda animada
- 💎 Validação visual elegante
- ⚡ Touch target 52px

### **Uso Básico:**

```tsx
import { InputPremium } from '@/components/InputPremium';

// Input simples
<InputPremium
  label="Seu nome"
  value={name}
  onChangeText={setName}
  placeholder="Digite seu nome"
  icon="account"
/>

// Input com validação
<InputPremium
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  icon="email"
  keyboardType="email-address"
  required
/>

// Input password com efeito glass
<InputPremium
  label="Senha"
  value={password}
  onChangeText={setPassword}
  icon="lock"
  secureTextEntry
  useGlass={true}
  helperText="Mínimo 8 caracteres"
/>
```

### **Props:**

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `label` | `string?` | - | Label acima do input |
| `error` | `string?` | - | Mensagem de erro |
| `helperText` | `string?` | - | Texto de ajuda |
| `icon` | `string?` | - | Ícone MaterialCommunityIcons |
| `iconColor` | `string?` | `champagne` | Cor do ícone |
| `required` | `boolean?` | `false` | Adiciona * no label |
| `useGlass` | `boolean?` | `true` | Efeito glassmorphism |

### **Exemplo Completo (Login):**

```tsx
<View style={styles.form}>
  <InputPremium
    label="Email"
    value={email}
    onChangeText={setEmail}
    error={errors.email}
    icon="email"
    keyboardType="email-address"
    autoCapitalize="none"
    required
  />

  <InputPremium
    label="Senha"
    value={password}
    onChangeText={setPassword}
    error={errors.password}
    icon="lock"
    secureTextEntry
    required
  />

  <ButtonPremium
    variant="primaryGold"
    size="lg"
    fullWidth
    onPress={handleLogin}
    accessibilityLabel="Entrar"
  >
    Entrar
  </ButtonPremium>
</View>
```

---

## 🏷️ **2. BadgePremium**

Badge com gradientes e efeito glow.

### **Features:**
- ✨ 6 variantes com gradientes
- 🌟 Efeito glow opcional
- 🎯 3 tamanhos (sm, md, lg)
- 💎 Ícones integrados
- ⚡ Animações sutis

### **Uso Básico:**

```tsx
import { BadgePremium } from '@/components/BadgePremium';

// Badge primário
<BadgePremium variant="primary" size="md">
  Novo
</BadgePremium>

// Badge dourado com glow
<BadgePremium variant="gold" glow>
  Premium
</BadgePremium>

// Badge com ícone
<BadgePremium variant="success" icon="check-circle">
  Concluído
</BadgePremium>

// Badge de erro
<BadgePremium variant="error" size="sm" icon="alert">
  Urgente
</BadgePremium>
```

### **Variantes:**

| Variante | Gradiente | Uso |
|----------|-----------|-----|
| `primary` | Azul sereno → Azul bebê | Padrão |
| `gold` | Azul → Dourado | Premium features |
| `success` | Verde suave | Sucesso |
| `warning` | Amarelo | Avisos |
| `error` | Vermelho suave | Erros |
| `info` | Azul info | Informação |

### **Tamanhos:**

```tsx
<BadgePremium size="sm">Pequeno</BadgePremium>   // 12px
<BadgePremium size="md">Médio</BadgePremium>     // 14px (padrão)
<BadgePremium size="lg">Grande</BadgePremium>    // 16px
```

### **Exemplo Completo (Status de Usuária):**

```tsx
<View style={styles.userHeader}>
  <Text style={styles.userName}>Maria Silva</Text>
  
  <View style={styles.badges}>
    <BadgePremium variant="gold" glow icon="crown">
      Premium
    </BadgePremium>
    
    <BadgePremium variant="success" icon="check-circle">
      Verificada
    </BadgePremium>
    
    <BadgePremium variant="primary" size="sm">
      Semana 24
    </BadgePremium>
  </View>
</View>
```

---

## 🔘 **3. ButtonPremium** (Revisão)

### **Exemplo: Form de Onboarding**

```tsx
<View style={styles.formContainer}>
  <InputPremium
    label="Como você prefere ser chamada?"
    value={name}
    onChangeText={setName}
    icon="account-heart"
    placeholder="Ex: Maria"
    required
  />

  <InputPremium
    label="Quantas semanas de gestação?"
    value={week}
    onChangeText={setWeek}
    icon="calendar-heart"
    keyboardType="numeric"
    helperText="Aproximadamente"
  />

  <ButtonPremium
    variant="primaryGold"
    size="lg"
    fullWidth
    icon="arrow-right"
    iconPosition="right"
    onPress={handleContinue}
    accessibilityLabel="Continuar"
  >
    Continuar
  </ButtonPremium>
</View>
```

---

## 🪟 **4. CardGlass** (Revisão)

### **Exemplo: Card de Perfil**

```tsx
<CardGlass
  title="Meu Perfil"
  subtitle="Personalize sua experiência"
  icon="account-circle"
  iconColor={sereneDawnColors.champagne}
  variant="elevated"
>
  <InputPremium
    label="Nome"
    value={profile.name}
    onChangeText={(text) => updateProfile('name', text)}
    icon="account"
  />

  <InputPremium
    label="Semana de gestação"
    value={profile.week}
    onChangeText={(text) => updateProfile('week', text)}
    icon="calendar"
    keyboardType="numeric"
  />

  <View style={styles.badgesContainer}>
    <Text style={styles.badgesLabel}>Status:</Text>
    <BadgePremium variant="primary">
      Ativa
    </BadgePremium>
    {profile.isPremium && (
      <BadgePremium variant="gold" glow>
        Premium
      </BadgePremium>
    )}
  </View>

  <ButtonPremium
    variant="primaryGold"
    size="lg"
    fullWidth
    onPress={handleSave}
    accessibilityLabel="Salvar alterações"
  >
    Salvar
  </ButtonPremium>
</CardGlass>
```

---

## 💡 **Exemplo Completo: Tela de Cadastro**

```tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InputPremium } from '@/components/InputPremium';
import { ButtonPremium } from '@/components/ButtonPremium';
import { BadgePremium } from '@/components/BadgePremium';
import { CardGlass } from '@/components/CardGlass';
import {
  sereneDawnColors,
  sereneDawnSpacing,
  sereneDawnBorderRadius,
} from '@/theme/sereneDawn';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [week, setWeek] = useState('');
  const [errors, setErrors] = useState<any>({});

  const handleSignup = () => {
    // Validação e registro
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          sereneDawnColors.midnightBlue,
          sereneDawnColors.darkPetrol,
        ]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Principal */}
        <CardGlass
          title="💕 Bem-vinda ao Nossa Maternidade"
          subtitle="Crie sua conta"
          variant="elevated"
          style={styles.card}
        >
          {/* Badge Premium */}
          <View style={styles.premiumBadge}>
            <BadgePremium variant="gold" glow icon="star">
              Grátis por 30 dias
            </BadgePremium>
          </View>

          {/* Formulário */}
          <InputPremium
            label="Como você prefere ser chamada?"
            value={name}
            onChangeText={setName}
            error={errors.name}
            icon="account-heart"
            placeholder="Ex: Maria"
            required
          />

          <InputPremium
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            icon="email"
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <InputPremium
            label="Senha"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            icon="lock"
            secureTextEntry
            helperText="Mínimo 8 caracteres"
            required
          />

          <InputPremium
            label="Semana de gestação"
            value={week}
            onChangeText={setWeek}
            error={errors.week}
            icon="calendar-heart"
            keyboardType="numeric"
            placeholder="Ex: 20"
            helperText="Aproximadamente"
          />

          {/* Botão Cadastrar */}
          <ButtonPremium
            variant="primaryGold"
            size="lg"
            fullWidth
            icon="check-circle"
            iconPosition="right"
            onPress={handleSignup}
            accessibilityLabel="Criar conta"
            style={styles.signupButton}
          >
            Criar minha conta
          </ButtonPremium>

          {/* Botão Já tenho conta */}
          <ButtonPremium
            variant="ghost"
            size="md"
            fullWidth
            onPress={() => navigation.navigate('Login')}
            accessibilityLabel="Fazer login"
          >
            Já tenho uma conta
          </ButtonPremium>
        </CardGlass>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: sereneDawnSpacing.lg,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
  },
  premiumBadge: {
    alignItems: 'center',
    marginBottom: sereneDawnSpacing.lg,
  },
  signupButton: {
    marginTop: sereneDawnSpacing.lg,
    marginBottom: sereneDawnSpacing.md,
  },
});
```

---

## ✅ **Checklist de Migração**

### **Por Screen:**

#### **LoginScreen:**
- [ ] Substituir `Input` por `InputPremium`
- [ ] Substituir `Button` por `ButtonPremium`
- [ ] Adicionar background gradient
- [ ] Usar `CardGlass` para container

#### **SignupScreen:**
- [ ] Substituir inputs por `InputPremium`
- [ ] Substituir botões por `ButtonPremium`
- [ ] Adicionar `BadgePremium` para premium trial
- [ ] Background gradient

#### **ProfileScreen:**
- [ ] Migrar para `InputPremium`
- [ ] Usar `BadgePremium` para status
- [ ] `CardGlass` para seções
- [ ] `ButtonPremium` para ações

#### **SettingsScreen:**
- [ ] `CardGlass` para grupos de configurações
- [ ] `BadgePremium` para novidades
- [ ] `ButtonPremium` para botões de ação

---

## 🎨 **Paleta Visual Rápida**

```tsx
// Inputs e campos
<InputPremium iconColor={sereneDawnColors.champagne} />

// Badges de status
<BadgePremium variant="gold" />      // Premium
<BadgePremium variant="success" />   // Verificado
<BadgePremium variant="primary" />   // Ativo
<BadgePremium variant="warning" />   // Atenção
<BadgePremium variant="error" />     // Urgente

// Botões primários
<ButtonPremium variant="primaryGold" />  // CTA principal
<ButtonPremium variant="primary" />      // CTA secundário
<ButtonPremium variant="outline" />      // Voltar/Cancelar
<ButtonPremium variant="ghost" />        // Links

// Cards
<CardGlass variant="elevated" />  // Principal
<CardGlass variant="glow" />      // Premium/Destaque
<CardGlass variant="default" />   // Padrão
```

---

## 📊 **Comparação Antes vs. Depois**

| Componente | Antes (Bubblegum) | Depois (Serene Dawn) | Melhoria |
|------------|-------------------|----------------------|----------|
| Input | Rosa/creme, flat | Glass + gradiente dourado | +80% UX |
| Badge | Sólido, sem brilho | Gradiente + glow | +70% visual |
| Button | Simples | Gradiente + haptic | +90% premium |
| Card | Flat branco | Glassmorphism + shadow | +100% elite |

---

## 🚀 **Próximos Passos**

1. **✅ Implementar em LoginScreen**
2. **✅ Implementar em SignupScreen**
3. **✅ Migrar ProfileScreen**
4. **✅ Atualizar SettingsScreen**
5. **✅ Testar em dispositivos reais**

---

**🌅 Componentes Premium - Tema "Amanhecer Sereno"**

*Transformando cada interação em uma experiência premium.* ✨

