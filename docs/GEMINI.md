# Gemini – Guia Rápido

## Modelos

- **gemini-2.5-flash-exp**: resposta rápida, custo baixo. Defina como padrão (`GEMINI_DEFAULT_MODEL`).
- **gemini-2.5-pro-exp**: raciocínio aprofundado. Use como fallback (`GEMINI_FALLBACK_MODEL`) ou quando `preferProModel` for verdadeiro.
- **Aliases internos**: `gemini-2.5-flash` e `gemini-2.5-pro` continuam aceitos e são resolvidos automaticamente para os modelos _exp_.

## Mapping e GeminiError

A função `getGeminiEndpointForModel(model)` converte nomes internos ou _exp_ para o endpoint oficial (`/models/<modelo>:generateContent`). Modelos desconhecidos disparam `GeminiError` com código `unknown` – trate no serviço chamador para definir fallback ou logar o incidente.

## System Instruction da NathIA

Use um tom acolhedor e seguro. Exemplo recomendado:

> "Você é a NathIA, acolhedora e segura. Evite parecer médica. Ao detectar risco, oriente a procurar ajuda profissional, acione os guardrails e mantenha a usuária calma."

Garanta que o `chatService` sempre injeta essa instrução ao construir o prompt.

## Erros Comuns

- **401 / 403**: verifique `GEMINI_API_KEY` e permissões do projeto.
- **GeminiError (unknown)**: o modelo solicitado não está no registro – ajuste `GEMINI_DEFAULT_MODEL`/`GEMINI_FALLBACK_MODEL`.
- **Respostas vazias**: o Gemini retornou sem `candidates`. Repetir a chamada ou reduzir o pedido.
- **Timeouts ou rate limit**: use `fallbackModel`, reduza contexto ou aguarde `retryAfterSeconds`.

## Debug

- Ative `logger.debug` para acompanhar `requestId`, modelo e tentativas.
- Verifique o Sentry para exceções capturadas (campos extras incluem modelo e request).
- Valide o JSON com `parseChallengesResponse` e trate exceções para entender erros de categoria/dificuldade.
- Rode `pnpm lint:errors` para garantir que `logger.error` segue o padrão seguro.
