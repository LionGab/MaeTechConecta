# 📱 Guia de Teste - Para Influenciadora

## 🎯 Como Testar o App Hoje

### Opção 1: No Celular (Mais Fácil) 📱

#### Passo 1: Instalar Expo Go no Celular
- **Android:** Abra a Play Store → Procure "Expo Go" → Instale
- **iPhone:** Abra a App Store → Procure "Expo Go" → Instale

#### Passo 2: Receber o QR Code
- Peça para alguém rodar o comando: `pnpm dev`
- Um QR Code aparecerá no terminal/tela
- **IMPORTANTE:** Certifique-se que o celular e o computador estão na MESMA rede WiFi

#### Passo 3: Escanear o QR Code
- **Android:** Abra o Expo Go → Toque em "Scan QR Code" → Escaneie
- **iPhone:** Abra a Câmera nativa → Aponte para o QR Code → Toque na notificação

#### Passo 4: Aguardar o App Carregar
- O app vai baixar e abrir automaticamente
- Primeira vez pode demorar ~30 segundos

---

### Opção 2: Emulador no Computador 💻

#### Android (Recomendado)
1. Instalar Android Studio
2. Criar um emulador (AVD)
3. Rodar: `pnpm dev` → Pressionar `a` para abrir no Android

#### iPhone (Só no Mac)
1. Instalar Xcode
2. Abrir simulador iOS
3. Rodar: `pnpm dev` → Pressionar `i` para abrir no iOS

---

## ✅ Checklist de Teste

### 1. Primeira Abertura (Onboarding)
- [ ] App abre mostrando tela de boas-vindas
- [ ] Consegue navegar pelas 7 telas de onboarding
- [ ] Consegue selecionar tipo: Gestante / Mãe / Tentante
- [ ] Consegue preencher nome
- [ ] Consegue selecionar semana de gestação (se gestante)
- [ ] Consegue escolher preferências
- [ ] Ao finalizar, vai para a Home

### 2. Home Screen (Tela Principal)
- [ ] Mostra nome personalizado ("Olá, [Nome]!")
- [ ] Mostra semana de gestação (se gestante)
- [ ] Botão "Gerar Plano Agora" aparece
- [ ] Ao clicar, gera um plano diário personalizado
- [ ] Plano mostra:
  - [ ] Prioridades do dia
  - [ ] Dica do dia
  - [ ] Receita sugerida

### 3. Chat com NathIA 🤖
- [ ] Aba "NathIA" aparece na navegação inferior
- [ ] Tela de chat abre sem erros
- [ ] Consegue digitar uma mensagem
- [ ] Exemplos de perguntas:
  - "Olá, NathIA!"
  - "Me dê uma dica para hoje"
  - "Quais alimentos são bons para gestante?"
- [ ] NathIA responde de forma empática
- [ ] Respostas são personalizadas (menciona nome, semana de gestação)
- [ ] Histórico de conversas é salvo

### 4. Hábitos Diários 📋
- [ ] Aba "Hábitos" aparece na navegação
- [ ] Lista de hábitos aparece
- [ ] Consegue marcar hábito como completo
- [ ] Progresso atualiza visualmente
- [ ] Lista inclui hábitos como:
  - Beber água
  - Fazer exercício leve
  - Alimentação saudável
  - Descanso

### 5. Feed de Conteúdos 📚
- [ ] Aba "Conteúdos" aparece na navegação
- [ ] Lista de artigos/conteúdos aparece
- [ ] Consegue clicar em um conteúdo
- [ ] Tela de detalhe abre mostrando:
  - [ ] Título
  - [ ] Descrição completa
  - [ ] Botão de compartilhar funciona
- [ ] Consegue voltar para a lista

### 6. Perfil 👤
- [ ] Aba "Perfil" aparece na navegação
- [ ] Mostra informações do usuário:
  - [ ] Nome
  - [ ] Tipo (Gestante/Mãe/Tentante)
  - [ ] Semana de gestação (se aplicável)
- [ ] Consegue editar perfil
- [ ] Toggle de Dark Mode funciona

### 7. Dark Mode 🌙
- [ ] No Perfil, consegue alternar entre Light/Dark
- [ ] Todas as telas mudam de cor
- [ ] Textos continuam legíveis
- [ ] Navegação continua funcionando

### 8. Navegação Geral
- [ ] Todas as 5 abas funcionam:
  - [ ] Início (Home)
  - [ ] NathIA (Chat)
  - [ ] Hábitos
  - [ ] Conteúdos
  - [ ] Perfil
- [ ] Ícones aparecem corretamente
- [ ] Transições entre telas são suaves
- [ ] App não trava ou fecha inesperadamente

---

## 🎬 O Que Testar Especificamente

### Teste de Fluxo Completo:
1. **Novo Usuário:**
   - Abrir app pela primeira vez
   - Completar onboarding
   - Explorar todas as telas
   - Fazer uma pergunta para NathIA
   - Marcar um hábito como completo
   - Ler um conteúdo

2. **Usuário Existente:**
   - Fechar e reabrir o app
   - Verificar se perfil está salvo
   - Verificar se histórico de chat está salvo
   - Verificar se plano diário aparece

### Teste de Chat NathIA:
Teste perguntas como:
- "Oi, NathIA!"
- "Estou na 20ª semana, o que esperar?"
- "Me dê uma dica para hoje"
- "Quais alimentos evitar na gravidez?"
- "Como faço para dormir melhor?"
- "Me conte sobre desenvolvimento do bebê"

**O que observar:**
- ✅ Respostas empáticas e acolhedoras
- ✅ Linguagem casual e acessível
- ✅ Personalização (menciona nome, semana)
- ✅ Não dá conselhos médicos diretos
- ✅ Sugere sempre consultar médico
- ✅ Respostas rápidas (não demora muito)

### Teste de Performance:
- [ ] App abre rápido (< 5 segundos)
- [ ] Navegação é fluida
- [ ] Chat responde em tempo razoável (< 10 segundos)
- [ ] Não trava durante uso
- [ ] Não consome muita bateria

---

## 🐛 Problemas Comuns e Soluções

### App não abre / QR Code não funciona
- ✅ Verificar se celular e computador estão na mesma WiFi
- ✅ Tentar fechar e reabrir Expo Go
- ✅ Pedir para rodar `pnpm dev` novamente

### Chat não responde
- ⚠️ Verificar se Supabase está configurado
- ⚠️ Verificar se Edge Function está deployed
- ⚠️ Verificar se Gemini API Key está configurada

### App trava ou fecha
- ✅ Verificar se há atualizações pendentes do Expo Go
- ✅ Fechar outros apps no celular
- ✅ Reiniciar o app

### Onboarding não salva
- ⚠️ Verificar se Supabase está configurado
- ⚠️ Verificar conexão com internet

---

## 📸 Screenshots para Capturar

Se possível, tire screenshots de:
1. Tela de onboarding (primeira tela)
2. Home Screen com plano diário gerado
3. Chat funcionando (pergunta + resposta)
4. Lista de hábitos
5. Feed de conteúdos
6. Perfil do usuário
7. Dark Mode ativado

---

## 📝 Feedback para Dar

### O que está bom ✅
- O que mais gostou?
- Funcionalidades que funcionaram bem
- Design que achou bonito

### O que precisa melhorar 🔧
- O que não funcionou?
- O que ficou confuso?
- O que falta ou está faltando?
- Bugs encontrados

### Sugestões 💡
- O que você adicionaria?
- O que mudaria?
- O que facilitaria para outras mães?

---

## 🚀 Próximos Passos Após Teste

1. **Se tudo funcionou:**
   - Personalizar conteúdos
   - Adicionar mais perguntas ao chat
   - Preparar para lançamento

2. **Se algo não funcionou:**
   - Anotar o problema específico
   - Tirar screenshot se possível
   - Enviar feedback detalhado

---

## 📞 Precisa de Ajuda?

Se encontrar problemas durante o teste:
1. Anotar o que aconteceu
2. Tirar screenshot se possível
3. Tentar novamente em alguns minutos
4. Pedir ajuda técnica se necessário

---

**Tempo estimado de teste:** 30-45 minutos  
**Ideal fazer:** Teste completo seguindo o checklist acima

🎉 **Divirta-se testando o app!**
