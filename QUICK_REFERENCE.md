# 🚀 快速参考卡片

## 📋 当前环境状态

| 组件 | 状态 | 版本/说明 |
|------|------|-----------|
| Node.js | ✅ 已安装 | v25.2.1 |
| npm | ✅ 已安装 | 11.6.4 |
| 前端依赖 | ✅ 已安装 | React + Vite + TypeScript |
| 后端依赖 | ✅ 已安装 | Express + TypeScript |
| PostgreSQL | ⚠️ 需安装 | 参考 INSTALL_POSTGRESQL_WINDOWS.md |
| Redis | 🔧 可选 | 缓存和会话管理 |
| MongoDB | 🔧 可选 | 对话历史存储 |

---

## ⚡ 常用命令

### 启动项目
```bash
npm run dev              # 同时启动前后端
npm run dev:frontend     # 仅启动前端 (http://localhost:5173)
npm run dev:backend      # 仅启动后端 (http://localhost:5000)
```

### 安装依赖
```bash
npm run install:all      # 安装所有依赖
npm run install:frontend # 仅安装前端
npm run install:backend  # 仅安装后端
```

### 数据库操作
```bash
# 初始化数据库
psql -U postgres -f database/init.sql

# 插入种子数据
psql -U postgres -d english_quest_mvp -f database/seed.sql

# 重置数据库
psql -U postgres -c "DROP DATABASE IF EXISTS english_quest_mvp;"
psql -U postgres -f database/init.sql
psql -U postgres -d english_quest_mvp -f database/seed.sql
```

### 构建和测试
```bash
npm run build            # 构建前后端
npm run test             # 运行测试
npm run lint             # 代码检查
npm run clean:all        # 清理所有依赖
```

---

## 🔧 配置文件位置

### 前端配置
- **文件**: `frontend/.env`
- **内容**:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  VITE_WS_URL=ws://localhost:5000
  ```

### 后端配置
- **文件**: `backend/.env`
- **必需配置**:
  ```env
  DB_PASSWORD=你的PostgreSQL密码
  CLAUDE_API_KEY=你的Claude_API密钥
  ```

---

## 📚 文档快速链接

| 文档 | 用途 |
|------|------|
| [ENVIRONMENT_SETUP_COMPLETE.md](ENVIRONMENT_SETUP_COMPLETE.md) | 环境配置完成指南（推荐） |
| [INSTALL_POSTGRESQL_WINDOWS.md](INSTALL_POSTGRESQL_WINDOWS.md) | PostgreSQL Windows 安装 |
| [SETUP.md](SETUP.md) | 详细安装步骤 |
| [QUICKSTART.md](QUICKSTART.md) | 快速启动指南 |
| [README.md](README.md) | 项目总览 |
| [Design_Manage/ROADMAP.md](Design_Manage/ROADMAP.md) | 开发路线图 |

---

## 🎯 下一步行动清单

### 必需完成
- [ ] 安装 PostgreSQL
- [ ] 配置数据库密码 (`backend/.env`)
- [ ] 获取 Claude API 密钥
- [ ] 配置 API 密钥 (`backend/.env`)
- [ ] 初始化数据库
- [ ] 启动项目测试

### 可选完成
- [ ] 安装 Redis
- [ ] 安装 MongoDB
- [ ] 配置 pgAdmin 4

---

## 🐛 常见问题速查

### 前端启动失败
```bash
# 端口被占用
netstat -ano | findstr :5173
# 终止进程或更改端口
```

### 后端启动失败
```bash
# 检查 PostgreSQL 是否运行
# 验证 backend/.env 配置
# 确认数据库密码正确
```

### 数据库连接失败
```bash
# 确保 PostgreSQL 服务运行
# 检查 backend/.env 中的 DB_PASSWORD
# 验证数据库是否已创建
```

### bcrypt 错误
```bash
cd backend
npm rebuild bcrypt
```

---

## 🌐 访问地址

- **前端**: http://localhost:5173
- **后端 API**: http://localhost:5000
- **健康检查**: http://localhost:5000/health
- **pgAdmin 4**: http://localhost:5050 (如已安装)

---

## 📊 项目功能

### 已实现
- ✅ 用户认证系统（注册/登录/JWT）
- ✅ 任务系统（5个新手村任务）
- ✅ AI 对话系统（Claude API 集成）
- ✅ 角色系统（等级/经验值）
- ✅ 对话评分系统

### 数据库内容
- 5个新手村任务（初次见面、自我介绍、探索村庄、面包店购物、帮助村民）
- 完整的用户系统表结构
- 任务进度追踪系统
- 好友和支付系统

---

## 💡 快速提示

1. **首次启动前**：必须先安装 PostgreSQL 并初始化数据库
2. **AI 功能**：需要配置 Claude API 密钥才能使用对话功能
3. **开发模式**：建议同时运行前后端 (`npm run dev`)
4. **数据库管理**：使用 pgAdmin 4 可视化管理数据库
5. **日志查看**：后端控制台会显示所有 API 请求和数据库操作

---

## 🆘 获取帮助

遇到问题时：
1. 查看 [ENVIRONMENT_SETUP_COMPLETE.md](ENVIRONMENT_SETUP_COMPLETE.md) 的"常见问题"部分
2. 检查控制台日志输出
3. 验证环境变量配置
4. 查看相关文档

---

**最后更新**: 2026-02-01
