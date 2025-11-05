# 🎯 Preparar para Teste da Influenciadora

## ⚡ Checklist Rápido (5 minutos antes do teste)

### 1. Verificar Configuração (Técnico)
- [ ] Supabase configurado e funcionando
- [ ] Edge Function `nathia-chat` deployed
- [ ] Gemini API Key configurada
- [ ] `.env.local` preenchido com credenciais

### 2. Preparar Ambiente de Teste
```bash
# Garantir que está tudo instalado
cd /workspace
pnpm install

# Iniciar o servidor de desenvolvimento
pnpm dev
```

### 3. Verificar QR Code
- [ ] QR Code aparece no terminal
- [ ] Verificar se mostra "Metro waiting on..."
- [ ] Anotar o endereço (ex: exp://192.168.x.x:8081)

### 4. Testar Localmente (Opcional mas Recomendado)
- [ ] Testar onboarding funciona
- [ ] Testar chat responde
- [ ] Testar navegação entre telas

### 5. Preparar Dispositivo
- [ ] Ter um celular Android ou iPhone disponível
- [ ] Instalar Expo Go no celular
- [ ] Garantir que celular está na mesma WiFi do computador

---

## 📱 Instruções para Passar para Influenciadora

### Opção 1: Presencial
1. Mostrar QR Code na tela
2. Pedir para escanear com Expo Go
3. Aguardar app carregar
4. Passar o guia: `GUIA-TESTE-INFLUENCIADORA.md`

### Opção 2: Remoto
1. Compartilhar tela mostrando QR Code
2. Pedir para escanear com Expo Go
3. Enviar link do guia: `GUIA-TESTE-INFLUENCIADORA.md`

### Opção 3: Tunnel (Recomendado para Remoto)
```bash
# Usar tunnel do Expo (funciona mesmo em WiFi diferente)
pnpm dev --tunnel
```

---

## 🎬 Script de Apresentação

### Introdução (1 min)
"Olá! Vou te mostrar como testar o app Nossa Maternidade hoje. É bem simples:
1. Vou gerar um QR Code
2. Você escaneia com o Expo Go
3. O app vai abrir no seu celular
4. Você testa todas as funcionalidades"

### Durante o Teste (30 min)
- Ficar disponível para ajudar
- Observar o que ela está testando
- Anotar feedbacks importantes
- Não interromper o fluxo dela

### Após o Teste (10 min)
- Perguntar o que achou
- Anotar problemas encontrados
- Coletar sugestões
- Agradecer o tempo dela

---

## ✅ O Que Deve Funcionar

### Funcionalidades Críticas:
- ✅ Onboarding completo
- ✅ Home Screen com plano diário
- ✅ Chat NathIA respondendo
- ✅ Hábitos funcionando
- ✅ Feed de conteúdos
- ✅ Perfil do usuário

### O Que Pode Não Funcionar (E Está OK):
- ⚠️ Notificações push (opcional)
- ⚠️ Pagamentos Stripe (não implementado ainda)
- ⚠️ Alguns conteúdos podem estar vazios (seed data)

---

## 🐛 Problemas Comuns e Soluções

### QR Code não aparece
```bash
# Tentar novamente
pnpm dev

# Ou usar tunnel
pnpm dev --tunnel
```

### Chat não responde
- Verificar logs no terminal
- Verificar se Edge Function está deployed
- Verificar se Gemini API Key está configurada

### App não carrega
- Verificar conexão WiFi
- Tentar fechar e reabrir Expo Go
- Limpar cache: Expo Go → Settings → Clear cache

---

## 📝 Template de Feedback

Após o teste, coletar:
- **O que funcionou bem:** ___________
- **O que não funcionou:** ___________
- **Sugestões:** ___________
- **Bugs encontrados:** ___________

---

## 🎯 Objetivo do Teste

1. ✅ Validar que todas as funcionalidades principais funcionam
2. ✅ Coletar feedback sobre UX/UI
3. ✅ Identificar bugs críticos
4. ✅ Garantir que está pronto para uso

---

**Tempo total:** ~45 minutos (preparação + teste + feedback)  
**Status:** ✅ Pronto para testar!
