# 🐛 Correções de Bugs

## Bug 1: Concatenação de Timestamp (RESOLVIDO ✅)

### ❌ Problema

Na linha 54 de `ChatScreen.tsx`, o código tentava somar 1000 milissegundos a uma string:

```typescript
// ❌ ERRADO - String concatenation
createdAt: new Date(msg.created_at + 1000)
```

Como `msg.created_at` é uma string ISO 8601 (ex: `"2024-01-15T10:30:00Z"`), o operador `+` fazia concatenação de strings em vez de adição aritmética:

- Input: `"2024-01-15T10:30:00Z" + 1000`
- Resultado: `"2024-01-15T10:30:00Z1000"` (string inválida!)
- Consequência: `new Date()` retornava `Invalid Date`

### ✅ Solução

Convertemos a string para milissegundos antes de adicionar:

```typescript
// ✅ CORRETO - Aritmética de números
const baseTimestamp = new Date(msg.created_at).getTime();
return [
  { ...userMsg, createdAt: new Date(baseTimestamp) },
  { ...assistantMsg, createdAt: new Date(baseTimestamp + 1000) }
];
```

### 📊 Explicação Técnica

```typescript
// Processo correto:
const isoString = "2024-01-15T10:30:00.000Z";
const dateObj = new Date(isoString);        // → Date object
const milliseconds = dateObj.getTime();     // → 1705315800000 (número)
const adjustedMs = milliseconds + 1000;     // → 1705315801000 (adição!)
const newDate = new Date(adjustedMs);       // → Date válido
```

### 🎯 Impacto

**Antes**: Mensagens da assistente tinham `Invalid Date`  
**Depois**: Ambas as mensagens têm timestamps válidos com 1 segundo de diferença

### 📍 Arquivo
- `src/screens/ChatScreen.tsx` (linhas 52-56)

---

## Bug 2: Histórico Incompleto (RESOLVIDO ✅)

### ❌ Problema

O histórico do chat só exibia mensagens do usuário, ignorando respostas da IA.

### ✅ Solução

Implementado `flatMap` para gerar 2 mensagens por registro (user + assistant).

**Ver documentação completa**: `CHAT_HISTORY_FIX.md`

---

## 📝 Convenções de Correção

### Nomenclatura
- `baseTimestamp`: Timestamp base em milissegundos
- `adjustedMs`: Timestamp ajustado após adição/subtração

### Boas Práticas
```typescript
// ✅ SEMPRE converta strings para números antes de operações aritméticas
const timestamp = new Date(stringDate).getTime() + offset;

// ❌ NUNCA faça operações diretas em strings de data
const wrong = new Date(stringDate + offset);
```

---

**Última atualização**: Janeiro 2024  
**Status**: Todos os bugs conhecidos resolvidos ✅

