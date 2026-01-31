import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

// 加载环境变量
dotenv.config()

// 导入路由
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import questRoutes from './routes/questRoutes'
import aiRoutes from './routes/aiRoutes'

// 导入中间件
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFoundHandler'

// 创建 Express 应用
const app: Application = express()
const httpServer = createServer(app)

// 创建 Socket.IO 服务器
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// 中间件
app.use(helmet()) // 安全头
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json()) // 解析 JSON
app.use(express.urlencoded({ extended: true })) // 解析 URL 编码
app.use(morgan('dev')) // 日志

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/quests', questRoutes)
app.use('/api/ai', aiRoutes)

// WebSocket 连接处理
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })

  // 心跳
  socket.on('ping', () => {
    socket.emit('pong')
  })
})

// 错误处理中间件（必须放在最后）
app.use(notFoundHandler)
app.use(errorHandler)

// 启动服务器
const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  httpServer.close(() => {
    console.log('HTTP server closed')
  })
})

export { app, io }
