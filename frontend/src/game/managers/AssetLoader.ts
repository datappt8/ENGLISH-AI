/**
 * 资源加载器
 * 管理游戏资源的加载和缓存
 */
export class AssetLoader {
  private scene: Phaser.Scene
  private assetsLoaded: boolean = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /**
   * 预加载所有游戏资源
   */
  preloadAssets() {
    // 设置资源路径
    const basePath = '/assets'

    // 加载地面瓦片
    this.loadTiles(basePath)

    // 加载建筑物
    this.loadBuildings(basePath)

    // 加载装饰物
    this.loadDecorations(basePath)

    // 加载角色
    this.loadCharacters(basePath)

    // 加载UI元素
    this.loadUI(basePath)

    // 监听加载完成
    this.scene.load.on('complete', () => {
      this.assetsLoaded = true
      console.log('✅ 所有资源加载完成')
    })

    // 监听加载进度
    this.scene.load.on('progress', (progress: number) => {
      console.log(`📦 资源加载进度: ${Math.floor(progress * 100)}%`)
    })

    // 监听加载错误
    this.scene.load.on('loaderror', (file: any) => {
      console.warn(`⚠️ 资源加载失败: ${file.key}`)
      console.log('💡 使用占位符图形代替')
    })
  }

  /**
   * 加载地面瓦片
   */
  private loadTiles(basePath: string) {
    const tiles = [
      { key: 'tile_grass', file: 'grass.png' },
      { key: 'tile_stone_path', file: 'stone_path.png' },
      { key: 'tile_dirt', file: 'dirt.png' },
    ]

    tiles.forEach(tile => {
      this.scene.load.image(tile.key, `${basePath}/tiles/${tile.file}`)
    })
  }

  /**
   * 加载建筑物
   */
  private loadBuildings(basePath: string) {
    const buildings = [
      { key: 'building_chief_office', file: 'chief_office.png' },
      { key: 'building_bakery', file: 'bakery.png' },
      { key: 'building_library', file: 'library.png' },
      { key: 'building_house_1', file: 'house_1.png' },
      { key: 'building_house_2', file: 'house_2.png' },
    ]

    buildings.forEach(building => {
      this.scene.load.image(building.key, `${basePath}/buildings/${building.file}`)
    })
  }

  /**
   * 加载装饰物
   */
  private loadDecorations(basePath: string) {
    const decorations = [
      { key: 'tree_large', file: 'tree_large.png' },
      { key: 'tree_small', file: 'tree_small.png' },
      { key: 'lamp', file: 'lamp.png' },
      { key: 'flower_1', file: 'flower_1.png' },
      { key: 'rock_1', file: 'rock_1.png' },
    ]

    decorations.forEach(deco => {
      this.scene.load.image(deco.key, `${basePath}/decorations/${deco.file}`)
    })
  }

  /**
   * 加载角色精灵
   */
  private loadCharacters(basePath: string) {
    // 玩家角色
    this.scene.load.spritesheet('player_idle', `${basePath}/characters/player/idle.png`, {
      frameWidth: 64,
      frameHeight: 64
    })

    this.scene.load.spritesheet('player_walk', `${basePath}/characters/player/walk.png`, {
      frameWidth: 64,
      frameHeight: 64
    })

    // NPC角色
    const npcs = [
      { key: 'npc_meow', file: 'meow.png' },
      { key: 'npc_baker', file: 'baker.png' },
      { key: 'npc_librarian', file: 'librarian.png' },
    ]

    npcs.forEach(npc => {
      this.scene.load.spritesheet(npc.key, `${basePath}/characters/npcs/${npc.file}`, {
        frameWidth: 64,
        frameHeight: 64
      })
    })
  }

  /**
   * 加载UI元素
   */
  private loadUI(basePath: string) {
    const uiElements = [
      { key: 'dialogue_box', file: 'dialogue_box.png' },
      { key: 'button_normal', file: 'button_normal.png' },
      { key: 'button_hover', file: 'button_hover.png' },
      { key: 'quest_marker', file: 'quest_marker.png' },
    ]

    uiElements.forEach(ui => {
      this.scene.load.image(ui.key, `${basePath}/ui/${ui.file}`)
    })
  }

  /**
   * 创建角色动画
   */
  createAnimations() {
    // 玩家待机动画
    if (this.scene.textures.exists('player_idle')) {
      this.scene.anims.create({
        key: 'player_idle_anim',
        frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      })
    }

    // 玩家行走动画
    if (this.scene.textures.exists('player_walk')) {
      this.scene.anims.create({
        key: 'player_walk_anim',
        frames: this.scene.anims.generateFrameNumbers('player_walk', { start: 0, end: 7 }),
        frameRate: 12,
        repeat: -1
      })
    }

    // NPC待机动画
    const npcKeys = ['npc_meow', 'npc_baker', 'npc_librarian']
    npcKeys.forEach(key => {
      if (this.scene.textures.exists(key)) {
        this.scene.anims.create({
          key: `${key}_idle`,
          frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
          frameRate: 6,
          repeat: -1
        })
      }
    })

    console.log('✅ 动画创建完成')
  }

  /**
   * 检查资源是否存在
   */
  hasTexture(key: string): boolean {
    return this.scene.textures.exists(key)
  }

  /**
   * 检查所有资源是否加载完成
   */
  isLoaded(): boolean {
    return this.assetsLoaded
  }

  /**
   * 获取占位符纹理（当资源不存在时使用）
   */
  getPlaceholderTexture(type: 'tile' | 'building' | 'character' | 'decoration'): string {
    // 返回占位符纹理key，如果不存在则返回null
    // 这样场景可以使用几何图形作为后备
    return ''
  }
}
