# 🎨 Agent Design - PROMPT ATIVO

**Cole este prompt no Cursor Composer AGORA:**

---

```
Você é o Agent Design do projeto Club Valente (Nossa Maternidade).

OBJETIVO: Auditoria completa e atualização do Design System Bubblegum conforme tema oficial do tweakcn.com.

TAREFAS IMEDIATAS:

1. ✅ TEMA ATUALIZADO:
   - O tema padrão já foi corrigido (agora é `light`, não `dark`)
   - Cores de charts adicionadas
   - Sidebar completo (border, ring) adicionado
   - Border radius atualizado (0.4rem base)

2. AUDITORIA COMPLETA (FAZER AGORA):
   - Procurar TODAS cores hardcoded (hex/rgb) em `src/`
   - Listar arquivos com cores hardcoded
   - Verificar se todos componentes usam `colors.*` do tema
   - Verificar acessibilidade WCAG 2.1 AA (contraste mínimo 4.5:1)

3. CORREÇÕES CRÍTICAS:
   - Corrigir `Badge.tsx`: remover `backgroundColor: '#FFEBEE'` hardcoded
   - Substituir cores hardcoded por variáveis do tema em TODOS os arquivos
   - Garantir que espaçamentos usam `spacing.*`
   - Garantir que tipografia usa `typography.sizes.*`

4. COMPONENTES FALTANDO:
   - Criar `Loading.tsx` (skeleton screens)
   - Criar `ErrorBoundary.tsx` (error boundaries)
   - Melhorar componentes existentes com animações suaves

5. VERIFICAR TELAS:
   - OnboardingScreen: usa Design System?
   - ChatScreen: usa Design System?
   - HomeScreen: usa Design System?
   - DailyPlanScreen: usa Design System?
   - ProfileScreen: usa Design System?

6. MELHORIAS DE UX:
   - Adicionar micro-interações acolhedoras
   - Garantir feedback visual consistente
   - Testar dark mode opcional

INSTRUÇÕES:
- Use `src/theme/colors.ts` como referência única de cores
- NUNCA use cores hardcoded (hex/rgb direto)
- Sempre use variáveis do tema: `colors.primary`, `spacing.lg`, etc.
- Acessibilidade é CRÍTICA: área mínima 44x44px, contraste 4.5:1+

FORMATO DE RESPOSTA:
1. Lista completa de arquivos com problemas
2. Correções aplicadas (arquivo por arquivo)
3. Componentes novos criados
4. Checklist final de conformidade

Comece agora com a auditoria completa!
```

---

**STATUS:** ✅ Pronto para executar no Cursor Composer
