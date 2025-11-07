# 🎨 Preview e Hot Reload - Guia Completo

## 📋 Visão Geral

Este guia explica como manter o **preview sempre visível** e o **hot reload ativo** para ver alterações em tempo real enquanto ajusta estilo, layout e funcionalidade.

---

## ✅ Configurações Ativas

### Fast Refresh (Hot Reload)

O **Fast Refresh** está **habilitado por padrão** no Expo e React Native. Ele permite:

- ✅ **Atualização instantânea** ao salvar arquivos
- ✅ **Preservação do estado** do componente (não perde dados)
- ✅ **Hot reload** para mudanças de estilo e layout
- ✅ **Full reload** apenas quando necessário

### Configurações Aplicadas

#### 1. Metro Config (`apps/mobile/metro.config.js`)

```javascript
// Fast Refresh habilitado por padrão
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};
```

#### 2. Babel Config (`apps/mobile/babel.config.js`)

O `babel-preset-expo` já inclui Fast Refresh automaticamente. Não é necessário configuração adicional.

---

## 🚀 Como Usar

### 1. Iniciar o Servidor de Desenvolvimento

```bash
# Desenvolvimento padrão (recomendado)
pnpm dev

# Ou diretamente
cd apps/mobile
pnpm dev
```

### 2. Abrir o Preview

Após iniciar, você verá:

```
Metro waiting on exp://192.168.x.x:8081
Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press w │ open web
› Press a │ open Android
› Press i │ open iOS simulator
```

**Opções disponíveis:**

- **`w`** - Abre no navegador (web preview)
- **`a`** - Abre no emulador Android
- **`i`** - Abre no simulador iOS
- **QR Code** - Escaneie com Expo Go no celular

### 3. Manter o Preview Visível

#### No Navegador (Web)

1. Pressione `w` no terminal ou acesse `http://localhost:8081`
2. O preview ficará aberto no navegador
3. **Mantenha a aba aberta** enquanto desenvolve
4. As alterações aparecerão automaticamente ao salvar

#### No Emulador/Simulador

1. Pressione `a` (Android) ou `i` (iOS)
2. O emulador/simulador abrirá automaticamente
3. **Mantenha a janela aberta** enquanto desenvolve
4. As alterações aparecerão automaticamente ao salvar

#### No Celular (Expo Go)

1. Escaneie o QR code com o app Expo Go
2. O app abrirá e conectará ao servidor
3. **Mantenha o app aberto** enquanto desenvolve
4. As alterações aparecerão automaticamente ao salvar

---

## 🔥 Hot Reload em Ação

### O Que Ativa Hot Reload

✅ **Mudanças de estilo** (StyleSheet, cores, espaçamento)
✅ **Mudanças de layout** (View, Text, componentes)
✅ **Mudanças de props** (valores passados para componentes)
✅ **Mudanças de estado** (useState, useReducer)
✅ **Novos componentes** (criação de novos arquivos)

### O Que Requer Full Reload

⚠️ **Mudanças em arquivos de configuração** (app.config.js, metro.config.js)
⚠️ **Mudanças em dependências nativas** (instalação de novos pacotes)
⚠️ **Mudanças em assets** (imagens, fontes) - às vezes requer reload
⚠️ **Erros de sintaxe** - pode requerer reload manual

---

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
# Desenvolvimento padrão
pnpm dev

# Desenvolvimento com cache limpo (se houver problemas)
pnpm dev:clear

# Desenvolvimento apenas para web
pnpm dev:web

# Desenvolvimento com tunnel (para testar em dispositivos remotos)
pnpm dev:tunnel

# Desenvolvimento apenas localhost (não acessível na rede)
pnpm dev:localhost

# Desenvolvimento na rede local (LAN)
pnpm dev:lan
```

---

## 💡 Dicas e Boas Práticas

### 1. Mantenha o Preview Sempre Aberto

- ✅ Deixe o navegador/emulador aberto enquanto desenvolve
- ✅ Use um monitor secundário se possível
- ✅ Configure o Cursor para abrir o preview automaticamente

### 2. Use Fast Refresh Efetivamente

- ✅ **Salve frequentemente** - cada save atualiza o preview
- ✅ **Teste imediatamente** - veja as mudanças em tempo real
- ✅ **Mantenha o estado** - Fast Refresh preserva o estado do componente

### 3. Otimize o Desenvolvimento

- ✅ **Use TypeScript** - erros aparecem antes de salvar
- ✅ **Use ESLint** - problemas de código são detectados
- ✅ **Use Prettier** - formatação automática ao salvar

### 4. Troubleshooting

#### Hot Reload Não Funciona

```bash
# Limpar cache e reiniciar
pnpm dev:clear
```

#### Preview Não Atualiza

1. Verifique se o servidor está rodando
2. Verifique se há erros no terminal
3. Tente fazer um reload manual (pressione `r` no terminal)

#### Mudanças Não Aparecem

1. Verifique se salvou o arquivo
2. Verifique se há erros de sintaxe
3. Verifique se o Fast Refresh está ativo (deve aparecer no terminal)

---

## 🎯 Workflow Recomendado

### 1. Iniciar Desenvolvimento

```bash
# Terminal 1: Servidor de desenvolvimento
pnpm dev

# Pressione 'w' para abrir no navegador
```

### 2. Desenvolver com Preview

1. **Abra o arquivo** que deseja editar no Cursor
2. **Mantenha o preview aberto** no navegador/emulador
3. **Faça alterações** no código
4. **Salve o arquivo** (Ctrl+S / Cmd+S)
5. **Veja as mudanças** aparecerem automaticamente no preview

### 3. Iterar Rapidamente

- ✅ **Ajuste estilos** → Salve → Veja no preview
- ✅ **Mude layout** → Salve → Veja no preview
- ✅ **Adicione funcionalidade** → Salve → Veja no preview

---

## 🔍 Verificar se Está Funcionando

### No Terminal

Você deve ver:

```
Fast Refresh enabled
Metro waiting on exp://192.168.x.x:8081
```

### No Preview

- ✅ Mudanças aparecem **instantaneamente** ao salvar
- ✅ **Estado preservado** (não perde dados do formulário, etc.)
- ✅ **Sem reload completo** (não reinicia o app)

### Teste Rápido

1. Abra um componente (ex: `src/components/Button.tsx`)
2. Mude uma cor ou estilo
3. Salve o arquivo
4. **O preview deve atualizar instantaneamente** sem reload completo

---

## 📚 Recursos Adicionais

- [Expo Fast Refresh Docs](https://docs.expo.dev/guides/using-fast-refresh/)
- [React Native Fast Refresh](https://reactnative.dev/docs/fast-refresh)
- [Metro Bundler Config](https://metrobundler.dev/docs/configuration)

---

## ✅ Checklist

- [ ] Servidor de desenvolvimento rodando (`pnpm dev`)
- [ ] Preview aberto (navegador/emulador/celular)
- [ ] Fast Refresh ativo (aparece no terminal)
- [ ] Mudanças aparecem automaticamente ao salvar
- [ ] Estado preservado durante hot reload

---

**🎉 Agora você está pronto para desenvolver com preview sempre visível e hot reload ativo!**
