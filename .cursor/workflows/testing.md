# Workflow: Testing

Workflow otimizado para criação e execução de testes usando Cursor 2.0.

## Fase 1: Planejamento de Testes

### Passo 1: Identificar O Que Testar

- Componentes críticos
- Lógica de negócio
- Utils e helpers
- Hooks customizados
- Serviços e integrações

### Passo 2: Definir Estratégia

- Testes unitários para lógica
- Testes de componente para UI
- Testes de integração para fluxos
- Testes E2E para cenários completos

### Passo 3: Estabelecer Coverage

- Coverage mínimo: 70%
- Componentes críticos: 100%
- Utils: 90%+
- Hooks: 80%+

## Fase 2: Criação de Testes

### Testes Unitários (Jest/Vitest)

#### Utils e Helpers

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from './utils';

describe('functionToTest', () => {
  it('should handle normal case', () => {
    const result = functionToTest(input);
    expect(result).toBe(expected);
  });

  it('should handle edge case', () => {
    const result = functionToTest(edgeInput);
    expect(result).toBe(expected);
  });

  it('should throw error on invalid input', () => {
    expect(() => functionToTest(invalidInput)).toThrow();
  });
});
```

#### Hooks Customizados

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(initialValue);
  });

  it('should update value on action', () => {
    const { result } = renderHook(() => useCustomHook());
    act(() => {
      result.current.updateValue(newValue);
    });
    expect(result.current.value).toBe(newValue);
  });
});
```

### Testes de Componente (React Native Testing Library)

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    const { getByText } = render(<ComponentName prop1="value" />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <ComponentName prop1="value" onPress={onPress} />
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', () => {
    const { getByLabelText } = render(<ComponentName prop1="value" />);
    expect(getByLabelText('Accessible Label')).toBeTruthy();
  });
});
```

### Testes de Integração

```typescript
import { render, waitFor } from '@testing-library/react-native';
import { ScreenWithIntegration } from './ScreenWithIntegration';

describe('ScreenWithIntegration', () => {
  it('should load and display data', async () => {
    const { getByText } = render(<ScreenWithIntegration />);
    await waitFor(() => {
      expect(getByText('Loaded Data')).toBeTruthy();
    });
  });

  it('should handle errors gracefully', async () => {
    // Mock error
    const { getByText } = render(<ScreenWithIntegration />);
    await waitFor(() => {
      expect(getByText('Error message')).toBeTruthy();
    });
  });
});
```

### Testes E2E (Maestro/Playwright)

```yaml
# maestro/smoke-flow.yaml
appId: com.nossamaternidade.app
---
- launchApp
- tapOn: 'Login'
- inputText: 'test@example.com'
- tapOn: 'Senha'
- inputText: 'password123'
- tapOn: 'Entrar'
- assertVisible: 'Home'
```

## Fase 3: Execução de Testes

### Executar Todos os Testes

```bash
npm run test
```

### Executar com Coverage

```bash
npm run test:coverage
```

### Executar em Modo Watch

```bash
npm run test:watch
```

### Executar Testes E2E

```bash
npm run e2e:android
```

## Fase 4: Validação

### Checklist de Testes

- [ ] Todos os testes passando
- [ ] Coverage >= 70%
- [ ] Componentes críticos com 100% coverage
- [ ] Testes E2E para fluxos principais
- [ ] Testes de acessibilidade
- [ ] Testes de performance (quando aplicável)
- [ ] Edge cases cobertos
- [ ] Erros tratados e testados

### Validação Automática

```
@validar-projeto
```

## Comandos Úteis

```bash
# Executar testes
npm run test

# Executar com coverage
npm run test:coverage

# Executar em modo watch
npm run test:watch

# Executar testes E2E
npm run e2e:android

# Executar testes específicos
npm run test -- ComponentName

# Executar testes com verbose
npm run test -- --verbose
```

## Boas Práticas

### 1. Testes Isolados

- Cada teste deve ser independente
- Não depender de ordem de execução
- Limpar estado entre testes

### 2. Testes Descritivos

- Nomes claros e descritivos
- Descrever comportamento esperado
- Organizar com describe/it

### 3. AAA Pattern

- Arrange: Preparar dados
- Act: Executar ação
- Assert: Verificar resultado

### 4. Mocks e Stubs

- Mockar dependências externas
- Mockar APIs e serviços
- Mockar navegação quando necessário

### 5. Coverage Inteligente

- Não focar apenas em números
- Testar comportamentos importantes
- Testar edge cases
- Testar erros

### 6. Testes de Acessibilidade

- Verificar accessibilityLabel
- Verificar accessibilityRole
- Testar com screen readers
- Verificar contraste

## Estrutura de Testes

```
__tests__/
  components/
    ComponentName.test.tsx
  hooks/
    useCustomHook.test.ts
  utils/
    utilityFunction.test.ts
  integration/
    flow.test.tsx
  e2e/
    smoke.spec.js
```

## Tempo Estimado

- Planejamento: 5-10 min
- Criação de testes: 20-40 min
- Execução e validação: 5-10 min
- **Total: 30-60 min**

## Dicas

1. Escreva testes enquanto desenvolve
2. Use TDD quando apropriado
3. Foque em comportamentos, não implementação
4. Mantenha testes simples e legíveis
5. Atualize testes quando código mudar
6. Use Multi-Agente para criar múltiplos testes em paralelo

## Checklist Final

- [ ] Testes criados para componentes críticos
- [ ] Testes unitários para utils
- [ ] Testes de integração para fluxos
- [ ] Testes E2E para cenários principais
- [ ] Coverage >= 70%
- [ ] Todos os testes passando
- [ ] Testes de acessibilidade incluídos
- [ ] Edge cases cobertos
- [ ] Erros testados
