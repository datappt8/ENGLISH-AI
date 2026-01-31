import { Router } from 'express'
import { register, login, logout, refreshToken } from '../controllers/authController'

const router = Router()

// POST /api/auth/register - 用户注册
router.post('/register', register)

// POST /api/auth/login - 用户登录
router.post('/login', login)

// POST /api/auth/logout - 用户登出
router.post('/logout', logout)

// POST /api/auth/refresh - 刷新 token
router.post('/refresh', refreshToken)

export default router
