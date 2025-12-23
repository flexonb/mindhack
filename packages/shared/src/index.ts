// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'user' | 'helper' | 'counselor' | 'admin';

export interface UserProfile {
  userId: string;
  bio?: string;
  preferredLanguage: string;
  timezone: string;
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  crisisAlerts: boolean;
}

// Training Types
export type PersonaCondition =
  | 'depression'
  | 'anxiety'
  | 'ptsd'
  | 'bipolar'
  | 'ocd'
  | 'addiction'
  | 'eating_disorder'
  | 'crisis';

export type DifficultyLevel = 'mild' | 'moderate' | 'severe';

export interface Persona {
  id: string;
  name: string;
  condition: PersonaCondition;
  difficulty: DifficultyLevel;
  description: string;
  systemPrompt: string;
  traits: string[];
  triggerTopics: string[];
  crisisKeywords: string[];
  openingMessages: string[];
  escalationMessages: string[];
}

export interface TrainingSession {
  id: string;
  userId: string;
  personaId: string;
  messages: ChatMessage[];
  scores: SessionScores;
  startedAt: Date;
  completedAt?: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  suggestedResponses?: SuggestedResponse[];
}

export interface SuggestedResponse {
  id: string;
  content: string;
  category: 'empathetic' | 'challenging' | 'resource' | 'question';
  explanation: string;
}

export interface SessionScores {
  crisisRecognition: number;
  empathy: number;
  appropriateness: number;
  deescalation: number;
  overall: number;
}

// Support Types
export interface Helper {
  id: string;
  userId: string;
  role: HelperRole;
  credentials: Credential[];
  specialties: string[];
  bio: string;
  availability: Availability[];
  rating: number;
  totalSessions: number;
  isVerified: boolean;
}

export type HelperRole = 'listener' | 'peer_support' | 'counselor' | 'crisis_responder' | 'specialist';

export interface Credential {
  type: string;
  issuer: string;
  documentUrl: string;
  verified: boolean;
}

export interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface SupportSession {
  id: string;
  userId: string;
  helperId: string;
  type: 'text' | 'voice' | 'video';
  status: SessionStatus;
  messages: ChatMessage[];
  rating?: number;
  feedback?: string;
  startedAt: Date;
  endedAt?: Date;
}

export type SessionStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'escalated';

// Scoring Types
export interface UserProgress {
  userId: string;
  totalSessions: number;
  averageScore: number;
  skillLevels: Record<string, SkillLevel>;
  badges: Badge[];
  certificates: Certificate[];
  streakDays: number;
  lastActiveAt: Date;
}

export interface SkillLevel {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  score: number;
  sessionsCompleted: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
}

export interface Certificate {
  id: string;
  name: string;
  issuedAt: Date;
  personaId: string;
  score: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

// WebSocket Event Types
export interface WSEvent {
  type: WSEventType;
  payload: unknown;
  timestamp: Date;
}

export type WSEventType =
  | 'message'
  | 'typing_start'
  | 'typing_stop'
  | 'user_joined'
  | 'user_left'
  | 'session_ended'
  | 'crisis_detected'
  | 'score_update';

// Crisis Detection Types
export interface CrisisAlert {
  id: string;
  userId: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedKeywords: string[];
  triggeredAt: Date;
  escalatedAt?: Date;
  resolvedAt?: Date;
  outcome?: string;
}
