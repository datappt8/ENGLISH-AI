import Phaser from 'phaser'
import { DialogueManager } from '../managers/DialogueManager'
import { AssetLoader } from '../managers/AssetLoader'

/**
 * 新手村场景
 * 使用简单的几何图形作为占位符，展示等距投影效果
 * 支持自动加载美术资源（如果存在）
 */
export class StarterVillageScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private player?: Phaser.GameObjects.Graphics | Phaser.GameObjects.Sprite
  private playerGridX: number = 5
  private playerGridY: number = 5
  private npcs: Array<{ sprite: Phaser.GameObjects.Graphics | Phaser.GameObjects.Sprite; gridX: number; gridY: number; name: string; questId?: string }> = []
  private dialogueManager?: DialogueManager
  private assetLoader?: AssetLoader

  // 移动端触摸控制
  private touchStartX: number = 0
  private touchStartY: number = 0
  private isMobile: boolean = false

  // 等距投影参数
  private readonly TILE_WIDTH = 64
  private readonly TILE_HEIGHT = 32
  private readonly MAP_WIDTH = 15
  private readonly MAP_HEIGHT = 15

  constructor() {
    super({ key: 'StarterVillageScene' })
  }

  preload() {
    // 初始化资源加载器
    this.assetLoader = new AssetLoader(this)

    // 尝试加载美术资源
    this.assetLoader.preloadAssets()
  }

  create() {
    // 检测是否为移动设备
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // 创建动画（如果资源存在）
    this.assetLoader?.createAnimations()

    // 初始化对话管理器
    this.dialogueManager = new DialogueManager(this)

    // 设置背景色
    this.cameras.main.setBackgroundColor('#87CEEB')

    // 绘制地图
    this.createMap()

    // 创建玩家
    this.createPlayer()

    // 创建NPC
    this.createNPCs()

    // 设置相机跟随
    this.cameras.main.startFollow(this.player!, true, 0.1, 0.1)
    this.cameras.main.setZoom(1.5)

    // 设置键盘控制
    this.cursors = this.input.keyboard?.createCursorKeys()

    // 添加说明文字
    this.addInstructions()

    // 移动端添加触摸滑动控制
    if (this.isMobile) {
      this.setupTouchControls()
    }

    // 添加点击事件
    this.input.on('pointerdown', this.handleClick, this)
  }

  /**
   * 创建地图（使用几何图形绘制等距瓦片）
   */
  private createMap() {
    const graphics = this.add.graphics()

    for (let y = 0; y < this.MAP_HEIGHT; y++) {
      for (let x = 0; x < this.MAP_WIDTH; x++) {
        const screenPos = this.gridToScreen(x, y)

        // 绘制菱形瓦片
        const isPath = (x === 5 || y === 5) // 简单的路径
        const color = isPath ? 0xcccccc : 0x90EE90

        graphics.fillStyle(color, 1)
        graphics.beginPath()
        graphics.moveTo(screenPos.x, screenPos.y)
        graphics.lineTo(screenPos.x + this.TILE_WIDTH / 2, screenPos.y + this.TILE_HEIGHT / 2)
        graphics.lineTo(screenPos.x, screenPos.y + this.TILE_HEIGHT)
        graphics.lineTo(screenPos.x - this.TILE_WIDTH / 2, screenPos.y + this.TILE_HEIGHT / 2)
        graphics.closePath()
        graphics.fillPath()

        // 绘制边框
        graphics.lineStyle(1, 0x666666, 0.3)
        graphics.strokePath()
      }
    }

    // 添加一些装饰（树木）
    this.addDecorations()
  }

  /**
   * 添加装饰物
   */
  private addDecorations() {
    const trees = [
      { x: 2, y: 2 },
      { x: 8, y: 2 },
      { x: 2, y: 8 },
      { x: 8, y: 8 },
      { x: 12, y: 5 },
      { x: 5, y: 12 },
    ]

    trees.forEach(tree => {
      const screenPos = this.gridToScreen(tree.x, tree.y)
      const graphics = this.add.graphics()

      // 绘制简单的树（三角形 + 矩形）
      graphics.fillStyle(0x8B4513, 1) // 树干
      graphics.fillRect(screenPos.x - 5, screenPos.y - 20, 10, 20)

      graphics.fillStyle(0x228B22, 1) // 树冠
      graphics.beginPath()
      graphics.moveTo(screenPos.x, screenPos.y - 50)
      graphics.lineTo(screenPos.x + 20, screenPos.y - 20)
      graphics.lineTo(screenPos.x - 20, screenPos.y - 20)
      graphics.closePath()
      graphics.fillPath()

      // 设置深度
      graphics.setDepth(this.getDepth(tree.x, tree.y, 100))
    })
  }

  /**
   * 创建玩家
   */
  private createPlayer() {
    const screenPos = this.gridToScreen(this.playerGridX, this.playerGridY)

    // 尝试使用精灵资源，否则使用几何图形
    if (this.assetLoader?.hasTexture('player_idle')) {
      // 使用精灵
      this.player = this.add.sprite(screenPos.x, screenPos.y - 20, 'player_idle')
      this.player.play('player_idle_anim')
      console.log('✅ 使用玩家精灵资源')
    } else {
      // 使用几何图形占位符
      this.player = this.add.graphics()
      const graphics = this.player as Phaser.GameObjects.Graphics
      graphics.fillStyle(0x0000FF, 1)
      graphics.fillCircle(0, 0, 15)
      graphics.fillStyle(0xFFFFFF, 1)
      graphics.fillCircle(0, -5, 5) // 眼睛
      graphics.setPosition(screenPos.x, screenPos.y - 20)
      console.log('💡 使用玩家几何图形占位符')
    }

    this.player.setDepth(this.getDepth(this.playerGridX, this.playerGridY, 200))

    // 添加玩家名字
    const nameText = this.add.text(screenPos.x, screenPos.y - 60, '玩家', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5)
    nameText.setDepth(this.getDepth(this.playerGridX, this.playerGridY, 201))

    this.player.setData('nameText', nameText)
  }

  /**
   * 创建NPC
   */
  private createNPCs() {
    const npcData = [
      { x: 7, y: 5, name: '村长喵喵', color: 0xFF6B6B, questId: 'starter_village_001' },
      { x: 5, y: 7, name: '面包师', color: 0xFFD93D, questId: 'starter_village_002' },
      { x: 10, y: 10, name: '图书管理员', color: 0x6BCB77, questId: 'starter_village_003' },
    ]

    npcData.forEach(data => {
      const screenPos = this.gridToScreen(data.x, data.y)

      const npc = this.add.graphics()
      npc.fillStyle(data.color, 1)
      npc.fillCircle(0, 0, 15)
      npc.fillStyle(0xFFFFFF, 1)
      npc.fillCircle(-5, -5, 3) // 左眼
      npc.fillCircle(5, -5, 3)  // 右眼

      npc.setPosition(screenPos.x, screenPos.y - 20)
      npc.setDepth(this.getDepth(data.x, data.y, 200))
      npc.setInteractive(new Phaser.Geom.Circle(0, 0, 15), Phaser.Geom.Circle.Contains)

      // 添加NPC名字
      const nameText = this.add.text(0, -40, data.name, {
        fontSize: '12px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 5, y: 2 }
      }).setOrigin(0.5)
      nameText.setPosition(screenPos.x, screenPos.y - 60)
      nameText.setDepth(this.getDepth(data.x, data.y, 201))

      // 添加感叹号（表示有任务）
      const questMarker = this.add.text(0, -60, '❗', {
        fontSize: '20px'
      }).setOrigin(0.5)
      questMarker.setPosition(screenPos.x, screenPos.y - 80)
      questMarker.setDepth(this.getDepth(data.x, data.y, 202))

      this.npcs.push({
        sprite: npc,
        gridX: data.x,
        gridY: data.y,
        name: data.name,
        questId: data.questId
      })

      // NPC点击事件 - 使用新的对话系统
      // 使用 pointerup 以提高移动端兼容性
      npc.on('pointerup', () => {
        this.startDialogueWithNPC(data.name, data.questId)
      })

      // 防止事件冒泡
      npc.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.event?.stopPropagation()
      })
    })
  }

  /**
   * 设置移动端触摸控制
   */
  private setupTouchControls() {
    // 监听触摸开始
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.touchStartX = pointer.x
      this.touchStartY = pointer.y
    })

    // 监听触摸结束（滑动）
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const deltaX = pointer.x - this.touchStartX
      const deltaY = pointer.y - this.touchStartY
      const minSwipeDistance = 30 // 最小滑动距离

      // 判断滑动方向
      if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // 横向滑动
          if (deltaX > 0) {
            this.movePlayer('right')
          } else {
            this.movePlayer('left')
          }
        } else {
          // 纵向滑动
          if (deltaY > 0) {
            this.movePlayer('down')
          } else {
            this.movePlayer('up')
          }
        }
      }
    })

    // 添加触摸提示（使用游戏逻辑坐标，不是实际屏幕坐标）
    const touchHint = this.add.text(
      this.scale.width / 2,  // 使用游戏逻辑宽度
      this.scale.height - 50, // 使用游戏逻辑高度
      '👆 滑动屏幕移动角色',
      {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 15, y: 10 }
      }
    )
    touchHint.setOrigin(0.5)
    touchHint.setScrollFactor(0)
    touchHint.setDepth(3000)
    touchHint.setAlpha(0.9)

    // 5秒后淡出提示
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: touchHint,
        alpha: 0,
        duration: 1000,
        onComplete: () => touchHint.destroy()
      })
    })
  }

  /**
   * 移动玩家
   */
  private movePlayer(direction: 'up' | 'down' | 'left' | 'right') {
    let newGridX = this.playerGridX
    let newGridY = this.playerGridY

    switch (direction) {
      case 'up':
        newGridY--
        break
      case 'down':
        newGridY++
        break
      case 'left':
        newGridX--
        break
      case 'right':
        newGridX++
        break
    }

    // 检查边界
    if (newGridX >= 0 && newGridX < this.MAP_WIDTH &&
        newGridY >= 0 && newGridY < this.MAP_HEIGHT) {
      this.playerGridX = newGridX
      this.playerGridY = newGridY

      const screenPos = this.gridToScreen(this.playerGridX, this.playerGridY)
      this.player!.setPosition(screenPos.x, screenPos.y - 20)
      this.player!.setDepth(this.getDepth(this.playerGridX, this.playerGridY, 200))

      // 更新名字位置
      const nameText = this.player!.getData('nameText')
      if (nameText) {
        nameText.setPosition(screenPos.x, screenPos.y - 60)
        nameText.setDepth(this.getDepth(this.playerGridX, this.playerGridY, 201))
      }
    }
  }

  /**
   * 添加说明文字
   */
  private addInstructions() {
    const instructionText = this.isMobile
      ? '💬 点击NPC对话\n👆 滑动屏幕移动角色'
      : '🎮 使用方向键移动\n💬 点击NPC对话\n📋 按空格键查看任务'

    const instructions = this.add.text(10, 10,
      instructionText,
      {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 10 }
      }
    )
    instructions.setScrollFactor(0)
    instructions.setDepth(1000)
  }

  /**
   * 开始与NPC对话（使用AI对话系统）
   */
  private async startDialogueWithNPC(npcName: string, questId?: string) {
    if (this.dialogueManager?.isDialogueActive()) return

    await this.dialogueManager?.startDialogue(npcName, questId)
  }

  /**
   * 显示对话框（旧版本，保留作为后备）
   */
  private showDialogue(npcName: string) {
    const dialogueBox = this.add.graphics()
    dialogueBox.fillStyle(0x000000, 0.8)
    dialogueBox.fillRoundedRect(100, 500, 1080, 150, 10)
    dialogueBox.setScrollFactor(0)
    dialogueBox.setDepth(2000)

    const dialogueText = this.add.text(150, 530,
      `${npcName}: 你好！欢迎来到新手村！\n\n点击屏幕关闭对话`,
      {
        fontSize: '18px',
        color: '#ffffff',
        wordWrap: { width: 1000 }
      }
    )
    dialogueText.setScrollFactor(0)
    dialogueText.setDepth(2001)

    // 点击关闭对话
    const closeDialogue = () => {
      dialogueBox.destroy()
      dialogueText.destroy()
      this.input.off('pointerdown', closeDialogue)
    }

    this.time.delayedCall(100, () => {
      this.input.once('pointerdown', closeDialogue)
    })
  }

  /**
   * 处理点击事件
   */
  private handleClick(pointer: Phaser.Input.Pointer) {
    // 转换为世界坐标
    const worldX = pointer.worldX
    const worldY = pointer.worldY

    // 转换为网格坐标
    const gridPos = this.screenToGrid(worldX, worldY)

    console.log(`点击位置: 屏幕(${worldX}, ${worldY}) -> 网格(${gridPos.x}, ${gridPos.y})`)
  }

  update() {
    if (!this.cursors || !this.player) return

    let moved = false
    let newGridX = this.playerGridX
    let newGridY = this.playerGridY

    // 处理键盘输入
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      newGridY--
      moved = true
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
      newGridY++
      moved = true
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.left!)) {
      newGridX--
      moved = true
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right!)) {
      newGridX++
      moved = true
    }

    // 检查边界
    if (moved) {
      if (newGridX >= 0 && newGridX < this.MAP_WIDTH &&
          newGridY >= 0 && newGridY < this.MAP_HEIGHT) {
        this.playerGridX = newGridX
        this.playerGridY = newGridY

        const screenPos = this.gridToScreen(this.playerGridX, this.playerGridY)
        this.player.setPosition(screenPos.x, screenPos.y - 20)
        this.player.setDepth(this.getDepth(this.playerGridX, this.playerGridY, 200))

        // 更新名字位置
        const nameText = this.player.getData('nameText')
        if (nameText) {
          nameText.setPosition(screenPos.x, screenPos.y - 60)
          nameText.setDepth(this.getDepth(this.playerGridX, this.playerGridY, 201))
        }
      }
    }
  }

  /**
   * 网格坐标转屏幕坐标
   */
  private gridToScreen(gridX: number, gridY: number): { x: number; y: number } {
    const screenX = (gridX - gridY) * (this.TILE_WIDTH / 2) + 400
    const screenY = (gridX + gridY) * (this.TILE_HEIGHT / 2) + 100
    return { x: screenX, y: screenY }
  }

  /**
   * 屏幕坐标转网格坐标
   */
  private screenToGrid(screenX: number, screenY: number): { x: number; y: number } {
    const adjustedX = screenX - 400
    const adjustedY = screenY - 100

    const gridX = (adjustedX / (this.TILE_WIDTH / 2) + adjustedY / (this.TILE_HEIGHT / 2)) / 2
    const gridY = (adjustedY / (this.TILE_HEIGHT / 2) - adjustedX / (this.TILE_WIDTH / 2)) / 2

    return {
      x: Math.floor(gridX),
      y: Math.floor(gridY)
    }
  }

  /**
   * 计算深度值（用于排序）
   */
  private getDepth(gridX: number, gridY: number, zOffset: number = 0): number {
    return (gridX + gridY) * 1000 + zOffset
  }
}
