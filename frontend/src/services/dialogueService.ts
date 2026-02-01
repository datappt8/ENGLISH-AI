import api from './api'
import type { DialogueMessage, ApiResponse } from '@types/index'

// 发送消息响应接口
export interface SendMessageResponse {
  response: {
    role: 'assistant'
    content: string
    audio_url: string | null
  }
  suggestions: string[]
  progress: {
    current_turn: number
    total_turns_target: number
    can_end: boolean
  }
  should_end: boolean
}

// 结束会话响应接口
export interface EndSessionResponse {
  session_summary: {
    session_id: string
    total_turns: number
    duration_seconds: number
    final_score: number
  }
  evaluation: {
    overall_score: number
    pronunciation_score: number
    grammar_score: number
    fluency_score: number
    completeness_score: number
    feedback: string[]
    strengths: string[]
    improvements: string[]
  }
  passed: boolean
  can_submit_quest: boolean
}

// 简单聊天响应接口
export interface ChatResponse {
  reply: string
  npc_name?: string
  quest_id?: string
}

// 简单聊天请求接口
export interface ChatRequest {
  message: string
  npc_name?: string
  quest_id?: string
  conversation_history?: Array<{ role: string; content: string }>
}

// 简单聊天（用于游戏内NPC对话）
export const chat = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await api.post<any, ApiResponse<ChatResponse>>('/ai/chat', request)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || '对话失败')
  } catch (error: any) {
    console.error('AI聊天失败:', error)
    throw new Error(error.response?.data?.message || error.message || '对话失败')
  }
}

// 发送对话消息
export const sendDialogueMessage = async (
  sessionId: string,
  questId: string,
  message: string
): Promise<SendMessageResponse> => {
  try {
    const response = await api.post<any, ApiResponse<SendMessageResponse>>('/ai/dialogue', {
      session_id: sessionId,
      quest_id: questId,
      message,
    })

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || '发送消息失败')
  } catch (error: any) {
    console.error('发送对话消息失败:', error)
    throw new Error(error.response?.data?.message || error.message || '发送消息失败')
  }
}

// 结束对话会话
export const endDialogueSession = async (sessionId: string): Promise<EndSessionResponse> => {
  try {
    const response = await api.post<any, ApiResponse<EndSessionResponse>>(
      `/ai/dialogue/${sessionId}/end`
    )

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || '结束会话失败')
  } catch (error: any) {
    console.error('结束对话会话失败:', error)
    throw new Error(error.response?.data?.message || error.message || '结束会话失败')
  }
}

// 语音识别（使用浏览器 Web Speech API）
export const startSpeechRecognition = (
  onResult: (transcript: string) => void,
  onError: (error: string) => void
): SpeechRecognition | null => {
  // 检查浏览器是否支持语音识别
  const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    onError('您的浏览器不支持语音识别功能')
    return null
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript)
  }

  recognition.onerror = (event) => {
    onError(`语音识别错误: ${event.error}`)
  }

  recognition.start()
  return recognition
}

// 文本转语音（使用浏览器 Web Speech API）
export const speakText = (text: string, lang: string = 'en-US'): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9 // 语速
    utterance.pitch = 1 // 音调
    window.speechSynthesis.speak(utterance)
  } else {
    console.error('您的浏览器不支持语音合成功能')
  }
}

// 停止语音播放
export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
