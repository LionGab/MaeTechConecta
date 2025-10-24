# Mobile Testing Guide - ClubNath

Este guia fornece instruções detalhadas para testar a aplicação ClubNath em dispositivos móveis.

## 📱 Pré-requisitos

- Node.js instalado
- npm ou yarn
- Dispositivo móvel Android ou iOS
- Rede Wi-Fi compartilhada entre computador e dispositivo

## 🚀 Configuração para Teste Local

### 1. Iniciar o Servidor de Desenvolvimento

```bash
npm install
npm run dev
```

O servidor iniciará em `http://localhost:9002`

### 2. Encontrar IP Local da Máquina

#### No Windows:
```bash
ipconfig
```
Procure por "Endereço IPv4"

#### No macOS/Linux:
```bash
ifconfig | grep "inet "
```
ou
```bash
ip addr show
```

### 3. Acessar no Dispositivo Móvel

1. Conecte o dispositivo móvel à mesma rede Wi-Fi
2. Abra o navegador no dispositivo
3. Digite: `http://<SEU_IP>:9002`
   - Exemplo: `http://192.168.1.100:9002`

## ✅ Checklist de Testes Mobile

### Interface e Responsividade

- [ ] **Layout Mobile**
  - [ ] Conteúdo visível sem zoom
  - [ ] Sem scroll horizontal indesejado
  - [ ] Espaçamento adequado entre elementos
  - [ ] Textos legíveis (mínimo 16px)

- [ ] **Touch Targets**
  - [ ] Botões com mínimo 44x44px
  - [ ] Espaçamento de 8px entre elementos clicáveis
  - [ ] Feedback visual ao tocar (hover/active states)
  - [ ] Sem elementos sobrepostos

- [ ] **Navegação**
  - [ ] Bottom navigation fixo e funcional
  - [ ] Bottom nav oculto em desktop
  - [ ] Transições suaves entre páginas
  - [ ] Botão voltar do navegador funciona

### Páginas Específicas

#### Login/Signup (`/`)
- [ ] Formulário centralizado e legível
- [ ] Inputs com altura mínima de 44px
- [ ] Botões de social login bem espaçados
- [ ] Teclado virtual não sobrepõe campos
- [ ] Toggle de senha funcional
- [ ] Mensagens de erro visíveis
- [ ] Validação de email funcional
- [ ] Senha mínima de 6 caracteres

#### Dashboard (`/dashboard`)
- [ ] Header fixo no topo
- [ ] Conteúdo não sobrepõe header/bottom nav
- [ ] Cards responsivos
- [ ] Imagens carregam corretamente
- [ ] NathIA chatbot funcional
- [ ] Grid adapta-se ao tamanho da tela

#### Conexões (`/dashboard/matches`)
- [ ] Cards de perfil legíveis
- [ ] Botões de ação acessíveis
- [ ] Scroll vertical suave
- [ ] Imagens de perfil carregam

#### Loja (`/dashboard/loja`)
- [ ] Grid de produtos responsivo
- [ ] Preços e descrições legíveis
- [ ] Botões de compra acessíveis
- [ ] Imagens de produtos otimizadas

#### Fórum (`/dashboard/forum`)
- [ ] Posts legíveis
- [ ] Campo de input expansível
- [ ] Botão enviar acessível
- [ ] Chatbot não sobrepõe conteúdo

### PWA (Progressive Web App)

- [ ] **Instalação**
  - [ ] Prompt de instalação aparece
  - [ ] App instala com sucesso
  - [ ] Ícone aparece na tela inicial
  - [ ] Nome correto exibido

- [ ] **Funcionalidade Offline**
  - [ ] Service worker registrado
  - [ ] Páginas em cache acessíveis offline
  - [ ] Mensagem de offline amigável
  - [ ] Sincronização ao voltar online

- [ ] **Manifest**
  - [ ] Theme color aplicado
  - [ ] Background color correto
  - [ ] Ícones nos tamanhos corretos (192px, 512px)
  - [ ] Orientação portrait funcional

### Performance Mobile

- [ ] **Velocidade**
  - [ ] Primeira renderização < 3s
  - [ ] Interatividade < 5s
  - [ ] Navegação fluida
  - [ ] Sem travamentos

- [ ] **Otimizações**
  - [ ] Imagens lazy loading
  - [ ] Fontes otimizadas
  - [ ] CSS crítico inline
  - [ ] JavaScript minificado

### Acessibilidade Mobile

- [ ] **Touch**
  - [ ] Gestos padrão funcionam (scroll, tap, swipe)
  - [ ] Sem conflitos de toque
  - [ ] Zoom funcional onde necessário

- [ ] **Leitores de Tela**
  - [ ] Elementos semânticos corretos
  - [ ] Alt text em imagens
  - [ ] Labels em formulários
  - [ ] Navegação por teclado

### Testes por Dispositivo

#### iPhone (Safari iOS)
- [ ] Layout correto
- [ ] Bottom nav não sobrepõe conteúdo
- [ ] PWA instalável
- [ ] Touch gestures funcionam
- [ ] Status bar integrado

#### Android (Chrome)
- [ ] Layout correto
- [ ] Bottom nav funcional
- [ ] PWA instalável
- [ ] Notificações funcionam
- [ ] Back button do sistema funciona

#### Tablets (iPad/Android)
- [ ] Layout adapta para tela maior
- [ ] Bottom nav oculto (md:hidden)
- [ ] Grid usa 2 colunas em landscape
- [ ] Conteúdo não muito espaçado

## 🔧 Debugging Mobile

### Chrome DevTools (Remote Debugging Android)

1. Ative "Depuração USB" no dispositivo Android
2. Conecte via USB ao computador
3. Abra Chrome: `chrome://inspect`
4. Selecione o dispositivo e a página

### Safari DevTools (Remote Debugging iOS)

1. Ative "Web Inspector" no iOS: Settings > Safari > Advanced
2. Conecte iPhone ao Mac via USB
3. Abra Safari > Develop > [Seu iPhone]
4. Selecione a página

### Lighthouse Mobile Audit

```bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Rodar audit mobile
lighthouse http://localhost:9002 --view --preset=mobile
```

## 📊 Métricas Alvo

- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Time to Interactive**: < 5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🐛 Problemas Comuns

### 1. Dispositivo não acessa servidor local
**Solução**: Verifique firewall, certifique-se que está na mesma rede

### 2. Bottom nav sobrepõe conteúdo
**Solução**: Adicione `pb-20` no container principal

### 3. Inputs não focam corretamente
**Solução**: Remova `user-scalable=no` do viewport

### 4. PWA não instala
**Solução**: Certifique-se que está usando HTTPS ou localhost

### 5. Service worker não atualiza
**Solução**: Limpe cache, force reload, ou incremente versão do SW

## 📝 Relatório de Teste

Ao finalizar os testes, documente:

1. **Dispositivos testados**
   - Modelo
   - Sistema operacional
   - Navegador e versão

2. **Problemas encontrados**
   - Descrição
   - Passos para reproduzir
   - Screenshot
   - Severidade

3. **Performance**
   - Métricas Lighthouse
   - Experiência subjetiva
   - Sugestões de melhoria

---

✅ **Teste concluído com sucesso quando todos os itens estiverem marcados!**
