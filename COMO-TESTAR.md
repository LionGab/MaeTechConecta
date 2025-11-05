# 🚀 Como Testar o App - Guia Rápido

## Para a Influenciadora Testar Hoje

### Passo 1: Instalar Expo Go 📱
- **Android:** [Download na Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iPhone:** [Download na App Store](https://apps.apple.com/app/expo-go/id982107779)

### Passo 2: Preparar o Ambiente
Alguém técnico precisa fazer:
```bash
cd /workspace
pnpm dev
```

Um QR Code aparecerá na tela.

### Passo 3: Escanear QR Code
- **Android:** Abra Expo Go → "Scan QR Code" → Escaneie
- **iPhone:** Abra Câmera → Aponte para QR Code → Toque na notificação

⚠️ **IMPORTANTE:** Celular e computador precisam estar na MESMA rede WiFi!

### Passo 4: Testar Funcionalidades

#### ✅ Checklist Básico:
1. **Onboarding** - Complete as 7 telas
2. **Home** - Gere um plano diário
3. **Chat NathIA** - Faça uma pergunta
4. **Hábitos** - Marque um hábito como completo
5. **Conteúdos** - Leia um artigo
6. **Perfil** - Veja suas informações

#### 🎯 Teste Principal: Chat NathIA
Faça perguntas como:
- "Olá, NathIA!"
- "Me dê uma dica para hoje"
- "Quais alimentos são bons para gestante?"

**O que observar:**
- ✅ Resposta rápida (< 10 segundos)
- ✅ Linguagem empática e acessível
- ✅ Personalização (menciona seu nome)
- ✅ Não dá conselhos médicos diretos

### ⚠️ Se Algo Não Funcionar

#### Chat não responde:
- Verificar conexão com internet
- Verificar se Supabase está configurado
- Verificar se Edge Function está deployed

#### App não abre:
- Verificar se está na mesma WiFi
- Tentar fechar e reabrir Expo Go
- Pedir para rodar `pnpm dev` novamente

---

## 📚 Documentação Completa

Para guia detalhado, veja: **`GUIA-TESTE-INFLUENCIADORA.md`**

---

**Tempo de teste:** ~30 minutos  
**Dificuldade:** Fácil (só precisa do Expo Go instalado)
