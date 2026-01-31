import jwt from 'jsonwebtoken'

// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d' // 7天过期

// JWT Payload 接口
export interface JwtPayload {
  userId: string
  username: string
  email: string
  iat?: number
  exp?: number
}

/**
 * 生成 JWT Token
 * @param payload - Token 载荷数据
 * @returns JWT Token 字符串
 */
export const generateToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })
    return token
  } catch (error) {
    console.error('生成 Token 失败:', error)
    throw new Error('Token 生成失败')
  }
}

/**
 * 验证 JWT Token
 * @param token - JWT Token 字符串
 * @returns 解码后的 Payload
 * @throws 如果 Token 无效或过期
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token 已过期')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token 无效')
    } else {
      throw new Error('Token 验证失败')
    }
  }
}

/**
 * 解码 JWT Token（不验证签名）
 * @param token - JWT Token 字符串
 * @returns 解码后的 Payload，如果失败返回 null
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload
    return decoded
  } catch (error) {
    console.error('解码 Token 失败:', error)
    return null
  }
}

/**
 * 从请求头中提取 Token
 * @param authHeader - Authorization 请求头
 * @returns Token 字符串，如果不存在返回 null
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) {
    return null
  }

  // 支持 "Bearer <token>" 格式
  const parts = authHeader.split(' ')
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1]
  }

  // 直接返回 token
  return authHeader
}
