# English Quest - Database

数据库初始化和管理脚本

## 数据库架构

本项目使用三种数据库：

1. **PostgreSQL** - 主数据库
   - 用户数据
   - 任务数据
   - 游戏进度
   - 支付订单

2. **Redis** - 缓存和会话
   - 用户会话
   - API 限流
   - 排行榜缓存

3. **MongoDB** - 日志存储
   - AI 对话记录
   - 学习日志

## 快速开始

### 1. 安装 PostgreSQL

确保已安装 PostgreSQL 12+

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# 从官网下载安装: https://www.postgresql.org/download/
```

### 2. 初始化数据库

```bash
# 方法 1: 使用 psql 命令
psql -U postgres -f init.sql

# 方法 2: 使用 npm 脚本（从 backend 目录）
cd ../backend
npm run db:migrate
```

### 3. 插入种子数据

```bash
# 使用 psql 命令
psql -U postgres -d english_quest_mvp -f seed.sql

# 或使用 npm 脚本
cd ../backend
npm run db:seed
```

## 数据库表结构

### 核心表

1. **users** - 用户账号表
   - 存储用户基本信息、会员状态、游戏数据
   - 索引: username, email, level, membership_tier

2. **characters** - 角色表
   - 存储用户的游戏角色信息
   - 每个用户一个活跃角色

3. **quest_templates** - 任务模板表
   - 静态任务配置数据
   - 包含对话脚本、评分标准、奖励

4. **user_quests** - 用户任务进度表
   - 记录用户的任务完成情况
   - 存储最高分数和完成数据

5. **user_stats** - 用户统计表
   - 学习统计数据
   - 连续学习天数、平均分数等

6. **friendships** - 好友关系表
   - 用户之间的好友关系

7. **payment_orders** - 支付订单表
   - 支付记录和订单状态

## 数据库维护

### 备份数据库

```bash
# 完整备份
pg_dump -U postgres english_quest_mvp > backup.sql

# 仅备份数据
pg_dump -U postgres --data-only english_quest_mvp > data_backup.sql

# 仅备份结构
pg_dump -U postgres --schema-only english_quest_mvp > schema_backup.sql
```

### 恢复数据库

```bash
# 从备份恢复
psql -U postgres english_quest_mvp < backup.sql
```

### 重置数据库

```bash
# 删除并重新创建
psql -U postgres -c "DROP DATABASE IF EXISTS english_quest_mvp;"
psql -U postgres -f init.sql
psql -U postgres -d english_quest_mvp -f seed.sql
```

## 数据库连接信息

在 `backend/.env` 文件中配置：

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=english_quest_mvp
DB_USER=postgres
DB_PASSWORD=your_password
```

## 性能优化

### 索引策略

所有外键字段都已建立索引，高频查询字段也有相应索引。

### 查询优化

使用 EXPLAIN ANALYZE 分析慢查询：

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE username = 'test';
```

### 连接池

后端使用 pg 连接池，配置：
- 最大连接数: 20
- 空闲超时: 30秒
- 连接超时: 2秒

## 常见问题

### 1. 连接被拒绝

检查 PostgreSQL 是否运行：
```bash
sudo systemctl status postgresql
```

### 2. 权限错误

确保用户有创建数据库的权限：
```sql
ALTER USER postgres CREATEDB;
```

### 3. 编码问题

确保数据库使用 UTF-8 编码：
```sql
\l  -- 查看数据库列表和编码
```

## 开发注意事项

1. 所有表都有 `created_at` 和 `updated_at` 时间戳
2. `updated_at` 通过触发器自动更新
3. 使用 UUID 作为主键
4. 外键设置了 ON DELETE CASCADE
5. 敏感数据（密码）使用 bcrypt 加密后存储
