import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'

// 扩展 Request 类型以包含 user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        username: string
        membershipTier: string
      }
    }
  }
}

// JWT 认证中间件
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('未提供认证令牌', 401)
    }

    const token = authHeader.substring(7) // 移除 "Bearer " 前缀

    // 验证 token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured')
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      user_id: string
      username: string
      membership_tier: string
    }

    // 将用户信息附加到请求对象
    req.user = {
      userId: decoded.user_id,
      username: decoded.username,
      membershipTier: decoded.membership_tier,
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('无效的认证令牌', 401))
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('认证令牌已过期', 401))
    } else {
      next(error)
    }
  }
}

// 可选认证中间件（不强制要求登录）
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const jwtSecret = process.env.JWT_SECRET
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as {
          user_id: string
          username: string
          membership_tier: string
        }
        req.user = {
          userId: decoded.user_id,
          username: decoded.username,
          membershipTier: decoded.membership_tier,
        }
      }
    }
    next()
  } catch (error) {
    // 忽略认证错误，继续处理请求
    next()
  }
}
