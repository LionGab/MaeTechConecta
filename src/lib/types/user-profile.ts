/**
 * User Profile Types
 * Defines the structure for user pregnancy tracking and personalization
 */

export interface PregnancyData {
  /** Expected due date */
  dueDate: Date | string;
  /** Current gestational week (1-42) */
  currentWeek: number;
  /** Current trimester (1, 2, or 3) */
  currentTrimester: 1 | 2 | 3;
  /** Whether this is the user's first pregnancy */
  isFirstPregnancy: boolean;
  /** Baby's expected gender if known */
  babyGender?: 'boy' | 'girl' | 'unknown';
  /** Date when pregnancy data was last updated */
  lastUpdated: Date | string;
}

export interface SymptomEntry {
  id: string;
  date: Date | string;
  symptoms: {
    nausea?: 1 | 2 | 3 | 4 | 5; // 1 = mild, 5 = severe
    fatigue?: 1 | 2 | 3 | 4 | 5;
    backPain?: 1 | 2 | 3 | 4 | 5;
    headache?: 1 | 2 | 3 | 4 | 5;
    moodSwings?: 1 | 2 | 3 | 4 | 5;
    swelling?: 1 | 2 | 3 | 4 | 5;
    other?: string;
  };
  notes?: string;
}

export interface DailyRoutineTask {
  id: string;
  title: string;
  description: string;
  time?: string; // e.g., "08:00"
  icon: string; // emoji or icon name
  completed: boolean;
  points: number;
  trimester: (1 | 2 | 3)[];
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  pregnancyData?: PregnancyData;
  preferences: {
    showCommercialContent: boolean;
    enableNotifications: boolean;
    darkMode: boolean;
  };
  gamification: {
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
    badges: string[];
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Calculate current trimester based on week
 */
export function getTrimester(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

/**
 * Calculate weeks pregnant from due date
 */
export function getWeeksFromDueDate(dueDate: Date): number {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeksRemaining = Math.ceil(diffDays / 7);
  const currentWeek = 40 - weeksRemaining;
  return Math.max(1, Math.min(42, currentWeek));
}

/**
 * Get pregnancy-related content personalized by trimester
 */
export function getContentByTrimester(trimester: 1 | 2 | 3) {
  const content = {
    1: {
      title: 'Primeiro Trimestre',
      weekRange: '1-13 semanas',
      focus: ['Náuseas', 'Fadiga', 'Vitaminas', 'Primeiras consultas'],
      tips: [
        'Tome ácido fólico diariamente',
        'Beba pelo menos 2L de água',
        'Descanse quando sentir cansaço',
        'Registre seus sintomas',
      ],
    },
    2: {
      title: 'Segundo Trimestre',
      weekRange: '14-27 semanas',
      focus: ['Energia renovada', 'Movimento do bebê', 'Alimentação', 'Exercícios'],
      tips: [
        'Pratique exercícios leves',
        'Alongue-se diariamente',
        'Converse com seu bebê',
        'Planeje o enxoval',
      ],
    },
    3: {
      title: 'Terceiro Trimestre',
      weekRange: '28-40+ semanas',
      focus: ['Preparação para o parto', 'Desconfortos', 'Bolsa maternidade', 'Respiração'],
      tips: [
        'Pratique exercícios respiratórios',
        'Prepare a bolsa da maternidade',
        'Massagem perineal',
        'Converse sobre o plano de parto',
      ],
    },
  };
  return content[trimester];
}

/**
 * Get suggested chatbot questions by trimester
 */
export function getChatbotQuestionsByTrimester(trimester: 1 | 2 | 3) {
  const questions = {
    1: [
      'Estou com muito enjoo, o que fazer?',
      'É normal sentir cansaço extremo?',
      'Quando devo contar para a família?',
      'Quais vitaminas devo tomar?',
    ],
    2: [
      'Exercícios seguros no segundo trimestre',
      'Como evitar diabetes gestacional?',
      'É normal sentir o bebê se mexer?',
      'Alimentação saudável na gravidez',
    ],
    3: [
      'Quais são os sinais de trabalho de parto?',
      'Como fazer um plano de parto?',
      'Como lidar com ansiedade pré-parto?',
      'Quando ir para o hospital?',
    ],
  };
  return questions[trimester];
}

/**
 * Get daily routine tasks by trimester
 */
export function getRoutineTasksByTrimester(trimester: 1 | 2 | 3): Omit<DailyRoutineTask, 'completed'>[] {
  const tasks = {
    1: [
      {
        id: 't1-vitamins',
        title: 'Tomar vitaminas',
        description: 'Ácido fólico e vitaminas pré-natais',
        time: '08:00',
        icon: '💊',
        points: 10,
        trimester: [1, 2, 3] as (1 | 2 | 3)[],
      },
      {
        id: 't1-water',
        title: 'Beber 2L de água',
        description: 'Mantenha-se hidratada',
        time: '12:00',
        icon: '💧',
        points: 10,
        trimester: [1, 2, 3] as (1 | 2 | 3)[],
      },
      {
        id: 't1-symptoms',
        title: 'Registrar sintomas',
        description: 'Anote como você está se sentindo',
        time: '20:00',
        icon: '📝',
        points: 15,
        trimester: [1, 2, 3] as (1 | 2 | 3)[],
      },
      {
        id: 't1-rest',
        title: 'Descansar',
        description: 'Tire um cochilo se sentir cansaço',
        time: '15:00',
        icon: '😴',
        points: 10,
        trimester: [1] as (1 | 2 | 3)[],
      },
      {
        id: 't1-walk',
        title: 'Caminhada leve',
        description: '15 minutos de caminhada',
        time: '17:00',
        icon: '🚶‍♀️',
        points: 15,
        trimester: [1] as (1 | 2 | 3)[],
      },
    ],
    2: [
      {
        id: 't2-vitamins',
        title: 'Tomar vitaminas',
        description: 'Vitaminas pré-natais',
        time: '08:00',
        icon: '💊',
        points: 10,
        trimester: [1, 2, 3] as (1 | 2 | 3)[],
      },
      {
        id: 't2-water',
        title: 'Beber 2L de água',
        description: 'Mantenha-se hidratada',
        time: '12:00',
        icon: '💧',
        points: 10,
        trimester: [1, 2, 3] as (1 | 2 | 3)[],
      },
      {
        id: 't2-exercise',
        title: 'Exercício leve',
        description: 'Yoga ou caminhada 30min',
        time: '09:00',
        icon: '🧘‍♀️',
        points: 20,
        trimester: [2] as (1 | 2 | 3)[],
      },
      {
        id: 't2-pelvic',
        title: 'Assoalho pélvico',
        description: 'Exercícios de Kegel',
        time: '14:00',
        icon: '💪',
        points: 15,
        trimester: [2, 3] as (1 | 2 | 3)[],
      },
      {
        id: 't2-baby',
        title: 'Conversar com bebê',
        description: 'Momento de conexão',
        time: '20:00',
        icon: '💕',
        points: 10,
        trimester: [2, 3] as (1 | 2 | 3)[],
      },
    ],
    3: [
      {
        id: 't3-vitamins',
        title: 'Tomar vitaminas',
        description: 'Vitaminas pré-natais',
        time: '08:00',
        icon: '💊',
        points: 10,
        trimester: [1, 2, 3] as (1 | 2 | 3)[],
      },
      {
        id: 't3-water',
        title: 'Beber 2L de água',
        description: 'Mantenha-se hidratada',
        time: '12:00',
        icon: '💧',
        points: 10,
        trimester: [1, 2, 3] as (1 | 2 | 3)[],
      },
      {
        id: 't3-breathing',
        title: 'Exercícios respiratórios',
        description: 'Prepare-se para o parto',
        time: '10:00',
        icon: '🌬️',
        points: 20,
        trimester: [3] as (1 | 2 | 3)[],
      },
      {
        id: 't3-pelvic',
        title: 'Assoalho pélvico',
        description: 'Exercícios de Kegel',
        time: '14:00',
        icon: '💪',
        points: 15,
        trimester: [2, 3] as (1 | 2 | 3)[],
      },
      {
        id: 't3-perineal',
        title: 'Massagem perineal',
        description: 'Prepare seu corpo (após 34 sem)',
        time: '21:00',
        icon: '✨',
        points: 15,
        trimester: [3] as (1 | 2 | 3)[],
      },
      {
        id: 't3-baby',
        title: 'Conversar com bebê',
        description: 'Momento de conexão',
        time: '20:00',
        icon: '💕',
        points: 10,
        trimester: [2, 3] as (1 | 2 | 3)[],
      },
    ],
  };
  return tasks[trimester];
}
