# 🐛 Como Verificar Erros no Console

## 📋 Passos Rápidos

### 1. Abrir Console do Navegador

**Chrome/Edge:**

- Pressione `F12` ou `Ctrl+Shift+I` (Windows/Linux)
- Pressione `Cmd+Option+I` (Mac)

**Firefox:**

- Pressione `F12` ou `Ctrl+Shift+K` (Windows/Linux)
- Pressione `Cmd+Option+K` (Mac)

### 2. Verificar Abas

- **Console** - Erros e logs
- **Network** - Requisições HTTP
- **Elements** - HTML/CSS
- **Sources** - Código fonte

### 3. Filtrar Erros

No console, use os filtros:

- ❌ **Errors** - Apenas erros
- ⚠️ **Warnings** - Apenas warnings
- ℹ️ **Info** - Apenas info
- 🔍 **All** - Tudo

---

## 🔍 O Que Procurar

### Erros Comuns

1. **TypeError: Cannot read property 'X' of undefined**
   - Objeto não existe ou é undefined
   - Verificar se objeto foi inicializado

2. **ReferenceError: X is not defined**
   - Variável não foi declarada
   - Verificar imports e escopo

3. **Warning: Each child in a list should have a unique key**
   - Lista sem keys únicas
   - Adicionar `key` prop

4. **Network Error: Failed to fetch**
   - Requisição HTTP falhou
   - Verificar URL e CORS

---

## 📊 Verificar Network Tab

1. Abra **Network** tab
2. Recarregue a página (F5)
3. Procure por:
   - ❌ Requisições vermelhas (falhadas)
   - ⚠️ Requisições amarelas (lentas)
   - ❌ Status 404, 500, etc.

---

## ✅ Checklist

- [ ] Console aberto (F12)
- [ ] Filtros aplicados (Errors/Warnings)
- [ ] Network tab verificado
- [ ] Erros anotados
- [ ] Screenshots tirados (se necessário)

---

**💡 Dica:** Use `console.log()` no código para debug.
