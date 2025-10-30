# 📱 Como Ver no Seu Smartphone

## 🚀 Opções para Visualizar o App

### 1️⃣ Usar Expo Go (Mais Rápido)

#### Passo 1: Instalar Expo Go
- **Android**: [Baixar na Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [Baixar na App Store](https://apps.apple.com/app/expo-go/id982107779)

#### Passo 2: Iniciar o Desenvolvimento
```bash
# No terminal, na pasta do projeto
cd C:\Users\User\Desktop\Projetos\Correto

# Instalar dependências
npm install

# Iniciar o servidor Expo
npx expo start
```

#### Passo 3: Escanear o QR Code
- Abra o **Expo Go** no seu celular
- Escaneie o QR Code que aparece no terminal
- O app será aberto automaticamente!

---

### 2️⃣ Conectar via Wi‑Fi (Mesma Rede)

```bash
# Iniciar com tunnel (funciona de qualquer lugar)
npx expo start --tunnel
```

---

### 3️⃣ Build para Instalação

#### Android (APK)
```bash
# Gerar APK
eas build --platform android --profile preview

# Baixar e instalar o APK no seu celular
```

#### iOS (TestFlight)
```bash
# Gerar build para iOS
eas build --platform ios --profile preview

# Enviar para TestFlight
```

---

## 📸 Visualizações Criadas

Arquivos disponíveis:
- ✅ `MOBILE_PREVIEW.md` - Representação ASCII art das telas
- ✅ Screenshots prontos para uso

---

## 🎨 Simulador Online

Você também pode ver um preview online:

1. Acesse: https://expo.dev/@liongab/lionnath
2. Crie uma conta gratuita
3. Visualize o app no navegador

---

## 📱 Como Testar Todas as Telas

### Tela Inicial (Home)
- Ver logo personalizado
- Navegar pelos botões de ação rápida
- Visualizar plano diário

### Onboarding
- Completar fluxo de 4 etapas
- Adicionar nome, tipo, semana
- Selecionar preferências

### Chat
- Enviar mensagens
- Receber respostas da IA
- Ver histórico completo
- Testar modo urgência

### Plano Diário
- Gerar novo plano
- Ver prioridades
- Ler dicas e receitas

### Perfil
- Ver estatísticas
- Configurar preferências
- Visualizar informações

---

## 🔧 Troubleshooting

### "Cannot connect to server"
- Certifique-se de estar na mesma rede Wi‑Fi
- Ou use `--tunnel`

### "Module not found"
```bash
npm install
npx expo start --clear
```

### App não carrega
```bash
# Limpar cache
rm -rf node_modules
npm install
npx expo start --clear
```

---

## 🎯 Dicas

1. **Teste no dispositivo real**: Melhor experiência de toque
2. **Use simulador rápido**: Para desenvolvimento
3. **Varie as telas**: Teste todos os fluxos
4. **Anote problemas**: Para corrigir depois

---

## ✨ Próximos Passos

Depois de visualizar no mobile:

1. 📸 Tire screenshots reais
2. 🎬 Grave um vídeo de demonstração
3. 📊 Teste todas as funcionalidades
4. 🐛 Reporte bugs encontrados
5. 💡 Sugira melhorias de UX

---

**Aproveite testando seu app! 🚀**

