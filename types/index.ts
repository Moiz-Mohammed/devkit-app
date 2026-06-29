// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
  character?: Character;
  xp?: UserXP;
  streak?: Streak;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SignupInput {
  email: string;
  username: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ─── Character & Classes ──────────────────────────────────────────────────────

export interface CareerClass {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  primaryColor: string;
}

export interface Character {
  id: string;
  userId: string;
  classId: string;
  class: CareerClass;
  evolutionStage: number; // 0–5
  primaryWeaponId?: string;
  secondaryWeaponId?: string;
  familiarId?: string;
}

export type EvolutionStage =
  | 'Newcomer'
  | 'Recruit'
  | 'Apprentice'
  | 'Journeyman'
  | 'Expert'
  | 'Master';

export const EVOLUTION_STAGES: EvolutionStage[] = [
  'Newcomer', 'Recruit', 'Apprentice', 'Journeyman', 'Expert', 'Master',
];

// ─── XP & Progression ─────────────────────────────────────────────────────────

export interface UserXP {
  id: string;
  userId: string;
  totalXP: number;
  level: number;
  xpToNext: number;
}

export interface Streak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveAt: string;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface OnboardingAnswer {
  questionId: string;
  answer: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  status?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
