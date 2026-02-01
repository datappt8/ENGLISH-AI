import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
  getQuests,
  getQuestById,
  startQuest,
  submitQuest,
} from '../controllers/questController'

const router = Router()

// GET /api/quests - 获取任务列表
router.get('/', authenticate, getQuests)

// GET /api/quests/:questId - 获取任务详情
router.get('/:questId', authenticate, getQuestById)

// POST /api/quests/:questId/start - 开始任务
router.post('/:questId/start', authenticate, startQuest)

// POST /api/quests/:questId/submit - 提交任务
router.post('/:questId/submit', authenticate, submitQuest)

export default router
