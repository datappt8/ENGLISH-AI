import Anthropic from '@anthropic-ai/sdk'
import { query } from '../config/database'

// 初始化 Claude 客户端
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
})

// 对话消息接口
export interface DialogueMessage {
  role: 'user' | 'assistant'
  content: string
}

// 对话上下文接口
export interface DialogueContext {
  questId: string
  npcPersonality: string
  dialogueObjective: string
  scenarioContext: string
  userLevel: number
}

// 对话响应接口
export interface DialogueResponse {
  content: string
  suggestions: string[]
  shouldEnd: boolean
  score?: number
}

/**
 * 构建系统提示词
 * 根据任务上下文和 NPC 个性生成系统提示
 */
const buildSystemPrompt = (context: DialogueContext): string => {
  return `You are an English learning assistant acting as an NPC in an educational game.

**Your Role:**
- Character Personality: ${context.npcPersonality}
- Dialogue Objective: ${context.dialogueObjective}
- Scenario: ${context.scenarioContext}
- Student Level: ${context.userLevel}

**Your Responsibilities:**
1. Stay in character and maintain the personality described above
2. Guide the conversation toward the learning objective naturally
3. Provide gentle corrections when the student makes mistakes
4. Encourage the student and maintain a positive, supportive tone
5. Keep responses concise (2-3 sentences) to encourage back-and-forth dialogue
6. Use vocabulary and grammar appropriate for the student's level
7. If the student struggles, provide hints or rephrase questions

**Important Guidelines:**
- Always respond in English
- Be patient and encouraging
- Make learning feel like a natural conversation, not a test
- Celebrate progress and effort
- If the conversation reaches a natural conclusion or the objective is met, indicate this

Respond naturally as this character would, keeping the educational goal in mind.`
}

/**
 * 发送对话消息到 Claude API
 * @param messages - 对话历史
 * @param context - 对话上下文
 * @returns Claude 的响应
 */
export const sendMessage = async (
  messages: DialogueMessage[],
  context: DialogueContext
): Promise<DialogueResponse> => {
  try {
    const systemPrompt = buildSystemPrompt(context)

    // 调用 Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    // 提取响应内容
    const content = response.content[0]
    const responseText = content.type === 'text' ? content.text : ''

    // 分析是否应该结束对话
    const shouldEnd = responseText.toLowerCase().includes('goodbye') ||
                      responseText.toLowerCase().includes('see you') ||
                      responseText.toLowerCase().includes('conversation complete')

    // 生成学习建议（基于对话内容）
    const suggestions = generateSuggestions(messages, responseText)

    return {
      content: responseText,
      suggestions,
      shouldEnd,
    }
  } catch (error: any) {
    console.error('Claude API 调用失败:', error)
    throw new Error(`AI 对话服务错误: ${error.message}`)
  }
}

/**
 * 评估用户的对话表现
 * @param sessionId - 会话 ID
 * @param messages - 完整对话历史
 * @returns 评分和详细反馈
 */
export const evaluateDialogue = async (
  sessionId: string,
  messages: DialogueMessage[]
): Promise<{
  overallScore: number
  pronunciationScore: number
  grammarScore: number
  fluencyScore: number
  completenessScore: number
  feedback: string[]
  strengths: string[]
  improvements: string[]
}> => {
  try {
    // 构建评估提示
    const evaluationPrompt = `Please evaluate this English learning dialogue session. The student is practicing conversational English.

**Dialogue History:**
${messages.map((msg, idx) => `${idx + 1}. ${msg.role === 'user' ? 'Student' : 'Teacher'}: ${msg.content}`).join('\n')}

**Evaluation Criteria:**
1. Grammar (0-100): Correctness of grammar usage
2. Fluency (0-100): Natural flow and coherence of responses
3. Completeness (0-100): How well the student achieved the dialogue objective

Please provide:
1. Scores for each criterion (as numbers 0-100)
2. Overall score (weighted average)
3. 2-3 specific strengths
4. 2-3 areas for improvement
5. Encouraging feedback

Format your response as JSON:
{
  "grammar": <score>,
  "fluency": <score>,
  "completeness": <score>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "feedback": ["feedback1", "feedback2"]
}`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ],
    })

    // 解析响应
    const content = response.content[0]
    const responseText = content.type === 'text' ? content.text : '{}'

    // 提取 JSON（处理可能的 markdown 代码块）
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    // 计算总分（语法 30%，流畅度 35%，完整度 35%）
    const grammarScore = evaluation.grammar || 70
    const fluencyScore = evaluation.fluency || 70
    const completenessScore = evaluation.completeness || 70
    const overallScore = Math.round(
      grammarScore * 0.3 + fluencyScore * 0.35 + completenessScore * 0.35
    )

    return {
      overallScore,
      pronunciationScore: 75, // 占位符，实际需要语音识别
      grammarScore,
      fluencyScore,
      completenessScore,
      feedback: evaluation.feedback || ['Good effort!'],
      strengths: evaluation.strengths || ['Participated actively'],
      improvements: evaluation.improvements || ['Keep practicing'],
    }
  } catch (error: any) {
    console.error('对话评估失败:', error)
    // 返回默认评分
    return {
      overallScore: 70,
      pronunciationScore: 70,
      grammarScore: 70,
      fluencyScore: 70,
      completenessScore: 70,
      feedback: ['Session completed'],
      strengths: ['Participated in the dialogue'],
      improvements: ['Continue practicing regularly'],
    }
  }
}

/**
 * 生成学习建议
 * 基于对话内容提供即时反馈
 */
const generateSuggestions = (
  messages: DialogueMessage[],
  latestResponse: string
): string[] => {
  const suggestions: string[] = []

  // 如果用户消息很短，建议详细回答
  const lastUserMessage = messages.filter((m) => m.role === 'user').pop()
  if (lastUserMessage && lastUserMessage.content.split(' ').length < 5) {
    suggestions.push('Try to provide more detailed responses')
  }

  // 如果对话进行顺利，给予鼓励
  if (messages.length > 4) {
    suggestions.push('Great job keeping the conversation going!')
  }

  // 如果 AI 提出问题，提示用户回答
  if (latestResponse.includes('?')) {
    suggestions.push('The NPC asked you a question - try to answer it')
  }

  return suggestions.slice(0, 3) // 最多返回 3 条建议
}

/**
 * 保存对话历史到数据库
 */
export const saveDialogueHistory = async (
  sessionId: string,
  userId: string,
  questId: string,
  messages: DialogueMessage[]
): Promise<void> => {
  try {
    await query(
      `INSERT INTO dialogue_sessions (id, user_id, quest_id, messages, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (id)
       DO UPDATE SET messages = $4, updated_at = NOW()`,
      [sessionId, userId, questId, JSON.stringify(messages)]
    )
  } catch (error) {
    console.error('保存对话历史失败:', error)
    throw error
  }
}

/**
 * 获取对话历史
 */
export const getDialogueHistory = async (
  sessionId: string
): Promise<DialogueMessage[]> => {
  try {
    const result = await query(
      `SELECT messages FROM dialogue_sessions WHERE id = $1`,
      [sessionId]
    )

    if (result.rows.length === 0) {
      return []
    }

    return result.rows[0].messages || []
  } catch (error) {
    console.error('获取对话历史失败:', error)
    return []
  }
}
