/**
 * @fileOverview Type definitions for pregnancy tracking and maternal health features
 */

export type Trimester = 'first' | 'second' | 'third' | 'postpartum';

export interface PregnancyProfile {
  id: string;
  userId: string;
  dueDate: string; // ISO date string
  currentWeek: number;
  currentTrimester: Trimester;
  lastPeriodDate: string; // ISO date string
  isHighRisk?: boolean;
  healthConditions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SymptomEntry {
  id: string;
  userId: string;
  date: string; // ISO date string
  symptoms: {
    nausea?: number; // 1-5 scale
    fatigue?: number;
    headache?: number;
    backPain?: number;
    moodSwings?: number;
    cramping?: number;
    swelling?: number;
    other?: string;
  };
  notes?: string;
  week: number;
  createdAt: string;
}

export interface DailyRoutine {
  id: string;
  userId: string;
  trimester: Trimester;
  tasks: RoutineTask[];
  completedTasks: string[]; // task IDs
  date: string; // ISO date string
  streak: number;
}

export interface RoutineTask {
  id: string;
  title: string;
  description: string;
  icon: string;
  time?: string;
  completed: boolean;
  points: number;
  category: 'health' | 'nutrition' | 'exercise' | 'wellness' | 'education';
}

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  type: 'ultrasound' | 'checkup' | 'test' | 'other';
  date: string; // ISO date string
  time: string;
  doctor?: string;
  location?: string;
  notes?: string;
  reminder?: boolean;
  createdAt: string;
}

export interface Milestone {
  id: string;
  week: number;
  trimester: Trimester;
  title: string;
  description: string;
  babyDevelopment: string;
  motherChanges: string;
  tips: string[];
  imageUrl?: string;
}

export interface BirthPlan {
  id: string;
  userId: string;
  birthLocation: 'hospital' | 'home' | 'birth-center' | 'undecided';
  painManagement: string[];
  birthPartner?: string;
  preferences: {
    movement?: boolean;
    music?: boolean;
    lighting?: string;
    photography?: boolean;
  };
  specialRequests?: string;
  emergencyContacts: {
    name: string;
    phone: string;
    relationship: string;
  }[];
  updatedAt: string;
}

export interface ContractionTimer {
  id: string;
  userId: string;
  startTime: string; // ISO timestamp
  endTime?: string;
  duration?: number; // seconds
  notes?: string;
}

export interface ContractionSession {
  id: string;
  userId: string;
  date: string;
  contractions: ContractionTimer[];
  averageInterval?: number;
  averageDuration?: number;
  status: 'monitoring' | 'completed' | 'hospital-time';
}

export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'nutrition' | 'exercise' | 'medical' | 'emotional' | 'preparation' | 'postpartum';
  trimester: Trimester[];
  week?: number;
  imageUrl?: string;
  videoUrl?: string;
  readTime: number; // minutes
  tags: string[];
  author?: string;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  userId: string;
  type: 'symptom-analysis' | 'routine-suggestion' | 'health-tip' | 'warning';
  content: string;
  priority: 'low' | 'medium' | 'high';
  actionable?: boolean;
  actionText?: string;
  actionLink?: string;
  week: number;
  createdAt: string;
  dismissed?: boolean;
}

export interface WeeklyProgress {
  week: number;
  routineCompletion: number; // percentage
  symptomsLogged: boolean;
  appointmentsAttended: number;
  contentRead: number;
  mood: number; // 1-5 scale
  notes?: string;
}

// Helper functions
export function calculateWeekFromDueDate(dueDate: Date): number {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.max(1, Math.min(40, 40 - diffWeeks));
}

export function getTrimesterFromWeek(week: number): Trimester {
  if (week <= 13) return 'first';
  if (week <= 27) return 'second';
  if (week <= 40) return 'third';
  return 'postpartum';
}

export function getDaysUntilDueDate(dueDate: Date): number {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
