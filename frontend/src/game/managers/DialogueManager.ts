import Phaser from 'phaser'
import { chat } from '../../services/dialogueService'

/**
 * 对话管理器
 * 处理游戏内的NPC对话和AI交互
 */
export class DialogueManager {
  private scene: Phaser.Scene
  private dialogueBox?: Phaser.GameObjects.Graphics
  private dialogueText?: Phaser.GameObjects.Text
  private npcNameText?: Phaser.GameObjects.Text
  private optionsContainer?: Phaser.GameObjects.Container
  private isActive: boolean = false
  private currentNPC?: string
  private conversationHistory: Array<{ role: string; content: string }> = []

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
    const width = 1080
    const height = 200
    const x = 100
    const y = 480

    // 对话框背景
    this.dialogueBox = this.scene.add.graphics()
    this.dialogueBox.fillStyle(0x000000, 0.85)
    this.dialogueBox.fillRoundedRect(x, y, width, height, 15)
    this.dialogueBox.lineStyle(3, 0x667eea, 1)
    this.dialogueBox.strokeRoundedRect(x, y, width, height, 15)
    this.dialogueBox.setScrollFactor(0)
    this.dialogueBox.setDepth(3000)

    // NPC名字
    this.npcNameText = this.scene.add.text(x + 20, y + 15, this.currentNPC || '', {
      fontSize: '20px',
      color: '#FFD700',
      fontStyle: 'bold'
    })
    this.npcNameText.setScrollFactor(0)
    this.npcNameText.setDepth(3001)

    // 对话文本
    this.dialogueText = this.scene.add.text(x + 20, y + 50, '', {
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: width - 40 }
    })
    this.dialogueText.setScrollFactor(0)
    this.dialogueText.setDepth(3001)

    // 选项容器
    this.optionsContainer = this.scene.add.container(x + 20, y + height + 20)
    this.optionsContainer.setScrollFactor(0)
    this.optionsContainer.setDepth(3001)
  }

  /**
   * 显示NPC消息
   */
  private showNPCMessage(message: string) {
    if (!this.dialogueText) return

    // 打字机效果
    this.dialogueText.setText('')
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
        }
      },
      loop: true
    })
  }

  /**
   * 显示回复选项
   */
  private showResponseOptions() {
    if (!this.optionsContainer) return

    // 清空之前的选项
    this.optionsContainer.removeAll(true)

    const options = [
      { text: '💬 继续对话', action: 'continue' },
      { text: '❓ 询问任务', action: 'quest' },
      { text: '👋 结束对话', action: 'end' }
    ]

    options.forEach((option, index) => {
      const button = this.createOptionButton(option.text, index * 250, () => {
        this.handleOptionClick(option.action)
      })
      this.optionsContainer!.add(button)
    })
  }

  /**
   * 创建选项按钮
   */
  private createOptionButton(text: string, x: number, callback: () => void): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, 0)

    const bg = this.scene.add.graphics()
    bg.fillStyle(0x667eea, 1)
    bg.fillRoundedRect(0, 0, 230, 50, 10)
    bg.lineStyle(2, 0xffffff, 0.5)
    bg.strokeRoundedRect(0, 0, 230, 50, 10)

    const buttonText = this.scene.add.text(115, 25, text, {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    container.add([bg, buttonText])
    container.setSize(230, 50)
    container.setInteractive(new Phaser.Geom.Rectangle(0, 0, 230, 50), Phaser.Geom.Rectangle.Contains)

    // 悬停效果
    container.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x764ba2, 1)
      bg.fillRoundedRect(0, 0, 230, 50, 10)
      bg.lineStyle(2, 0xffffff, 1)
      bg.strokeRoundedRect(0, 0, 230, 50, 10)
    })

    container.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x667eea, 1)
      bg.fillRoundedRect(0, 0, 230, 50, 10)
      bg.lineStyle(2, 0xffffff, 0.5)
      bg.strokeRoundedRect(0, 0, 230, 50, 10)
    })

    container.on('pointerdown', callback)

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

    this.dialogueBox?.destroy()
    this.dialogueText?.destroy()
    this.npcNameText?.destroy()
    this.optionsContainer?.destroy()

    this.dialogueBox = undefined
    this.dialogueText = undefined
    this.npcNameText = undefined
    this.optionsContainer = undefined

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
