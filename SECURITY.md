# Política de Segurança

## Versões Suportadas

Use esta seção para informar as pessoas sobre quais versões do seu projeto estão atualmente sendo suportadas com atualizações de segurança.

| Versão | Suportada          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Como Reportar uma Vulnerabilidade

### 🔒 Processo de Reporte

Se você descobrir uma vulnerabilidade de segurança, siga estes passos:

1. **NÃO** abra uma issue pública
2. Envie um email para: **security@nossa-maternidade.com**
3. Inclua:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Possível impacto
   - Sugestões de correção (se tiver)

### 📋 O que Esperar

- **Resposta**: Dentro de 48 horas
- **Confirmação**: Dentro de 7 dias
- **Correção**: Dependendo da gravidade

### 🎯 Tipos de Vulnerabilidades Aceitas

Aceitamos reportes de:
- Autenticação e autorização
- Exposição de dados sensíveis
- Injeção de código
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- APIs inseguras

## Medidas de Segurança Implementadas

### 🔐 Autenticação
- Supabase Auth com tokens JWT
- Row Level Security (RLS) habilitado
- Proteção contra brute force

### 🔒 Dados
- Criptografia em trânsito (HTTPS)
- Chaves de API em variáveis de ambiente
- Sanitização de inputs

### 📝 Logs
- Auditoria de ações sensíveis
- Não armazenamos senhas em texto plano
- LGPD compliant

## Boas Práticas de Segurança

### Para Desenvolvedores

```typescript
// ✅ Bom: Validação de input
const sanitizeInput = (input: string) => {
  return input.trim().replace(/[<>]/g, '');
};

// ❌ Ruim: Input direto
const processInput = (input: string) => {
  return processDirectly(input); // Perigoso!
};
```

### Para Usuários

- Nunca compartilhe suas credenciais
- Use senhas fortes
- Mantenha o app atualizado
- Reporte atividades suspeitas

## Reconhecimento de Segurança

Mantemos uma lista de [Reconhecimentos de Segurança](SECURITY.md#acknowledgments) para quem reportar vulnerabilidades de forma responsável.

---

**Última atualização**: Janeiro 2024
