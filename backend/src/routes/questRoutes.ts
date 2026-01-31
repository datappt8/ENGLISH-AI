import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
  getQuests,
  getQuestById,
  startQuest,
  submitQuest,
} from '../controllers/questController'

const router = Router()

// 所有任务路由都需要认证
router.use(authenticate)

// GET /api/quests - 获取任务列表
router.get('/', getQuests)

// GET /api/quests/:questId - 获取任务详情
router.get('/:questId', getQuestById)

// POST /api/quests/:questId/start - 开始任务
router.post('/:questId/start', startQuest)

// POST /api/quests/:questId/submit - 提交任务
router.post('/:questId/submit', submitQuest)

export default router
