import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { StarterVillageScene } from '../game/scenes/StarterVillageScene'
import { MicrophoneSetup } from '../components/MicrophoneSetup'
import './GamePage.css'

function GamePage() {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)
  const [showMicSetup, setShowMicSetup] = useState(true)
  const [userInfo] = useState({
    username: '玩家',
    level: 1,
    exp: 0,
    coins: 100,
    diamonds: 0
  })

  useEffect(() => {
    // 检查用户是否登录
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登录，跳转到登录页
      alert('请先登录后再进入游戏')
      window.location.href = '/login'
      return
    }

    // 从localStorage获取用户信息
    // TODO: 从API获取用户信息
    // 暂时使用默认值
  }, [])

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current || showMicSetup) return

    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // 初始化游戏的函数
    const initGame = () => {
      if (phaserGameRef.current) return // 避免重复初始化

      // Phaser 游戏配置
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        parent: gameRef.current!,
        backgroundColor: '#87CEEB',
        scene: [StarterVillageScene],
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 1280,
          height: 720,
        },
        input: {
          activePointers: 3, // 支持多点触控
        },
      }

      phaserGameRef.current = new Phaser.Game(config)
      console.log('✅ 游戏初始化完成')
    }

    // 移动端：显示横屏提示
    if (isMobile) {
      // 创建全屏按钮（移动端）
      const fullscreenBtn = document.createElement('button')
      fullscreenBtn.id = 'fullscreen-toggle-btn'
      fullscreenBtn.innerHTML = '⛶'
      fullscreenBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
        touch-action: manipulation;
      `

      fullscreenBtn.onclick = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const isFullscreen = !!(document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement)

        if (!isFullscreen) {
          // 进入全屏
          const elem = document.documentElement
          try {
            if (elem.requestFullscreen) {
              await elem.requestFullscreen()
            } else if ((elem as any).webkitRequestFullscreen) {
              await (elem as any).webkitRequestFullscreen()
            } else if ((elem as any).mozRequestFullScreen) {
              await (elem as any).mozRequestFullScreen()
            } else if ((elem as any).msRequestFullscreen) {
              await (elem as any).msRequestFullscreen()
            }
            fullscreenBtn.innerHTML = '✕'

            // 尝试锁定横屏
            if (screen.orientation && screen.orientation.lock) {
              try {
                await screen.orientation.lock('landscape')
              } catch (err) {
                console.log('无法锁定横屏:', err)
              }
            }
          } catch (err) {
            console.log('无法进入全屏:', err)
          }
        } else {
          // 退出全屏
          if (document.exitFullscreen) {
            await document.exitFullscreen()
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen()
          } else if ((document as any).mozCancelFullScreen) {
            await (document as any).mozCancelFullScreen()
          } else if ((document as any).msExitFullscreen) {
            await (document as any).msExitFullscreen()
          }
          fullscreenBtn.innerHTML = '⛶'
        }
      }

      document.body.appendChild(fullscreenBtn)

      // 监听全屏变化
      const handleFullscreenChange = () => {
        const isFullscreen = !!(document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement)

        if (fullscreenBtn) {
          fullscreenBtn.innerHTML = isFullscreen ? '✕' : '⛶'
        }
      }

      document.addEventListener('fullscreenchange', handleFullscreenChange)
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.addEventListener('mozfullscreenchange', handleFullscreenChange)
      document.addEventListener('MSFullscreenChange', handleFullscreenChange)

      // 检查当前方向
      const isPortrait = window.innerHeight > window.innerWidth

      if (isPortrait) {
        // 创建横屏提示遮罩
        const orientationHint = document.createElement('div')
        orientationHint.id = 'orientation-hint'
        orientationHint.innerHTML = `
          <div style="text-align: center;">
            <div style="font-size: 60px; margin-bottom: 20px;">📱</div>
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">请横屏游戏</div>
            <div style="font-size: 16px; color: #ccc;">旋转手机以获得最佳体验</div>
            <div style="font-size: 14px; color: #999; margin-top: 20px;">2秒后自动尝试横屏...</div>
          </div>
        `
        orientationHint.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          font-family: Arial, sans-serif;
        `
        document.body.appendChild(orientationHint)

        // 2秒后自动尝试横屏
        setTimeout(async () => {
          try {
            // 尝试进入全屏
            const elem = document.documentElement
            if (elem.requestFullscreen) {
              await elem.requestFullscreen()
            } else if ((elem as any).webkitRequestFullscreen) {
              await (elem as any).webkitRequestFullscreen()
            } else if ((elem as any).mozRequestFullScreen) {
              await (elem as any).mozRequestFullScreen()
            } else if ((elem as any).msRequestFullscreen) {
              await (elem as any).msRequestFullscreen()
            }
            console.log('✅ 已进入全屏')
          } catch (err) {
            console.log('⚠️ 无法自动进入全屏:', err)
          }

          // 尝试锁定横屏
          try {
            if (screen.orientation && screen.orientation.lock) {
              await screen.orientation.lock('landscape')
              console.log('✅ 已锁定横屏')
            }
          } catch (err) {
            console.log('⚠️ 无法自动锁定横屏:', err)
          }

          // 等待一小段时间让方向变化生效
          setTimeout(() => {
            const isNowPortrait = window.innerHeight > window.innerWidth
            if (!isNowPortrait) {
              // 已经横屏，移除提示并初始化游戏
              if (orientationHint.parentNode) {
                orientationHint.remove()
              }
              initGame()
            } else {
              // 仍然是竖屏，也初始化游戏（用户可能手动旋转）
              initGame()
            }
          }, 500)
        }, 2000)

        // 监听方向变化
        const handleOrientationChange = () => {
          const isNowPortrait = window.innerHeight > window.innerWidth
          if (!isNowPortrait && orientationHint.parentNode) {
            // 已经横屏，移除提示并初始化游戏
            orientationHint.remove()
            initGame()
          }
        }

        window.addEventListener('resize', handleOrientationChange)
        window.addEventListener('orientationchange', handleOrientationChange)

        // 清理函数
        return () => {
          window.removeEventListener('resize', handleOrientationChange)
          window.removeEventListener('orientationchange', handleOrientationChange)
          document.removeEventListener('fullscreenchange', handleFullscreenChange)
          document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
          document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
          document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
          if (orientationHint.parentNode) {
            orientationHint.remove()
          }
          if (fullscreenBtn.parentNode) {
            fullscreenBtn.remove()
          }
          if (phaserGameRef.current) {
            phaserGameRef.current.destroy(true)
            phaserGameRef.current = null
          }
        }
      } else {
        // 已经是横屏，直接初始化游戏
        initGame()

        // 清理函数
        return () => {
          document.removeEventListener('fullscreenchange', handleFullscreenChange)
          document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
          document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
          document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
          if (fullscreenBtn.parentNode) {
            fullscreenBtn.remove()
          }
          if (phaserGameRef.current) {
            phaserGameRef.current.destroy(true)
            phaserGameRef.current = null
          }
        }
      }
    } else {
      // 桌面端，直接初始化游戏
      initGame()
    }

    // 清理函数（桌面端或移动端已横屏的情况）
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
      const btn = document.getElementById('fullscreen-toggle-btn')
      if (btn) btn.remove()
    }
  }, [showMicSetup])

  const handleMicSetupComplete = () => {
    setShowMicSetup(false)
  }

  if (showMicSetup) {
    return <MicrophoneSetup onComplete={handleMicSetupComplete} />
  }

  const handleStartDialogue = () => {
    alert('💡 提示：\n\n请在游戏画面中点击NPC（村长喵喵、面包师或图书管理员）来开始对话！\n\n使用方向键 ↑↓←→ 移动角色')
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
