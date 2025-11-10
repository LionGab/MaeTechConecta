# Sistema de Hábitos e Gamificação

Documentação completa do sistema de hábitos, streaks e gamificação.

## Visão Geral

O sistema de gamificação incentiva usuárias a manter hábitos saudáveis através de:

- ✅ **Hábitos Diários**: Tracking de atividades recorrentes
- 🔥 **Streaks**: Sequências de dias consecutivos
- ⭐ **Pontos (XP)**: Sistema de recompensas
- 🎯 **Níveis**: Progressão baseada em pontos
- 🏆 **Badges**: Conquistas especiais

## Arquitetura

### Tabelas do Banco

#### `habit_templates`

Templates padrão de hábitos (ex: Hidratação, Meditação).

```sql
- id: UUID
- name: TEXT
- description: TEXT
- category: TEXT (autocuidado, saude-fisica, saude-mental, organizacao, relacionamento, aprendizado)
- frequency: TEXT (daily, weekly, custom)
- points_value: INTEGER
- icon: TEXT
- color: TEXT
- is_default: BOOLEAN
- recommended_for: TEXT[] (gestante, mae, tentante)
```

#### `habits`

Instâncias de hábitos ativos do usuário.

```sql
- id: UUID
- user_id: UUID
- template_id: UUID (nullable)
- name: TEXT
- description: TEXT
- category: TEXT
- frequency: TEXT
- frequency_config: JSONB
- points_value: INTEGER
- icon: TEXT
- color: TEXT
- is_active: BOOLEAN
- archived_at: TIMESTAMPTZ
```

#### `habit_logs`

Registro diário de conclusão de hábitos.

```sql
- id: UUID
- habit_id: UUID
- user_id: UUID
- date: DATE
- done: BOOLEAN
- skipped: BOOLEAN
- notes: TEXT
- points_earned: INTEGER
- completed_at: TIMESTAMPTZ
UNIQUE(habit_id, date) -- Um log por hábito por dia
```

#### `streaks`

Sequências de dias consecutivos.

```sql
- id: UUID
- user_id: UUID
- habit_id: UUID (nullable para streak geral)
- current_streak: INTEGER
- longest_streak: INTEGER
- last_completed_date: DATE
UNIQUE(user_id, habit_id)
```

#### `user_gamification`

Sistema de pontos, níveis e conquistas.

```sql
- user_id: UUID (PK)
- total_points: INTEGER
- level: INTEGER
- current_streak: INTEGER
- longest_streak: INTEGER
- last_activity_date: DATE
- badges: JSONB
- achievements: JSONB
- total_habits_completed: INTEGER
- perfect_weeks: INTEGER
```

## Fluxo de Funcionamento

### 1. Criar Hábito

```typescript
// Usuário escolhe template ou cria customizado
const habit = await supabase.from('habits').insert({
  user_id: userId,
  template_id: templateId, // Opcional
  name: 'Hidratação',
  category: 'saude-fisica',
  frequency: 'daily',
  points_value: 10,
  icon: '💧',
  color: '#87CEEB',
  is_active: true,
});
```

### 2. Marcar Hábito como Concluído

```typescript
// Usuário marca hábito como done
const log = await supabase.from('habit_logs').insert({
  habit_id: habitId,
  user_id: userId,
  date: '2025-01-08',
  done: true,
  points_earned: 10,
  completed_at: new Date().toISOString(),
});

// Trigger automático:
// - Atualiza streak (trg_update_habit_streak)
// - Adiciona pontos em user_gamification
// - Atualiza nível (level = floor(points / 100) + 1)
```

### 3. Cálculo de Streak

```sql
-- Função: update_habit_streak()
-- Executada automaticamente via trigger ao inserir/atualizar habit_log

IF done = TRUE THEN
  IF last_completed_date = ontem THEN
    current_streak = current_streak + 1
    longest_streak = MAX(longest_streak, current_streak)
  ELSE
    current_streak = 1 -- Reinicia
  END IF
END IF
```

### 4. Sistema de Pontos e Níveis

```typescript
// Pontos
total_points = SUM(points_earned de todos habit_logs)

// Nível
level = floor(total_points / 100) + 1

// Exemplos:
// 0-99 pontos = Nível 1
// 100-199 pontos = Nível 2
// 200-299 pontos = Nível 3
```

### 5. Badges e Achievements

```json
// Exemplos de badges (armazenados em JSONB)
{
  "badges": [
    {
      "id": "first_habit",
      "name": "Primeira Vez",
      "description": "Completou seu primeiro hábito",
      "earned_at": "2025-01-08T10:00:00Z",
      "icon": "🎉"
    },
    {
      "id": "week_warrior",
      "name": "Guerreira da Semana",
      "description": "7 dias de streak consecutivo",
      "earned_at": "2025-01-15T10:00:00Z",
      "icon": "🔥"
    },
    {
      "id": "hydration_master",
      "name": "Mestre da Hidratação",
      "description": "30 dias consecutivos de hidratação",
      "earned_at": "2025-02-07T10:00:00Z",
      "icon": "💧"
    }
  ]
}
```

## Cron Jobs

### Verificar Streaks Quebrados

```sql
-- Executar diariamente (00:00)
SELECT check_broken_streaks();

-- Zera current_streak para hábitos que não foram completados ontem
```

## API / Edge Functions

### `GET /habits`

Lista hábitos ativos do usuário.

```typescript
const { data: habits } = await supabase
  .from('habits')
  .select('*')
  .eq('user_id', userId)
  .eq('is_active', true)
  .order('created_at', { ascending: false });
```

### `POST /habits/{habitId}/complete`

Marca hábito como concluído hoje.

```typescript
const { data } = await supabase.from('habit_logs').upsert(
  {
    habit_id: habitId,
    user_id: userId,
    date: new Date().toISOString().split('T')[0],
    done: true,
    points_earned: 10,
    completed_at: new Date().toISOString(),
  },
  { onConflict: 'habit_id,date' }
);
```

### `GET /gamification`

Retorna stats de gamificação.

```typescript
const { data } = await supabase
  .from('user_gamification')
  .select('*')
  .eq('user_id', userId)
  .single();

// Response:
{
  total_points: 350,
  level: 4,
  current_streak: 7,
  longest_streak: 14,
  badges: [...],
  achievements: [...]
}
```

## UI Components

### HabitCard

Exibe hábito individual com switch para marcar como concluído.

### StreakBadge

Mostra ícone de fogo (🔥) + dias de streak.

### ProgressBar

Barra de progresso visual para hábitos do dia.

### LevelIndicator

Exibe nível atual e progresso para próximo nível.

## Regras de Negócio

### Streaks

- ✅ Consecutivo = completar ontem e hoje
- ❌ Quebra = não completar ontem
- 🔄 Reinicia = volta para 1 ao completar após quebra

### Pontos

- ✅ Ganhos ao completar hábito (done = true)
- ❌ Não perde pontos ao quebrar streak
- 📊 Acumulativo (nunca diminui)

### Níveis

- 📈 Baseado em pontos totais
- 🎯 100 pontos = 1 nível
- 🚀 Infinito (sem limite)

### Hábitos

- 📅 **daily**: Aparece todos os dias
- 📆 **weekly**: Configurável (ex: segunda, quarta, sexta)
- 🗓️ **custom**: Datas específicas via JSON

## Testes

### Unitários (Vitest)

```typescript
// __tests__/habits/streakCalculation.test.ts
describe('Streak Calculation', () => {
  it('should increment streak when consecutive', () => {
    const result = calculateStreak(yesterdayDate, todayDate);
    expect(result.current_streak).toBe(2);
  });

  it('should reset streak when not consecutive', () => {
    const result = calculateStreak(twoDaysAgoDate, todayDate);
    expect(result.current_streak).toBe(1);
  });
});
```

### E2E (Maestro)

```yaml
# e2e/maestro/habits-flow.yaml
- launchApp
- tapOn: 'Hábitos'
- assertVisible: 'Meus Hábitos'
- tapOn: 'Hidratação'
- assertVisible: '10 pontos'
- tapOn: 'Marcar como concluído'
- assertVisible: '🔥 1 dia'
```

## Performance

### Otimizações

- ✅ Índices em `user_id`, `habit_id`, `date`
- ✅ Unique constraint previne duplicações
- ✅ Triggers executam lógica no banco (rápido)
- ✅ JSONB para badges (flexível + performático)

### Limites

- Max 50 hábitos ativos por usuário
- Logs mantidos por 1 ano (cleanup automático)

## Referências

- **Migration**: `supabase/migrations/20250108_habits_system.sql`
- **Hooks**: `src/hooks/useHabits.ts`
- **Components**: `src/components/habits/`
- **Screen**: `src/app/(tabs)/habitos.tsx`
