# 📅 Plano de Execução - Club Valente MVP

## Sistema Multi-Agent com Cursor 2.0

**Data de início:** 30/10/2025 (Hoje)
**Prazo:** 6-8 semanas
**Meta:** MVP funcional com todas as features core

---

## 🎯 Visão Geral

| Semana       | Período       | Foco                | Agentes Ativos | Entregáveis                        |
| ------------ | ------------- | ------------------- | -------------- | ---------------------------------- |
| **Semana 1** | 30/10 - 05/11 | Setup + Fundação    | Todos (1-8)    | Estrutura completa                 |
| **Semana 2** | 06/11 - 12/11 | Onboarding + NAT-IA | 1, 2, 3, 5     | Onboarding funcional + Chat básico |
| **Semana 3** | 13/11 - 19/11 | NAT-IA Avançado     | 2, 3, 4, 6     | Moderação + Memória + Risco        |
| **Semana 4** | 20/11 - 26/11 | Hábitos             | 1, 2, 4, 5     | Checklist completo                 |
| **Semana 5** | 27/11 - 03/12 | Conteúdos           | 1, 2, 4, 5     | Feed funcional                     |
| **Semana 6** | 04/12 - 10/12 | Polish + Testes     | Todos          | MVP completo                       |
| **Semana 7** | 11/12 - 17/12 | Buffer + Ajustes    | Todos          | Correções finais                   |
| **Semana 8** | 18/12 - 24/12 | Deploy + Docs       | 7, 8           | App em produção                    |

---

## 📅 SEMANA 1: Setup + Fundação (30/10 - 05/11)

### **Dia 1 - Quarta, 30/10/2025**

**Manhã (Agent 1, 2, 7):**

- ✅ Setup projeto React Native + Expo SDK 52
- ✅ Configuração TypeScript strict
- ✅ Setup Supabase (projeto, auth, database)
- ✅ Configuração EAS Build
- ✅ GitHub repo + CI/CD básico

**Tarde (Agent 1, 4):**

- ✅ Estrutura de pastas escalável
- ✅ Design System base (cores, tipografia, spacing)
- ✅ Componentes base (Button, Input, Card)
- ✅ ESLint + Prettier + Husky

**Entregável Dia 1:** Projeto configurado e rodando localmente ✅

---

### **Dia 2 - Quinta, 31/10/2025**

**Manhã (Agent 2):**

- ✅ Schema Supabase completo:
  - `user_profiles`
  - `conversation_history`
  - `chat_messages`
  - `habits`
  - `habit_completions`
  - `content_items`
  - `moderation_queue`
  - `risk_alerts`
  - `vector_embeddings`
- ✅ RLS (Row Level Security) configurado
- ✅ Políticas de acesso básicas

**Tarde (Agent 3):**

- ✅ Setup Gemini 2.0 Flash API
- ✅ Edge Function base (`nathia-chat`)
- ✅ Configuração de embeddings (text-embedding-004)
- ✅ Vector Store setup (pgvector)

**Entregável Dia 2:** Database schema + IA básica configurada ✅

---

### **Dia 3 - Sexta, 01/11/2025**

**Manhã (Agent 6):**

- ✅ Rascunho RIPD/DPIA
- ✅ Política de privacidade base
- ✅ Consentimento LGPD
- ✅ Mapeamento de dados sensíveis

**Tarde (Agent 1, 4):**

- ✅ Componentes do design system:
  - Badge, Loading, ErrorBoundary
  - Skeleton screens
  - Toast/Alert system
- ✅ Theme provider (light/dark)

**Entregável Dia 3:** LGPD compliance base + Design system completo ✅

---

### **Dia 4 - Segunda, 03/11/2025**

**Manhã (Agent 1, 2):**

- ✅ Navegação React Navigation
- ✅ Auth flow (Supabase Auth)
- ✅ Protected routes
- ✅ Onboarding screen (estrutura básica)

**Tarde (Agent 3):**

- ✅ Prompt system NAT-IA v0.1
- ✅ Restrições médicas hard-coded
- ✅ Sistema de triagem básico

**Entregável Dia 4:** Auth + Navegação + NAT-IA básico funcionando ✅

---

### **Dia 5 - Terça, 04/11/2025**

**Manhã (Agent 5):**

- ✅ Setup testes (Jest + React Native Testing Library)
- ✅ Testes básicos dos componentes
- ✅ E2E setup (Playwright para web, Detox para mobile)

**Tarde (Agent 7, 8):**

- ✅ Monitoring básico (Sentry)
- ✅ Analytics setup
- ✅ Documentação base do projeto

**Entregável Dia 5:** Testes configurados + Monitoring ✅

---

### **Dia 6-7 - Quarta/Quinta, 05-06/11/2025**

**Integração geral:**

- ✅ Revisão de todos os agentes
- ✅ Integração entre módulos
- ✅ Fix de bugs críticos
- ✅ Documentação de arquitetura

**Entregável Fim Semana 1:** Fundação sólida, tudo integrado ✅

---

## 📅 SEMANA 2: Onboarding + NAT-IA Core (06/11 - 12/11)

### **Dia 8-9 - Quarta/Quinta, 06-07/11**

**Agent 1 (Frontend):**

- ✅ Onboarding completo:
  - 5 telas de perguntas múltipla escolha
  - 1 tela de resposta aberta (texto)
  - Animações suaves entre telas
  - Progresso visual
  - Salvamento no Supabase

**Agent 2 (Backend):**

- ✅ API de onboarding
- ✅ Salvamento de respostas
- ✅ Criação de perfil automática

**Entregável:** Onboarding funcional (sem áudio ainda) ✅

---

### **Dia 10-11 - Sexta/Segunda, 08-10/11**

**Agent 3 (IA):**

- ✅ NAT-IA Edge Function completa:
  - Integração Gemini 2.0 Flash
  - Contexto das últimas 20 mensagens
  - Prompt system acolhedor
  - Restrições médicas hard-coded
  - Logs básicos

**Agent 1 (Frontend):**

- ✅ Tela de chat:
  - Interface conversacional
  - Input de mensagem
  - Lista de mensagens
  - Loading states
  - Error handling

**Entregável:** Chat NAT-IA básico funcionando ✅

---

### **Dia 12 - Terça, 11/11**

**Agent 3 + Agent 6:**

- ✅ Sistema de triagem de risco v0.1:
  - Palavras-chave críticas
  - Encaminhamento CVV 188
  - Flag de risco alto
- ✅ Compliance básico

**Entregável:** Triagem de risco operacional ✅

---

### **Dia 13 - Quarta, 12/11**

**Agent 5:**

- ✅ Testes E2E do fluxo:
  - Onboarding completo
  - Chat básico
  - Detecção de risco
- ✅ Correções de bugs

**Entregável:** Fluxo completo testado ✅

---

## 📅 SEMANA 3: NAT-IA Avançado (13/11 - 19/11)

### **Dia 14-15 - Quinta/Sexta, 13-14/11**

**Agent 3:**

- ✅ Moderação 3 camadas:
  - Camada 1: Gemini Safety Settings
  - Camada 2: Análise contextual
  - Camada 3: Fila de revisão humana
- ✅ Edge Function `moderation-service`

**Agent 2:**

- ✅ Tabela `moderation_queue`
- ✅ Admin dashboard básico (opcional)

**Entregável:** Moderação robusta funcionando ✅

---

### **Dia 16-17 - Segunda/Terça, 17-18/11**

**Agent 3:**

- ✅ Sistema de memória RAG:
  - Geração de embeddings
  - Vector Store (pgvector)
  - Recuperação semântica
  - Resumos hierárquicos (diário/semanal)
- ✅ Edge Functions: `generate-embeddings`, `retrieve-memory`

**Entregável:** Memória conversacional avançada ✅

---

### **Dia 18 - Quarta, 19/11**

**Agent 3:**

- ✅ Classificador de risco completo:
  - Risco médico (0-10)
  - Risco psicológico (0-10)
  - Ações recomendadas
  - Alertas automáticos
- ✅ Edge Function `risk-REDACTED`

**Agent 6:**

- ✅ Compliance LGPD para IA:
  - Pseudonimização de logs
  - Retenção de dados
  - Consentimento específico

**Entregável:** Sistema de risco completo ✅

---

## 📅 SEMANA 4: Checklist de Hábitos (20/11 - 26/11)

### **Dia 19-20 - Quinta/Sexta, 20-21/11**

**Agent 1 (Frontend):**

- ✅ Tela de hábitos:
  - Lista de hábitos (5 pré-definidos)
  - Check/uncheck diário
  - Visualização de progresso
  - Streaks básico

**Agent 2 (Backend):**

- ✅ APIs de hábitos:
  - Criar/listar hábitos
  - Marcar completo
  - Calcular streaks
  - Histórico diário/semanal

**Entregável:** Checklist de hábitos funcional ✅

---

### **Dia 21-22 - Segunda/Terça, 24-25/11**

**Agent 1:**

- ✅ Visualizações:
  - Gráfico de progresso semanal
  - Estatísticas de streaks
  - Conquistas básicas
- ✅ Notificações push (Expo Notifications)

**Agent 4:**

- ✅ Micro-interações:
  - Animação de check
  - Feedback visual de progresso
  - Celebrações de streaks

**Entregável:** Hábitos com UX polida ✅

---

### **Dia 23 - Quarta, 26/11**

**Agent 5:**

- ✅ Testes E2E de hábitos
- ✅ Testes de notificações
- ✅ Correções

**Entregável:** Hábitos testados e funcionando ✅

---

## 📅 SEMANA 5: Feed de Conteúdos (27/11 - 03/12)

### **Dia 24-25 - Quinta/Sexta, 27-28/11**

**Agent 2 (Backend):**

- ✅ CMS básico no Supabase:
  - Tabela `content_items`
  - Categorias/tags
  - Favoritos
- ✅ APIs de conteúdo

**Agent 1 (Frontend):**

- ✅ Tela de feed:
  - Lista de conteúdos
  - Categorias/tags
  - Busca básica
  - Favoritos

**Entregável:** Feed básico funcionando ✅

---

### **Dia 26-27 - Segunda/Terça, 01-02/12**

**Agent 1:**

- ✅ Player de vídeo/áudio (Expo AV)
- ✅ Visualização de artigos
- ✅ Download offline (opcional)

**Agent 4:**

- ✅ UI de conteúdos polida:
  - Cards visuais
  - Preview de conteúdo
  - Navegação fluida

**Entregável:** Conteúdos com players funcionando ✅

---

### **Dia 28 - Quarta, 03/12**

**Agent 3:**

- ✅ Análise comportamental (1x/dia):
  - Edge Function `behavior-analysis`
  - Sugestões de conteúdo personalizado
  - Atualização de perfil

**Entregável:** Feed com personalização básica ✅

---

## 📅 SEMANA 6: Polish + Testes (04/12 - 10/12)

### **Dia 29-31 - Quinta/Segunda, 04-08/12**

**Todos os Agentes:**

- ✅ Revisão completa do app
- ✅ Correção de bugs críticos
- ✅ Otimizações de performance
- ✅ Melhorias de UX
- ✅ Acessibilidade final (WCAG 2.1 AA)
- ✅ Testes E2E completos:
  - Fluxo onboarding → chat → hábitos → conteúdos
  - Detecção de risco
  - Moderação
  - Offline mode
  - Performance

**Entregável:** App polido e testado ✅

---

### **Dia 32 - Terça, 09/12**

**Agent 5:**

- ✅ Testes "red team":
  - Tentativas de quebrar segurança
  - Pedidos médicos
  - Conteúdo inapropriado
  - Crise simulada
- ✅ Correções de segurança

**Entregável:** Testes de segurança completos ✅

---

### **Dia 33 - Quarta, 10/12**

**Agent 6:**

- ✅ Compliance LGPD final:
  - RIPD completo
  - Política de privacidade
  - Termos de uso
  - Consentimentos revisados

**Agent 8:**

- ✅ Documentação completa:
  - User guide
  - API docs
  - Arquitetura técnica

**Entregável:** Compliance + Docs completos ✅

---

## 📅 SEMANA 7: Buffer + Ajustes (11/12 - 17/12)

### **Dia 34-38 - Quinta/Segunda, 11-15/12**

**Buffer para:**

- ✅ Features que atrasaram
- ✅ Ajustes baseados em feedback interno
- ✅ Otimizações finais
- ✅ Preparação para beta testing

**Entregável:** MVP estável e pronto para beta ✅

---

### **Dia 39 - Terça, 16/12**

**Agent 7:**

- ✅ Deploy para TestFlight (iOS)
- ✅ Deploy para Internal Testing (Android)
- ✅ Setup monitoring em produção

**Entregável:** App disponível para beta ✅

---

## 📅 SEMANA 8: Deploy + Docs (18/12 - 24/12)

### **Dia 40-42 - Quinta/Segunda, 18-22/12**

**Beta testing interno:**

- ✅ Testes com grupo beta (10-20 mães)
- ✅ Coleta de feedback
- ✅ Correções críticas

**Agent 8:**

- ✅ Documentação final:
  - Guia do usuário
  - FAQ
  - Troubleshooting
  - Política de suporte

**Entregável:** Beta testing completo + Docs finais ✅

---

### **Dia 43 - Terça, 23/12**

**Agent 7:**

- ✅ Deploy final para produção:
  - App Store Connect (iOS)
  - Google Play Console (Android)
- ✅ Monitoramento pós-lançamento

**Entregável:** MVP em produção! 🚀

---

## 📊 Métricas de Sucesso (Checkpoints)

### **Semana 2:**

- [ ] Onboarding completo funcionando
- [ ] NAT-IA respondendo corretamente
- [ ] Triagem de risco operacional

### **Semana 4:**

- [ ] Hábitos funcionando com streaks
- [ ] Notificações push operacionais

### **Semana 6:**

- [ ] Todos os testes E2E passando
- [ ] Performance <500ms latência
- [ ] Acessibilidade WCAG 2.1 AA

### **Semana 8:**

- [ ] MVP em produção
- [ ] Beta testing positivo (>80% satisfação)
- [ ] Zero bugs críticos

---

## 🎯 Priorização (Se atrasar)

**Must Have (MVP não funciona sem):**

1. Onboarding básico
2. NAT-IA funcionando
3. Triagem de risco
4. Hábitos básicos
5. Conteúdos simples

**Should Have (MVP melhor com):** 6. Memória RAG avançada 7. Moderação 3 camadas 8. Análise comportamental 9. Notificações push

**Nice to Have (Pode esperar):** 10. Áudio no onboarding 11. Download offline de conteúdos 12. Comunidade/comentários 13. Gamificação avançada

---

## 📝 Notas Importantes

- **Todos os agentes trabalham em paralelo** quando possível
- **Commits diários** para rastreabilidade
- **Code reviews** entre agentes antes de merge
- **Daily standup simulado** (revisão diária do progresso)
- **Buffer de 1 semana** para imprevistos

---

**Próximo passo:** Começar com Semana 1, Dia 1! 🚀

