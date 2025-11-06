# 🌐 Teste do Onboarding na Web

## ✅ Configuração

O onboarding está configurado para funcionar na web também!

### Como Testar na Web

1. **Iniciar servidor web**:

```bash
cd apps/mobile
pnpm dev:web
```

2. **Abrir no navegador**:
   - O Expo abrirá automaticamente em `http://localhost:8081` ou similar
   - Ou acesse a URL mostrada no terminal

3. **Limpar localStorage** (se já testou antes):

```javascript
// No console do navegador (F12):
localStorage.removeItem('onboarded');
// Recarregar a página (F5)
```

4. **Testar onboarding**:
   - O onboarding deve aparecer automaticamente
   - Navegar pelos 5 slides
   - Completar onboarding
   - Verificar navegação para Home

### ✅ Funcionalidades na Web

- ✅ AsyncStorage funciona na web (usa localStorage automaticamente)
- ✅ Navegação funciona na web
- ✅ Animações funcionam na web
- ✅ Design claymorphism funciona na web
- ✅ Todos os componentes são compatíveis com web

### 🔧 Diferenças Web vs Mobile

- **Storage**: AsyncStorage usa localStorage na web automaticamente
- **Navegação**: React Navigation funciona igual na web
- **Animações**: Animated API funciona na web
- **Design**: Claymorphism funciona na web (box-shadow)

### 🐛 Troubleshooting

**Onboarding não aparece na web**:

1. Limpar localStorage: `localStorage.removeItem('onboarded')`
2. Recarregar página (F5)
3. Verificar console do navegador para erros

**AsyncStorage não funciona**:

- AsyncStorage funciona automaticamente na web
- Usa localStorage por baixo dos panos
- Não precisa de configuração adicional

**Animações lentas na web**:

- Normal em alguns navegadores
- Pode ajustar `useNativeDriver` se necessário

### 📝 Checklist de Teste Web

- [ ] Servidor web iniciado (`pnpm dev:web`)
- [ ] Página carrega no navegador
- [ ] Onboarding aparece automaticamente
- [ ] Navegação entre slides funciona
- [ ] Botões Voltar/Próximo/Pular funcionam
- [ ] Pagination dots atualizam
- [ ] Completar onboarding navega para Home
- [ ] Reiniciar página não mostra onboarding novamente
