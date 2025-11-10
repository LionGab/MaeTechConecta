# 🍎 Configuração do Xcode para iOS - Nossa Maternidade

## ⚠️ Importante

Estes comandos são para **macOS** apenas. Se você está no Windows, use o **Expo Go** no dispositivo iOS físico ou o **simulador iOS** (requer Mac).

---

## 📋 Pré-requisitos

- ✅ macOS instalado
- ✅ Xcode instalado (via App Store)
- ✅ Command Line Tools do Xcode
- ✅ CocoaPods (para dependências nativas)

---

## 🚀 Configuração Inicial do Xcode

### 1. Selecionar Xcode como Ferramenta de Desenvolvimento

```bash
# Selecionar Xcode padrão
sudo xcode-select -s /Applications/Xcode.app

# Verificar seleção
xcode-select -p
```

**Deve retornar:** `/Applications/Xcode.app/Contents/Developer`

### 2. Executar Primeira Inicialização do Xcode

```bash
# Executar primeira inicialização e verificar componentes
sudo xcodebuild -runFirstLaunch -checkForNewerComponents
```

Este comando:

- ✅ Aceita os termos de licença
- ✅ Instala componentes adicionais necessários
- ✅ Verifica atualizações disponíveis

### 3. Aceitar Licença do Xcode

```bash
# Aceitar licença do Xcode
sudo xcodebuild -license accept
```

---

## 🔧 Configuração Adicional

### 4. Instalar Command Line Tools

```bash
# Instalar Command Line Tools
xcode-select --install
```

Se já estiver instalado, aparecerá: "command line tools are already installed"

### 5. Verificar Versão do Xcode

```bash
# Verificar versão do Xcode
xcodebuild -version

# Verificar versão do Swift
swift --version
```

### 6. Configurar Simulador iOS

```bash
# Listar simuladores disponíveis
xcrun simctl list devices

# Abrir simulador específico (exemplo: iPhone 15)
open -a Simulator
```

---

## 📱 Configuração para Expo

### 7. Instalar CocoaPods (se necessário)

```bash
# Instalar CocoaPods
sudo gem install cocoapods

# Verificar instalação
pod --version
```

### 8. Configurar Projeto Expo para iOS

```bash
# Navegar para o projeto mobile
cd apps/mobile

# Instalar dependências
pnpm install

# Gerar projeto iOS nativo (se necessário)
npx expo prebuild --platform ios
```

### 9. Instalar Dependências iOS (CocoaPods)

```bash
# Navegar para pasta ios (se existir)
cd ios

# Instalar pods
pod install

# Voltar para raiz do projeto mobile
cd ..
```

---

## 🎯 Executar no Simulador iOS

### Opção 1: Via Expo CLI

```bash
cd apps/mobile

# Iniciar Expo
pnpm dev

# Pressionar 'i' para abrir simulador iOS
# Ou executar diretamente:
npx expo start --ios
```

### Opção 2: Via Xcode

1. Abrir Xcode
2. Abrir `apps/mobile/ios/NossaMaternidade.xcworkspace` (não .xcodeproj)
3. Selecionar simulador iOS no topo
4. Clicar em Run (▶️)

### Opção 3: Via Terminal

```bash
# Abrir simulador
open -a Simulator

# Executar app no simulador
cd apps/mobile
npx expo run:ios
```

---

## 🔍 Verificações

### Verificar Configuração Completa

```bash
# Verificar Xcode
xcode-select -p

# Verificar Command Line Tools
xcodebuild -version

# Verificar CocoaPods
pod --version

# Verificar Node/npm
node --version
npm --version

# Verificar Expo CLI
npx expo --version
```

---

## 🐛 Troubleshooting

### "xcode-select: error: tool 'xcodebuild' requires Xcode"

**Solução:**

```bash
# Selecionar Xcode corretamente
sudo xcode-select -s /Applications/Xcode.app

# Verificar
xcode-select -p
```

### "Command Line Tools not installed"

**Solução:**

```bash
# Instalar Command Line Tools
xcode-select --install

# Ou baixar manualmente de:
# https://developer.apple.com/download/more/
```

### "CocoaPods not found"

**Solução:**

```bash
# Instalar CocoaPods
sudo gem install cocoapods

# Se der erro de permissão, usar:
sudo gem install -n /usr/local/bin cocoapods
```

### "Simulator not opening"

**Solução:**

```bash
# Abrir simulador manualmente
open -a Simulator

# Ou listar e escolher simulador específico
xcrun simctl list devices available
```

### "Build failed" no Xcode

**Soluções:**

1. Limpar build: `Product > Clean Build Folder` (Shift+Cmd+K)
2. Limpar Derived Data: `~/Library/Developer/Xcode/DerivedData`
3. Reinstalar pods: `cd ios && pod deintegrate && pod install`

---

## 📋 Checklist de Configuração

- [ ] Xcode instalado (App Store)
- [ ] Command Line Tools instalados
- [ ] Xcode selecionado: `xcode-select -s /Applications/Xcode.app`
- [ ] Primeira inicialização executada: `xcodebuild -runFirstLaunch`
- [ ] Licença aceita: `xcodebuild -license accept`
- [ ] CocoaPods instalado (se necessário)
- [ ] Dependências do projeto instaladas: `pnpm install`
- [ ] Pods instalados (se projeto nativo): `pod install`
- [ ] Simulador iOS funcionando

---

## 🚀 Comandos Rápidos

```bash
# Configuração completa (executar uma vez)
sudo xcode-select -s /Applications/Xcode.app
sudo xcodebuild -runFirstLaunch -checkForNewerComponents
sudo xcodebuild -license accept

# Verificar configuração
xcode-select -p
xcodebuild -version

# Executar app iOS
cd apps/mobile
pnpm dev
# Pressionar 'i' para iOS
```

---

## 📚 Referências

- [Xcode Command Line Tools](https://developer.apple.com/xcode/)
- [Expo iOS Development](https://docs.expo.dev/workflow/ios-simulator/)
- [CocoaPods](https://cocoapods.org/)

---

**Execute os comandos acima para configurar o Xcode para desenvolvimento iOS!** 🎉
