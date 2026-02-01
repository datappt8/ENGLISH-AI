import Phaser from 'phaser'
import { chat } from '../../services/dialogueService'
import { getVoiceManager } from './VoiceManager'

/**
 * 对话管理器
 * 处理游戏内的NPC对话和AI交互
 * 支持文本和语音输入/输出
 */
export class DialogueManager {
  private scene: Phaser.Scene
  private dialogueBox?: Phaser.GameObjects.Graphics
  private dialogueText?: Phaser.GameObjects.Text
  private npcNameText?: Phaser.GameObjects.Text
  private optionsContainer?: Phaser.GameObjects.Container
  private voiceButton?: Phaser.GameObjects.Container
  private isActive: boolean = false
  private currentNPC?: string
  private conversationHistory: Array<{ role: string; content: string }> = []
  private voiceManager = getVoiceManager()
  private isVoiceEnabled: boolean = true
  private domButtonsContainer?: HTMLDivElement

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /**
   * 开始与NPC对话
   */
  async startDialogue(npcName: string, questId?: string) {
    if (this.isActive) return

    this.isActive = true
    this.currentNPC = npcName
    this.conversationHistory = []

    // 创建对话框UI
    this.createDialogueUI()

    // 获取NPC的初始问候语
    const greeting = this.getNPCGreeting(npcName, questId)
    this.showNPCMessage(greeting)

    // 发送到AI获取回复
    await this.sendToAI(greeting, questId)
  }

  /**
   * 创建对话框UI
   */
  private createDialogueUI() {
    // 获取游戏配置的尺寸（不是实际屏幕尺寸）
    // 使用 game.config 获取游戏的逻辑尺寸，这是UI坐标系统使用的尺寸
    const cam = this.scene.cameras.main
    const screenWidth = this.scene.scale.width  // 游戏逻辑宽度 (1280)
    const screenHeight = this.scene.scale.height // 游戏逻辑高度 (720)

    // 调试信息：打印实际尺寸
    console.log('=== 对话框UI创建 ===')
    console.log('游戏逻辑尺寸:', screenWidth, 'x', screenHeight)
    console.log('相机尺寸:', cam.width, 'x', cam.height)
    console.log('画布实际尺寸:', this.scene.game.canvas.width, 'x', this.scene.game.canvas.height)
    console.log('画布显示尺寸:', this.scene.game.canvas.clientWidth, 'x', this.scene.game.canvas.clientHeight)
    console.log('缩放比例:', this.scene.scale.displayScale)

    // 对话框尺寸 - 根据屏幕宽度自适应
    const width = Math.min(900, screenWidth * 0.85) // 使用屏幕宽度的85%
    const height = 180
    const x = (screenWidth - width) / 2 // 水平居中
    const y = screenHeight - height - 30 // 距离底部30px

    // 对话框背景
    this.dialogueBox = this.scene.add.graphics()
    this.dialogueBox.fillStyle(0x000000, 0.85)
    this.dialogueBox.fillRoundedRect(x, y, width, height, 15)
    this.dialogueBox.lineStyle(3, 0x667eea, 1)
    this.dialogueBox.strokeRoundedRect(x, y, width, height, 15)
    this.dialogueBox.setScrollFactor(0)
    this.dialogueBox.setDepth(3000)

    // NPC名字
    this.npcNameText = this.scene.add.text(x + width * 0.2 + 20, y + 15, this.currentNPC || '', {
      fontSize: '18px',
      color: '#FFD700',
      fontStyle: 'bold'
    })
    this.npcNameText.setScrollFactor(0)
    this.npcNameText.setDepth(3001)

    // 对话文本 - 向右移动20%
    this.dialogueText = this.scene.add.text(x + width * 0.2 + 20, y + 45, '', {
      fontSize: '15px',
      color: '#ffffff',
      wordWrap: { width: width * 0.8 - 40 } // 调整换行宽度
    })
    this.dialogueText.setScrollFactor(0)
    this.dialogueText.setDepth(3001)

    // 选项容器 - 位置设为(0,0)，按钮使用绝对坐标
    const isMobile = screenWidth < 768
    this.optionsContainer = this.scene.add.container(0, 0)
    this.optionsContainer.setScrollFactor(0)
    this.optionsContainer.setDepth(3100) // 提高层级，确保在对话框之上
  }

  /**
   * 显示NPC消息
   */
  private showNPCMessage(message: string) {
    if (!this.dialogueText) return

    // 打字机效果
    this.dialogueText.setText('')
    this.dialogueText.setColor('#ffffff')
    let index = 0
    const typewriterTimer = this.scene.time.addEvent({
      delay: 30,
      callback: () => {
        if (index < message.length) {
          this.dialogueText!.setText(message.substring(0, index + 1))
          index++
        } else {
          typewriterTimer.destroy()
          // 显示回复选项
          this.showResponseOptions()
          // 如果启用语音，朗读NPC消息
          if (this.isVoiceEnabled) {
            this.speakMessage(message)
          }
        }
      },
      loop: true
    })
  }

  /**
   * 朗读消息
   */
  private speakMessage(text: string) {
    console.log('尝试朗读:', text)
    console.log('语音支持:', this.voiceManager.isVoiceSupported())

    if (!this.voiceManager.isVoiceSupported()) {
      console.warn('浏览器不支持语音功能')
      return
    }

    const voice = this.voiceManager.getRecommendedVoice()
    console.log('使用语音:', voice)

    this.voiceManager.speak(text, {
      voice: voice,
      rate: 0.9,
      onStart: () => {
        console.log('开始朗读')
      },
      onEnd: () => {
        console.log('朗读结束')
      },
      onError: (error) => {
        console.error('语音播放失败:', error)
      }
    })
  }

  /**
   * 显示回复选项（使用DOM按钮，兼容微信浏览器）
   */
  private showResponseOptions() {
    // 清空之前的DOM按钮
    if (this.domButtonsContainer) {
      this.domButtonsContainer.remove()
      this.domButtonsContainer = undefined
    }

    const options = [
      { text: '🎤 语音回复', action: 'voice' },
      { text: '💬 继续对话', action: 'continue' },
      { text: '❓ 询问任务', action: 'quest' },
      { text: '👋 结束对话', action: 'end' }
    ]

    // 创建DOM按钮容器
    this.domButtonsContainer = document.createElement('div')
    this.domButtonsContainer.id = 'dialogue-buttons'

    // 检测是否为移动端
    const isMobile = window.innerWidth < 768

    // 设置容器样式
    this.domButtonsContainer.style.cssText = `
      position: fixed;
      ${isMobile ? `
        bottom: 240px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
      ` : `
        bottom: 240px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: row;
        gap: 15px;
        justify-content: center;
      `}
      z-index: 10000;
      pointer-events: auto;
    `

    // 创建按钮
    options.forEach(option => {
      const button = document.createElement('button')
      button.textContent = option.text
      button.style.cssText = `
        ${isMobile ? `
          width: 260px;
          height: 50px;
          font-size: 15px;
        ` : `
          width: 170px;
          height: 45px;
          font-size: 13px;
        `}
        background: rgba(102, 126, 234, 0.9);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.6);
        border-radius: 10px;
        font-weight: bold;
        cursor: pointer;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      `

      // 点击事件
      button.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('DOM按钮点击:', option.action)

        // 视觉反馈
        button.style.background = 'rgba(90, 74, 138, 0.9)'
        setTimeout(() => {
          button.style.background = 'rgba(102, 126, 234, 0.9)'
          this.handleOptionClick(option.action)
        }, 100)
      }

      // 触摸反馈
      button.ontouchstart = () => {
        button.style.background = 'rgba(118, 75, 162, 0.9)'
      }
      button.ontouchend = () => {
        button.style.background = 'rgba(102, 126, 234, 0.9)'
      }

      // 悬停效果（桌面端）
      if (!isMobile) {
        button.onmouseenter = () => {
          button.style.background = 'rgba(118, 75, 162, 0.9)'
          button.style.borderColor = 'rgba(255, 255, 255, 1)'
        }
        button.onmouseleave = () => {
          button.style.background = 'rgba(102, 126, 234, 0.9)'
          button.style.borderColor = 'rgba(255, 255, 255, 0.6)'
        }
      }

      this.domButtonsContainer!.appendChild(button)
    })

    // 添加到页面
    document.body.appendChild(this.domButtonsContainer)
  }

  /**
   * 创建选项按钮（使用绝对坐标）
   */
  private createOptionButton(
    text: string,
    x: number,
    y: number,
    callback: () => void,
    buttonWidth: number,
    buttonHeight: number,
    isMobile: boolean = false
  ): Phaser.GameObjects.Container {
    // 创建容器，使用绝对坐标
    const container = this.scene.add.container(x, y)
    const fontSize = isMobile ? '15px' : '13px'

    // 创建背景图形
    const bg = this.scene.add.graphics()
    bg.fillStyle(0x667eea, 0.8) // 半透明背景
    bg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
    bg.lineStyle(2, 0xffffff, 0.6)
    bg.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 10)

    // 添加调试边框（红色）
    bg.lineStyle(2, 0xff0000, 0.5)
    bg.strokeRect(0, 0, buttonWidth, buttonHeight)

    // 创建按钮文字
    const buttonText = this.scene.add.text(buttonWidth / 2, buttonHeight / 2, text, {
      fontSize: fontSize,
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    container.add([bg, buttonText])
    container.setSize(buttonWidth, buttonHeight)

    // 设置交互区域 - 使用整个按钮区域
    container.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight),
      Phaser.Geom.Rectangle.Contains
    )

    console.log(`创建按钮: ${text}`)
    console.log(`  容器位置: (${x}, ${y})`)
    console.log(`  按钮尺寸: ${buttonWidth}x${buttonHeight}`)
    console.log(`  交互区域: (0, 0, ${buttonWidth}, ${buttonHeight})`)
    console.log(`  世界坐标: (${container.x}, ${container.y})`)

    // 点击事件 - 使用 pointerup
    container.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      console.log(`✅ 按钮点击: ${text}`)
      console.log(`  指针坐标: (${pointer.x}, ${pointer.y})`)
      console.log(`  世界坐标: (${pointer.worldX}, ${pointer.worldY})`)
      console.log(`  容器坐标: (${container.x}, ${container.y})`)

      // 阻止事件传播
      if (pointer.event) {
        pointer.event.stopPropagation()
      }

      // 点击视觉反馈
      bg.clear()
      bg.fillStyle(0x5a4a8a, 0.9)
      bg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
      bg.lineStyle(2, 0xffffff, 1)
      bg.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
      // 保持调试边框
      bg.lineStyle(2, 0xff0000, 0.5)
      bg.strokeRect(0, 0, buttonWidth, buttonHeight)

      // 执行回调
      this.scene.time.delayedCall(100, () => {
        callback()
        // 恢复按钮样式
        bg.clear()
        bg.fillStyle(0x667eea, 0.8)
        bg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
        bg.lineStyle(2, 0xffffff, 0.6)
        bg.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
        // 保持调试边框
        bg.lineStyle(2, 0xff0000, 0.5)
        bg.strokeRect(0, 0, buttonWidth, buttonHeight)
      })
    })

    // 防止事件冒泡到游戏场景
    container.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      console.log(`👇 按钮按下: ${text}`)
      console.log(`  指针坐标: (${pointer.x}, ${pointer.y})`)
      if (pointer.event) {
        pointer.event.stopPropagation()
      }

      // 按下视觉反馈
      bg.clear()
      bg.fillStyle(0x764ba2, 0.9)
      bg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
      bg.lineStyle(2, 0xffffff, 0.8)
      bg.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
      // 保持调试边框
      bg.lineStyle(2, 0xff0000, 0.5)
      bg.strokeRect(0, 0, buttonWidth, buttonHeight)
    })

    // 悬停效果（桌面端）
    if (!isMobile) {
      container.on('pointerover', () => {
        console.log(`🖱️ 鼠标悬停: ${text}`)
        bg.clear()
        bg.fillStyle(0x764ba2, 0.9)
        bg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
        bg.lineStyle(2, 0xffffff, 1)
        bg.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
        bg.lineStyle(2, 0xff0000, 0.5)
        bg.strokeRect(0, 0, buttonWidth, buttonHeight)
      })

      container.on('pointerout', () => {
        bg.clear()
        bg.fillStyle(0x667eea, 0.8)
        bg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
        bg.lineStyle(2, 0xffffff, 0.6)
        bg.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 10)
        bg.lineStyle(2, 0xff0000, 0.5)
        bg.strokeRect(0, 0, buttonWidth, buttonHeight)
      })
    }

    return container
  }

  /**
   * 处理选项点击
   */
  private async handleOptionClick(action: string) {
    if (action === 'end') {
      this.closeDialogue()
      return
    }

    if (action === 'voice') {
      this.startVoiceInput()
      return
    }

    let userMessage = ''
    if (action === 'continue') {
      userMessage = '请继续说'
    } else if (action === 'quest') {
      userMessage = '我想了解一下任务'
    }

    // 显示用户消息
    this.showUserMessage(userMessage)

    // 发送到AI
    await this.sendToAI(userMessage)
  }

  /**
   * 开始语音输入
   */
  private async startVoiceInput() {
    if (!this.voiceManager.isVoiceSupported()) {
      this.showSystemMessage('您的浏览器不支持语音功能')
      return
    }

    // 显示监听状态
    this.showSystemMessage('🎤 正在请求麦克风权限...')

    await this.voiceManager.startListening(
      async (transcript, confidence) => {
        // 语音识别成功
        console.log(`识别到: ${transcript} (置信度: ${confidence})`)
        this.showUserMessage(transcript)
        await this.sendToAI(transcript)
      },
      (error) => {
        // 语音识别失败
        console.error('语音识别失败:', error)
        this.showSystemMessage(`❌ ${error}`)
        this.showResponseOptions()
      },
      () => {
        // 开始监听
        console.log('开始监听')
        this.showSystemMessage('🎤 正在监听，请说话...')
      },
      () => {
        // 结束监听
        console.log('结束监听')
      }
    )
  }

  /**
   * 显示系统消息
   */
  private showSystemMessage(message: string) {
    if (!this.dialogueText) return

    this.dialogueText.setText(message)
    this.dialogueText.setColor('#FFD700')

    // 清空选项
    this.optionsContainer?.removeAll(true)
  }

  /**
   * 显示用户消息
   */
  private showUserMessage(message: string) {
    if (!this.dialogueText) return

    this.dialogueText.setText(`你: ${message}`)
    this.dialogueText.setColor('#90EE90')

    // 1秒后清空，准备显示AI回复
    this.scene.time.delayedCall(1000, () => {
      this.dialogueText!.setText('思考中...')
      this.dialogueText!.setColor('#ffffff')
    })
  }

  /**
   * 发送消息到AI
   */
  private async sendToAI(message: string, questId?: string) {
    try {
      // 添加到对话历史
      this.conversationHistory.push({
        role: 'user',
        content: message
      })

      // 调用AI API
      const response = await chat({
        message,
        npc_name: this.currentNPC,
        quest_id: questId,
        conversation_history: this.conversationHistory
      })

      // 添加AI回复到历史
      this.conversationHistory.push({
        role: 'assistant',
        content: response.reply
      })

      // 显示AI回复
      this.showNPCMessage(response.reply)

    } catch (error) {
      console.error('AI对话失败:', error)
      this.showNPCMessage('抱歉，我现在有点忙，稍后再聊吧！')
    }
  }

  /**
   * 获取NPC问候语
   */
  private getNPCGreeting(npcName: string, questId?: string): string {
    const greetings: { [key: string]: string } = {
      '村长喵喵': '喵~ 欢迎来到新手村！我是村长喵喵。你是新来的冒险者吧？',
      '面包师': '你好！闻到香味了吗？我刚烤好新鲜的面包！',
      '图书管理员': '嘘...这里是图书馆，请保持安静。需要我帮你找什么书吗？'
    }

    return greetings[npcName] || `你好！我是${npcName}。`
  }

  /**
   * 关闭对话框
   */
  closeDialogue() {
    if (!this.isActive) return

    // 停止语音
    this.voiceManager.stopSpeaking()
    this.voiceManager.stopListening()

    // 清理DOM按钮
    if (this.domButtonsContainer) {
      this.domButtonsContainer.remove()
      this.domButtonsContainer = undefined
    }

    this.dialogueBox?.destroy()
    this.dialogueText?.destroy()
    this.npcNameText?.destroy()
    this.optionsContainer?.destroy()
    this.voiceButton?.destroy()

    this.dialogueBox = undefined
    this.dialogueText = undefined
    this.npcNameText = undefined
    this.optionsContainer = undefined
    this.voiceButton = undefined

    this.isActive = false
    this.currentNPC = undefined
    this.conversationHistory = []
  }

  /**
   * 检查是否正在对话
   */
  isDialogueActive(): boolean {
    return this.isActive
  }
}
