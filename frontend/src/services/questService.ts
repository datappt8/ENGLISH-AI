import api from './api'
import type { Quest, ApiResponse } from '@types/index'

// 获取任务列表
export const getQuests = async (params?: {
  zone?: string
  status?: string
}): Promise<Quest[]> => {
  const response = await api.get<any, ApiResponse<{ quests: Quest[] }>>('/quests', { params })
  if (response.success && response.data) {
    return response.data.quests
  }
  throw new Error('获取任务列表失败')
}

// 获取任务详情
export const getQuestById = async (questId: string): Promise<Quest> => {
  const response = await api.get<any, ApiResponse<{ quest: Quest }>>(`/quests/${questId}`)
  if (response.success && response.data) {
    return response.data.quest
  }
  throw new Error('获取任务详情失败')
}

// 开始任务
export const startQuest = async (questId: string): Promise<{
  quest: Quest
  sessionId: string
}> => {
  const response = await api.post<any, ApiResponse<{
    quest: Quest
    session_id: string
  }>>(`/quests/${questId}/start`)

  if (response.success && response.data) {
    return {
      quest: response.data.quest,
      sessionId: response.data.session_id
    }
  }
  throw new Error('开始任务失败')
}

// 提交任务
export const submitQuest = async (
  questId: string,
  data: {
    sessionId: string
    score: number
    completionData: any
  }
): Promise<{
  result: 'passed' | 'failed'
  score: number
  rewards: any
  feedback: any
}> => {
  const response = await api.post<any, ApiResponse<any>>(`/quests/${questId}/submit`, {
    session_id: data.sessionId,
    score: data.score,
    completion_data: data.completionData
  })

  if (response.success && response.data) {
    return response.data
  }
  throw new Error('提交任务失败')
}
