// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  level: number
  experience: number
  coins: number
  diamonds: number
  membershipTier: 'free' | 'basic' | 'premium' | 'vip'
  membershipExpiresAt?: string
  avatarUrl?: string
  displayName?: string
  bio?: string
  createdAt: string
  lastLoginAt: string
}

// 角色相关类型
export interface Character {
  id: string
  characterName: string
  currentZone: string
  level: number
  strength: number
  intelligence: number
  charisma: number
}

// 任务相关类型
export interface Quest {
  id: string
  title: string
  description: string
  zone: string
  quest_order: number
  difficulty: 'easy' | 'medium' | 'hard' | 'boss'
  required_level: number
  prerequisite_quests: string[]
  quest_type: 'dialogue' | 'pronunciation' | 'listening' | 'roleplay' | 'challenge'
  npc_id: string
  dialogue_context: any
  passing_score: number
  pronunciation_weight: number
  grammar_weight: number
  fluency_weight: number
  completeness_weight: number
  exp_reward: number
  coin_reward: number
  special_rewards?: any
  time_limit_seconds?: number
  tags: string[]
  learning_objectives: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  // 用户进度相关
  user_status: 'not_started' | 'in_progress' | 'completed' | 'failed'
  user_attempts: number
  user_best_score?: number
  is_unlocked: boolean
}

export interface UserQuestProgress {
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
  attempts: number
  bestScore: number | null
}

// NPC 相关类型
export interface NPC {
  id: string
  name: string
  avatarUrl: string
  personality: string
}

// AI 对话相关类型
export interface DialogueMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  audioUrl?: string
  timestamp?: string
}

export interface DialogueEvaluation {
  pronunciationScore: number
  grammarScore: number
  fluencyScore: number
  issues: Array<{
    type: string
    word: string
    suggestion: string
  }>
}

// 统计相关类型
export interface UserStats {
  totalQuestsCompleted: number
  currentStreakDays: number
  longestStreakDays: number
  avgPronunciationScore: number
  totalStudyTimeMinutes: number
  friendsCount: number
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

// 认证相关类型
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  character: Character
  token: string
}
