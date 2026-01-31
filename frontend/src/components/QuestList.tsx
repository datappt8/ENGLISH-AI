import React, { useEffect, useState } from 'react'
import { getQuests, QuestListResponse } from '../services/questService'
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

// 状态颜色映射
const statusColors = {
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
}

// 状态文本映射
const statusText = {
  not_started: '未开始',
  in_progress: '进行中',
  completed: '已完成',
  failed: '失败',
}

// 区域文本映射
const zoneText: Record<string, string> = {
  starter_village: '新手村',
  forest: '森林',
  castle: '城堡',
  city: '城市',
  peak: '山峰',
}

interface QuestListProps {
  onQuestClick?: (questId: string) => void
  filterZone?: string
  filterStatus?: string
  filterDifficulty?: string
}

const QuestList: React.FC<QuestListProps> = ({
  onQuestClick,
  filterZone,
  filterStatus,
  filterDifficulty,
}) => {
  const [questData, setQuestData] = useState<QuestListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedZone, setSelectedZone] = useState<string>(filterZone || '')
  const [selectedStatus, setSelectedStatus] = useState<string>(filterStatus || '')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(filterDifficulty || '')

  // 加载任务列表
  const loadQuests = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: any = {}
      if (selectedZone) params.zone = selectedZone
      if (selectedStatus) params.status = selectedStatus
      if (selectedDifficulty) params.difficulty = selectedDifficulty

      const data = await getQuests(params)
      setQuestData(data)
    } catch (err: any) {
      setError(err.message || '加载任务列表失败')
      console.error('加载任务列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和筛选变化时重新加载
  useEffect(() => {
    loadQuests()
  }, [selectedZone, selectedStatus, selectedDifficulty])

  // 处理任务点击
  const handleQuestClick = (questId: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return
    }
    if (onQuestClick) {
      onQuestClick(questId)
    }
  }

  // 渲染加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载任务列表中...</p>
        </div>
      </div>
    )
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadQuests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  // 渲染空状态
  if (!questData || questData.quests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <p className="text-gray-600 mb-2">暂无任务</p>
          <p className="text-gray-500 text-sm">请尝试调整筛选条件</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 统计信息 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">总任务数</div>
          <div className="text-2xl font-bold text-gray-900">{questData.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-600">可接取</div>
          <div className="text-2xl font-bold text-gray-900">{questData.availableCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">进行中</div>
          <div className="text-2xl font-bold text-gray-900">{questData.inProgressCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600">已完成</div>
          <div className="text-2xl font-bold text-gray-900">{questData.completedCount}</div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 区域筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">区域</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部区域</option>
              <option value="starter_village">新手村</option>
              <option value="forest">森林</option>
              <option value="castle">城堡</option>
              <option value="city">城市</option>
              <option value="peak">山峰</option>
            </select>
          </div>

          {/* 状态筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部状态</option>
              <option value="not_started">未开始</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
            </select>
          </div>

          {/* 难度筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">难度</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
              <option value="boss">Boss</option>
            </select>
          </div>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questData.quests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onClick={() => handleQuestClick(quest.id, quest.is_unlocked)}
          />
        ))}
      </div>
    </div>
  )
}

// 任务卡片组件
interface QuestCardProps {
  quest: Quest
  onClick: () => void
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onClick }) => {
  const isLocked = !quest.is_unlocked
  const isCompleted = quest.user_status === 'completed'

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200
        ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer hover:-translate-y-1'}
        ${isCompleted ? 'border-2 border-green-400' : 'border border-gray-200'}
      `}
    >
      {/* 任务头部 */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 flex-1">{quest.title}</h3>
          {isLocked && <span className="text-2xl">🔒</span>}
          {isCompleted && <span className="text-2xl">✅</span>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* 区域标签 */}
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {zoneText[quest.zone] || quest.zone}
          </span>
          {/* 难度标签 */}
          <span className={`px-2 py-1 text-xs rounded-full border ${difficultyColors[quest.difficulty]}`}>
            {difficultyText[quest.difficulty]}
          </span>
          {/* 状态标签 */}
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[quest.user_status]}`}>
            {statusText[quest.user_status]}
          </span>
        </div>
      </div>

      {/* 任务内容 */}
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{quest.description}</p>

        {/* 任务信息 */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">📊</span>
            <span>等级要求: Lv.{quest.required_level}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">🎯</span>
            <span>及格分: {quest.passing_score}分</span>
          </div>
          {quest.user_attempts > 0 && (
            <div className="flex items-center text-sm text-gray-700">
              <span className="mr-2">🔄</span>
              <span>尝试次数: {quest.user_attempts}</span>
              {quest.user_best_score && (
                <span className="ml-2 text-blue-600 font-medium">
                  (最高: {quest.user_best_score}分)
                </span>
              )}
            </div>
          )}
        </div>

        {/* 奖励信息 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm">
              <span className="mr-1">⭐</span>
              <span className="font-medium text-yellow-600">+{quest.exp_reward} EXP</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="mr-1">💰</span>
              <span className="font-medium text-yellow-600">+{quest.coin_reward}</span>
            </div>
          </div>
        </div>

        {/* 学习目标 */}
        {quest.learning_objectives && quest.learning_objectives.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-1">学习目标:</div>
            <div className="flex flex-wrap gap-1">
              {quest.learning_objectives.slice(0, 3).map((objective, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {objective}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 锁定提示 */}
      {isLocked && (
        <div className="px-4 pb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs text-yellow-800">
            <span className="mr-1">🔒</span>
            需要完成前置任务或提升等级
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestList
