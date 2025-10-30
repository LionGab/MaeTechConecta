# 🚀 Guia de Configuração - Nossa Maternidade

## Pré-requisitos

1. **Node.js** 16 ou superior
2. **Expo CLI** instalado globalmente
3. Contas nas APIs necessárias

## 📋 Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Acesse [Supabase](https://supabase.com) e crie um projeto
2. Vá em **SQL Editor** e execute o conteúdo de `supabase-setup.sql`
3. As tabelas serão criadas automaticamente:
   - `user_profiles`
   - `chat_messages`
   - `daily_plans`

### 3. Configurar APIs

As chaves de API já estão configuradas em `src/config/api.ts`:
- ✅ Claude API
- ✅ OpenAI
- ✅ Gemini
- ✅ Perplexity

Para usar recursos de voz e vídeo:
- Configure ElevenLabs em `src/services/contentGenerator.ts`
- Configure HeyGen em `src/services/contentGenerator.ts`

### 4. Configurar Assets

Adicione os arquivos de imagem na pasta `assets/`:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

Você pode usar placeholders temporários.

### 5. Rodar o App

```bash
# Iniciar Expo
npx expo start

# Rodar em iOS (requer Mac)
npx expo start --ios

# Rodar em Android
npx expo start --android
```

## 🧪 Testando o App

### Onboarding
1. O app iniciará na tela de onboarding
2. Preencha seu nome, tipo (gestante/mãe/tentante)
3. Informe a semana de gravidez
4. Selecione suas preferências

### Chat
1. Vá para a tela de Chat
2. Digite uma pergunta sobre gravidez/maternidade
3. A IA responderá de forma empática
4. Teste o modo urgência: "Estou sangrando"

### Plano Diário
1. Vá para Home
2. Clique em "Gerar Plano Agora"
3. Receba prioridades, dica e receita

## 🔐 Segurança

### Implementação de RLS (Row Level Security)
O Supabase já está configurado com RLS. Cada usuário só acessa seus próprios dados.

### Chaves de API
⚠️ **IMPORTANTE**: As chaves estão hardcoded para facilitar o setup. Em produção, mova para variáveis de ambiente.

## 🐛 Troubleshooting

### Erro ao conectar no Supabase
- Verifique se as chaves estão corretas em `src/services/supabase.ts`
- Confirme se as tabelas foram criadas

### Erro ao usar APIs de IA
- Verifique sua quota/limite de créditos
- Claude: https://console.anthropic.com
- OpenAI: https://platform.openai.com/usage

### App não inicia
```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm install
npx expo start --clear
```

## 📱 Build para Produção

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## 🎯 Próximos Passos

1. [ ] Adicionar integração com ElevenLabs para voz
2. [ ] Integrar HeyGen para vídeos com avatar
3. [ ] Configurar Stripe para pagamentos
4. [ ] Adicionar push notifications com OneSignal
5. [ ] Implementar modo offline robusto

## 📞 Suporte

Para dúvidas e ajuda, consulte:
- [Expo Docs](https://docs.expo.dev)
- [Supabase Docs](https://supabase.com/docs)
- [React Native Docs](https://reactnative.dev)

---

Desenvolvido com 💕 para mães e gestantes no Brasil

