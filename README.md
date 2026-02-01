# 🎮 Talkgame

> **Talk, Play, Master English** - 说着玩，玩着学

一款AI驱动的多人在线英语口语学习游戏，通过闯关冒险的方式让英语学习变得有趣。

---

## 🤖 AI Agent 团队（重要）

本项目使用 **7个 AI Agent 协作开发**，使用 `@数字` 调用：

| Agent | 职责 | 调用方式 |
|-------|------|---------|
| **@1** project-manager | 项目管理（主控，YOLO模式） | `@1 开发新功能` |
| **@2** game-design | 游戏策划和关卡设计 | `@2 设计关卡` |
| **@3** architecture | 系统架构和技术选型 | `@3 设计架构` |
| **@4** character-design | 角色、场景、UI设计 | `@4 设计角色` |
| **@5** code-generation | 前后端代码实现 | `@5 实现功能` |
| **@6** testing | 功能测试和质量保证 | `@6 测试功能` |
| **@7** monetization | 变现策略和数据分析 | `@7 优化转化` |

**详细说明**: 查看 [AGENTS.md](AGENTS.md) | [完整指南](Design_Manage/AGENT_GUIDE.md)

---

## ✨ 核心特性

### 🤖 AI智能对话
- 基于Claude API的智能NPC
- 实时语音识别和发音评分
- 个性化AI导师系统
- 智能语法纠正

### 👥 真人互动
- 实时配对练习
- 多人协作任务
- 竞技场对战
- 公会系统

### 🎯 闯关模式
- **新手村** (Lv 1-10) - A1水平
- **初级森林** (Lv 11-25) - A2水平
- **中级城堡** (Lv 26-45) - B1-B2水平
- **高级都市** (Lv 46-70) - C1水平
- **专家峰顶** (Lv 71-100) - C2水平

### 🏆 奖励系统
- 经验值和等级系统
- 虚拟货币（金币+钻石）
- 成就和称号
- 排行榜

### 💎 分级付费
- **免费版** - 新手村完整体验
- **标准会员** (¥39/月) - 解锁到中级城堡
- **高级会员** (¥99/月) - 全部区域+AI导师
- **VIP会员** (¥299/月) - 全部权限+真人外教

---

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **游戏引擎**: Phaser 3 (2D游戏)
- **状态管理**: Zustand
- **实时通信**: Socket.io-client
- **样式**: Tailwind CSS
- **构建工具**: Vite

### 后端
- **运行时**: Node.js 20+
- **框架**: Express.js + Socket.io
- **语言**: TypeScript
- **ORM**: Prisma
- **认证**: JWT

### 数据库
- **PostgreSQL** - 用户数据、游戏数据
- **Redis** - 缓存、会话、排行榜
- **MongoDB** - 对话记录、日志

### AI服务
- **Claude API** - AI对话和语法纠正
- **Web Speech API** - 语音识别
- **自研算法** - 发音评分

### 部署
- **容器化**: Docker + Docker Compose
- **云服务**: AWS / Azure / 阿里云
- **CDN**: CloudFlare

---

## 🏗️ 项目结构

```
talkgame/
├── .claude/
│   └── skills/              # AI Agent系统
│       ├── project-manager/ # 主控Agent（YOLO模式）
│       ├── game-design/     # 游戏策划
│       ├── architecture/    # 系统架构
│       ├── character-design/# 角色设计
│       ├── code-generation/ # 代码生成
│       ├── testing/         # 测试
│       └── monetization/    # 变现优化
│
├── Design_Manage/           # 设计文档
│   ├── game_design/         # 游戏设计
│   ├── technical/           # 技术架构
│   ├── assets/              # 资源设计
│   └── logs/                # 开发日志
│
├── frontend/                # 前端代码
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── scenes/          # Phaser场景
│   │   ├── services/        # API服务
│   │   └── stores/          # 状态管理
│   └── package.json
│
├── backend/                 # 后端代码
│   ├── src/
│   │   ├── routes/          # API路由
│   │   ├── services/        # 业务逻辑
│   │   ├── models/          # 数据模型
│   │   └── socket/          # WebSocket
│   └── package.json
│
├── shared/                  # 共享代码
│   └── types/               # TypeScript类型
│
├── docker-compose.yml       # Docker配置
└── README.md
```

---

## 🚀 快速开始

### 📚 完整安装指南

**新手必看**：
- 📖 [环境配置完成指南](ENVIRONMENT_SETUP_COMPLETE.md) - **推荐阅读**
- 🪟 [PostgreSQL Windows 安装指南](INSTALL_POSTGRESQL_WINDOWS.md)
- 📋 [详细安装步骤](SETUP.md)
- ⚡ [快速启动指南](QUICKSTART.md)

### 环境要求
- ✅ Node.js 20+ (已安装 v25.2.1)
- ⚠️ PostgreSQL 16+ (需要安装)
- 🔧 Redis 7+ (可选)
- 🔧 MongoDB 7+ (可选)

### 一键安装依赖
```bash
# 安装所有依赖（前端+后端）
npm run install:all

# 或分别安装
npm run install:frontend  # 安装前端依赖
npm run install:backend   # 安装后端依赖
```

### 配置环境变量

**前端配置** (`frontend/.env`)：
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
```

**后端配置** (`backend/.env`)：
```env
# 数据库配置（必需）
DB_PASSWORD=你的PostgreSQL密码

# Claude API（必需 - AI对话功能）
CLAUDE_API_KEY=你的Claude_API密钥

# 其他配置已预设
```

### 初始化数据库
```bash
# 1. 安装 PostgreSQL（参考 INSTALL_POSTGRESQL_WINDOWS.md）

# 2. 运行初始化脚本
psql -U postgres -f database/init.sql

# 3. 插入种子数据（5个新手村任务）
psql -U postgres -d english_quest_mvp -f database/seed.sql
```

### 启动项目
```bash
# 同时启动前后端（推荐）
npm run dev

# 或分别启动
npm run dev:frontend  # 前端: http://localhost:5173
npm run dev:backend   # 后端: http://localhost:5000
```

访问 http://localhost:5173 开始体验！

### ⚡ 当前状态
- ✅ 前端依赖已安装
- ✅ 后端依赖已安装
- ✅ 环境配置文件已创建
- ⚠️ 需要安装 PostgreSQL 并配置密码
- ⚠️ 需要配置 Claude API 密钥

---

## 🤖 AI Agent开发系统

本项目使用**7个AI Agent协作开发**，由主控Agent（YOLO模式）统一管理：

### 使用方法
```bash
# 与主Agent对话（使用 @1 识别符）
@1 开发新手村功能
@1 优化付费转化
@1 修复所有Bug
```

### Agent列表
- **project-manager** - 主控Agent，协调所有工作
- **game-design** - 游戏策划和关卡设计
- **architecture** - 系统架构和技术选型
- **character-design** - 角色、场景、UI设计
- **code-generation** - 前后端代码实现
- **testing** - 功能测试和质量保证
- **monetization** - 变现策略和数据分析

详见：[Agent使用指南](Design_Manage/AGENT_GUIDE.md)

---

## 📖 文档

- [项目总览](Design_Manage/PROJECT_OVERVIEW.md)
- [游戏设计](Design_Manage/game_design/GAME_DESIGN.md)
- [技术架构](Design_Manage/technical/TECH_ARCHITECTURE.md)
- [变现策略](Design_Manage/game_design/MONETIZATION.md)
- [开发路线图](Design_Manage/ROADMAP.md)
- [Agent系统](Design_Manage/AGENT_GUIDE.md)

---

## 🎯 开发路线图

### ✅ 阶段0: 项目规划（已完成）
- 完整的游戏设计文档
- 技术架构设计
- AI Agent系统搭建

### ⏳ 阶段1: MVP开发（进行中）
- ✅ 项目代码结构搭建完成
- ✅ 前端框架配置完成 (React + TypeScript + Phaser)
- ✅ 后端框架配置完成 (Node.js + Express + TypeScript)
- ✅ 数据库架构设计完成 (PostgreSQL + Redis + MongoDB)
- ✅ 5个新手村任务设计完成
- ✅ 4个宠物角色设计完成
- 🚧 基础AI对话系统开发中
- 🚧 用户认证系统开发中

### 📅 阶段2: 核心功能（计划中）
- 5个区域全部开放
- 真人互动功能
- 付费系统

### 📅 阶段3: 高级功能（计划中）
- AI导师系统
- 多人协作任务
- 数据分析系统

### 📅 阶段4: 正式发布（计划中）
- 性能优化
- 全面测试
- 正式上线

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献
1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 代码规范
- 使用TypeScript
- 遵循ESLint规则
- 编写单元测试
- 添加必要注释

---

## 📊 项目状态

![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/talkgame?style=social)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/talkgame?style=social)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/talkgame)
![GitHub license](https://img.shields.io/github/license/YOUR_USERNAME/talkgame)

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 💬 联系我们

- **项目主页**: https://github.com/YOUR_USERNAME/talkgame
- **问题反馈**: [GitHub Issues](https://github.com/YOUR_USERNAME/talkgame/issues)
- **讨论区**: [GitHub Discussions](https://github.com/YOUR_USERNAME/talkgame/discussions)

---

## 🌟 致谢

感谢所有为本项目做出贡献的开发者！

特别感谢：
- [Claude AI](https://claude.ai) - AI对话引擎
- [Phaser](https://phaser.io) - 游戏引擎
- [React](https://react.dev) - 前端框架

---

**⭐ 如果这个项目对您有帮助，请给我们一个Star！**

**🎮 Talk, Play, Master English - 说着玩，玩着学！**
