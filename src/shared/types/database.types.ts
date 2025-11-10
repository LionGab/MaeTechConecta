/**
 * Database Types - Supabase Schema
 *
 * 🔐 Tipos gerados do schema do Supabase
 * Mantenha sincronizado com migrations via: pnpm supabase:gen:types
 */

// ==========================================
// PROFILES
// ==========================================

export type UserStage = 'gestante' | 'mae' | 'tentante' | 'puerperio' | 'mae_estabelecida';
export type SubscriptionTier = 'free' | 'premium';

export interface Profile {
  id: string;
  email?: string;
  name: string;
  avatar_url?: string;
  stage: UserStage;
  pregnancy_week?: number;
  baby_name?: string;
  preferences: string[];
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

// ==========================================
// USER CONTEXT
// ==========================================

export interface UserContext {
  id: string;
  user_id: string;
  pregnancy_week?: number;
  baby_name?: string;
  preferences: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ==========================================
// DAILY TIPS
// ==========================================

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  audience: {
    stage: UserStage[];
    tags: string[];
  };
  category?: string;
  relevance_score: number;
  created_at: string;
}

// ==========================================
// HABITS & GAMIFICATION
// ==========================================

export interface HabitTemplate {
  id: string;
  name: string;
  description?: string;
  icon: string;
  default_points: number;
  category: string;
  tags: string[];
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  template_id?: string;
  name: string;
  icon: string;
  points: number;
  is_active: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  done: boolean;
  skipped: boolean;
  logged_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  best_streak: number;
  total_points: number;
  level: number;
  badges: string[];
  last_completion_date?: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  points_required?: number;
  unlocked_at?: string;
}

// ==========================================
// POSTS (MundoNath)
// ==========================================

export interface Post {
  id: string;
  author_id: string;
  title: string;
  subtitle?: string;
  content: string;
  cover_image?: string;
  category: string;
  tags: string[];
  is_premium: boolean;
  read_time: number;
  published_at: string;
  created_at: string;
}

// ==========================================
// CURATED ARTICLES (MãeValente)
// ==========================================

export interface CuratedArticle {
  id: string;
  title: string;
  summary: string;
  source_url: string;
  source_name: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  relevance_score: number;
  curated_at: string;
}

// ==========================================
// CHAT MESSAGES
// ==========================================

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  context_data?: Record<string, any>;
  meta?: Record<string, any>;
  created_at: string;
}

// ==========================================
// HELPERS
// ==========================================

export type InsertProfile = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProfile = Partial<InsertProfile>;

export type InsertHabit = Omit<Habit, 'id' | 'created_at'>;
export type UpdateHabit = Partial<InsertHabit>;

export type InsertHabitLog = Omit<HabitLog, 'id' | 'logged_at'>;

export type InsertChatMessage = Omit<ChatMessage, 'id' | 'created_at'>;

