import { Request, Response, NextFunction } from 'express'
import { query } from '../config/database'
import * as ClaudeService from '../services/claudeService'

// 扩展 Request 类型以包含用户信息
interface AuthRequest extends Request {
  user?: {
    id: string
    username: string
    level: number
    membership_tier: 'free' | 'basic' | 'premium' | 'vip'
  }
}

// 发送对话消息
export const sendDialogueMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未授权访问',
      })
    }

    const { session_id, quest_id, message } = req.body

    // 验证输入
    if (!session_id || !quest_id || !message) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数',
      })
    }

    // 获取任务信息
    const questResult = await query(
      `SELECT qt.*, n.name as npc_name, n.personality as npc_personality
       FROM quest_templates qt
       LEFT JOIN npcs n ON qt.npc_id = n.id
       WHERE qt.id = $1`,
      [quest_id]
    )

    if (questResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '任务不存在',
      })
    }

    const quest = questResult.rows[0]

    // 获取对话历史
    let dialogueHistory = await ClaudeService.getDialogueHistory(session_id)

    // 添加用户消息
    dialogueHistory.push({
      role: 'user',
      content: message,
    })

    // 构建对话上下文
    const context: ClaudeService.DialogueContext = {
      questId: quest_id,
      npcPersonality: quest.npc_personality || 'friendly and helpful',
      dialogueObjective: quest.dialogue_context?.objective || 'Practice conversational English',
      scenarioContext: quest.dialogue_context?.scenario || quest.description,
      userLevel: req.user?.level || 1,
    }

    // 调用 Claude API
    const aiResponse = await ClaudeService.sendMessage(dialogueHistory, context)

    // 添加 AI 响应到历史
    dialogueHistory.push({
      role: 'assistant',
      content: aiResponse.content,
    })

    // 保存对话历史
    await ClaudeService.saveDialogueHistory(session_id, userId, quest_id, dialogueHistory)

    // 计算进度
    const userTurns = dialogueHistory.filter((m) => m.role === 'user').length
    const targetTurns = quest.dialogue_context?.min_turns || 5

    res.json({
      success: true,
      data: {
        response: {
          role: 'assistant',
          content: aiResponse.content,
          audio_url: null, // TODO: 集成 TTS
        },
        suggestions: aiResponse.suggestions,
        progress: {
          current_turn: userTurns,
          total_turns_target: targetTurns,
          can_end: userTurns >= targetTurns || aiResponse.shouldEnd,
        },
        should_end: aiResponse.shouldEnd,
      },
    })
  } catch (error: any) {
    console.error('发送对话消息失败:', error)
    next(error)
  }
}

// 结束对话会话
export const endDialogueSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未授权访问',
      })
    }

    const { sessionId } = req.params

    // 获取对话历史
    const dialogueHistory = await ClaudeService.getDialogueHistory(sessionId)

    if (dialogueHistory.length === 0) {
      return res.status(404).json({
        success: false,
        message: '会话不存在',
      })
    }

    // 获取会话信息
    const sessionResult = await query(
      `SELECT quest_id, created_at FROM dialogue_sessions WHERE id = $1`,
      [sessionId]
    )

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '会话不存在',
      })
    }

    const session = sessionResult.rows[0]

    // 评估对话
    const evaluation = await ClaudeService.evaluateDialogue(sessionId, dialogueHistory)

    // 计算会话时长
    const startTime = new Date(session.created_at)
    const endTime = new Date()
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

    // 获取任务信息以检查是否通过
    const questResult = await query(
      `SELECT passing_score FROM quest_templates WHERE id = $1`,
      [session.quest_id]
    )

    const passingScore = questResult.rows[0]?.passing_score || 60
    const passed = evaluation.overallScore >= passingScore

    // 统计对话轮数
    const totalTurns = dialogueHistory.filter((m) => m.role === 'user').length

    res.json({
      success: true,
      data: {
        session_summary: {
          session_id: sessionId,
          total_turns: totalTurns,
          duration_seconds: durationSeconds,
          final_score: evaluation.overallScore,
        },
        evaluation: {
          overall_score: evaluation.overallScore,
          pronunciation_score: evaluation.pronunciationScore,
          grammar_score: evaluation.grammarScore,
          fluency_score: evaluation.fluencyScore,
          completeness_score: evaluation.completenessScore,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          improvements: evaluation.improvements,
        },
        passed,
        can_submit_quest: passed,
      },
    })
  } catch (error: any) {
    console.error('结束对话会话失败:', error)
    next(error)
  }
}
