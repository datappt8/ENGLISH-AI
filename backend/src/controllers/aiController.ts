import { Request, Response, NextFunction } from 'express'

// 发送对话消息
export const sendDialogueMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 实现 AI 对话逻辑
    const { session_id, quest_id, message } = req.body

    res.json({
      success: true,
      data: {
        response: {
          role: 'assistant',
          content: 'Hello! This is a placeholder response.',
          audio_url: null,
        },
        evaluation: {
          pronunciation_score: 85,
          grammar_score: 90,
          fluency_score: 80,
          issues: [],
        },
        suggestions: ['Great job!'],
        progress: {
          current_turn: 1,
          total_turns_target: 5,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// 结束对话会话
export const endDialogueSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 实现结束对话会话逻辑
    const { sessionId } = req.params

    res.json({
      success: true,
      data: {
        session_summary: {
          session_id: sessionId,
          total_turns: 5,
          duration_seconds: 300,
          final_score: 85,
        },
        passed: true,
        can_submit_quest: true,
      },
    })
  } catch (error) {
    next(error)
  }
}
