# English Quest - Backend

Node.js + Express + TypeScript 后端 API 服务器

## 技术栈

- **Node.js 20+** - 运行时环境
- **Express** - Web 框架
- **TypeScript** - 类型安全
- **PostgreSQL** - 主数据库
- **Redis** - 缓存
- **MongoDB** - 日志存储
- **Socket.IO** - WebSocket 实时通信
- **JWT** - 身份认证
- **Bcrypt** - 密码加密

## 开发环境设置

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

需要配置的环境变量：
- 数据库连接信息（PostgreSQL, Redis, MongoDB）
- JWT 密钥
- Claude API 密钥
- CORS 设置

### 3. 初始化数据库

```bash
npm run db:migrate
npm run db:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:5000 启动

## 项目结构

```
src/
├── config/          # 配置文件（数据库连接等）
├── controllers/     # 控制器（处理请求）
├── services/        # 业务逻辑服务
├── models/          # 数据模型
├── routes/          # 路由定义
├── middleware/      # 中间件（认证、错误处理等）
├── utils/           # 工具函数
├── types/           # TypeScript 类型定义
├── database/        # 数据库迁移和种子文件
└── server.ts        # 应用入口
```

## 可用脚本

- `npm run dev` - 启动开发服务器（带热重载）
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run lint` - 运行 ESLint
- `npm test` - 运行测试
- `npm run db:migrate` - 运行数据库迁移
- `npm run db:seed` - 填充测试数据

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新 token

### 用户
- `GET /api/users/me` - 获取当前用户信息
- `PATCH /api/users/me` - 更新用户资料
- `GET /api/users/me/stats` - 获取用户统计

### 任务
- `GET /api/quests` - 获取任务列表
- `GET /api/quests/:id` - 获取任务详情
- `POST /api/quests/:id/start` - 开始任务
- `POST /api/quests/:id/submit` - 提交任务

### AI 对话
- `POST /api/ai/dialogue` - 发送对话消息
- `POST /api/ai/dialogue/:sessionId/end` - 结束对话会话

## 开发注意事项

1. 所有 API 响应遵循统一格式
2. 使用 JWT 进行身份认证
3. 敏感数据使用 bcrypt 加密
4. 实现了完整的错误处理机制
5. 使用 TypeScript 确保类型安全

## 数据库

### PostgreSQL
- 用户数据
- 任务数据
- 游戏进度

### Redis
- 会话管理
- 缓存
- 限流

### MongoDB
- AI 对话记录
- 学习日志
