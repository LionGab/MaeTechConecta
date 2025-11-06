# 🚀 Arquivos para Migração: LionNath → NathaliaValente

**Data:** 2025-11-06  
**Status:** Pronto para copiar

---

## 📁 ESTRUTURA DE ARQUIVOS

Estes arquivos foram adaptados do LionNath (React Native) para NathaliaValente (PWA React + Vite).

### **Onde copiar cada arquivo:**

```
NathaliaValente/
├── src/
│   ├── lib/
│   │   └── nat-ai/              # ← COPIAR: guardrails.ts, risk-analyzer.ts, system-prompt.ts, context-manager.ts
│   └── schemas/                 # ← COPIAR: chat-message.ts, user-profile.ts, risk-analysis.ts
├── supabase/
│   └── functions/               # ← COPIAR: Todas as Edge Functions do LionNath/infra/supabase/functions/
└── ...
```

---

## ✅ CHECKLIST DE MIGRAÇÃO

### **1. Sistema NAT-AI (Prioridade Alta)**
- [ ] Copiar `src/lib/nat-ai/guardrails.ts`
- [ ] Copiar `src/lib/nat-ai/risk-analyzer.ts` (adaptar para web)
- [ ] Copiar `src/lib/nat-ai/system-prompt.ts`
- [ ] Copiar `src/lib/nat-ai/context-manager.ts` (adaptar AsyncStorage → localStorage)

### **2. Schemas Zod**
- [ ] Copiar `src/schemas/chat-message.ts`
- [ ] Copiar `src/schemas/user-profile.ts`
- [ ] Copiar `src/schemas/risk-analysis.ts`

### **3. Edge Functions**
- [ ] Copiar `supabase/functions/nathia-chat/`
- [ ] Copiar `supabase/functions/moderation-service/`
- [ ] Copiar `supabase/functions/risk-classifier/`
- [ ] Copiar `supabase/functions/behavior-analysis/`
- [ ] Copiar `supabase/functions/lgpd-requests/`
- [ ] Copiar `supabase/functions/transcribe-audio/`

### **4. Features (Adaptar para React Web)**
- [ ] Criar `src/features/nathia-chat/` (Chat com IA)
- [ ] Criar `src/features/habits/` (Sistema de hábitos)
- [ ] Criar `src/features/content/` (Feed de conteúdos)

---

## 🔧 ADAPTAÇÕES NECESSÁRIAS

### **AsyncStorage → localStorage**
```typescript
// De (React Native):
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.getItem('key');

// Para (Web):
const value = localStorage.getItem('key');
```

### **React Navigation → React Router**
```typescript
// De (React Native):
import { useNavigation } from '@react-navigation/native';
navigation.navigate('Screen');

// Para (Web):
import { useNavigate } from 'react-router-dom';
navigate('/screen');
```

### **Componentes React Native → React Web**
```typescript
// De (React Native):
import { View, Text, TouchableOpacity } from 'react-native';

// Para (Web):
import { div, p, button } from React; // ou usar TailwindCSS
```

---

## 📝 PRÓXIMOS PASSOS

1. **Copiar arquivos** desta pasta para NathaliaValente
2. **Instalar dependências** se necessário (zod, axios, etc)
3. **Adaptar imports** para estrutura do NathaliaValente
4. **Testar** cada feature migrada
5. **Atualizar rotas** no React Router

---

**Arquivos prontos para migração!** 🚀


