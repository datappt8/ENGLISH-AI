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
  difficulty: 'easy' | 'medium' | 'hard' | 'boss'
  questType: 'dialogue' | 'pronunciation' | 'listening' | 'roleplay' | 'challenge'
  requiredLevel: number
  rewards: {
    exp: number
    coins: number
  }
  userProgress?: UserQuestProgress
  estimatedTimeMinutes: number
  isLocked: boolean
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
