# Tailwind CSS v4 - Regras Completas

🎯 **Arquivo de Regras Completo:** `.cursor/rules/TAILWINDCSS_V4_RULES.md`

## Acesso Rápido

Para consultar as regras completas do Tailwind CSS v4:

```bash
# Ler o arquivo de regras completo
cat .cursor/rules/TAILWINDCSS_V4_RULES.md
```

## Mudanças Críticas (Resumo)

1. **Configuração:** `tailwind.config.js` → `@theme` no CSS
2. **Espaçamento:** `space-*` → `gap-*`
3. **Opacidade:** `*-opacity-*` → `{utility}/{opacity}`
4. **Sombras:** `shadow` → `shadow-xs`
5. **Bordas:** Cor padrão agora é `currentColor` (não cinza)
6. **Plugins:** `@plugin` no CSS (não JS)
7. **Cores:** OKLCH recomendado
8. **Conteúdo:** Detecção automática (sem `content: []`)

## Migração Automática

```bash
npx @tailwindcss/upgrade@next
```

## ⚠️ Nota

**Este projeto usa React Native, NÃO Tailwind CSS.**

Este arquivo serve apenas como referência para projetos web futuros.
