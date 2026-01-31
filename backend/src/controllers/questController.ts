import { Request, Response, NextFunction } from 'express'

// 获取任务列表
export const getQuests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 从数据库获取任务列表
    const { zone, status } = req.query

    res.json({
      success: true,
      data: {
        quests: [],
        total: 0,
        availableCount: 0,
        completedCount: 0,
      },
    })
  } catch (error) {
    next(error)
  }
}

// 获取任务详情
export const getQuestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 从数据库获取任务详情
    const { questId } = req.params

    res.json({
      success: true,
      data: {
        quest: {
          id: questId,
          title: '示例任务',
          description: '任务描述',
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// 开始任务
export const startQuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 实现开始任务逻辑
    const { questId } = req.params

    res.json({
      success: true,
      data: {
        quest: {
          id: questId,
        },
        session_id: 'temp_session_id',
      },
    })
  } catch (error) {
    next(error)
  }
}

// 提交任务
export const submitQuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 实现提交任务逻辑
    const { questId } = req.params
    const { session_id, score, completion_data } = req.body

    res.json({
      success: true,
      data: {
        result: score >= 70 ? 'passed' : 'failed',
        score,
        rewards: {
          exp_gained: 100,
          coins_gained: 50,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}
