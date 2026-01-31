import api from './api'
import type { Quest, ApiResponse } from '@types/index'

// 任务列表响应接口
export interface QuestListResponse {
  quests: Quest[]
  total: number
  availableCount: number
  inProgressCount: number
  completedCount: number
}

// 任务详情响应接口
export interface QuestDetailResponse {
  quest: Quest
  prerequisites: {
    met: boolean
    missing: string[]
  }
}

// 开始任务响应接口
export interface StartQuestResponse {
  quest: Quest
  session_id: string
}

// 提交任务响应接口
export interface SubmitQuestResponse {
  result: 'passed' | 'failed'
  score: number
  rewards: {
    exp_gained: number
    coins_gained: number
    exp_breakdown?: {
      base: number
      membership_bonus: number
      streak_bonus: number
      perfect_score_bonus: number
    }
    coin_breakdown?: {
      base: number
      membership_bonus: number
      streak_bonus: number
      perfect_score_bonus: number
    }
  }
  level_up: boolean
  new_level?: number
  levels_gained?: number
  special_rewards?: any
}

/**
 * 获取任务列表
 * @param params - 筛选参数
 * @returns 任务列表和统计信息
 */
export const getQuests = async (params?: {
  zone?: string
  status?: string
  difficulty?: string
}): Promise<QuestListResponse> => {
  try {
    const response = await api.get<any, ApiResponse<QuestListResponse>>('/quests', { params })
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || '获取任务列表失败')
  } catch (error: any) {
    console.error('获取任务列表失败:', error)
    throw new Error(error.response?.data?.message || error.message || '获取任务列表失败')
  }
}

/**
 * 获取任务详情
 * @param questId - 任务 ID
 * @returns 任务详情和前置条件信息
 */
export const getQuestById = async (questId: string): Promise<QuestDetailResponse> => {
  try {
    const response = await api.get<any, ApiResponse<QuestDetailResponse>>(`/quests/${questId}`)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || '获取任务详情失败')
  } catch (error: any) {
    console.error('获取任务详情失败:', error)
    throw new Error(error.response?.data?.message || error.message || '获取任务详情失败')
  }
}

/**
 * 开始任务
 * @param questId - 任务 ID
 * @returns 任务信息和会话 ID
 */
export const startQuest = async (questId: string): Promise<StartQuestResponse> => {
  try {
    const response = await api.post<any, ApiResponse<StartQuestResponse>>(`/quests/${questId}/start`)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || '开始任务失败')
  } catch (error: any) {
    console.error('开始任务失败:', error)
    throw new Error(error.response?.data?.message || error.message || '开始任务失败')
  }
}

/**
 * 提交任务
 * @param questId - 任务 ID
 * @param data - 提交数据
 * @returns 任务结果和奖励信息
 */
export const submitQuest = async (
  questId: string,
  data: {
    sessionId: string
    score: number
    completionData: any
  }
): Promise<SubmitQuestResponse> => {
  try {
    const response = await api.post<any, ApiResponse<SubmitQuestResponse>>(`/quests/${questId}/submit`, {
      session_id: data.sessionId,
      score: data.score,
      completion_data: data.completionData
    })

    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || '提交任务失败')
  } catch (error: any) {
    console.error('提交任务失败:', error)
    throw new Error(error.response?.data?.message || error.message || '提交任务失败')
  }
}
