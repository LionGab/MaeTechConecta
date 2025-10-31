# 🎨 Agent Design - ATIVO
## Trabalhando no Design System Bubblegum

**Status:** ✅ ATIVO
**Workspace:** `agent-design/`
**Data de Ativação:** 30/10/2025

---

## 🎯 MISSÃO ATUAL

O Agent Design está trabalhando em:

1. **Auditoria completa do Design System**
   - Verificar consistência de cores (zero hardcoded)
   - Verificar espaçamentos padronizados
   - Verificar tipografia consistente
   - Verificar acessibilidade WCAG 2.1 AA

2. **Correções de Design**
   - Corrigir tema padrão (deveria ser `light`, não `dark`)
   - Remover cores hardcoded do Badge.tsx
   - Garantir que todas as telas usam Design System
   - Adicionar componentes faltando (Loading, Skeleton, ErrorBoundary)

3. **Melhorias de UX**
   - Micro-interações acolhedoras
   - Animações suaves
   - Feedback visual consistente
   - Dark mode opcional funcionando

---

## 🔥 PROMPT PARA CURSOR COMPOSER (COPIE AGORA)

```
Você é o Agent Design do projeto Club Valente.

Sua missão: Auditoria completa e correções do Design System Bubblegum.

TAREFAS IMEDIATAS:

1. AUDITORIA COMPLETA:
   - Procurar todas cores hardcoded (hex/rgb) nos arquivos src/
   - Procurar espaçamentos hardcoded
   - Procurar tipografia hardcoded
   - Verificar acessibilidade WCAG 2.1 AA em todos componentes

2. CORREÇÕES CRÍTICAS:
   - Corrigir src/theme/colors.ts: export const colors = light; (atualmente está dark)
   - Corrigir Badge.tsx: remover backgroundColor: '#FFEBEE' hardcoded
   - Garantir que todos componentes usam variáveis do tema

3. COMPONENTES FALTANDO:
   - Criar Loading.tsx (skeleton screens)
   - Criar ErrorBoundary.tsx (error boundaries)
   - Melhorar componentes existentes

4. VERIFICAR TODAS AS TELAS:
   - OnboardingScreen: usa Design System?
   - ChatScreen: usa Design System?
   - HomeScreen: usa Design System?
   - DailyPlanScreen: usa Design System?
   - ProfileScreen: usa Design System?

Faça auditoria completa e liste TODOS os problemas encontrados.
Depois corrija os problemas críticos.

Referência: src/theme/colors.ts (tema Bubblegum)
```

---

## 📋 CHECKLIST DE TRABALHO

### Fase 1: Auditoria ✅
- [ ] Scannear todos arquivos .tsx/.ts em src/
- [ ] Listar cores hardcoded
- [ ] Listar espaçamentos hardcoded
- [ ] Listar tipografia hardcoded
- [ ] Verificar acessibilidade

### Fase 2: Correções 🔥
- [ ] Corrigir colors.ts (tema padrão)
- [ ] Corrigir Badge.tsx
- [ ] Substituir cores hardcoded por variáveis do tema
- [ ] Substituir espaçamentos hardcoded

### Fase 3: Componentes ⬜
- [ ] Criar Loading.tsx
- [ ] Criar ErrorBoundary.tsx
- [ ] Melhorar componentes existentes

### Fase 4: Telas ⬜
- [ ] Auditar OnboardingScreen
- [ ] Auditar ChatScreen
- [ ] Auditar HomeScreen
- [ ] Auditar DailyPlanScreen
- [ ] Auditar ProfileScreen

---

## 🎯 OBJETIVO FINAL

**100% dos componentes e telas usando Design System Bubblegum consistentemente.**

Zero cores/estilos hardcoded.

WCAG 2.1 AA compliant.

---

**PRÓXIMO PASSO:** Cole o prompt acima no Cursor Composer e execute!
