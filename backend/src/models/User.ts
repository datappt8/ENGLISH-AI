import { query, transaction } from '../config/database'
import bcrypt from 'bcrypt'

// 用户接口
export interface User {
  id: string
  username: string
  email: string
  password_hash: string
  membership_tier: 'free' | 'basic' | 'premium' | 'vip'
  membership_expires_at?: Date
  level: number
  experience: number
  coins: number
  diamonds: number
  avatar_url?: string
  display_name?: string
  bio?: string
  is_email_verified: boolean
  is_active: boolean
  is_banned: boolean
  ban_reason?: string
  banned_until?: Date
  created_at: Date
  updated_at: Date
  last_login_at?: Date
}

// 创建用户时的数据接口
export interface CreateUserData {
  username: string
  email: string
  password: string
}

// 用户返回数据（不包含密码）
export type UserWithoutPassword = Omit<User, 'password_hash'>

/**
 * 创建新用户
 * @param userData - 用户数据
 * @returns 创建的用户信息（不含密码）
 */
export const createUser = async (userData: CreateUserData): Promise<UserWithoutPassword> => {
  const { username, email, password } = userData

  // 使用事务确保数据一致性
  const result = await transaction(async (client) => {
    // 1. 加密密码
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // 2. 创建用户记录
    const userResult = await client.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, membership_tier, membership_expires_at,
                 level, experience, coins, diamonds, avatar_url, display_name, bio,
                 is_email_verified, is_active, is_banned, ban_reason, banned_until,
                 created_at, updated_at, last_login_at`,
      [username.trim(), email.trim().toLowerCase(), passwordHash]
    )

    const user = userResult.rows[0]

    // 3. 创建角色记录
    await client.query(
      `INSERT INTO characters (user_id, character_name, character_class)
       VALUES ($1, $2, $3)`,
      [user.id, username, 'adventurer']
    )

    // 4. 初始化用户统计记录
    await client.query(
      `INSERT INTO user_stats (user_id)
       VALUES ($1)`,
      [user.id]
    )

    return user
  })

  return result
}

/**
 * 根据用户名查找用户
 * @param username - 用户名
 * @returns 用户信息（包含密码哈希）
 */
export const findUserByUsername = async (username: string): Promise<User | null> => {
  const result = await query(
    `SELECT * FROM users WHERE username = $1`,
    [username.trim()]
  )

  return result.rows[0] || null
}

/**
 * 根据邮箱查找用户
 * @param email - 邮箱地址
 * @returns 用户信息（包含密码哈希）
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query(
    `SELECT * FROM users WHERE email = $1`,
    [email.trim().toLowerCase()]
  )

  return result.rows[0] || null
}

/**
 * 根据用户名或邮箱查找用户
 * @param usernameOrEmail - 用户名或邮箱
 * @returns 用户信息（包含密码哈希）
 */
export const findUserByUsernameOrEmail = async (
  usernameOrEmail: string
): Promise<User | null> => {
  const input = usernameOrEmail.trim()

  const result = await query(
    `SELECT * FROM users WHERE username = $1 OR email = $2`,
    [input, input.toLowerCase()]
  )

  return result.rows[0] || null
}

/**
 * 根据 ID 查找用户
 * @param userId - 用户 ID
 * @returns 用户信息（不含密码）
 */
export const findUserById = async (userId: string): Promise<UserWithoutPassword | null> => {
  const result = await query(
    `SELECT id, username, email, membership_tier, membership_expires_at,
            level, experience, coins, diamonds, avatar_url, display_name, bio,
            is_email_verified, is_active, is_banned, ban_reason, banned_until,
            created_at, updated_at, last_login_at
     FROM users
     WHERE id = $1`,
    [userId]
  )

  return result.rows[0] || null
}

/**
 * 更新用户最后登录时间
 * @param userId - 用户 ID
 */
export const updateLastLogin = async (userId: string): Promise<void> => {
  await query(
    `UPDATE users SET last_login_at = NOW() WHERE id = $1`,
    [userId]
  )
}

/**
 * 验证密码
 * @param plainPassword - 明文密码
 * @param hashedPassword - 哈希密码
 * @returns 是否匹配
 */
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword)
  } catch (error) {
    console.error('密码验证失败:', error)
    return false
  }
}

/**
 * 检查用户名是否已存在
 * @param username - 用户名
 * @returns 是否存在
 */
export const isUsernameExists = async (username: string): Promise<boolean> => {
  const result = await query(
    `SELECT EXISTS(SELECT 1 FROM users WHERE username = $1) as exists`,
    [username.trim()]
  )

  return result.rows[0].exists
}

/**
 * 检查邮箱是否已存在
 * @param email - 邮箱地址
 * @returns 是否存在
 */
export const isEmailExists = async (email: string): Promise<boolean> => {
  const result = await query(
    `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists`,
    [email.trim().toLowerCase()]
  )

  return result.rows[0].exists
}

/**
 * 更新用户资料
 * @param userId - 用户 ID
 * @param updates - 更新的字段
 * @returns 更新后的用户信息
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Pick<User, 'display_name' | 'bio' | 'avatar_url'>>
): Promise<UserWithoutPassword | null> => {
  const fields: string[] = []
  const values: any[] = []
  let paramIndex = 1

  // 动态构建更新字段
  if (updates.display_name !== undefined) {
    fields.push(`display_name = $${paramIndex++}`)
    values.push(updates.display_name)
  }
  if (updates.bio !== undefined) {
    fields.push(`bio = $${paramIndex++}`)
    values.push(updates.bio)
  }
  if (updates.avatar_url !== undefined) {
    fields.push(`avatar_url = $${paramIndex++}`)
    values.push(updates.avatar_url)
  }

  if (fields.length === 0) {
    return findUserById(userId)
  }

  values.push(userId)

  const result = await query(
    `UPDATE users
     SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex}
     RETURNING id, username, email, membership_tier, membership_expires_at,
               level, experience, coins, diamonds, avatar_url, display_name, bio,
               is_email_verified, is_active, is_banned, ban_reason, banned_until,
               created_at, updated_at, last_login_at`,
    values
  )

  return result.rows[0] || null
}
