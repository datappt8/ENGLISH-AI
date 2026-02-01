import Phaser from 'phaser'

/**
 * 新手村场景
 * 使用简单的几何图形作为占位符，展示等距投影效果
 */
export class StarterVillageScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private player?: Phaser.GameObjects.Graphics
  private playerGridX: number = 5
  private playerGridY: number = 5
  private npcs: Array<{ sprite: Phaser.GameObjects.Graphics; gridX: number; gridY: number; name: string }> = []

  // 等距投影参数
  private readonly TILE_WIDTH = 64
  private readonly TILE_HEIGHT = 32
  private readonly MAP_WIDTH = 15
  private readonly MAP_HEIGHT = 15

  constructor() {
    super({ key: 'StarterVillageScene' })
  }

  create() {
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

    this.player = this.add.graphics()
    this.player.fillStyle(0x0000FF, 1)
    this.player.fillCircle(0, 0, 15)
    this.player.fillStyle(0xFFFFFF, 1)
    this.player.fillCircle(0, -5, 5) // 眼睛

    this.player.setPosition(screenPos.x, screenPos.y - 20)
    this.player.setDepth(this.getDepth(this.playerGridX, this.playerGridY, 200))

    // 添加玩家名字
    const nameText = this.add.text(0, -40, '玩家', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5)

    this.player.setData('nameText', nameText)
  }

  /**
   * 创建NPC
   */
  private createNPCs() {
    const npcData = [
      { x: 7, y: 5, name: '村长喵喵', color: 0xFF6B6B },
      { x: 5, y: 7, name: '面包师', color: 0xFFD93D },
      { x: 10, y: 10, name: '图书管理员', color: 0x6BCB77 },
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
        name: data.name
      })

      // NPC点击事件
      npc.on('pointerdown', () => {
        this.showDialogue(data.name)
      })
    })
  }

  /**
   * 添加说明文字
   */
  private addInstructions() {
    const instructions = this.add.text(10, 10,
      '🎮 使用方向键移动\n💬 点击NPC对话\n📋 按空格键查看任务',
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
   * 显示对话框
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
