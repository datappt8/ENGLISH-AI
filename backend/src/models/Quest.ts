import { query, transaction } from '../config/database'
import { v4 as uuidv4 } from 'uuid'

// 任务模板接口
export interface QuestTemplate {
  id: string
  title: string
  description: string
  zone: string
  quest_order: number
  difficulty: 'easy' | 'medium' | 'hard' | 'boss'
  required_level: number
  prerequisite_quests: string[]
  quest_type: 'dialogue' | 'pronunciation' | 'listening' | 'roleplay' | 'challenge'
  npc_id: string
  dialogue_context: any
  passing_score: number
  pronunciation_weight: number
  grammar_weight: number
  fluency_weight: number
  completeness_weight: number
  exp_reward: number
  coin_reward: number
  special_rewards?: any
  time_limit_seconds?: number
  tags: string[]
  learning_objectives: string[]
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// 用户任务进度接口
export interface UserQuest {
  id: string
  user_id: string
  quest_id: string
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
  attempts: number
  best_score?: number
  completion_data?: any
  started_at?: Date
  completed_at?: Date
  created_at: Date
  updated_at: Date
}

// 任务会话接口
export interface QuestSession {
  id: string
  user_id: string
  quest_id: string
  user_quest_id: string
  session_id: string
  status: 'active' | 'completed' | 'expired' | 'abandoned'
  dialogue_history: any[]
  current_turn: number
  created_at: Date
  expires_at: Date
  completed_at?: Date
  updated_at: Date
}

// 任务列表项（包含用户进度）
export interface QuestWithProgress extends QuestTemplate {
  user_status: 'not_started' | 'in_progress' | 'completed' | 'failed'
  user_attempts: number
  user_best_score?: number
  is_unlocked: boolean
}

// 任务筛选条件
export interface QuestFilters {
  zone?: string
  status?: 'not_started' | 'in_progress' | 'completed' | 'failed'
  difficulty?: string
}

/**
 * 获取任务列表（带用户进度）
 * @param userId - 用户 ID
 * @param filters - 筛选条件
 * @returns 任务列表
 */
export const getAllQuests = async (
  userId: string,
  filters: QuestFilters = {}
): Promise<QuestWithProgress[]> => {
  try {
    let queryText = `
      SELECT
        qt.*,
        COALESCE(uq.status, 'not_started') as user_status,
        COALESCE(uq.attempts, 0) as user_attempts,
        uq.best_score as user_best_score
      FROM quest_templates qt
      LEFT JOIN user_quests uq ON qt.id = uq.quest_id AND uq.user_id = $1
      WHERE qt.is_active = true
    `
    const params: any[] = [userId]
    let paramIndex = 2

    // 添加筛选条件
    if (filters.zone) {
      queryText += ` AND qt.zone = $${paramIndex}`
      params.push(filters.zone)
      paramIndex++
    }

    if (filters.status) {
      queryText += ` AND COALESCE(uq.status, 'not_started') = $${paramIndex}`
      params.push(filters.status)
      paramIndex++
    }

    if (filters.difficulty) {
      queryText += ` AND qt.difficulty = $${paramIndex}`
      params.push(filters.difficulty)
      paramIndex++
    }

    queryText += ` ORDER BY qt.zone, qt.quest_order`

    const result = await query(queryText, params)

    // 获取用户信息以检查任务是否解锁
    const userResult = await query(
      `SELECT level FROM users WHERE id = $1`,
      [userId]
    )
    const userLevel = userResult.rows[0]?.level || 1

    // 获取用户已完成的任务列表
    const completedQuestsResult = await query(
      `SELECT quest_id FROM user_quests WHERE user_id = $1 AND status = 'completed'`,
      [userId]
    )
    const completedQuestIds = new Set(
      completedQuestsResult.rows.map((row) => row.quest_id)
    )

    // 检查每个任务是否解锁
    const questsWithUnlockStatus = result.rows.map((quest) => {
      const isLevelMet = userLevel >= quest.required_level
      const prerequisitesMet = !quest.prerequisite_quests || quest.prerequisite_quests.length === 0 || quest.prerequisite_quests.every((prereqId: string) =>
        completedQuestIds.has(prereqId)
      )
      const isUnlocked = isLevelMet && prerequisitesMet

      return {
        ...quest,
        is_unlocked: isUnlocked,
      }
    })

    return questsWithUnlockStatus
  } catch (error) {
    console.error('获取任务列表失败:', error)
    throw new Error('获取任务列表失败')
  }
}

/**
 * 获取任务详情（包含用户进度）
 * @param questId - 任务 ID
 * @param userId - 用户 ID
 * @returns 任务详情
 */
export const getQuestById = async (
  questId: string,
  userId: string
): Promise<QuestWithProgress | null> => {
  try {
    const result = await query(
      `SELECT
        qt.*,
        COALESCE(uq.status, 'not_started') as user_status,
        COALESCE(uq.attempts, 0) as user_attempts,
        uq.best_score as user_best_score
      FROM quest_templates qt
      LEFT JOIN user_quests uq ON qt.id = uq.quest_id AND uq.user_id = $2
      WHERE qt.id = $1 AND qt.is_active = true`,
      [questId, userId]
    )

    if (result.rows.length === 0) {
      return null
    }

    const quest = result.rows[0]

    // 检查任务是否解锁
    const userResult = await query(
      `SELECT level FROM users WHERE id = $1`,
      [userId]
    )
    const userLevel = userResult.rows[0]?.level || 1

    const completedQuestsResult = await query(
      `SELECT quest_id FROM user_quests WHERE user_id = $1 AND status = 'completed'`,
      [userId]
    )
    const completedQuestIds = new Set(
      completedQuestsResult.rows.map((row) => row.quest_id)
    )

    const isLevelMet = userLevel >= quest.required_level
    const prerequisitesMet = !quest.prerequisite_quests || quest.prerequisite_quests.length === 0 ||
      quest.prerequisite_quests.every((prereqId: string) =>
        completedQuestIds.has(prereqId)
      )

    return {
      ...quest,
      is_unlocked: isLevelMet && prerequisitesMet,
    }
  } catch (error) {
    console.error('获取任务详情失败:', error)
    throw new Error('获取任务详情失败')
  }
}

/**
 * 获取用户任务进度
 * @param userId - 用户 ID
 * @param questId - 任务 ID
 * @returns 用户任务进度
 */
export const getUserQuestProgress = async (
  userId: string,
  questId: string
): Promise<UserQuest | null> => {
  try {
    const result = await query(
      `SELECT * FROM user_quests WHERE user_id = $1 AND quest_id = $2`,
      [userId, questId]
    )

    return result.rows[0] || null
  } catch (error) {
    console.error('获取用户任务进度失败:', error)
    throw new Error('获取用户任务进度失败')
  }
}

/**
 * 开始任务
 * @param userId - 用户 ID
 * @param questId - 任务 ID
 * @returns 会话 ID
 */
export const startQuest = async (
  userId: string,
  questId: string
): Promise<string> => {
  try {
    const sessionId = uuidv4()

    // 检查是否已有任务记录
    const existingQuest = await getUserQuestProgress(userId, questId)

    if (existingQuest) {
      // 更新现有记录
      await query(
        `UPDATE user_quests
         SET status = 'in_progress',
             started_at = NOW(),
             attempts = attempts + 1,
             updated_at = NOW()
         WHERE user_id = $1 AND quest_id = $2`,
        [userId, questId]
      )
    } else {
      // 创建新记录
      await query(
        `INSERT INTO user_quests (user_id, quest_id, status, attempts, started_at)
         VALUES ($1, $2, 'in_progress', 1, NOW())`,
        [userId, questId]
      )
    }

    return sessionId
  } catch (error) {
    console.error('开始任务失败:', error)
    throw new Error('开始任务失败')
  }
}

/**
 * 提交任务
 * @param userId - 用户 ID
 * @param questId - 任务 ID
 * @param score - 得分
 * @param completionData - 完成数据
 * @param client - 可选的数据库客户端（用于事务）
 * @returns 是否通过
 */
export const submitQuest = async (
  userId: string,
  questId: string,
  score: number,
  completionData: any,
  client?: any
): Promise<boolean> => {
  try {
    // 获取任务模板
    const queryFn = client ? client.query.bind(client) : query
    const questTemplate = await queryFn(
      `SELECT passing_score FROM quest_templates WHERE id = $1`,
      [questId]
    )

    if (questTemplate.rows.length === 0) {
      throw new Error('任务不存在')
    }

    const passingScore = questTemplate.rows[0].passing_score
    const isPassed = score >= passingScore

    // 如果提供了 client，直接使用；否则创建新事务
    const executeInTransaction = async (txClient: any) => {
      // 获取当前最佳分数
      const currentProgress = await txClient.query(
        `SELECT best_score FROM user_quests WHERE user_id = $1 AND quest_id = $2`,
        [userId, questId]
      )

      const currentBestScore = currentProgress.rows[0]?.best_score || 0
      const newBestScore = Math.max(score, currentBestScore)

      // 更新任务进度
      await txClient.query(
        `UPDATE user_quests
         SET status = $1,
             best_score = $2,
             completion_data = $3,
             completed_at = CASE WHEN $1::varchar = 'completed' THEN NOW() ELSE completed_at END,
             updated_at = NOW()
         WHERE user_id = $4 AND quest_id = $5`,
        [
          isPassed ? 'completed' : 'failed',
          newBestScore,
          JSON.stringify(completionData),
          userId,
          questId,
        ]
      )

      // 如果通过，更新用户统计
      if (isPassed) {
        await txClient.query(
          `UPDATE user_stats
           SET total_quests_completed = total_quests_completed + 1,
               last_study_date = CURRENT_DATE,
               updated_at = NOW()
           WHERE user_id = $1`,
          [userId]
        )
      } else {
        await txClient.query(
          `UPDATE user_stats
           SET total_quests_failed = total_quests_failed + 1,
               updated_at = NOW()
           WHERE user_id = $1`,
          [userId]
        )
      }
    }

    if (client) {
      await executeInTransaction(client)
    } else {
      await transaction(executeInTransaction)
    }

    return isPassed
  } catch (error) {
    console.error('提交任务失败:', error)
    console.error('错误详情:', {
      userId,
      questId,
      score,
      hasClient: !!client,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined
    })
    throw new Error('提交任务失败')
  }
}

/**
 * 更新任务进度
 * @param userId - 用户 ID
 * @param questId - 任务 ID
 * @param data - 进度数据
 */
export const updateQuestProgress = async (
  userId: string,
  questId: string,
  data: Partial<UserQuest>
): Promise<void> => {
  try {
    const fields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    // 动态构建更新字段
    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`)
      values.push(data.status)
    }
    if (data.best_score !== undefined) {
      fields.push(`best_score = $${paramIndex++}`)
      values.push(data.best_score)
    }
    if (data.completion_data !== undefined) {
      fields.push(`completion_data = $${paramIndex++}`)
      values.push(JSON.stringify(data.completion_data))
    }

    if (fields.length === 0) {
      return
    }

    values.push(userId, questId)

    await query(
      `UPDATE user_quests
       SET ${fields.join(', ')}, updated_at = NOW()
       WHERE user_id = $${paramIndex++} AND quest_id = $${paramIndex}`,
      values
    )
  } catch (error) {
    console.error('更新任务进度失败:', error)
    throw new Error('更新任务进度失败')
  }
}

/**
 * 检查前置任务是否完成
 * @param userId - 用户 ID
 * @param questId - 任务 ID
 * @returns 是否满足前置条件
 */
export const checkQuestPrerequisites = async (
  userId: string,
  questId: string
): Promise<{ met: boolean; missing: string[] }> => {
  try {
    // 获取任务的前置要求
    const questResult = await query(
      `SELECT prerequisite_quests, required_level FROM quest_templates WHERE id = $1`,
      [questId]
    )

    if (questResult.rows.length === 0) {
      throw new Error('任务不存在')
    }

    const { prerequisite_quests, required_level } = questResult.rows[0]

    // 检查等级要求
    const userResult = await query(
      `SELECT level FROM users WHERE id = $1`,
      [userId]
    )
    const userLevel = userResult.rows[0]?.level || 1

    if (userLevel < required_level) {
      return {
        met: false,
        missing: [`需要等级 ${required_level}，当前等级 ${userLevel}`],
      }
    }

    // 检查前置任务
    if (!prerequisite_quests || prerequisite_quests.length === 0) {
      return { met: true, missing: [] }
    }

    const completedQuestsResult = await query(
      `SELECT quest_id FROM user_quests
       WHERE user_id = $1 AND status = 'completed' AND quest_id = ANY($2)`,
      [userId, prerequisite_quests]
    )

    const completedQuestIds = completedQuestsResult.rows.map((row) => row.quest_id)
    const missingQuests = prerequisite_quests.filter(
      (prereqId: string) => !completedQuestIds.includes(prereqId)
    )

    return {
      met: missingQuests.length === 0,
      missing: missingQuests,
    }
  } catch (error) {
    console.error('检查前置任务失败:', error)
    throw new Error('检查前置任务失败')
  }
}

/**
 * 创建任务会话
 * @param userId - 用户 ID
 * @param questId - 任务 ID
 * @param userQuestId - 用户任务记录 ID
 * @param sessionId - 会话 ID
 * @param expiresInHours - 会话过期时间（小时）
 * @returns 会话信息
 */
export const createQuestSession = async (
  userId: string,
  questId: string,
  userQuestId: string,
  sessionId: string,
  expiresInHours: number = 24
): Promise<QuestSession> => {
  try {
    const result = await query(
      `INSERT INTO quest_sessions (
        user_id, quest_id, user_quest_id, session_id, expires_at
      ) VALUES ($1, $2, $3, $4, NOW() + INTERVAL '${expiresInHours} hours')
      RETURNING *`,
      [userId, questId, userQuestId, sessionId]
    )

    return result.rows[0]
  } catch (error) {
    console.error('创建任务会话失败:', error)
    throw new Error('创建任务会话失败')
  }
}

/**
 * 验证任务会话
 * @param sessionId - 会话 ID
 * @param userId - 用户 ID
 * @param questId - 任务 ID
 * @returns 会话信息，如果无效则返回 null
 */
export const validateQuestSession = async (
  sessionId: string,
  userId: string,
  questId: string
): Promise<QuestSession | null> => {
  try {
    const result = await query(
      `SELECT * FROM quest_sessions
       WHERE session_id = $1
         AND user_id = $2
         AND quest_id = $3
         AND status = 'active'
         AND expires_at > NOW()`,
      [sessionId, userId, questId]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('验证任务会话失败:', error)
    throw new Error('验证任务会话失败')
  }
}

/**
 * 完成任务会话
 * @param sessionId - 会话 ID
 */
export const completeQuestSession = async (sessionId: string): Promise<void> => {
  try {
    await query(
      `UPDATE quest_sessions
       SET status = 'completed', completed_at = NOW()
       WHERE session_id = $1`,
      [sessionId]
    )
  } catch (error) {
    console.error('完成任务会话失败:', error)
    throw new Error('完成任务会话失败')
  }
}

/**
 * 更新会话对话历史
 * @param sessionId - 会话 ID
 * @param dialogueEntry - 对话条目
 */
export const updateSessionDialogue = async (
  sessionId: string,
  dialogueEntry: any
): Promise<void> => {
  try {
    await query(
      `UPDATE quest_sessions
       SET dialogue_history = dialogue_history || $1::jsonb,
           current_turn = current_turn + 1
       WHERE session_id = $2`,
      [JSON.stringify([dialogueEntry]), sessionId]
    )
  } catch (error) {
    console.error('更新会话对话历史失败:', error)
    throw new Error('更新会话对话历史失败')
  }
}

/**
 * 清理过期会话
 */
export const cleanupExpiredSessions = async (): Promise<number> => {
  try {
    const result = await query(
      `UPDATE quest_sessions
       SET status = 'expired'
       WHERE status = 'active' AND expires_at < NOW()
       RETURNING id`
    )

    return result.rows.length
  } catch (error) {
    console.error('清理过期会话失败:', error)
    throw new Error('清理过期会话失败')
  }
}
