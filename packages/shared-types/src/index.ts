/**
 * @nossa-maternidade/shared-types
 *
 * Pacote de tipos compartilhados entre mobile, web e edge functions
 * Compatível com ESM e CJS
 */

// ==================== USER TYPES ====================

export type UserType = 'gestante' | 'mãe' | 'tentante';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  type: UserType;
  weekOfPregnancy?: number;
  babyName?: string;
  dueDate?: Date;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    onboardingCompleted: boolean;
    lastActiveAt?: Date;
    preferences?: UserPreferences;
  };
}

export interface UserPreferences {
  notifications: {
    daily: boolean;
    emergency: boolean;
    content: boolean;
  };
  language: 'pt-BR';
  theme: 'light' | 'dark' | 'auto';
}

// ==================== CHAT TYPES ====================

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageUrgency = 'low' | 'medium' | 'high' | 'emergency';

export type MessageSentiment = 'positive' | 'neutral' | 'negative';

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  metadata?: {
    urgency?: MessageUrgency;
    sentiment?: MessageSentiment;
    containsMedicalAdvice?: boolean;
    aiModel?: 'claude' | 'gpt4' | 'gemini';
    tokens?: number;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastMessageAt: Date;
  metadata?: {
    totalMessages: number;
    averageUrgency: MessageUrgency;
  };
}

// ==================== CONTENT TYPES ====================

export interface DailyPlan {
  id: string;
  userId: string;
  date: Date;
  priorities: string[];
  tip: string;
  recipe?: Recipe;
  createdAt: Date;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTime: number; // minutos
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

// ==================== NOTIFICATION TYPES ====================

export type NotificationType = 'daily_tip' | 'reminder' | 'emergency' | 'update';

export type NotificationStatus = 'pending' | 'sent' | 'read' | 'failed';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  scheduledFor: Date;
  sentAt?: Date;
  readAt?: Date;
  metadata?: {
    priority: 'low' | 'medium' | 'high';
    actionUrl?: string;
  };
}

// ==================== PAYMENT TYPES ====================

export type SubscriptionTier = 'free' | 'premium';

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethod?: string;
}

// ==================== API TYPES ====================

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  metadata?: {
    timestamp: Date;
    requestId: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ==================== VALIDATION SCHEMAS ====================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ==================== HELPER TYPES ====================

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

// ==================== TYPE GUARDS ====================

export const isGestante = (user: UserProfile): boolean => user.type === 'gestante';

export const isMãe = (user: UserProfile): boolean => user.type === 'mãe';

export const isTentante = (user: UserProfile): boolean => user.type === 'tentante';

export const isEmergency = (message: ChatMessage): boolean => message.metadata?.urgency === 'emergency';

