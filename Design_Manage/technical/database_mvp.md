# MVP 数据库架构设计

**项目**: English Quest MVP
**版本**: 1.0.0
**设计日期**: 2026-01-31
**设计者**: 架构 Agent

## 📋 概述

本文档定义了 English Quest MVP 阶段的完整数据库架构。设计遵循以下原则：
- **简洁性**: MVP 阶段只包含核心功能所需的表
- **可扩展性**: 预留扩展字段和设计空间
- **性能优化**: 合理的索引和数据类型选择
- **数据完整性**: 使用外键和约束保证数据一致性

---

## 🗄️ PostgreSQL 主数据库

### 1. 用户表 (users)

存储用户基本信息和账号数据。

```sql
CREATE TABLE users (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 账号信息
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,

  -- 会员信息
  membership_tier VARCHAR(20) DEFAULT 'free' CHECK (membership_tier IN ('free', 'basic', 'premium', 'vip')),
  membership_expires_at TIMESTAMP,

  -- 游戏数据
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 100),
  experience INTEGER DEFAULT 0 CHECK (experience >= 0),
  coins INTEGER DEFAULT 100 CHECK (coins >= 0),
  diamonds INTEGER DEFAULT 0 CHECK (diamonds >= 0),

  -- 个人信息
  avatar_url VARCHAR(500),
  display_name VARCHAR(100),
  bio TEXT,

  -- 状态
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  banned_until TIMESTAMP,

  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- 索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_membership ON users(membership_tier);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 注释
COMMENT ON TABLE users IS '用户账号表';
COMMENT ON COLUMN users.membership_tier IS '会员等级: free, basic, premium, vip';
COMMENT ON COLUMN users.level IS '游戏等级 (1-100)';
COMMENT ON COLUMN users.experience IS '总经验值';
COMMENT ON COLUMN users.coins IS '游戏金币';
COMMENT ON COLUMN users.diamonds IS '钻石（付费货币）';
```

**预计数据量**: MVP阶段 1,000-10,000 用户
**查询频率**: 极高（每次请求都需要验证用户）
**缓存策略**: Redis 缓存用户基本信息，TTL 1小时

---

### 2. 角色表 (characters)

存储用户的游戏角色信息。

```sql
CREATE TABLE characters (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 关联用户
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 角色信息
  character_name VARCHAR(100) NOT NULL,
  character_class VARCHAR(50) DEFAULT 'adventurer',

  -- 游戏进度
  current_zone VARCHAR(50) DEFAULT 'starter_village' CHECK (current_zone IN (
    'starter_village',
    'forest',
    'castle',
    'city',
    'peak'
  )),

  -- 属性值（预留，暂不使用）
  strength INTEGER DEFAULT 10,
  intelligence INTEGER DEFAULT 10,
  charisma INTEGER DEFAULT 10,

  -- 外观（预留）
  appearance JSONB DEFAULT '{}',

  -- 状态
  is_active BOOLEAN DEFAULT TRUE,

  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_zone ON characters(current_zone);

-- 触发器
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 注释
COMMENT ON TABLE characters IS '用户角色表';
COMMENT ON COLUMN characters.current_zone IS '当前所在区域';
COMMENT ON COLUMN characters.appearance IS 'JSON格式的角色外观配置';

-- 约束：每个用户最多一个角色（MVP阶段）
CREATE UNIQUE INDEX idx_characters_user_one_active ON characters(user_id)
  WHERE is_active = TRUE;
```

**预计数据量**: 与用户数相同
**查询频率**: 高
**缓存策略**: 与用户信息一起缓存

---

### 3. 任务模板表 (quest_templates)

存储任务的模板配置（静态数据）。

```sql
CREATE TABLE quest_templates (
  -- 主键
  id VARCHAR(100) PRIMARY KEY, -- 例如: 'starter_village_quest_001'

  -- 任务信息
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  zone VARCHAR(50) NOT NULL,
  quest_order INTEGER NOT NULL, -- 任务在该区域的顺序

  -- 难度和要求
  difficulty VARCHAR(20) DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard', 'boss')),
  required_level INTEGER DEFAULT 1,
  prerequisite_quests TEXT[], -- 前置任务ID数组

  -- 任务类型和内容
  quest_type VARCHAR(50) NOT NULL CHECK (quest_type IN (
    'dialogue',      -- 对话任务
    'pronunciation', -- 发音任务
    'listening',     -- 听力任务
    'roleplay',      -- 角色扮演
    'challenge'      -- 挑战任务
  )),

  -- AI 对话配置
  npc_id VARCHAR(100), -- NPC ID
  dialogue_context JSONB, -- 对话上下文和脚本

  -- 评分标准
  passing_score INTEGER DEFAULT 70, -- 及格分数
  pronunciation_weight DECIMAL(3,2) DEFAULT 0.40,
  grammar_weight DECIMAL(3,2) DEFAULT 0.30,
  fluency_weight DECIMAL(3,2) DEFAULT 0.20,
  completeness_weight DECIMAL(3,2) DEFAULT 0.10,

  -- 奖励
  exp_reward INTEGER NOT NULL,
  coin_reward INTEGER NOT NULL,
  special_rewards JSONB, -- 特殊奖励（道具、成就等）

  -- 时间限制
  time_limit_seconds INTEGER, -- NULL表示无时间限制

  -- 元数据
  tags TEXT[],
  learning_objectives TEXT[],

  -- 状态
  is_active BOOLEAN DEFAULT TRUE,

  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_quest_templates_zone ON quest_templates(zone);
CREATE INDEX idx_quest_templates_type ON quest_templates(quest_type);
CREATE INDEX idx_quest_templates_difficulty ON quest_templates(difficulty);
CREATE INDEX idx_quest_templates_order ON quest_templates(zone, quest_order);

-- 触发器
CREATE TRIGGER update_quest_templates_updated_at BEFORE UPDATE ON quest_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 注释
COMMENT ON TABLE quest_templates IS '任务模板表（静态配置）';
COMMENT ON COLUMN quest_templates.dialogue_context IS '对话场景、NPC性格、示例对话等';
COMMENT ON COLUMN quest_templates.special_rewards IS '成就、称号、装备等特殊奖励';
```

**预计数据量**: 50-100 个任务（MVP阶段）
**查询频率**: 中等
**缓存策略**: 全部缓存到 Redis，极少变化

---

### 4. 用户任务进度表 (user_quests)

存储用户的任务进度和完成记录。

```sql
CREATE TABLE user_quests (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 关联
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id VARCHAR(100) NOT NULL REFERENCES quest_templates(id),

  -- 状态
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN (
    'not_started',
    'in_progress',
    'completed',
    'failed'
  )),

  -- 进度数据
  attempts INTEGER DEFAULT 0, -- 尝试次数
  best_score INTEGER, -- 最高分数
  completion_data JSONB, -- 完成数据（对话记录、评分详情等）

  -- 时间戳
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX idx_user_quests_quest_id ON user_quests(quest_id);
CREATE INDEX idx_user_quests_status ON user_quests(user_id, status);
CREATE INDEX idx_user_quests_completed_at ON user_quests(completed_at);

-- 触发器
CREATE TRIGGER update_user_quests_updated_at BEFORE UPDATE ON user_quests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 唯一约束：每个用户每个任务只有一条记录
CREATE UNIQUE INDEX idx_user_quests_unique ON user_quests(user_id, quest_id);

-- 注释
COMMENT ON TABLE user_quests IS '用户任务进度表';
COMMENT ON COLUMN user_quests.completion_data IS '完成数据：对话内容、AI评分、错误分析等';
```

**预计数据量**: 用户数 × 平均完成任务数（约 100,000 - 1,000,000 行）
**查询频率**: 极高
**缓存策略**: 缓存当前进行中的任务

---

### 5. 用户统计表 (user_stats)

存储用户的学习统计数据。

```sql
CREATE TABLE user_stats (
  -- 主键
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- 任务统计
  total_quests_completed INTEGER DEFAULT 0,
  total_quests_failed INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0, -- 连续学习天数
  longest_streak_days INTEGER DEFAULT 0,

  -- 发音统计
  avg_pronunciation_score DECIMAL(5,2),
  avg_grammar_score DECIMAL(5,2),
  avg_fluency_score DECIMAL(5,2),

  -- 学习时间
  total_study_time_minutes INTEGER DEFAULT 0,
  total_dialogue_count INTEGER DEFAULT 0,

  -- 社交统计
  friends_count INTEGER DEFAULT 0,

  -- 时间戳
  last_study_date DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_user_stats_streak ON user_stats(current_streak_days);
CREATE INDEX idx_user_stats_score ON user_stats(avg_pronunciation_score);

-- 触发器
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 注释
COMMENT ON TABLE user_stats IS '用户学习统计表';
```

**预计数据量**: 与用户数相同
**查询频率**: 中等
**缓存策略**: 排行榜数据缓存到 Redis

---

### 6. 好友关系表 (friendships)

存储用户之间的好友关系。

```sql
CREATE TABLE friendships (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 关联用户
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending',   -- 等待接受
    'accepted',  -- 已接受
    'rejected',  -- 已拒绝
    'blocked'    -- 已屏蔽
  )),

  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(user_id, status);

-- 唯一约束：防止重复好友关系
CREATE UNIQUE INDEX idx_friendships_unique ON friendships(
  LEAST(user_id, friend_id),
  GREATEST(user_id, friend_id)
);

-- 约束：不能添加自己为好友
ALTER TABLE friendships ADD CONSTRAINT chk_not_self
  CHECK (user_id != friend_id);

-- 触发器
CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON friendships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 注释
COMMENT ON TABLE friendships IS '好友关系表';
```

**预计数据量**: 用户数 × 平均好友数（约 10,000 - 100,000 行）
**查询频率**: 中等
**缓存策略**: 好友列表缓存到 Redis

---

### 7. 支付订单表 (payment_orders)

存储支付订单记录。

```sql
CREATE TABLE payment_orders (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL, -- 订单号

  -- 关联用户
  user_id UUID NOT NULL REFERENCES users(id),

  -- 订单信息
  product_type VARCHAR(50) NOT NULL CHECK (product_type IN (
    'membership',  -- 会员订阅
    'diamonds',    -- 钻石购买
    'special_package' -- 特殊礼包
  )),
  product_id VARCHAR(100),

  -- 金额
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'CNY',

  -- 支付信息
  payment_method VARCHAR(50), -- 'alipay', 'wechat', 'stripe'
  payment_provider_order_id VARCHAR(200), -- 第三方订单ID

  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending',    -- 等待支付
    'paid',       -- 已支付
    'completed',  -- 已完成（已发货）
    'refunded',   -- 已退款
    'failed'      -- 失败
  )),

  -- 附加信息
  metadata JSONB,

  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_payment_orders_user_id ON payment_orders(user_id);
CREATE INDEX idx_payment_orders_status ON payment_orders(status);
CREATE INDEX idx_payment_orders_created_at ON payment_orders(created_at);
CREATE INDEX idx_payment_orders_order_number ON payment_orders(order_number);

-- 触发器
CREATE TRIGGER update_payment_orders_updated_at BEFORE UPDATE ON payment_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 注释
COMMENT ON TABLE payment_orders IS '支付订单表';
```

**预计数据量**: 付费用户数 × 平均订单数（约 1,000 - 10,000 行）
**查询频率**: 低
**备份策略**: 高频备份，永久保存

---

## 🔴 Redis 缓存设计

### 1. 会话管理

```redis
# Key: session:{user_id}
# Type: Hash
# TTL: 7 days
# Value:
{
  "token": "jwt_token_string",
  "user_id": "uuid",
  "username": "john_doe",
  "level": 5,
  "membership": "premium",
  "login_at": "2026-01-31T12:00:00Z"
}
```

### 2. 用户缓存

```redis
# Key: user:{user_id}
# Type: Hash
# TTL: 1 hour
# Value: 用户基本信息和角色信息的JSON
```

### 3. 任务模板缓存

```redis
# Key: quest:template:{quest_id}
# Type: String (JSON)
# TTL: 24 hours
# Value: 完整的任务模板数据
```

### 4. 排行榜

```redis
# Key: leaderboard:global
# Type: Sorted Set
# Score: level * 1000000 + experience
# Member: user_id
```

### 5. API 限流

```redis
# Key: ratelimit:{user_id}:{endpoint}
# Type: String
# TTL: 60 seconds
# Value: 请求计数
```

---

## 🍃 MongoDB 文档设计

### 1. AI 对话记录

```javascript
{
  _id: ObjectId,
  user_id: "uuid",
  quest_id: "starter_village_quest_001",
  session_id: "uuid",
  messages: [
    {
      role: "system" | "user" | "assistant",
      content: "对话内容",
      timestamp: ISODate,
      metadata: {
        pronunciation_score: 85,
        grammar_issues: [],
        suggestions: []
      }
    }
  ],
  summary: {
    total_turns: 10,
    avg_score: 82,
    completion_time_seconds: 300
  },
  created_at: ISODate,
  updated_at: ISODate
}
```

### 2. 学习日志

```javascript
{
  _id: ObjectId,
  user_id: "uuid",
  date: ISODate("2026-01-31"),
  activities: [
    {
      type: "quest_completed",
      quest_id: "starter_village_quest_001",
      score: 85,
      time_spent_seconds: 300,
      timestamp: ISODate
    }
  ],
  daily_stats: {
    study_time_minutes: 45,
    quests_completed: 3,
    avg_score: 83
  }
}
```

---

## 📊 数据库关系图

```
users (1) ──────┬──── (N) characters
                │
                ├──── (N) user_quests
                │
                ├──── (1) user_stats
                │
                ├──── (N) friendships
                │
                └──── (N) payment_orders

quest_templates (1) ──── (N) user_quests
```

---

## ⚡ 性能优化策略

### 1. 查询优化
- 所有外键字段都建立了索引
- 高频查询字段建立复合索引
- 使用 EXPLAIN ANALYZE 分析慢查询

### 2. 缓存策略
- 静态数据（任务模板）：全部缓存，24小时 TTL
- 用户数据：按需缓存，1小时 TTL
- 排行榜：实时更新，永不过期

### 3. 分区策略（扩展阶段）
- user_quests 表按时间分区
- payment_orders 表按月分区

### 4. 读写分离（扩展阶段）
- 主库：写操作
- 从库：读操作、报表查询

---

## 🔒 数据安全

### 1. 敏感数据加密
- 密码：使用 bcrypt hash（cost 10）
- 支付信息：不存储完整卡号

### 2. 访问控制
- 数据库用户权限最小化
- 应用层使用连接池
- 生产环境禁止直接访问

### 3. 数据备份
- 每日全量备份
- 每小时增量备份
- payment_orders 表实时备份

---

## 📝 数据迁移计划

### 初始化脚本

```sql
-- 1. 创建数据库
CREATE DATABASE english_quest_mvp
  WITH ENCODING 'UTF8'
  LC_COLLATE='en_US.UTF-8'
  LC_CTYPE='en_US.UTF-8';

-- 2. 启用扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 模糊搜索

-- 3. 创建所有表（按依赖顺序）
-- ... (上面定义的所有表)

-- 4. 插入初始数据
-- 任务模板数据由 game-design Agent 提供
```

---

## 📈 扩展计划

当用户量增长时，考虑以下扩展：

1. **10,000+ 用户**
   - 启用 Redis 集群
   - 数据库读写分离

2. **100,000+ 用户**
   - PostgreSQL 主从复制
   - 表分区
   - CDN 加速

3. **1,000,000+ 用户**
   - 数据库分片
   - 微服务架构
   - 多区域部署

---

**设计完成时间**: 2026-01-31
**下一步**: 等待 game-design Agent 提供任务模板数据
