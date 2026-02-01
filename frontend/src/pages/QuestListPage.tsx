import { useState, useEffect } from 'react'
import { getQuests, startQuest } from '../services/questService'
import type { Quest } from '../types'
import './QuestListPage.css'

interface QuestListData {
  quests: Quest[]
  total: number
  availableCount: number
  inProgressCount: number
  completedCount: number
}

function QuestListPage() {
  const [questData, setQuestData] = useState<QuestListData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedZone, setSelectedZone] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    loadQuests()
  }, [selectedZone, selectedStatus])

  const loadQuests = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: any = {}
      if (selectedZone !== 'all') params.zone = selectedZone
      if (selectedStatus !== 'all') params.status = selectedStatus

      const data = await getQuests(params)
      setQuestData(data)
    } catch (err: any) {
      setError(err.message || '加载任务失败')
      console.error('加载任务失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuest = async (questId: string) => {
    try {
      const result = await startQuest(questId)
      alert(`任务已开始！\n会话ID: ${result.session_id}`)
      loadQuests() // 重新加载任务列表
    } catch (err: any) {
      alert(`开始任务失败: ${err.message}`)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50'
      case 'medium': return '#ff9800'
      case 'hard': return '#f44336'
      case 'boss': return '#9c27b0'
      default: return '#757575'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not_started': return '🔵 未开始'
      case 'in_progress': return '🟡 进行中'
      case 'completed': return '🟢 已完成'
      case 'failed': return '🔴 失败'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="quest-list-page">
        <div className="loading">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quest-list-page">
        <div className="error">
          <h3>❌ 加载失败</h3>
          <p>{error}</p>
          <button onClick={loadQuests}>重试</button>
        </div>
      </div>
    )
  }

  return (
    <div className="quest-list-page">
      <div className="page-header">
        <h1>📋 任务列表</h1>
        <div className="stats">
          <span className="stat">总计: {questData?.total || 0}</span>
          <span className="stat">可用: {questData?.availableCount || 0}</span>
          <span className="stat">进行中: {questData?.inProgressCount || 0}</span>
          <span className="stat">已完成: {questData?.completedCount || 0}</span>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>区域:</label>
          <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
            <option value="all">全部</option>
            <option value="starter_village">新手村</option>
            <option value="forest">森林</option>
            <option value="castle">城堡</option>
            <option value="city">城市</option>
            <option value="peak">山峰</option>
          </select>
        </div>

        <div className="filter-group">
          <label>状态:</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">全部</option>
            <option value="not_started">未开始</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
      </div>

      <div className="quest-list">
        {questData?.quests.map((quest) => (
          <div key={quest.id} className="quest-card">
            <div className="quest-header">
              <h3>{quest.title}</h3>
              <span
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(quest.difficulty) }}
              >
                {quest.difficulty}
              </span>
            </div>

            <p className="quest-description">{quest.description}</p>

            <div className="quest-info">
              <span className="info-item">📍 {quest.zone}</span>
              <span className="info-item">🎯 {quest.quest_type}</span>
              <span className="info-item">⭐ +{quest.exp_reward} EXP</span>
              <span className="info-item">💰 +{quest.coin_reward} 金币</span>
            </div>

            <div className="quest-footer">
              <span className="status-badge">{getStatusBadge(quest.user_status || 'not_started')}</span>

              {quest.user_status === 'not_started' && (
                <button
                  className="start-btn"
                  onClick={() => handleStartQuest(quest.id)}
                >
                  开始任务
                </button>
              )}

              {quest.user_status === 'in_progress' && (
                <button className="continue-btn">继续任务</button>
              )}

              {quest.user_status === 'completed' && (
                <button className="review-btn">查看详情</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {questData?.quests.length === 0 && (
        <div className="empty-state">
          <p>😔 没有找到任务</p>
        </div>
      )}
    </div>
  )
}

export default QuestListPage
