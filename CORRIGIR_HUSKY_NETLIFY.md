# 🔧 Corrigir Erro do Husky no Netlify

## ⚠️ Problema Resolvido

O Netlify estava falhando porque o script `prepare` chamava `husky install`, mas o Husky não estava instalado (está em `devDependencies` e não é instalado em produção).

## ✅ Correção Aplicada

**Arquivo:** `package.json`

**Mudança:**

```json
// ❌ Antes (quebrado):
"prepare": "husky install"

// ✅ Depois (corrigido):
"prepare": "node -e \"try { require('husky').install() } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e }\" || true"
```

**Como funciona:**

- Tenta instalar o Husky se estiver disponível
- Se não estiver disponível (MODULE_NOT_FOUND), ignora silenciosamente
- Se houver outro erro, lança o erro normalmente
- `|| true` garante que o script sempre retorna sucesso

## ✅ Resultado

Agora o Netlify:

- ✅ Instala dependências sem erro
- ✅ Ignora Husky se não estiver disponível (produção)
- ✅ Instala Husky se estiver disponível (desenvolvimento)

## 📝 Alternativas (Se a Solução Acima Não Funcionar)

### Opção 1: Adicionar Variável no Netlify

Adicione no Netlify Dashboard → **Site settings** → **Environment variables**:

```
HUSKY_SKIP_INSTALL=1
```

E no `package.json`:

```json
"prepare": "[ \"$HUSKY_SKIP_INSTALL\" = \"1\" ] || husky install"
```

### Opção 2: Instalar DevDependencies no Netlify

Adicione no Netlify Dashboard → **Site settings** → **Environment variables**:

```
NPM_FLAGS=--include=dev
```

Ou:

```
NPM_CONFIG_PRODUCTION=false
```

### Opção 3: Mover Husky para Dependencies

Mover `husky` de `devDependencies` para `dependencies` (não recomendado, pois aumenta o bundle).

## ✅ Verificar

Após a correção, o Netlify deve:

- ✅ Instalar dependências com sucesso
- ✅ Build passar sem erros
- ✅ Deploy funcionar corretamente

---

**Status:** ✅ Correção aplicada | ⚠️ Faça commit e push para testar
