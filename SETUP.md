# 开发环境配置指南

本文档提供完整的开发环境配置步骤。

## 系统要求

- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **Node.js**: 20.x 或更高版本
- **PostgreSQL**: 12.x 或更高版本
- **Redis**: 6.x 或更高版本
- **MongoDB**: 5.x 或更高版本
- **Git**: 2.x 或更高版本

## 1. 安装 Node.js

### Windows
从 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本。

### macOS
```bash
brew install node@20
```

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

验证安装：
```bash
node --version  # 应显示 v20.x.x
npm --version   # 应显示 10.x.x
```

## 2. 安装 PostgreSQL

### Windows
从 [PostgreSQL 官网](https://www.postgresql.org/download/windows/) 下载安装程序。

### macOS
```bash
brew install postgresql@16
brew services start postgresql@16
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

配置 PostgreSQL：
```bash
# 创建数据库用户
sudo -u postgres createuser --interactive --pwprompt

# 设置密码并记录到 .env 文件中
```

## 3. 安装 Redis

### Windows
从 [Redis 官网](https://redis.io/download) 下载或使用 WSL。

### macOS
```bash
brew install redis
brew services start redis
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

验证安装：
```bash
redis-cli ping  # 应返回 PONG
```

## 4. 安装 MongoDB

### Windows
从 [MongoDB 官网](https://www.mongodb.com/try/download/community) 下载安装程序。

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

验证安装：
```bash
mongosh --version
```

## 5. 克隆项目

```bash
git clone https://github.com/datappt8/ENGLISH-AI.git
cd ENGLISH-AI
```

## 6. 配置环境变量

### 前端配置

```bash
cd frontend
cp .env.example .env
```

编辑 `frontend/.env`：
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
```

### 后端配置

```bash
cd ../backend
cp .env.example .env
```

编辑 `backend/.env`：
```env
NODE_ENV=development
PORT=5000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=english_quest_mvp
DB_USER=postgres
DB_PASSWORD=your_password_here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# MongoDB
MONGODB_URI=mongodb://localhost:27017/english_quest

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Claude API (可选，用于 AI 对话)
CLAUDE_API_KEY=your_claude_api_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 7. 初始化数据库

```bash
# 从项目根目录
cd database

# 初始化 PostgreSQL 数据库
psql -U postgres -f init.sql

# 插入种子数据
psql -U postgres -d english_quest_mvp -f seed.sql
```

如果遇到权限问题：
```bash
# Windows (使用 psql 命令行)
psql -U postgres
\i D:/ENGLISH-AI/database/init.sql
\c english_quest_mvp
\i D:/ENGLISH-AI/database/seed.sql
```

## 8. 安装项目依赖

### 安装前端依赖
```bash
cd frontend
npm install
```

### 安装后端依赖
```bash
cd ../backend
npm install
```

## 9. 启动开发服务器

### 启动后端 (终端 1)
```bash
cd backend
npm run dev
```

后端将在 http://localhost:5000 启动

### 启动前端 (终端 2)
```bash
cd frontend
npm run dev
```

前端将在 http://localhost:3000 启动

## 10. 验证安装

访问 http://localhost:3000，你应该能看到：
- ✅ 首页正常显示
- ✅ 可以访问登录/注册页面
- ✅ 后端 API 健康检查: http://localhost:5000/health

## 常见问题

### 1. PostgreSQL 连接失败

**错误**: `ECONNREFUSED` 或 `password authentication failed`

**解决方案**:
- 确保 PostgreSQL 服务正在运行
- 检查 `backend/.env` 中的数据库配置
- 确认数据库用户和密码正确

### 2. Redis 连接失败

**错误**: `Redis connection error`

**解决方案**:
```bash
# 检查 Redis 是否运行
redis-cli ping

# 如果没有运行，启动 Redis
# macOS/Linux
brew services start redis
# 或
sudo systemctl start redis-server
```

### 3. 端口被占用

**错误**: `Port 3000 is already in use`

**解决方案**:
```bash
# 查找占用端口的进程
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# 终止进程或更改端口
```

### 4. npm install 失败

**错误**: 依赖安装失败

**解决方案**:
```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 5. 数据库初始化失败

**错误**: `database "english_quest_mvp" does not exist`

**解决方案**:
```bash
# 手动创建数据库
psql -U postgres
CREATE DATABASE english_quest_mvp;
\q

# 然后重新运行初始化脚本
psql -U postgres -d english_quest_mvp -f database/init.sql
```

## 开发工具推荐

### IDE
- **VS Code** (推荐)
  - 扩展: ESLint, Prettier, TypeScript, GitLens
- **WebStorm**

### 数据库管理
- **pgAdmin** (PostgreSQL)
- **Redis Commander** (Redis)
- **MongoDB Compass** (MongoDB)

### API 测试
- **Postman**
- **Insomnia**

### Git 客户端
- **GitHub Desktop**
- **GitKraken**

## 下一步

环境配置完成后，你可以：

1. 查看 [前端开发指南](frontend/README.md)
2. 查看 [后端开发指南](backend/README.md)
3. 查看 [数据库文档](database/README.md)
4. 开始开发新功能！

## 获取帮助

如果遇到问题：
1. 查看本文档的常见问题部分
2. 查看项目 [Issues](https://github.com/datappt8/ENGLISH-AI/issues)
3. 创建新的 Issue 描述你的问题
