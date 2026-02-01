import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { StarterVillageScene } from '../game/scenes/StarterVillageScene'
import './GamePage.css'

function GamePage() {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)
  const [userInfo, setUserInfo] = useState({
    username: '玩家',
    level: 1,
    exp: 0,
    coins: 100,
    diamonds: 0
  })

  useEffect(() => {
    // 从localStorage获取用户信息
    const token = localStorage.getItem('token')
    if (token) {
      // TODO: 从API获取用户信息
      // 暂时使用默认值
    }
  }, [])

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return

    // Phaser 游戏配置
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: gameRef.current,
      backgroundColor: '#87CEEB',
      scene: [StarterVillageScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    }

    phaserGameRef.current = new Phaser.Game(config)

    // 清理函数
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [])

  const handleStartDialogue = () => {
    console.log('开始对话')
    // TODO: 实现对话功能
  }

  const handleShowQuests = () => {
    window.location.href = '/quests'
  }

  const handleShowProfile = () => {
    window.location.href = '/profile'
  }

  const handleSettings = () => {
    console.log('打开设置')
    // TODO: 实现设置功能
  }

  return (
    <div className="game-page">
      <div className="game-header">
        <div className="user-info">
          <span className="username">{userInfo.username}</span>
          <span className="level">Lv {userInfo.level}</span>
        </div>
        <div className="game-stats">
          <span className="stat">💰 {userInfo.coins}</span>
          <span className="stat">💎 {userInfo.diamonds}</span>
          <span className="stat">⭐ {userInfo.exp} EXP</span>
        </div>
      </div>

      <div ref={gameRef} className="game-container" />

      <div className="game-controls">
        <button className="control-btn" onClick={handleStartDialogue}>🎤 开始对话</button>
        <button className="control-btn" onClick={handleShowQuests}>📋 任务列表</button>
        <button className="control-btn" onClick={handleShowProfile}>👤 个人资料</button>
        <button className="control-btn" onClick={handleSettings}>⚙️ 设置</button>
      </div>
    </div>
  )
}

export default GamePage
