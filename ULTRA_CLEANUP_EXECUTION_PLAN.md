# ULTRA CLEANUP EXECUTION PLAN

## EXECUTIVE SUMMARY

**Total Branches**: 40 remote branches (excluding origin/main)
**Branches with Value**: 12 branches contain extractable content
**Branches Already in Main**: 15 branches (empty or merged)
**Obsolete/Empty Branches**: 13 branches (only "Initial plan" commits or empty)

**CRITICAL FINDING**: Main branch CI/CD is BROKEN - needs PR #35 or #36 immediately

---

## PHASE 1: CRITICAL FIXES (DO FIRST - URGENT)

### 1.1 Fix Broken CI/CD - CHOOSE ONE:

**Option A: PR #35 - copilot/fix-post-merge-validation-issue (RECOMMENDED)**

What it fixes:
- 18 files changed, +460/-87 lines
- Adds .eslintignore files to apps/mobile, packages/shared, packages/shared-types  
- Adds .eslintrc.cjs to packages/shared-types, .eslintrc.js to packages/shared
- Updates tsconfig.json in all packages for proper monorepo TypeScript resolution
- Adds dependencies to root package.json for TypeScript resolution from root src/
- Fixes tsup build errors that are breaking CI/CD

RECOMMENDATION: Use PR #35 (cleaner, focused on config only, less risk)

---

## PHASE 2: FEATURE MERGES (High-Value Components)

### 2.1 StatusScreen Component + API Configuration (PR #26)

Branch: cursor/implement-react-component-with-detailed-guidelines-cbe2

What it adds:
- NEW COMPONENTS:
  - src/components/StatusScreen.tsx (334 lines)
  - src/components/ConfigErrorScreen.tsx (161 lines)  
  - src/components/LoadingScreen.tsx (42 lines)
- NEW FEATURES:
  - src/config/features.ts (21 lines)
  - src/hooks/useDailyPlan.ts (138 lines)
  - src/constants/index.ts (119 lines)
- NEW REPOSITORIES:
  - src/repositories/ChatRepository.ts (275 lines)
  - src/repositories/DailyPlanRepository.ts (189 lines)
  - src/repositories/UserRepository.ts (229 lines)
- NEW UTILITIES:
  - src/utils/validation.ts (310 lines)
  - scripts/validate-config.js (124 lines)
- DOCUMENTATION (4 docs):
  - APIS-CONFIGURADAS.md
  - EXEMPLOS-OTIMIZACAO.md
  - GUIA-BOAS-PRATICAS.md
  - STATUS-FUNCIONANDO.md

Total: 31 files changed, +5102/-22309 lines

---

## PHASE 3: DOCUMENTATION EXTRACTIONS

### Files to Extract by Branch:

**From 2025-11-06-c9dh-53244 (26+ files):**
- netlify.toml
- docs/legal/privacy-policy.md
- docs/legal/terms-of-service.md
- NETLIFY_DEPLOYMENT_SETUP.md
- NETLIFY_QUICK_START.md
- NETLIFY_SETUP_REPORT.md
- DESIGN-REVIEW-CHATSCREEN.md
- DESIGN-REVIEW-CONSOLIDATED.md
- DESIGN-REVIEW-DAILYPLANSCREEN.md
- DESIGN-REVIEW-HOMESCREEN.md
- DESIGN-REVIEW-ONBOARDING.md
- DESIGN-REVIEW-PROFILESCREEN.md
- PLANO_ACAO_IOS_ANDROID.md
- PLANO_ACAO_RAPIDO.md
- PLANO_ACAO_URGENTE.md
- PLANO_MIGRACAO_NATHALIAVALENTE.md
- RELATORIO-ANALISE-MOBILE.md
- RESUMO_ACAO_IMEDIATA.md
- MIGRACAO_ARQUIVOS/README.md
- scripts/get-browser-info.ps1
- scripts/setup-browser-prompt.ps1
- src/components/GradientView.tsx
- src/theme/colors.ts

**From cursor/auditar-reposit-rio-completamente-cc8b:**
- AUDITORIA-REPOSITORIO-2025.md (450 lines)

**From cursor/find-best-agents-and-mcp-for-repo-41a2:**
- RECOMENDACOES-AGENTS-MCP.md (467 lines)
- RESUMO-AGENTS-MCP.md (78 lines)

**From cursor/explain-project-and-add-mcps-fbf5:**
- EXPLICACAO-PROJETO.md (394 lines)
- MCP-CONFIGURACAO-COMPLETA.md (690 lines)

**From claude/deep-repo-analysis-011CUgoLHqmQ8RTJWe3RzrBq:**
- GUIA-CONFIGURACAO-API-KEYS-SEGURO.md (349 lines)
- supabase/functions/claude-chat/index.ts
- supabase/functions/openai-daily-plan/index.ts
- supabase/functions/openai-image-gen/index.ts
- supabase/functions/openai-validate/index.ts

**From cursor/analyze-github-repositories-for-missing-components-9eb4:**
- verificar-status.js
- APP-FUNCIONAL-CONFIGURADO.md
- CHECKLIST-CONFIGURACAO.md
- COMO-DEIXAR-APP-FUNCIONAL.md
- INICIO-RAPIDO.md
- RESUMO-FINAL-CONFIGURACAO.md
- STATUS-APP.md

**From cursor/analyze-github-repositories-for-missing-components-cdf8:**
- INVESTIGACAO-COMPLETA-BRANCHES.md (406 lines)
- ANALISE-COMPLETA-O-QUE-FALTA.md (536 lines)

**From cursor/make-app-functional-5a70:**
- COMPARACAO-SETUPS.md (145 lines)
- CHECKLIST-FUNCIONALIDADE.md (157 lines)

**From 2025-11-04-dwc2-8f2a9:**
- ANALISE-ESTRUTURA-REPOSITORIO.md (959 lines)
- CONSOLIDACAO-SISTEMA-STATUS.md (150 lines)
- infra/supabase/functions/behavior-analysis/ (complete with tests)
- infra/supabase/functions/lgpd-requests/ (complete with tests)
- infra/supabase/functions/moderation-service/ (complete with tests)
- infra/supabase/functions/risk-classifier/ (complete with tests)

---

## PHASE 4: MASS DELETION

### 4.1 Already in Main (15 branches) - SAFE TO DELETE:

2025-10-30-190y-ab44b
copilot/create-auto-approve-merge-workflow
copilot/fix-chat-screen-issue
copilot/fix-logical-errors-in-code
copilot/improve-app-functionality
copilot/improve-slow-code-efficiency
copilot/refactor-duplicated-code
copilot/refactor-duplicated-code-again
copilot/remove-invalid-submodule
copilot/remove-lionnath-archive-submodule
cursor/analyze-github-repositories-for-missing-components-0a63
cursor/analyze-github-repositories-for-missing-components-6fe5
cursor/analyze-github-repositories-for-missing-components-9d2b
cursor/make-app-functional-1412
cursor/make-app-functional-4bda
cursor/update-cursor-position-0c1b

### 4.2 Initial Plan Only (13 branches) - SAFE TO DELETE:

copilot/analyze-robust-branches
copilot/fix-chat-screen-crash
copilot/fix-lgpd-terms
copilot/fix-repository-functionality
copilot/identify-slow-code-issues
copilot/improve-slow-code-efficiency-again
copilot/suggest-descriptive-names
copilot/suggest-variable-function-names
copilot/suggest-variable-function-names-again
copilot/update-project-documentation

### 4.3 Delete After Extraction (12 branches):

copilot/fix-post-merge-validation-issue (or fix-post-merge-validation-failure)
cursor/implement-react-component-with-detailed-guidelines-cbe2
2025-11-06-c9dh-53244
2025-11-04-dwc2-8f2a9
cursor/auditar-reposit-rio-completamente-cc8b
cursor/find-best-agents-and-mcp-for-repo-41a2
cursor/explain-project-and-add-mcps-fbf5
claude/deep-repo-analysis-011CUgoLHqmQ8RTJWe3RzrBq
cursor/analyze-github-repositories-for-missing-components-9eb4
cursor/analyze-github-repositories-for-missing-components-cdf8
cursor/make-app-functional-5a70
cursor/make-app-functional-5e3c

---

## PHASE 5: VERIFICATION

### Build Verification:
- pnpm install
- pnpm build
- pnpm lint
- pnpm test

### Content Verification:
- Verify all 50+ docs extracted
- Verify all Edge Functions present
- Verify StatusScreen and components work
- Verify CI/CD passes

### Final Count:
- Before: 40 branches
- After: 1 branch (origin/main)
- Reduction: 97.5%

---

## EXECUTION ORDER

1. Create safety tag: `git tag pre-ultra-cleanup && git push origin pre-ultra-cleanup`
2. Fix CI/CD: Merge PR #35
3. Add features: Merge PR #26 (resolve conflicts carefully)
4. Extract docs: Cherry-pick from all 10 documentation branches
5. Verify: Build, test, CI/CD
6. Delete: Remove all 40 branches except main
7. Complete: Tag `ultra-cleanup-complete`

---

## ROLLBACK PLAN

If anything fails:
git reset --hard pre-ultra-cleanup
git push origin main --force

Deleted branches are recoverable for 30 days via GitHub UI.

---

## EXPECTED OUTCOMES

Code Assets Extracted:
- 3 screen components
- 3 repositories  
- 8 Supabase Edge Functions
- 2 status verification scripts
- Feature flags system
- Validation utilities

Documentation Assets:
- 50+ markdown files
- ~15,000 lines of documentation
- Complete project explanation
- MCP configuration guides
- API security guides
- Design reviews
- Action plans

Repository State:
- 1 clean main branch
- All PRs resolved
- CI/CD working
- No duplicate content
- Clear project structure
