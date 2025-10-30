# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o **Nossa Maternidade**! 💕

## 📋 Como Contribuir

### 1. Fork o Projeto

1. Faça fork do repositório
2. Clone seu fork: `git clone https://github.com/seu-usuario/nossa-maternidade.git`
3. Entre na pasta: `cd nossa-maternidade`

### 2. Configurar o Ambiente

```bash
# Instalar dependências
npm install

# Iniciar o app
npx expo start
```

### 3. Criar uma Branch

```bash
git checkout -b feature/minha-feature
# ou
git checkout -b bugfix/corrige-bug
```

### 4. Fazer Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: adiciona nova funcionalidade"
git commit -m "fix: corrige bug no chat"
git commit -m "docs: atualiza README"
git commit -m "style: ajusta formatação"
git commit -m "refactor: reorganiza código"
git commit -m "test: adiciona testes"
```

### 5. Push e Pull Request

```bash
git push origin feature/minha-feature
```

Depois, abra um Pull Request no GitHub.

## 🎯 Tipos de Contribuição

### 🐛 Reportar Bugs

Use o template de [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md).

### ✨ Sugerir Features

Use o template de [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md).

### 📝 Melhorar Documentação

- Corrigir erros
- Adicionar exemplos
- Traduzir documentação
- Melhorar explicações

### 💻 Desenvolver

1. Escolha uma issue ou sugira algo novo
2. Crie uma branch
3. Implemente a solução
4. Adicione testes (se aplicável)
5. Abra um PR

## 📏 Padrões de Código

### TypeScript

```typescript
// ✅ Bom
interface UserProfile {
  name: string;
  type: 'gestante' | 'mae' | 'tentante';
}

// ❌ Ruim
const profile: any = {};
```

### Componentes React

```tsx
// ✅ Bom
interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 80 }) => {
  return <View>{/* ... */}</View>;
};

// ❌ Ruim
export const Logo = (props) => {
  return <View>{/* ... */}</View>;
};
```

### Nomeação

- **Componentes**: PascalCase (`UserProfile`)
- **Funções**: camelCase (`getUserData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_CONFIG`)
- **Arquivos**: PascalCase para componentes, camelCase para utils

### Formatação

Usamos Prettier e ESLint. Execute:

```bash
npm run lint
npm run format
```

## 🧪 Testes

Quando possível, adicione testes:

```typescript
// Exemplo
describe('chatWithAI', () => {
  it('should return a valid response', async () => {
    const response = await chatWithAI('test', {});
    expect(response).toBeTruthy();
  });
});
```

## 📝 Commits

### Estrutura

```
tipo(escopo): descrição breve

Descrição detalhada (opcional)

Closes #123
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

### Exemplos

```bash
feat(chat): adiciona detecção de urgência
fix(chat): corrige histórico incompleto
docs(readme): atualiza instruções de instalação
style(ui): ajusta cores do tema
refactor(ai): reorganiza funções de IA
```

## 🔍 Code Review

Seu PR será revisado:

- ✅ Código segue padrões do projeto
- ✅ Não há erros de lint/TypeScript
- ✅ Funcionalidade foi testada
- ✅ Documentação foi atualizada
- ✅ Não quebra funcionalidades existentes

## 💡 Dicas

### Antes de Começar

- Procure por issues existentes
- Comente na issue para dizer que vai trabalhar nela
- Peça esclarecimentos se necessário

### Durante o Desenvolvimento

- Faça commits pequenos e frequentes
- Escreva mensagens de commit claras
- Teste suas mudanças localmente
- Atualize documentação se necessário

### Após o PR

- Responda feedbacks
- Faça ajustes solicitados
- Seja paciente com a revisão

## ❓ Dúvidas?

- Abra uma [Discussion](https://github.com/seu-usuario/nossa-maternidade/discussions)
- Entre em contato: contato@nossa-maternidade.com

## 🙏 Obrigado!

Sua contribuição faz a diferença! 💕
