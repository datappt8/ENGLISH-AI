# 🎨 美术资源指南

## 📋 资源需求清单

### 地面瓦片 (Tiles)
**尺寸**: 64x32 像素（等距投影菱形）
**格式**: PNG（透明背景）

| 文件名 | 描述 | 数量 | 优先级 |
|--------|------|------|--------|
| `tile_grass.png` | 草地瓦片 | 1 | 高 |
| `tile_stone_path.png` | 石头路径 | 1 | 高 |
| `tile_dirt.png` | 泥土地面 | 1 | 中 |
| `tile_water.png` | 水面（动画） | 4帧 | 低 |

### 建筑物 (Buildings)
**尺寸**: 根据实际大小（建议128x128起）
**格式**: PNG（透明背景）

| 文件名 | 描述 | 尺寸建议 | 优先级 |
|--------|------|----------|--------|
| `building_chief_office.png` | 村长办公室 | 128x128 | 高 |
| `building_bakery.png` | 面包店 | 128x128 | 高 |
| `building_library.png` | 图书馆 | 128x128 | 高 |
| `building_house_1.png` | 普通房屋1 | 96x96 | 中 |
| `building_house_2.png` | 普通房屋2 | 96x96 | 中 |

### 装饰物 (Decorations)
**尺寸**: 根据实际大小
**格式**: PNG（透明背景）

| 文件名 | 描述 | 尺寸建议 | 优先级 |
|--------|------|----------|--------|
| `tree_large.png` | 大树 | 64x96 | 高 |
| `tree_small.png` | 小树 | 48x64 | 中 |
| `lamp.png` | 路灯 | 32x64 | 中 |
| `flower_1.png` | 花朵1 | 32x32 | 低 |
| `flower_2.png` | 花朵2 | 32x32 | 低 |
| `rock_1.png` | 石头1 | 32x32 | 低 |
| `fence.png` | 栅栏 | 64x32 | 低 |

### 角色精灵 (Characters)
**尺寸**: 64x64 像素（每帧）
**格式**: PNG精灵表（Sprite Sheet）

#### 玩家角色
| 文件名 | 描述 | 帧数 | 优先级 |
|--------|------|------|--------|
| `player_idle.png` | 待机动画 | 4帧 | 高 |
| `player_walk.png` | 行走动画 | 8帧 | 高 |
| `player_talk.png` | 对话动画 | 4帧 | 中 |

**精灵表布局**: 横向排列，每帧64x64

#### NPC角色
| 文件名 | 描述 | 帧数 | 优先级 |
|--------|------|------|--------|
| `npc_meow.png` | 村长喵喵 | 4帧 | 高 |
| `npc_baker.png` | 面包师 | 4帧 | 高 |
| `npc_librarian.png` | 图书管理员 | 4帧 | 高 |

### UI元素 (UI)
**尺寸**: 根据实际需求
**格式**: PNG（透明背景）

| 文件名 | 描述 | 尺寸建议 | 优先级 |
|--------|------|----------|--------|
| `dialogue_box.png` | 对话框背景 | 1080x200 | 高 |
| `button_normal.png` | 按钮（正常） | 230x50 | 高 |
| `button_hover.png` | 按钮（悬停） | 230x50 | 高 |
| `quest_marker.png` | 任务标记 | 32x32 | 中 |
| `health_bar.png` | 生命条 | 100x20 | 低 |

---

## 🎨 美术风格指南

### 整体风格
- **类型**: 2.5D等距投影（Isometric）
- **风格**: 卡通/像素艺术混合
- **色调**: 明亮、温暖、友好
- **参考**: Stardew Valley, Habbo Hotel

### 色彩方案

#### 主色调
- **草地**: #90EE90 (浅绿)
- **路径**: #CCCCCC (浅灰)
- **建筑**: #D2691E (巧克力色) + #8B4513 (棕色)
- **天空**: #87CEEB (天蓝)

#### NPC颜色
- **村长喵喵**: #FF6B6B (红色系)
- **面包师**: #FFD93D (黄色系)
- **图书管理员**: #6BCB77 (绿色系)

### 等距投影规范

#### 角度和比例
```
投影角度: 26.565° (标准等距)
瓦片比例: 2:1 (宽:高)
瓦片尺寸: 64x32 像素
```

#### 绘制指南
1. **地面瓦片**: 绘制菱形，宽64px，高32px
2. **建筑物**: 底部对齐瓦片，向上延伸
3. **角色**: 底部中心点对齐瓦片中心
4. **阴影**: 使用半透明黑色，投射在地面

---

## 📐 资源规格

### 文件命名规范
```
类型_名称_状态.png

示例:
- tile_grass.png
- building_bakery.png
- npc_meow_idle.png
- player_walk_north.png
```

### 精灵表格式
```
横向排列，每帧等宽
帧与帧之间无间隔
背景透明

示例（4帧动画）:
[Frame1][Frame2][Frame3][Frame4]
 64x64   64x64   64x64   64x64
总尺寸: 256x64
```

### 导出设置
- **格式**: PNG-24
- **透明度**: 是
- **压缩**: 最佳质量
- **分辨率**: 72 DPI

---

## 📁 资源目录结构

```
frontend/public/assets/
├── tiles/                  # 地面瓦片
│   ├── grass.png
│   ├── stone_path.png
│   └── dirt.png
├── buildings/              # 建筑物
│   ├── chief_office.png
│   ├── bakery.png
│   └── library.png
├── decorations/            # 装饰物
│   ├── tree_large.png
│   ├── tree_small.png
│   └── lamp.png
├── characters/             # 角色
│   ├── player/
│   │   ├── idle.png
│   │   └── walk.png
│   └── npcs/
│       ├── meow.png
│       ├── baker.png
│       └── librarian.png
└── ui/                     # UI元素
    ├── dialogue_box.png
    ├── button_normal.png
    └── quest_marker.png
```

---

## 🛠️ 制作工具推荐

### 像素艺术工具
1. **Aseprite** (付费) - 专业像素艺术工具
2. **Piskel** (免费) - 在线像素编辑器
3. **GraphicsGale** (免费) - Windows像素艺术工具

### 2D艺术工具
1. **Photoshop** (付费) - 专业图像编辑
2. **GIMP** (免费) - 开源图像编辑
3. **Krita** (免费) - 数字绘画工具

### 等距投影工具
1. **Tiled** (免费) - 地图编辑器
2. **Pyxel Edit** (付费) - 瓦片和精灵编辑器

---

## 🎯 快速开始指南

### 方案1: 使用AI生成（推荐）
使用AI工具生成占位符资源：
- **DALL-E 3** / **Midjourney** - 生成概念图
- **Stable Diffusion** - 本地生成
- 提示词示例: "isometric pixel art grass tile, 64x32, transparent background, game asset"

### 方案2: 使用免费资源
从以下网站下载免费资源：
- **OpenGameArt.org** - 开源游戏资源
- **Itch.io** - 独立游戏资源
- **Kenney.nl** - 免费游戏资源包

### 方案3: 自己绘制
1. 下载Aseprite或Piskel
2. 创建64x32画布（瓦片）
3. 绘制菱形网格
4. 填充颜色和细节
5. 导出为PNG

---

## 📝 资源清单检查表

### 第一阶段（MVP必需）
- [ ] 草地瓦片
- [ ] 石头路径瓦片
- [ ] 村长办公室建筑
- [ ] 面包店建筑
- [ ] 图书馆建筑
- [ ] 大树装饰
- [ ] 玩家待机精灵
- [ ] 玩家行走精灵
- [ ] 村长喵喵精灵
- [ ] 面包师精灵
- [ ] 图书管理员精灵

### 第二阶段（增强体验）
- [ ] 更多地面类型
- [ ] 更多建筑
- [ ] 更多装饰物
- [ ] 角色对话动画
- [ ] UI美化资源
- [ ] 粒子效果

### 第三阶段（完整版）
- [ ] 所有角色动画
- [ ] 天气效果
- [ ] 季节变化
- [ ] 特殊效果
- [ ] 完整UI套件

---

## 🔗 参考资源

### 教程
- [Isometric Pixel Art Tutorial](https://www.youtube.com/results?search_query=isometric+pixel+art+tutorial)
- [Game Asset Creation Guide](https://opengameart.org/content/guide-to-creating-game-assets)

### 灵感
- **Stardew Valley** - 农场模拟游戏
- **Habbo Hotel** - 社交游戏
- **Monument Valley** - 等距解谜游戏

### 资源包
- [Kenney's Isometric Pack](https://kenney.nl/assets/isometric-blocks)
- [OpenGameArt Isometric](https://opengameart.org/art-search-advanced?keys=isometric)

---

## 💡 临时解决方案

在等待美术资源期间，当前使用：
- ✅ 几何图形占位符（已实现）
- ✅ 纯色填充
- ✅ 简单形状（圆形、矩形、三角形）

这些占位符已经可以展示游戏玩法，等美术资源准备好后可以直接替换。

---

## 📞 需要帮助？

如果需要帮助制作资源：
1. 提供具体需求（尺寸、风格、用途）
2. 我可以生成详细的制作说明
3. 或者推荐合适的外包平台

---

**文档创建**: 2026-02-01
**最后更新**: 2026-02-01
**状态**: 等待美术资源制作
