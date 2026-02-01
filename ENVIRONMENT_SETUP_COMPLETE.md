# 🎉 开发环境配置完成指南

## ✅ 已完成的配置

### 1. Node.js 环境
- ✅ Node.js v25.2.1
- ✅ npm 11.6.4
- ✅ 前端依赖已安装（React + Vite + TypeScript）
- ✅ 后端依赖已安装（Express + TypeScript）

### 2. 项目配置文件
- ✅ `frontend/.env` - 前端环境变量
- ✅ `backend/.env` - 后端环境变量（JWT密钥已设置）

### 3. 项目结构
```
ENGLISH-AI/
├── frontend/           ✅ 前端依赖已安装
│   ├── node_modules/  ✅
│   └── .env           ✅ 配置完成
├── backend/           ✅ 后端依赖已安装
│   ├── node_modules/  ✅
│   └── .env           ✅ 配置完成
├── database/          ✅ 数据库脚本准备就绪
│   ├── init.sql       ✅ 初始化脚本
│   └── seed.sql       ✅ 种子数据（5个新手村任务）
└── node_modules/      ✅ 根目录依赖已安装
```

---

## ⚠️ 待完成配置

### 必需配置

#### 1. 安装 PostgreSQL 数据库
PostgreSQL 是项目运行的**必需组件**，用于存储用户数据、任务进度等核心数据。

**安装指南**：请查看 `INSTALL_POSTGRESQL_WINDOWS.md`

**快速步骤**：
1. 下载：https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
2. 安装并设置密码（记住这个密码！）
3. 运行初始化脚本：
   ```bash
   psql -U postgres -f database/init.sql
   psql -U postgres -d english_quest_mvp -f database/seed.sql
   ```
4. 更新 `backend/.env` 中的 `DB_PASSWORD`

#### 2. 配置 Claude API 密钥
Claude API 用于 AI 对话功能，是核心功能之一。

**获取 API 密钥**：
1. 访问：https://console.anthropic.com/
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的 API Key

**配置方法**：
编辑 `backend/.env`，更新：
```env
CLAUDE_API_KEY=sk-ant-api03-你的密钥
```

### 可选配置

#### 3. Redis（可选 - 用于缓存和会话管理）
**Windows 安装**：
- 使用 WSL2：https://redis.io/docs/getting-started/installation/install-redis-on-windows/
- 或使用 Memurai（Windows 原生）：https://www.memurai.com/

**配置**：
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### 4. MongoDB（可选 - 用于对话历史存储）
**Windows 安装**：
- 下载：https://www.mongodb.com/try/download/community
- 安装 MongoDB Community Server

**配置**：
```env
MONGODB_URI=mongodb://localhost:27017/english_quest
```

---

## 🚀 启动项目

### 前提条件检查

在启动前，确保：
- ✅ PostgreSQL 已安装并运行
- ✅ `backend/.env` 中的 `DB_PASSWORD` 已更新
- ✅ `backend/.env` 中的 `CLAUDE_API_KEY` 已配置（如需使用 AI 功能）

### 启动命令

#### 方法1：同时启动前后端（推荐）
```bash
npm run dev
```

#### 方法2：分别启动

**终端1 - 启动后端**：
```bash
npm run dev:backend
# 或
cd backend && npm run dev
```

**终端2 - 启动前端**：
```bash
npm run dev:frontend
# 或
cd frontend && npm run dev
```

### 访问地址

- 🌐 **前端**：http://localhost:5173
- 🔌 **后端 API**：http://localhost:5000
- 📊 **API 健康检查**：http://localhost:5000/health

---

## 🧪 测试安装

### 1. 测试前端
```bash
cd frontend
npm run dev
```
访问 http://localhost:5173，应该能看到游戏首页。

### 2. 测试后端
```bash
cd backend
npm run dev
```
访问 http://localhost:5000/health，应该返回：
```json
{
  "status": "ok",
  "timestamp": "2026-02-01T..."
}
```

### 3. 测试数据库连接
启动后端后，查看控制台输出：
```
✅ PostgreSQL connected successfully
🚀 Server running on http://localhost:5000
```

---

## 📝 环境变量配置清单

### frontend/.env
```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# WebSocket URL
VITE_WS_URL=ws://localhost:5000
```

### backend/.env
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database - PostgreSQL（必需）
DB_HOST=localhost
DB_PORT=5432
DB_NAME=english_quest_mvp
DB_USER=postgres
DB_PASSWORD=你的PostgreSQL密码  # ⚠️ 必须配置

# Redis（可选）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# MongoDB（可选）
MONGODB_URI=mongodb://localhost:27017/english_quest

# JWT Secret（已配置）
JWT_SECRET=english_quest_dev_secret_key_2026_change_in_production
JWT_EXPIRES_IN=7d

# Claude API（必需 - 用于AI对话）
CLAUDE_API_KEY=你的Claude_API密钥  # ⚠️ 必须配置

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=debug
```

---

## 🎮 项目功能概览

### 已实现的功能

1. **用户认证系统** ✅
   - 用户注册/登录
   - JWT 认证
   - 会话管理

2. **任务系统** ✅
   - 5个新手村任务
   - 任务进度追踪
   - 经验值和等级系统
   - 奖励机制

3. **AI 对话系统** ✅
   - Claude API 集成
   - 实时对话
   - 自动评分和反馈
   - 对话历史管理

4. **游戏角色系统** ✅
   - 角色创建
   - 属性管理
   - 等级提升

### 数据库包含的内容

**5个新手村任务**：
1. 初次见面 - 与村长喵喵对话，学习基础问候语
2. 自我介绍 - 与柴犬小柴交流，学习自我介绍
3. 探索村庄 - 跟随小柴参观，学习询问地点和方向
4. 面包店购物 - 在小猪培根的店里学习购物用语
5. 帮助村民 - 帮兔子露露找猫咪，学习提供帮助

---

## 🔧 常用命令

### 安装相关
```bash
npm run install:all      # 安装所有依赖
npm run install:frontend # 仅安装前端依赖
npm run install:backend  # 仅安装后端依赖
```

### 开发相关
```bash
npm run dev              # 同时启动前后端
npm run dev:frontend     # 仅启动前端
npm run dev:backend      # 仅启动后端
```

### 构建相关
```bash
npm run build            # 构建前后端
npm run build:frontend   # 仅构建前端
npm run build:backend    # 仅构建后端
```

### 测试相关
```bash
npm run test             # 运行测试
npm run lint             # 代码检查
npm run lint:fix         # 自动修复代码问题
```

### 清理相关
```bash
npm run clean            # 清理前后端 node_modules
npm run clean:all        # 清理所有 node_modules
```

### 数据库相关
```bash
cd backend
npm run db:migrate       # 运行数据库迁移
npm run db:seed          # 插入种子数据
```

---

## 🐛 常见问题

### 1. 前端启动失败
**错误**：`Port 5173 is already in use`

**解决**：
```bash
# 查找占用端口的进程
netstat -ano | findstr :5173
# 终止进程或更改端口
```

### 2. 后端启动失败
**错误**：`PostgreSQL connection error`

**解决**：
- 确保 PostgreSQL 服务正在运行
- 检查 `backend/.env` 中的数据库配置
- 验证数据库密码是否正确

### 3. AI 对话功能不工作
**错误**：`Claude API error`

**解决**：
- 检查 `backend/.env` 中的 `CLAUDE_API_KEY` 是否配置
- 验证 API 密钥是否有效
- 检查 API 配额是否用完

### 4. bcrypt 相关错误
**错误**：`bcrypt binding error`

**解决**：
```bash
cd backend
npm rebuild bcrypt
```

### 5. 数据库初始化失败
**错误**：`database already exists`

**解决**：
```bash
# 删除并重新创建数据库
psql -U postgres -c "DROP DATABASE IF EXISTS english_quest_mvp;"
psql -U postgres -f database/init.sql
psql -U postgres -d english_quest_mvp -f database/seed.sql
```

---

## 📚 相关文档

- `README.md` - 项目总览
- `SETUP.md` - 详细安装指南
- `QUICKSTART.md` - 快速开始指南
- `PROJECT_STRUCTURE.md` - 项目结构说明
- `INSTALL_POSTGRESQL_WINDOWS.md` - PostgreSQL Windows 安装指南
- `Design_Manage/PROJECT_OVERVIEW.md` - 项目设计文档
- `Design_Manage/ROADMAP.md` - 开发路线图

---

## 🎯 下一步行动

### 立即行动（必需）
1. ⚠️ **安装 PostgreSQL** - 参考 `INSTALL_POSTGRESQL_WINDOWS.md`
2. ⚠️ **配置数据库密码** - 更新 `backend/.env`
3. ⚠️ **获取 Claude API 密钥** - 访问 https://console.anthropic.com/
4. ⚠️ **配置 API 密钥** - 更新 `backend/.env`
5. ✅ **启动项目** - 运行 `npm run dev`

### 可选行动
- 安装 Redis（提升性能）
- 安装 MongoDB（存储对话历史）
- 配置 pgAdmin 4（数据库管理工具）

---

## 🎊 完成后

当所有配置完成后，你将能够：

✅ 访问游戏首页
✅ 注册/登录用户账号
✅ 创建游戏角色
✅ 与 AI NPC 进行英语对话
✅ 完成新手村任务
✅ 获得经验值和奖励
✅ 查看学习进度和统计

---

## 💡 提示

- 开发时保持前后端同时运行
- 使用 pgAdmin 4 查看和管理数据库
- 查看后端控制台日志了解 API 调用情况
- 使用浏览器开发者工具调试前端问题

---

## 📞 获取帮助

如果遇到问题：
1. 查看本文档的"常见问题"部分
2. 查看相关文档（README.md, SETUP.md 等）
3. 检查控制台日志输出
4. 查看项目 Issues

---

**祝你开发愉快！🚀**
