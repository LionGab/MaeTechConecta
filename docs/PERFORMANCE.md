# 📊 Performance - Nossa Maternidade

**Última atualização**: 2025-01-XX  
**Versão**: 1.0.0

---

## 🎯 SLOs (Service Level Objectives)

### Mobile App

#### Cold Start

- **Target**: < 2s (p95)
- **Measurement**: Tempo do app launch até primeira tela renderizada
- **Tool**: Sentry Performance Monitoring

#### Screen Load

- **Target**: < 1s (p95)
- **Measurement**: Tempo de navegação entre telas
- **Tool**: React Navigation Performance

#### API Latency

- **Target**: < 500ms (p95)
- **Measurement**: Tempo de resposta de Edge Functions
- **Tool**: Supabase Logs + Sentry

### Edge Functions

#### Function Execution

- **Target**: < 2s (p95)
- **Measurement**: Tempo de execução de função
- **Tool**: Supabase Dashboard + Sentry

#### Rate Limiting

- **Target**: 100% de requisições dentro do rate limit
- **Measurement**: Taxa de requisições 429
- **Tool**: Supabase Logs

---

## 📈 Métricas Atuais (Baseline)

### Mobile App

| Métrica               | Atual | Target  | Status               |
| --------------------- | ----- | ------- | -------------------- |
| Cold Start (p95)      | -     | < 2s    | ⚠️ Baseline pendente |
| Screen Load (p95)     | -     | < 1s    | ⚠️ Baseline pendente |
| Bundle Size (Android) | -     | < 50MB  | ⚠️ Baseline pendente |
| Bundle Size (iOS)     | -     | < 50MB  | ⚠️ Baseline pendente |
| Memory Usage (p95)    | -     | < 200MB | ⚠️ Baseline pendente |

### Edge Functions

| Métrica           | Atual | Target | Status               |
| ----------------- | ----- | ------ | -------------------- |
| nathia-chat (p95) | -     | < 2s   | ⚠️ Baseline pendente |
| Rate Limit Hits   | -     | < 1%   | ⚠️ Baseline pendente |
| Error Rate        | -     | < 0.1% | ⚠️ Baseline pendente |

---

## 🔧 Otimizações Implementadas

### Mobile App

#### 1. Bundle Size

- ✅ Code splitting por rota
- ✅ Tree shaking habilitado
- ✅ Imagens otimizadas (WebP)
- ✅ Fontes otimizadas (subset)

#### 2. Performance

- ✅ React.memo em componentes pesados
- ✅ useMemo/useCallback para computações pesadas
- ✅ Lazy loading de screens
- ✅ FlatList otimizada (windowSize, maxToRenderPerBatch)

#### 3. Network

- ✅ Request caching (React Query)
- ✅ Offline-first com AsyncStorage
- ✅ Compressão de payloads

### Edge Functions

#### 1. Execution Time

- ✅ Rate limiting event-based (não bloqueia)
- ✅ Cache de respostas (quando aplicável)
- ✅ Timeout configurado (30s)

#### 2. Observabilidade

- ✅ Sentry integration
- ✅ Logs estruturados
- ✅ Métricas customizadas

---

## 📊 Monitoramento

### Sentry Performance

#### Setup

```typescript
// apps/mobile/sentry.config.js
Sentry.init({
  tracesSampleRate: 1.0, // 100% em dev, 0.1 em prod
  enableNativeFramesTracking: true,
});
```

#### Dashboards

- **Cold Start**: `transaction:app.start`
- **Screen Load**: `transaction:navigation.*`
- **API Calls**: `transaction:http.*`

### Supabase Logs

#### Edge Functions

```sql
-- Query para métricas de função
SELECT
  function_name,
  AVG(execution_time_ms) as avg_time,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY execution_time_ms) as p95_time,
  COUNT(*) as total_calls
FROM edge_function_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY function_name;
```

---

## 🚀 Como Medir

### Local (Development)

#### Mobile App

```bash
# Android
adb shell am start -W -n com.nossamaternidade.app/.MainActivity

# iOS
xcrun simctl launch --console-pty <device-id> com.nossamaternidade.app
```

#### Edge Functions

```bash
# Via Supabase CLI
supabase functions serve nathia-chat --debug
```

### Production

#### Sentry Dashboard

1. Acessar `https://sentry.io/organizations/<org>/performance/`
2. Filtrar por `transaction:app.*`
3. Visualizar p95, p99, média

#### Supabase Dashboard

1. Acessar `https://supabase.com/dashboard/project/<ref>/logs`
2. Filtrar por Edge Function
3. Analisar execution time e error rate

---

## 🎯 Próximos Passos

### Fase 1: Baseline (Semana 1-2)

- [ ] Configurar Sentry Performance no mobile
- [ ] Coletar métricas por 1 semana
- [ ] Documentar baseline atual
- [ ] Identificar gargalos

### Fase 2: Otimização (Semana 3-4)

- [ ] Aplicar otimizações baseadas em baseline
- [ ] Validar melhorias
- [ ] Atualizar SLOs se necessário

### Fase 3: Monitoramento Contínuo (Ongoing)

- [ ] Alertas no Sentry (SLO breach)
- [ ] Dashboards automatizados
- [ ] Review semanal de performance

---

## 📚 Referências

- [Sentry Performance](https://docs.sentry.io/product/performance/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Supabase Edge Functions Performance](https://supabase.com/docs/guides/functions/observability)
- [EAS Build Optimization](https://docs.expo.dev/build/optimize-builds/)

---

**Última atualização**: 2025-01-XX  
**Mantido por**: Time Nossa Maternidade
