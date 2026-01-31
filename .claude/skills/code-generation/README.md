# Code Generation Skill

代码生成Agent - 负责English Quest项目的前后端代码实现、数据库开发和API集成。

## 功能

- 前端开发 (React + TypeScript + Phaser 3)
- 后端开发 (Node.js + Express + Socket.io)
- 数据库设计和实现 (PostgreSQL + Redis + MongoDB)
- API开发和集成
- 代码优化和重构
- 安全加固和性能优化

## 使用方法

在Claude Code中调用此Skill：

```bash
# 方式1: 使用Skill工具
使用code-generation skill

# 方式2: 直接描述任务
"使用code-generation skill实现用户注册登录功能"
"使用code-generation skill创建游戏场景"
```

## 技术栈

### 前端
- React 18 + TypeScript
- Phaser 3 (游戏引擎)
- Vite (构建工具)
- Zustand/Redux (状态管理)

### 后端
- Node.js 20+
- Express.js
- Socket.io (实时通信)
- Prisma (ORM)
- JWT (认证)

### 数据库
- PostgreSQL (主数据库)
- Redis (缓存)
- MongoDB (文档存储)

### 第三方服务
- Claude API (AI对话)
- Web Speech API (语音识别)

## 输出

所有代码保存在：
- `frontend/` - 前端代码
- `backend/` - 后端代码
- `shared/` - 共享代码

## 编码规范

- 严格的TypeScript类型检查
- 遵循ESLint和Prettier规范
- 编写清晰的注释和文档
- 注重代码安全性和性能
- 编写单元测试和集成测试

## 相关文档

- [技术架构文档](../../../Design_Manage/technical/TECH_ARCHITECTURE.md)
- [Agent架构](../../../Design_Manage/ai_agents/AGENT_ARCHITECTURE.md)
- [游戏设计文档](../../../Design_Manage/game_design/GAME_DESIGN.md)

## 示例任务

```bash
# 创建前端组件
"创建用户个人资料页面组件"

# 实现后端API
"实现用户注册和登录API"

# 开发游戏场景
"使用Phaser创建新手村场景"

# 数据库设计
"设计用户、角色和任务的数据库表结构"

# 集成第三方服务
"集成Claude API实现AI对话功能"
```

## 协作

与以下Agents协作：
- **architecture** - 接收架构设计和技术方案
- **game-design** - 实现游戏玩法和关卡
- **testing** - 接收测试反馈并修复Bug
