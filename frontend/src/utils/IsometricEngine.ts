// Phaser 3 轴测图（2.5D）实现 - 无需插件
// 适用于预渲染的等距投影图片资产

/**
 * 等距投影工具类
 * 处理屏幕坐标和网格坐标的转换
 */
export class IsometricUtils {
  // 瓦片尺寸（等距投影）
  static TILE_WIDTH = 64;   // 菱形宽度
  static TILE_HEIGHT = 32;  // 菱形高度

  /**
   * 网格坐标转屏幕坐标
   * @param gridX - 网格 X 坐标
   * @param gridY - 网格 Y 坐标
   * @returns {x, y} 屏幕坐标
   */
  static gridToScreen(gridX: number, gridY: number): { x: number; y: number } {
    const screenX = (gridX - gridY) * (this.TILE_WIDTH / 2);
    const screenY = (gridX + gridY) * (this.TILE_HEIGHT / 2);
    return { x: screenX, y: screenY };
  }

  /**
   * 屏幕坐标转网格坐标
   * @param screenX - 屏幕 X 坐标
   * @param screenY - 屏幕 Y 坐标
   * @returns {x, y} 网格坐标
   */
  static screenToGrid(screenX: number, screenY: number): { x: number; y: number } {
    const gridX = (screenX / (this.TILE_WIDTH / 2) + screenY / (this.TILE_HEIGHT / 2)) / 2;
    const gridY = (screenY / (this.TILE_HEIGHT / 2) - screenX / (this.TILE_WIDTH / 2)) / 2;
    return {
      x: Math.floor(gridX),
      y: Math.floor(gridY)
    };
  }

  /**
   * 计算深度值（用于排序）
   * 越靠下、越靠右的物体应该在上层
   */
  static getDepth(gridX: number, gridY: number, zOffset: number = 0): number {
    return (gridX + gridY) * 1000 + zOffset;
  }
}

/**
 * 等距地图场景
 */
export class IsometricMapScene extends Phaser.Scene {
  private map!: IsometricMap;
  private groundLayer!: Phaser.GameObjects.Container;
  private objectsLayer!: Phaser.GameObjects.Container;
  private charactersLayer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'IsometricMapScene' });
  }

  preload() {
    // 加载地面纹理
    this.load.image('tile_grass', 'assets/tiles/grass.png');
    this.load.image('tile_stone', 'assets/tiles/stone_path.png');

    // 加载建筑
    this.load.image('building_chief_office', 'assets/buildings/chief_office.png');
    this.load.image('building_bakery', 'assets/buildings/bakery.png');

    // 加载装饰
    this.load.image('tree_large', 'assets/decorations/tree_large.png');
    this.load.image('lamp', 'assets/decorations/lamp.png');

    // 加载角色
    this.load.spritesheet('npc_meow', 'assets/characters/meow.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    // 创建图层容器
    this.groundLayer = this.add.container(0, 0);
    this.objectsLayer = this.add.container(0, 0);
    this.charactersLayer = this.add.container(0, 0);

    // 设置相机
    this.cameras.main.setBounds(0, 0, 2560, 1280);
    this.cameras.main.setZoom(1);

    // 创建地图
    this.map = new IsometricMap(this, 40, 40);
    this.renderMap();

    // 添加相机控制
    this.setupCameraControls();
  }

  /**
   * 渲染地图
   */
  private renderMap() {
    const mapData = this.map.getData();

    // 1. 渲染地面层
    this.renderGround(mapData.ground);

    // 2. 渲染建筑和装饰（需要深度排序）
    this.renderObjects(mapData.objects);

    // 3. 渲染角色
    this.renderCharacters(mapData.characters);
  }

  /**
   * 渲染地面
   */
  private renderGround(groundData: GroundTile[][]) {
    for (let y = 0; y < groundData.length; y++) {
      for (let x = 0; x < groundData[y].length; x++) {
        const tile = groundData[y][x];
        const screenPos = IsometricUtils.gridToScreen(x, y);

        const sprite = this.add.image(
          screenPos.x,
          screenPos.y,
          tile.texture
        );

        sprite.setOrigin(0.5, 0.5);
        sprite.setDepth(IsometricUtils.getDepth(x, y, -1000)); // 地面最底层

        this.groundLayer.add(sprite);
      }
    }
  }

  /**
   * 渲染物体（建筑、装饰等）
   */
  private renderObjects(objects: MapObject[]) {
    // 按深度排序
    objects.sort((a, b) => {
      const depthA = IsometricUtils.getDepth(a.gridX, a.gridY, a.zOffset || 0);
      const depthB = IsometricUtils.getDepth(b.gridX, b.gridY, b.zOffset || 0);
      return depthA - depthB;
    });

    objects.forEach(obj => {
      const screenPos = IsometricUtils.gridToScreen(obj.gridX, obj.gridY);

      const sprite = this.add.image(
        screenPos.x,
        screenPos.y - (obj.zOffset || 0), // Z 轴偏移
        obj.texture
      );

      sprite.setOrigin(0.5, 1); // 底部中心为锚点
      sprite.setDepth(IsometricUtils.getDepth(obj.gridX, obj.gridY, obj.zOffset || 0));

      // 如果是可交互物体
      if (obj.interactive) {
        sprite.setInteractive({ useHandCursor: true });
        sprite.on('pointerdown', () => this.onObjectClick(obj));
      }

      this.objectsLayer.add(sprite);
    });
  }

  /**
   * 渲染角色
   */
  private renderCharacters(characters: Character[]) {
    characters.forEach(char => {
      const screenPos = IsometricUtils.gridToScreen(char.gridX, char.gridY);

      const sprite = this.add.sprite(
        screenPos.x,
        screenPos.y,
        char.texture
      );

      sprite.setOrigin(0.5, 0.8); // 脚部为锚点
      sprite.setDepth(IsometricUtils.getDepth(char.gridX, char.gridY, 100));

      // 添加角色名称
      const nameText = this.add.text(screenPos.x, screenPos.y - 60, char.name, {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#00000080',
        padding: { x: 6, y: 3 }
      });
      nameText.setOrigin(0.5);
      nameText.setDepth(sprite.depth + 1);

      this.charactersLayer.add(sprite);
      this.charactersLayer.add(nameText);
    });
  }

  /**
   * 设置相机控制
   */
  private setupCameraControls() {
    // 鼠标拖拽移动
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      isDragging = true;
      dragStartX = pointer.x;
      dragStartY = pointer.y;
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (isDragging) {
        const deltaX = pointer.x - dragStartX;
        const deltaY = pointer.y - dragStartY;

        this.cameras.main.scrollX -= deltaX;
        this.cameras.main.scrollY -= deltaY;

        dragStartX = pointer.x;
        dragStartY = pointer.y;
      }
    });

    this.input.on('pointerup', () => {
      isDragging = false;
    });

    // 鼠标滚轮缩放
    this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any[], deltaX: number, deltaY: number) => {
      const zoom = this.cameras.main.zoom;
      const newZoom = Phaser.Math.Clamp(zoom - deltaY * 0.001, 0.5, 2);
      this.cameras.main.setZoom(newZoom);
    });
  }

  /**
   * 物体点击事件
   */
  private onObjectClick(obj: MapObject) {
    console.log('Clicked object:', obj);
    // 触发任务、对话等
  }

  update(time: number, delta: number) {
    // 更新角色动画、移动等
  }
}

/**
 * 等距地图数据管理
 */
export class IsometricMap {
  private scene: Phaser.Scene;
  private width: number;
  private height: number;
  private data: MapData;

  constructor(scene: Phaser.Scene, width: number, height: number) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.data = this.generateMapData();
  }

  /**
   * 生成地图数据（示例）
   */
  private generateMapData(): MapData {
    // 地面数据
    const ground: GroundTile[][] = [];
    for (let y = 0; y < this.height; y++) {
      ground[y] = [];
      for (let x = 0; x < this.width; x++) {
        // 简单示例：中心区域是石板路，其他是草地
        const isPath = Math.abs(x - 20) < 3 && Math.abs(y - 20) < 3;
        ground[y][x] = {
          texture: isPath ? 'tile_stone' : 'tile_grass',
          gridX: x,
          gridY: y
        };
      }
    }

    // 物体数据
    const objects: MapObject[] = [
      {
        id: 'chief_office',
        texture: 'building_chief_office',
        gridX: 20,
        gridY: 15,
        zOffset: 0,
        interactive: true
      },
      {
        id: 'tree_1',
        texture: 'tree_large',
        gridX: 15,
        gridY: 15,
        zOffset: 0,
        interactive: false
      }
    ];

    // 角色数据
    const characters: Character[] = [
      {
        id: 'npc_meow',
        name: '村长喵喵',
        texture: 'npc_meow',
        gridX: 20,
        gridY: 16
      }
    ];

    return { ground, objects, characters };
  }

  getData(): MapData {
    return this.data;
  }
}

/**
 * 类型定义
 */
interface GroundTile {
  texture: string;
  gridX: number;
  gridY: number;
}

interface MapObject {
  id: string;
  texture: string;
  gridX: number;
  gridY: number;
  zOffset?: number;
  interactive?: boolean;
}

interface Character {
  id: string;
  name: string;
  texture: string;
  gridX: number;
  gridY: number;
}

interface MapData {
  ground: GroundTile[][];
  objects: MapObject[];
  characters: Character[];
}

/**
 * 角色移动控制器
 */
export class IsometricCharacterController {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private gridX: number;
  private gridY: number;
  private isMoving: boolean = false;

  constructor(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite, gridX: number, gridY: number) {
    this.scene = scene;
    this.sprite = sprite;
    this.gridX = gridX;
    this.gridY = gridY;
  }

  /**
   * 移动到指定网格位置
   */
  moveTo(targetGridX: number, targetGridY: number, speed: number = 200) {
    if (this.isMoving) return;

    this.isMoving = true;
    const targetScreen = IsometricUtils.gridToScreen(targetGridX, targetGridY);

    this.scene.tweens.add({
      targets: this.sprite,
      x: targetScreen.x,
      y: targetScreen.y,
      duration: speed,
      ease: 'Linear',
      onUpdate: () => {
        // 更新深度（移动时实时更新）
        const currentGrid = IsometricUtils.screenToGrid(this.sprite.x, this.sprite.y);
        this.sprite.setDepth(IsometricUtils.getDepth(currentGrid.x, currentGrid.y, 100));
      },
      onComplete: () => {
        this.gridX = targetGridX;
        this.gridY = targetGridY;
        this.isMoving = false;
      }
    });
  }

  getGridPosition(): { x: number; y: number } {
    return { x: this.gridX, y: this.gridY };
  }
}
