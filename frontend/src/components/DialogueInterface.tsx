import { useState, useEffect, useRef } from 'react'
import { sendDialogueMessage, endDialogueSession } from '../services/dialogueService'
import type { SendMessageResponse, EndSessionResponse } from '../services/dialogueService'
import './DialogueInterface.css'

interface DialogueInterfaceProps {
  sessionId: string
  questId: string
  questTitle: string
  npcName: string
  npcAvatarUrl?: string
  onComplete: (result: EndSessionResponse) => void
  onCancel: () => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function DialogueInterface({
  sessionId,
  questId,
  questTitle,
  npcName,
  npcAvatarUrl,
  onComplete,
  onCancel,
}: DialogueInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [progress, setProgress] = useState({ current: 0, target: 5, canEnd: false })
  const [error, setError] = useState('')
  const [isEnding, setIsEnding] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 发送初始问候
  useEffect(() => {
    const sendGreeting = async () => {
      try {
        setLoading(true)
        const response = await sendDialogueMessage(
          sessionId,
          questId,
          'Hello! I\'m ready to start the conversation.'
        )

        setMessages([
          {
            role: 'assistant',
            content: response.response.content,
            timestamp: new Date(),
          },
        ])

        setSuggestions(response.suggestions)
        setProgress({
          current: response.progress.current_turn,
          target: response.progress.total_turns_target,
          canEnd: response.progress.can_end,
        })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    sendGreeting()
  }, [sessionId, questId])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setError('')

    // 添加用户消息到界面
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    try {
      setLoading(true)

      // 发送消息到后端
      const response = await sendDialogueMessage(sessionId, questId, userMessage)

      // 添加 AI 响应
      const aiMessage: Message = {
        role: 'assistant',
        content: response.response.content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // 更新建议和进度
      setSuggestions(response.suggestions)
      setProgress({
        current: response.progress.current_turn,
        target: response.progress.total_turns_target,
        canEnd: response.progress.can_end,
      })

      // 如果 AI 建议结束对话
      if (response.should_end) {
        setTimeout(() => handleEndSession(), 2000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleEndSession = async () => {
    if (isEnding) return

    try {
      setIsEnding(true)
      setLoading(true)

      const result = await endDialogueSession(sessionId)
      onComplete(result)
    } catch (err: any) {
      setError(err.message)
      setIsEnding(false)
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="dialogue-interface">
      {/* 头部 */}
      <div className="dialogue-header">
        <div className="dialogue-header-left">
          {npcAvatarUrl && (
            <img src={npcAvatarUrl} alt={npcName} className="npc-avatar" />
          )}
          <div>
            <h2>{questTitle}</h2>
            <p className="npc-name">与 {npcName} 对话</p>
          </div>
        </div>
        <div className="dialogue-header-right">
          <div className="progress-indicator">
            <span>进度: {progress.current}/{progress.target}</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(progress.current / progress.target) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="dialogue-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message message-${msg.role}`}>
            <div className="message-content">
              <p>{msg.content}</p>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message message-assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 建议区域 */}
      {suggestions.length > 0 && (
        <div className="dialogue-suggestions">
          <p className="suggestions-label">💡 提示:</p>
          <ul>
            {suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="dialogue-error">
          <p>❌ {error}</p>
        </div>
      )}

      {/* 输入区域 */}
      <div className="dialogue-input-area">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的回复..."
          disabled={loading || isEnding}
          className="dialogue-input"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || loading || isEnding}
          className="btn btn-primary"
        >
          发送
        </button>
        {progress.canEnd && (
          <button
            onClick={handleEndSession}
            disabled={loading || isEnding}
            className="btn btn-success"
          >
            {isEnding ? '结束中...' : '完成对话'}
          </button>
        )}
        <button
          onClick={onCancel}
          disabled={loading || isEnding}
          className="btn btn-secondary"
        >
          取消
        </button>
      </div>
    </div>
  )
}

export default DialogueInterface
