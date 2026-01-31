import api from './api'
import type { DialogueMessage, DialogueEvaluation, ApiResponse } from '@types/index'

// 发送对话消息
export const sendDialogueMessage = async (data: {
  sessionId: string
  questId: string
  message: {
    type: 'text' | 'audio'
    content: string
    audioUrl?: string
  }
}): Promise<{
  response: DialogueMessage
  evaluation: DialogueEvaluation
  suggestions: string[]
  progress: any
}> => {
  const response = await api.post<any, ApiResponse<any>>('/ai/dialogue', {
    session_id: data.sessionId,
    quest_id: data.questId,
    message: data.message
  })

  if (response.success && response.data) {
    return response.data
  }
  throw new Error('发送对话消息失败')
}

// 结束对话会话
export const endDialogueSession = async (sessionId: string): Promise<{
  sessionSummary: any
  passed: boolean
  canSubmitQuest: boolean
}> => {
  const response = await api.post<any, ApiResponse<any>>(`/ai/dialogue/${sessionId}/end`)

  if (response.success && response.data) {
    return response.data
  }
  throw new Error('结束对话会话失败')
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
