import { Request, Response, NextFunction } from 'express'

// 获取当前用户信息
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 从数据库获取用户信息
    res.json({
      success: true,
      data: {
        user: {
          id: req.user?.userId,
          username: req.user?.username,
          level: 1,
          experience: 0,
          coins: 100,
          diamonds: 0,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// 更新用户资料
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 实现更新用户资料逻辑
    const { displayName, bio, avatarUrl } = req.body

    res.json({
      success: true,
      message: '更新成功',
      data: {
        user: {
          displayName,
          bio,
          avatarUrl,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// 获取用户统计
export const getUserStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: 从数据库获取用户统计
    res.json({
      success: true,
      data: {
        stats: {
          totalQuestsCompleted: 0,
          currentStreakDays: 0,
          longestStreakDays: 0,
          avgPronunciationScore: 0,
          totalStudyTimeMinutes: 0,
          friendsCount: 0,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}
