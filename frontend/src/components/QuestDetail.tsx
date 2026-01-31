import React, { useEffect, useState } from 'react'
import { getQuestById, startQuest, QuestDetailResponse, StartQuestResponse } from '../services/questService'
import type { Quest } from '../types'

// 难度颜色映射
const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  hard: 'bg-orange-100 text-orange-800 border-orange-300',
  boss: 'bg-red-100 text-red-800 border-red-300',
}

// 难度文本映射
const difficultyText = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
  boss: 'Boss',
}

// 任务类型文本映射
const questTypeText = {
  dialogue: '对话练习',
  pronunciation: '发音练习',
  listening: '听力练习',
  roleplay: '角色扮演',
  challenge: '挑战任务',
}

// 区域文本映射
const zoneText: Record<string, string> = {
  starter_village: '新手村',
  forest: '森林',
  castle: '城堡',
  city: '城市',
  peak: '山峰',
}

interface QuestDetailProps {
  questId: string
  onStartQuest?: (questId: string, sessionId: string) => void
  onBack?: () => void
}

const QuestDetail: React.FC<QuestDetailProps> = ({ questId, onStartQuest, onBack }) => {
  const [questDetail, setQuestDetail] = useState<QuestDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)

  // 加载任务详情
  const loadQuestDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getQuestById(questId)
      setQuestDetail(data)
    } catch (err: any) {
      setError(err.message || '加载任务详情失败')
      console.error('加载任务详情失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuestDetail()
  }, [questId])

  // 处理开始任务
  const handleStartQuest = async () => {
    if (!questDetail || starting) return

    // 检查是否解锁
    if (!questDetail.quest.is_unlocked) {
      alert('任务未解锁，请先完成前置任务或提升等级')
      return
    }

    // 检查是否已完成
    if (questDetail.quest.user_status === 'completed') {
      alert('任务已完成')
      return
    }

    try {
      setStarting(true)
      const response: StartQuestResponse = await startQuest(questId)

      if (onStartQuest) {
        onStartQuest(questId, response.session_id)
      }
    } catch (err: any) {
      alert(err.message || '开始任务失败')
      console.error('开始任务失败:', err)
    } finally {
      setStarting(false)
    }
  }

  // 渲染加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载任务详情中...</p>
        </div>
      </div>
    )
  }

  // 渲染错误状态
  if (error || !questDetail) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error || '任务不存在'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadQuestDetail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重试
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                返回
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const { quest, prerequisites } = questDetail
  const isLocked = !quest.is_unlocked
  const isCompleted = quest.user_status === 'completed'
  const isInProgress = quest.user_status === 'in_progress'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 返回按钮 */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span className="mr-2">←</span>
          <span>返回任务列表</span>
        </button>
      )}

      {/* 任务头部 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{quest.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {zoneText[quest.zone] || quest.zone}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm border ${difficultyColors[quest.difficulty]}`}>
                  {difficultyText[quest.difficulty]}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {questTypeText[quest.quest_type]}
                </span>
              </div>
            </div>
            <div className="text-right">
              {isLocked && <div className="text-5xl">🔒</div>}
              {isCompleted && <div className="text-5xl">✅</div>}
              {isInProgress && <div className="text-5xl">⏳</div>}
            </div>
          </div>

          {/* 奖励信息 */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center">
              <span className="text-2xl mr-2">⭐</span>
              <div>
                <div className="text-sm opacity-80">经验值</div>
                <div className="text-xl font-bold">+{quest.exp_reward}</div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">💰</span>
              <div>
                <div className="text-sm opacity-80">金币</div>
                <div className="text-xl font-bold">+{quest.coin_reward}</div>
              </div>
            </div>
            {quest.special_rewards && (
              <div className="flex items-center">
                <span className="text-2xl mr-2">🎁</span>
                <div>
                  <div className="text-sm opacity-80">特殊奖励</div>
                  <div className="text-xl font-bold">有</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 任务描述 */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">任务描述</h2>
          <p className="text-gray-700 leading-relaxed">{quest.description}</p>
        </div>
      </div>

      {/* 任务要求 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">任务要求</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl mr-3">📊</span>
            <div>
              <div className="text-sm text-gray-600">等级要求</div>
              <div className="text-lg font-semibold text-gray-900">Lv.{quest.required_level}</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <span className="text-2xl mr-3">🎯</span>
            <div>
              <div className="text-sm text-gray-600">及格分数</div>
              <div className="text-lg font-semibold text-gray-900">{quest.passing_score}分</div>
            </div>
          </div>
          {quest.time_limit_seconds && (
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl mr-3">⏱️</span>
              <div>
                <div className="text-sm text-gray-600">时间限制</div>
                <div className="text-lg font-semibold text-gray-900">
                  {Math.floor(quest.time_limit_seconds / 60)}分钟
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <span className="text-2xl mr-3">🔄</span>
            <div>
              <div className="text-sm text-gray-600">已尝试次数</div>
              <div className="text-lg font-semibold text-gray-900">{quest.user_attempts}次</div>
            </div>
          </div>
        </div>

        {/* 最高分数 */}
        {quest.user_best_score !== undefined && quest.user_best_score !== null && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏆</span>
                <div>
                  <div className="text-sm text-gray-600">历史最高分</div>
                  <div className="text-2xl font-bold text-orange-600">{quest.user_best_score}分</div>
                </div>
              </div>
              {quest.user_best_score >= quest.passing_score && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  已通过
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 评分标准 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">评分标准</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">发音准确度</span>
            <span className="font-semibold text-blue-600">{(quest.pronunciation_weight * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">语法正确性</span>
            <span className="font-semibold text-blue-600">{(quest.grammar_weight * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">流畅度</span>
            <span className="font-semibold text-blue-600">{(quest.fluency_weight * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">完整度</span>
            <span className="font-semibold text-blue-600">{(quest.completeness_weight * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* 学习目标 */}
      {quest.learning_objectives && quest.learning_objectives.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">学习目标</h2>
          <ul className="space-y-2">
            {quest.learning_objectives.map((objective, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* NPC 信息 */}
      {quest.dialogue_context && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">任务场景</h2>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <p className="text-gray-700 mb-3">{quest.dialogue_context.scenario}</p>
            {quest.dialogue_context.npc_personality && (
              <div className="flex items-start">
                <span className="text-purple-600 font-medium mr-2">NPC性格:</span>
                <span className="text-gray-700">{quest.dialogue_context.npc_personality}</span>
              </div>
            )}
            {quest.dialogue_context.objectives && quest.dialogue_context.objectives.length > 0 && (
              <div className="mt-3">
                <div className="text-purple-600 font-medium mb-2">对话目标:</div>
                <ul className="space-y-1">
                  {quest.dialogue_context.objectives.map((obj: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-gray-700">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 前置条件提示 */}
      {!prerequisites.met && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <div className="flex items-start">
            <span className="text-3xl mr-4">🔒</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">任务未解锁</h3>
              <p className="text-yellow-800 mb-3">需要满足以下条件才能开始此任务：</p>
              <ul className="space-y-1">
                {prerequisites.missing.map((condition, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span className="text-yellow-800">{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              返回
            </button>
          )}
          <button
            onClick={handleStartQuest}
            disabled={isLocked || starting}
            className={`
              flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${
                isLocked
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isCompleted
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
              }
              ${starting ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            {starting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                启动中...
              </span>
            ) : isCompleted ? (
              '再次挑战'
            ) : isInProgress ? (
              '继续任务'
            ) : (
              '开始任务'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestDetail
