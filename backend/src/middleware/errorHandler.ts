import { Request, Response, NextFunction } from 'express'

// 自定义错误类
export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

// 错误处理中间件
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 默认错误
  let statusCode = 500
  let message = 'Internal Server Error'
  let isOperational = false

  // 如果是自定义错误
  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
    isOperational = err.isOperational
  }

  // 开发环境打印完整错误
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err)
  }

  // 返回错误响应
  res.status(statusCode).json({
    success: false,
    error: {
      code: getErrorCode(statusCode),
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
}

// 根据状态码获取错误代码
const getErrorCode = (statusCode: number): string => {
  const errorCodes: { [key: number]: string } = {
    400: 'VALIDATION_ERROR',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    429: 'RATE_LIMIT_EXCEEDED',
    500: 'INTERNAL_ERROR',
    503: 'SERVICE_UNAVAILABLE',
  }

  return errorCodes[statusCode] || 'UNKNOWN_ERROR'
}
