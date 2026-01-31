import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
  sendDialogueMessage,
  endDialogueSession,
} from '../controllers/aiController'

const router = Router()

// 所有 AI 路由都需要认证
router.use(authenticate)

// POST /api/ai/dialogue - 发送对话消息
router.post('/dialogue', sendDialogueMessage)

// POST /api/ai/dialogue/:sessionId/end - 结束对话会话
router.post('/dialogue/:sessionId/end', endDialogueSession)

export default router
