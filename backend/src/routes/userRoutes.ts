import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
  getCurrentUser,
  updateUserProfile,
  getUserStats,
} from '../controllers/userController'

const router = Router()

// 所有用户路由都需要认证
router.use(authenticate)

// GET /api/users/me - 获取当前用户信息
router.get('/me', getCurrentUser)

// PATCH /api/users/me - 更新用户资料
router.patch('/me', updateUserProfile)

// GET /api/users/me/stats - 获取用户统计
router.get('/me/stats', getUserStats)

export default router
