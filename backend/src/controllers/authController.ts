import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import { generateToken, verifyToken, extractTokenFromHeader } from '../utils/jwt'
import { validateRegisterData, validateLoginData, sanitizeInput } from '../utils/validation'
import {
  createUser,
  findUserByUsernameOrEmail,
  isUsernameExists,
  isEmailExists,
  updateLastLogin,
  verifyPassword,
  findUserById,
} from '../models/User'

/**
 * 用户注册
 * POST /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body

    // 1. 验证输入数据
    const validation = validateRegisterData({ username, email, password })
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors).join('；')
      throw new AppError(errorMessage, 400)
    }

    // 2. 清理输入数据
    const cleanUsername = sanitizeInput(username)
    const cleanEmail = sanitizeInput(email).toLowerCase()

    // 3. 检查用户名是否已存在
    const usernameExists = await isUsernameExists(cleanUsername)
    if (usernameExists) {
      throw new AppError('用户名已被使用', 409)
    }

    // 4. 检查邮箱是否已存在
    const emailExists = await isEmailExists(cleanEmail)
    if (emailExists) {
      throw new AppError('邮箱已被注册', 409)
    }

    // 5. 创建用户（包含密码加密、创建角色、初始化统计）
    const user = await createUser({
      username: cleanUsername,
      email: cleanEmail,
      password,
    })

    // 6. 生成 JWT Token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    })

    // 7. 返回成功响应
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          level: user.level,
          experience: user.experience,
          coins: user.coins,
          diamonds: user.diamonds,
          membershipTier: user.membership_tier,
          avatarUrl: user.avatar_url,
          displayName: user.display_name,
          createdAt: user.created_at,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 用户登录
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body

    // 1. 验证输入数据
    const validation = validateLoginData({ username, password })
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors).join('；')
      throw new AppError(errorMessage, 400)
    }

    // 2. 清理输入数据
    const cleanUsername = sanitizeInput(username)

    // 3. 查找用户（支持用户名或邮箱登录）
    const user = await findUserByUsernameOrEmail(cleanUsername)
    if (!user) {
      throw new AppError('用户名或密码错误', 401)
    }

    // 4. 检查用户状态
    if (user.is_banned) {
      const banMessage = user.ban_reason
        ? `账号已被封禁：${user.ban_reason}`
        : '账号已被封禁'
      throw new AppError(banMessage, 403)
    }

    if (!user.is_active) {
      throw new AppError('账号已被停用', 403)
    }

    // 5. 验证密码
    const isPasswordValid = await verifyPassword(password, user.password_hash)
    if (!isPasswordValid) {
      throw new AppError('用户名或密码错误', 401)
    }

    // 6. 更新最后登录时间
    await updateLastLogin(user.id)

    // 7. 生成 JWT Token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    })

    // 8. 返回成功响应
    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          level: user.level,
          experience: user.experience,
          coins: user.coins,
          diamonds: user.diamonds,
          membershipTier: user.membership_tier,
          avatarUrl: user.avatar_url,
          displayName: user.display_name,
          lastLoginAt: new Date(),
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 用户登出
 * POST /api/auth/logout
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 从请求头获取 token
    const token = extractTokenFromHeader(req.headers.authorization)

    if (token) {
      // TODO: 如果使用 Redis 存储会话，在这里清除 Redis 中的 token
      // 例如：await redisClient.del(`token:${token}`)
      // 或者将 token 加入黑名单
      // 例如：await redisClient.setex(`blacklist:${token}`, 7 * 24 * 60 * 60, '1')
    }

    res.json({
      success: true,
      message: '登出成功',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 刷新 Token
 * POST /api/auth/refresh
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 从请求头获取 token
    const token = extractTokenFromHeader(req.headers.authorization)
    if (!token) {
      throw new AppError('未提供 Token', 401)
    }

    // 2. 验证 token
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (error) {
      throw new AppError('Token 无效或已过期', 401)
    }

    // 3. 验证用户是否仍然存在且有效
    const user = await findUserById(decoded.userId)
    if (!user) {
      throw new AppError('用户不存在', 404)
    }

    if (user.is_banned || !user.is_active) {
      throw new AppError('账号已被停用', 403)
    }

    // 4. 生成新的 token
    const newToken = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    })

    // 5. 返回新 token
    res.json({
      success: true,
      message: 'Token 刷新成功',
      data: {
        token: newToken,
      },
    })
  } catch (error) {
    next(error)
  }
}
