import { Request, Response, NextFunction } from 'express'
import * as QuestModel from '../models/Quest'
import { query, transaction } from '../config/database'
import {
  calculateTotalReward,
  checkLevelUp,
  getMembershipMultiplier,
} from '../utils/rewards'

// 扩展 Request 类型以包含用户信息
interface AuthRequest extends Request {
  user?: {
    id: string
    username: string
    level: number
    membership_tier: 'free' | 'basic' | 'premium' | 'vip'
  }
}

/**
 * 获取任务列表
 * 支持按区域和状态筛选
 */
export const getQuests = async (
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

    const { zone, status, difficulty } = req.query

    // 构建筛选条件
    const filters: QuestModel.QuestFilters = {}
    if (zone && typeof zone === 'string') {
      filters.zone = zone
    }
    if (status && typeof status === 'string') {
      filters.status = status as any
    }
    if (difficulty && typeof difficulty === 'string') {
      filters.difficulty = difficulty
    }

    // 获取任务列表
    const quests = await QuestModel.getAllQuests(userId, filters)

    // 统计数据
    const total = quests.length
    const availableCount = quests.filter((q) => q.is_unlocked && q.user_status === 'not_started').length
    const inProgressCount = quests.filter((q) => q.user_status === 'in_progress').length
    const completedCount = quests.filter((q) => q.user_status === 'completed').length

    res.json({
      success: true,
      data: {
        quests,
        total,
        availableCount,
        inProgressCount,
        completedCount,
      },
    })
  } catch (error) {
    console.error('获取任务列表失败:', error)
    next(error)
  }
}

/**
 * 获取任务详情
 * 包含完整的任务信息、NPC 信息和用户进度
 */
export const getQuestById = async (
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

    const { questId } = req.params

    // 获取任务详情
    const quest = await QuestModel.getQuestById(questId, userId)

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: '任务不存在',
      })
    }

    // 检查前置条件
    const prerequisites = await QuestModel.checkQuestPrerequisites(userId, questId)

    res.json({
      success: true,
      data: {
        quest,
        prerequisites,
      },
    })
  } catch (error) {
    console.error('获取任务详情失败:', error)
    next(error)
  }
}

/**
 * 开始任务
 * 检查等级要求和前置任务，创建任务会话
 */
export const startQuest = async (
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

    const { questId } = req.params

    // 获取任务详情
    const quest = await QuestModel.getQuestById(questId, userId)

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: '任务不存在',
      })
    }

    // 检查任务是否已完成
    if (quest.user_status === 'completed') {
      return res.status(400).json({
        success: false,
        message: '任务已完成',
      })
    }

    // 检查前置条件
    const prerequisites = await QuestModel.checkQuestPrerequisites(userId, questId)

    if (!prerequisites.met) {
      return res.status(400).json({
        success: false,
        message: '不满足任务前置条件',
        data: {
          missing: prerequisites.missing,
        },
      })
    }

    // 开始任务，生成会话 ID
    const sessionId = await QuestModel.startQuest(userId, questId)

    res.json({
      success: true,
      data: {
        quest,
        session_id: sessionId,
      },
    })
  } catch (error) {
    console.error('开始任务失败:', error)
    next(error)
  }
}

/**
 * 提交任务
 * 验证会话、计算奖励、更新用户数据
 */
export const submitQuest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id
    const userLevel = req.user?.level || 1
    const membershipTier = req.user?.membership_tier || 'free'

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未授权访问',
      })
    }

    const { questId } = req.params
    const { session_id, score, completion_data } = req.body

    // 验证输入
    if (!session_id || typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数',
      })
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: '分数必须在 0-100 之间',
      })
    }

    // 获取任务模板
    const questResult = await query(
      `SELECT * FROM quest_templates WHERE id = $1`,
      [questId]
    )

    if (questResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '任务不存在',
      })
    }

    const questTemplate = questResult.rows[0]

    // 检查任务状态
    const userQuest = await QuestModel.getUserQuestProgress(userId, questId)

    if (!userQuest || userQuest.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: '任务未开始或已完成',
      })
    }

    // 判断是否通过
    const isPassed = score >= questTemplate.passing_score

    // 获取用户连胜天数
    const statsResult = await query(
      `SELECT current_streak_days FROM user_stats WHERE user_id = $1`,
      [userId]
    )
    const streakDays = statsResult.rows[0]?.current_streak_days || 0

    // 计算奖励
    const expRewards = calculateTotalReward(
      questTemplate.exp_reward,
      score,
      membershipTier,
      streakDays
    )

    const coinRewards = calculateTotalReward(
      questTemplate.coin_reward,
      score,
      membershipTier,
      streakDays
    )

    // 使用事务更新所有相关数据
    const result = await transaction(async (client) => {
      // 1. 提交任务
      const isPassed = await QuestModel.submitQuest(
        userId,
        questId,
        score,
        completion_data
      )

      if (!isPassed) {
        return {
          result: 'failed',
          score,
          rewards: {
            exp_gained: 0,
            coins_gained: 0,
          },
          level_up: false,
        }
      }

      // 2. 获取当前用户数据
      const userResult = await client.query(
        `SELECT level, experience, coins FROM users WHERE id = $1`,
        [userId]
      )
      const currentUser = userResult.rows[0]

      // 3. 更新经验值和金币
      const newExp = currentUser.experience + expRewards.totalAmount
      const newCoins = currentUser.coins + coinRewards.totalAmount

      // 4. 检查是否升级
      const levelUpInfo = checkLevelUp(newExp, currentUser.level)

      // 5. 更新用户数据
      await client.query(
        `UPDATE users
         SET level = $1,
             experience = $2,
             coins = $3,
             updated_at = NOW()
         WHERE id = $4`,
        [levelUpInfo.newLevel, levelUpInfo.remainingExp, newCoins, userId]
      )

      // 6. 更新用户统计（连胜等）
      const today = new Date().toISOString().split('T')[0]
      await client.query(
        `UPDATE user_stats
         SET last_study_date = $1,
             current_streak_days = CASE
               WHEN last_study_date = CURRENT_DATE - INTERVAL '1 day' THEN current_streak_days + 1
               WHEN last_study_date = CURRENT_DATE THEN current_streak_days
               ELSE 1
             END,
             longest_streak_days = GREATEST(
               longest_streak_days,
               CASE
                 WHEN last_study_date = CURRENT_DATE - INTERVAL '1 day' THEN current_streak_days + 1
                 WHEN last_study_date = CURRENT_DATE THEN current_streak_days
                 ELSE 1
               END
             ),
             updated_at = NOW()
         WHERE user_id = $2`,
        [today, userId]
      )

      return {
        result: 'passed',
        score,
        rewards: {
          exp_gained: expRewards.totalAmount,
          coins_gained: coinRewards.totalAmount,
          exp_breakdown: {
            base: expRewards.baseAmount,
            membership_bonus: expRewards.membershipBonus,
            streak_bonus: expRewards.streakBonus,
            perfect_score_bonus: expRewards.perfectScoreBonus,
          },
          coin_breakdown: {
            base: coinRewards.baseAmount,
            membership_bonus: coinRewards.membershipBonus,
            streak_bonus: coinRewards.streakBonus,
            perfect_score_bonus: coinRewards.perfectScoreBonus,
          },
        },
        level_up: levelUpInfo.leveledUp,
        new_level: levelUpInfo.newLevel,
        levels_gained: levelUpInfo.levelsGained,
        special_rewards: questTemplate.special_rewards,
      }
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('提交任务失败:', error)
    next(error)
  }
}
