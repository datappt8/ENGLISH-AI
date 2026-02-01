# 🎨 2.5D 轴测图视觉设计方案

## 📐 核心设计理念

### 视觉风格定位
- **2.5D 轴测投影** (Isometric Projection)
- **虚拟城市风格** - 类似 SimCity、Monument Valley
- **温馨卡通** - 友好、可爱、不幼稚
- **色彩明亮** - 充满活力但不刺眼
- **细节丰富** - 可探索的世界感

---

## 🎯 统一视觉规范

### 1. 轴测角度标准
```
投影角度: 30° (左右对称)
视角高度: 45° 俯视
网格单位: 64x32 像素 (1个地砖)
Z轴高度: 每层 16 像素
```

### 2. 色彩系统

#### 主色调 (Primary Colors)
```css
/* 新手村 - 温暖草原 */
--grass-green: #7EC850
--sky-blue: #87CEEB
--wood-brown: #8B6F47
--stone-gray: #A8A8A8

/* 强调色 */
--highlight-yellow: #FFD700
--interactive-blue: #4A90E2
--quest-orange: #FF8C42
```

#### 辅助色 (Secondary Colors)
```css
/* 建筑 */
--roof-red: #D84B4B
--wall-cream: #F5E6D3
--window-cyan: #B8E6F0

/* 自然元素 */
--tree-green: #5FA052
--flower-pink: #FF6B9D
--water-blue: #4A9EE0
```

### 3. 光影规范

#### 光源方向
- **主光源**: 左上方 45° (模拟太阳)
- **环境光**: 柔和的天空光
- **阴影**: 右下方投射，透明度 30-40%

#### 明暗层次
```
高光 (Highlight): 原色 + 20% 亮度
中间调 (Midtone): 原色
暗部 (Shadow): 原色 - 30% 亮度
投影 (Cast Shadow): 黑色 30% 透明度
```

---

## 🗺️ 关卡地图设计

### 新手村 (Starter Village) 布局

```
地图尺寸: 40x40 格子 (2560x1280 像素)
视野范围: 可缩放 50%-200%
```

#### 区域划分
```
     [北部 - 森林边缘]
            ↑
[西部]  [村庄中心]  [东部]
 农田      广场      商店区
            ↓
     [南部 - 入口道路]
```

#### 核心建筑布局
1. **村庄广场** (中心)
   - 村长喵喵的办公室
   - 任务公告板
   - 传送门/快速旅行点

2. **商店区** (东部)
   - 小猪培根的面包店
   - 道具商店
   - 服装店

3. **居民区** (西部)
   - 柴犬小柴的家
   - 兔子露露的家
   - 玩家可进入的房屋

4. **训练区** (北部)
   - 发音练习场
   - 对话训练室
   - 新手教程区

5. **休闲区** (南部)
   - 公园/花园
   - 喷泉广场
   - 社交聊天区

---

## 🎨 AI 生成提示词模板

### 核心提示词结构
```
[风格] + [视角] + [主体] + [环境] + [光照] + [细节] + [技术参数]
```

### 统一风格基础提示词
```
Base Prompt (所有图片必须包含):
---
isometric 2.5D game art, 30-degree angle view, cute cartoon style,
bright and vibrant colors, soft shadows, clean lines,
mobile game quality, high detail, professional game asset,
no text, no UI elements, transparent background or white background
---
```

### 建筑类资产提示词

#### 1. 村长办公室 (Village Chief's Office)
```
Prompt:
isometric 2.5D game art, cute cartoon village chief office building,
wooden structure with red tile roof, small tower with flag,
front entrance with stairs, windows with warm light inside,
surrounded by small garden with flowers, stone pathway,
bright daylight, soft shadows, cheerful atmosphere,
game asset style, clean and detailed, white background

Negative Prompt:
realistic, dark, gloomy, complex, messy, low quality, blurry
```

#### 2. 面包店 (Bakery)
```
Prompt:
isometric 2.5D game art, cute cartoon bakery shop,
cream-colored walls with brown wooden beams, striped awning,
display window showing bread and pastries, outdoor seating area,
small chimney with smoke, flower pots at entrance,
warm and inviting atmosphere, bright colors, soft shadows,
game asset style, high detail, white background

Negative Prompt:
realistic, dark, modern, complex, messy, low quality
```

#### 3. 居民房屋 (Residential House)
```
Prompt:
isometric 2.5D game art, cute cartoon small house,
cozy cottage style, colorful roof (red/blue/green variations),
wooden door, small windows with curtains, small garden,
mailbox, stone pathway, flowers and bushes,
cheerful and welcoming, bright daylight, soft shadows,
game asset style, clean design, white background

Negative Prompt:
realistic, large, complex, dark, gloomy, low quality
```

### 自然元素提示词

#### 4. 树木 (Trees)
```
Prompt:
isometric 2.5D game art, cute cartoon tree,
round fluffy green canopy, brown trunk, simple stylized leaves,
3 size variations (small, medium, large),
bright green colors, soft shadows on ground,
game asset style, clean and simple, transparent background

Negative Prompt:
realistic, detailed leaves, complex, dark, low quality
```

#### 5. 道路/地面 (Roads/Ground)
```
Prompt:
isometric 2.5D game art, tileable ground textures,
stone pathway, grass tiles, dirt road, cobblestone,
clean geometric patterns, bright colors, subtle texture,
soft shadows, game asset style, seamless edges,
white background, top-down isometric view

Negative Prompt:
realistic, photo, complex, messy, low quality
```

### 角色/NPC 提示词

#### 6. 村长喵喵 (Village Chief Cat)
```
Prompt:
isometric 2.5D game art, cute cartoon cat character,
orange tabby cat wearing small hat and vest, wise expression,
standing pose, friendly and approachable, chibi proportions,
bright colors, soft shading, clean lines, character design,
white background, front and side view

Negative Prompt:
realistic, scary, complex, dark, low quality, human-like
```

#### 7. 柴犬小柴 (Shiba Dog)
```
Prompt:
isometric 2.5D game art, cute cartoon shiba inu dog character,
cream and orange fur, happy expression with tongue out,
energetic pose, wearing small scarf, chibi proportions,
bright colors, soft shading, friendly and playful,
character design, white background, multiple angles

Negative Prompt:
realistic, aggressive, complex, dark, low quality
```

### 装饰元素提示词

#### 8. 道具/装饰 (Props/Decorations)
```
Prompt:
isometric 2.5D game art, cute cartoon village decorations,
lamp posts, benches, flower pots, signs, fountains,
mailboxes, fences, bushes, small props collection,
bright colors, clean design, soft shadows,
game asset style, white background, organized layout

Negative Prompt:
realistic, complex, messy, dark, low quality
```

---

## 🎯 AI 生成工作流程

### 第一阶段：建立风格参考
1. **生成风格参考图** (Style Reference)
   - 创建 1-2 张"新手村全景"作为风格锚点
   - 确定色彩、光影、细节程度
   - 作为后续所有生成的参考

2. **测试一致性**
   - 使用相同的基础提示词
   - 生成 3-5 个不同建筑测试
   - 确保风格统一

### 第二阶段：批量生成资产
1. **建筑资产** (10-15个)
   - 主要建筑 (村长办公室、面包店等)
   - 通用房屋 (3-4种变体)
   - 功能建筑 (商店、训练场等)

2. **自然元素** (20-30个)
   - 树木 (3-4种，各3个尺寸)
   - 花草 (5-8种)
   - 地面纹理 (6-8种)

3. **角色资产** (5-8个)
   - 主要NPC (村长、小柴、培根、露露)
   - 通用村民 (2-3种)
   - 玩家角色模板

4. **装饰道具** (30-50个)
   - 路灯、长椅、标志牌
   - 花坛、栅栏、邮箱
   - 互动物品 (任务标记等)

### 第三阶段：后期处理
1. **统一处理**
   - 去除背景
   - 调整尺寸到标准网格
   - 统一阴影方向和强度

2. **优化导出**
   - PNG 格式，透明背景
   - 2x 和 4x 分辨率 (适配不同屏幕)
   - 压缩优化 (保持质量)

---

## 📏 资产规格标准

### 建筑尺寸规范
```
小型建筑: 2x2 格子 (128x64 像素基础)
中型建筑: 3x3 格子 (192x96 像素基础)
大型建筑: 4x4 格子 (256x128 像素基础)
高度: 2-4 层 (32-64 像素)
```

### 角色尺寸规范
```
角色高度: 48-64 像素 (约 1.5 格子高)
角色宽度: 32-48 像素
动画帧数: 4-8 帧 (行走、站立、说话)
```

### 道具尺寸规范
```
小道具: 0.5x0.5 格子 (32x16 像素)
中道具: 1x1 格子 (64x32 像素)
大道具: 1.5x1.5 格子 (96x48 像素)
```

---

## 🎨 推荐 AI 工具

### 图像生成工具
1. **Midjourney** (推荐)
   - 优点: 风格一致性好，质量高
   - 适合: 概念图、建筑、场景

2. **DALL-E 3**
   - 优点: 精确控制，文字理解好
   - 适合: 特定需求、细节调整

3. **Stable Diffusion** (本地)
   - 优点: 完全控制，无限生成
   - 适合: 批量生成、风格训练

### 辅助工具
- **Remove.bg** - 自动去背景
- **Photoshop / Figma** - 后期调整
- **TexturePacker** - 打包精灵图
- **Aseprite** - 像素级调整

---

## 📋 资产清单 (新手村)

### 必需资产 (MVP)
- [ ] 地面纹理 (草地、道路、石板) - 6种
- [ ] 主要建筑 (村长办公室、面包店、2个房屋) - 4个
- [ ] 树木 (大中小) - 3种
- [ ] 主要NPC (村长喵喵、柴犬小柴、小猪培根、兔子露露) - 4个
- [ ] 基础装饰 (路灯、长椅、花坛、标志牌) - 8个

### 扩展资产 (完整版)
- [ ] 更多建筑变体 - 6个
- [ ] 季节性装饰 - 10个
- [ ] 动态元素 (喷泉、旗帜) - 4个
- [ ] 特效 (光晕、粒子) - 6个
- [ ] UI元素 (按钮、图标) - 20个

---

## 🎬 动画规范

### 角色动画
```
站立 (Idle): 2-4帧循环，轻微呼吸
行走 (Walk): 4-6帧循环
说话 (Talk): 2-3帧循环，嘴部动画
互动 (Interact): 4-6帧，挥手/点头
```

### 环境动画
```
树叶摇摆: 3-4帧，慢速循环
水面波动: 4-6帧，中速循环
烟雾上升: 6-8帧，慢速循环
旗帜飘动: 4-6帧，中速循环
```

---

## 🔄 迭代优化流程

### 第一轮：风格确认
1. 生成 3-5 个测试资产
2. 团队评审，确定最终风格
3. 记录关键参数和提示词

### 第二轮：批量生成
1. 按资产清单批量生成
2. 保持提示词一致性
3. 记录所有生成参数

### 第三轮：整合测试
1. 导入游戏引擎测试
2. 检查视觉一致性
3. 调整不协调的资产

### 第四轮：优化完善
1. 补充缺失资产
2. 优化性能 (文件大小)
3. 准备其他关卡资产

---

## 📝 注意事项

### 保持一致性的关键
1. **使用相同的基础提示词**
2. **保持相同的色彩系统**
3. **统一光源方向**
4. **相同的细节程度**
5. **一致的轮廓风格**

### 避免的问题
- ❌ 混合不同的艺术风格
- ❌ 不一致的光影方向
- ❌ 色彩饱和度差异过大
- ❌ 细节程度不统一
- ❌ 比例不协调

---

## 🎯 下一步行动

1. **选择 AI 工具** - 推荐从 Midjourney 开始
2. **生成风格参考** - 创建新手村全景图
3. **测试提示词** - 生成 3-5 个建筑测试一致性
4. **批量生成** - 按资产清单逐步完成
5. **整合测试** - 导入 Phaser 3 测试效果

需要我帮你生成具体的 AI 提示词或者开始设计其他关卡吗？
