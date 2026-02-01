import { Request, Response, NextFunction } from 'express'
import { query } from '../config/database'

// 获取当前用户信息
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId

    // 从数据库获取用户信息
    const userResult = await query(
      `SELECT u.id, u.username, u.email, u.level, u.experience, u.coins, u.diamonds,
              u.created_at, u.updated_at
       FROM users u
       WHERE u.id = $1`,
      [userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      })
    }

    const user = userResult.rows[0]

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        exp: user.experience,
        coins: user.coins,
        diamonds: user.diamonds,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
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
    const userId = req.user?.userId

    // 从数据库获取用户统计
    const statsResult = await query(
      `SELECT total_quests_completed, total_quests_failed,
              current_streak_days, longest_streak_days,
              avg_pronunciation_score, total_study_time_minutes,
              last_study_date, friends_count
       FROM user_stats
       WHERE user_id = $1`,
      [userId]
    )

    if (statsResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户统计不存在',
      })
    }

    const stats = statsResult.rows[0]

    res.json({
      success: true,
      data: {
        totalQuestsCompleted: stats.total_quests_completed,
        totalQuestsFailed: stats.total_quests_failed,
        currentStreakDays: stats.current_streak_days,
        longestStreakDays: stats.longest_streak_days,
        avgPronunciationScore: stats.avg_pronunciation_score,
        totalStudyTimeMinutes: stats.total_study_time_minutes,
        lastStudyDate: stats.last_study_date,
        friendsCount: stats.friends_count,
      },
    })
  } catch (error) {
    next(error)
  }
}
