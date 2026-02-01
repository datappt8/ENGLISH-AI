# 🎨 资源目录

这个目录包含游戏的所有美术资源。

## 📁 目录结构

```
assets/
├── tiles/              # 地面瓦片 (64x32)
├── buildings/          # 建筑物 (128x128+)
├── decorations/        # 装饰物 (各种尺寸)
├── characters/         # 角色精灵
│   ├── player/        # 玩家角色
│   └── npcs/          # NPC角色
└── ui/                # UI元素
```

## 🚀 快速开始

### 当前状态
目前游戏使用**几何图形占位符**，无需美术资源即可运行。

### 添加美术资源

1. **准备资源**
   - 参考 `ASSETS_GUIDE.md` 了解详细规格
   - 确保文件名和尺寸符合要求

2. **放置文件**
   - 将资源文件放入对应目录
   - 保持文件名一致

3. **自动加载**
   - 游戏会自动尝试加载资源
   - 如果资源不存在，自动使用占位符

## 📝 资源清单

### 必需资源（高优先级）
- [ ] `tiles/grass.png` - 草地瓦片
- [ ] `tiles/stone_path.png` - 石头路径
- [ ] `buildings/chief_office.png` - 村长办公室
- [ ] `buildings/bakery.png` - 面包店
- [ ] `buildings/library.png` - 图书馆
- [ ] `decorations/tree_large.png` - 大树
- [ ] `characters/player/idle.png` - 玩家待机
- [ ] `characters/player/walk.png` - 玩家行走
- [ ] `characters/npcs/meow.png` - 村长喵喵
- [ ] `characters/npcs/baker.png` - 面包师
- [ ] `characters/npcs/librarian.png` - 图书管理员

### 可选资源（中优先级）
- [ ] `tiles/dirt.png` - 泥土地面
- [ ] `buildings/house_1.png` - 普通房屋1
- [ ] `buildings/house_2.png` - 普通房屋2
- [ ] `decorations/tree_small.png` - 小树
- [ ] `decorations/lamp.png` - 路灯
- [ ] `ui/dialogue_box.png` - 对话框
- [ ] `ui/button_normal.png` - 按钮（正常）
- [ ] `ui/button_hover.png` - 按钮（悬停）

## 🎨 制作指南

详细的制作指南请参考项目根目录的 `ASSETS_GUIDE.md`

### 快速规格
- **地面瓦片**: 64x32 像素，PNG透明背景
- **建筑物**: 128x128+ 像素，PNG透明背景
- **角色**: 64x64 像素/帧，精灵表格式
- **风格**: 2.5D等距投影，卡通风格

## 🔗 资源来源

### 免费资源网站
- [OpenGameArt.org](https://opengameart.org/)
- [Kenney.nl](https://kenney.nl/)
- [Itch.io](https://itch.io/game-assets/free)

### AI生成工具
- DALL-E 3
- Midjourney
- Stable Diffusion

### 制作工具
- Aseprite (像素艺术)
- Photoshop (2D艺术)
- GIMP (免费替代)

## 💡 临时方案

在等待美术资源期间：
1. 游戏使用几何图形占位符
2. 功能完全正常
3. 可以正常测试游戏玩法
4. 资源准备好后直接替换即可

## 📞 需要帮助？

如果需要帮助制作资源，请查看：
- `ASSETS_GUIDE.md` - 完整的美术指南
- 项目README - 联系方式

---

**最后更新**: 2026-02-01
