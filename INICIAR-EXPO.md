# 🚀 Como Iniciar o Expo e Ver o QR Code

## Problema
Quando o Expo é iniciado em background pelo Cursor, o QR Code não aparece no terminal.

## ✅ Solução Rápida

### 1. Abra um novo terminal no projeto
- Abra PowerShell ou CMD
- Navegue até a pasta do projeto:
  ```bash
  cd C:\Users\User\Desktop\Projetos\Correto
  ```

### 2. Execute o comando:
```bash
npm start
```

Ou diretamente:
```bash
npx expo start
```

### 3. Aguarde o QR Code aparecer
O terminal mostrará:
- ✅ QR Code no terminal
- 🌐 Link para abrir no navegador (geralmente `http://localhost:19000`)
- 📱 URL para conectar no app Expo Go

### 4. Para testar no mobile:
- **iPhone**: Use a câmera para escanear o QR Code ou abra o app Expo Go
- **Android**: Abra o app Expo Go e escaneie o QR Code
- **Simulador iOS**: Pressione `i` no terminal
- **Emulador Android**: Pressione `a` no terminal

## 🔧 Comandos Úteis

- `npm start` - Inicia o Expo normalmente
- `npx expo start --clear` - Limpa cache e inicia
- `npx expo start --tunnel` - Usa túnel (útil se não estiver na mesma rede)
- `npx expo start --ios` - Inicia e abre no simulador iOS
- `npx expo start --android` - Inicia e abre no emulador Android

## ⚠️ Problemas Comuns

### QR Code não aparece?
1. Verifique se não há outro processo Expo rodando
2. Execute `npx expo start --clear` para limpar cache
3. Verifique se a porta 19000 está disponível

### Não consegue conectar no mobile?
1. Certifique-se que o celular e computador estão na mesma rede Wi-Fi
2. Tente usar o modo túnel: `npx expo start --tunnel`
3. Verifique se o firewall não está bloqueando a conexão
