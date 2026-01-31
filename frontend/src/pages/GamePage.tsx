import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import './GamePage.css'

function GamePage() {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return

    // Phaser 游戏配置
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: gameRef.current,
      backgroundColor: '#87CEEB',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    }

    phaserGameRef.current = new Phaser.Game(config)

    function preload(this: Phaser.Scene) {
      // TODO: 加载游戏资源
      console.log('Preloading assets...')
    }

    function create(this: Phaser.Scene) {
      // 临时显示文本
      this.add.text(640, 360, 'English Quest\n游戏场景开发中...', {
        fontSize: '32px',
        color: '#ffffff',
        align: 'center',
      }).setOrigin(0.5)

      this.add.text(640, 450, '点击屏幕开始对话', {
        fontSize: '20px',
        color: '#ffff00',
        align: 'center',
      }).setOrigin(0.5)
    }

    function update(this: Phaser.Scene) {
      // 游戏循环更新
    }

    // 清理函数
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [])

  return (
    <div className="game-page">
      <div className="game-header">
        <div className="user-info">
          <span className="username">玩家名称</span>
          <span className="level">Lv 1</span>
        </div>
        <div className="game-stats">
          <span className="stat">💰 100</span>
          <span className="stat">💎 0</span>
          <span className="stat">⭐ 0 EXP</span>
        </div>
      </div>

      <div ref={gameRef} className="game-container" />

      <div className="game-controls">
        <button className="control-btn">🎤 开始对话</button>
        <button className="control-btn">📋 任务列表</button>
        <button className="control-btn">👤 个人资料</button>
        <button className="control-btn">⚙️ 设置</button>
      </div>
    </div>
  )
}

export default GamePage
