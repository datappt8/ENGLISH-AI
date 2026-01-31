-- English Quest MVP 数据库初始化脚本
-- 创建日期: 2026-01-31

-- 创建数据库
CREATE DATABASE english_quest_mvp
  WITH ENCODING 'UTF8'
  LC_COLLATE='en_US.UTF-8'
  LC_CTYPE='en_US.UTF-8';

-- 连接到数据库
\c english_quest_mvp;

-- 启用扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 模糊搜索

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 1. 用户表 (users)
-- ============================================
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

-- 触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 注释
COMMENT ON TABLE users IS '用户账号表';
COMMENT ON COLUMN users.membership_tier IS '会员等级: free, basic, premium, vip';
COMMENT ON COLUMN users.level IS '游戏等级 (1-100)';

-- ============================================
-- 2. 角色表 (characters)
-- ============================================
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

  -- 属性值
  strength INTEGER DEFAULT 10,
  intelligence INTEGER DEFAULT 10,
  charisma INTEGER DEFAULT 10,

  -- 外观
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

-- 唯一约束：每个用户最多一个活跃角色
CREATE UNIQUE INDEX idx_characters_user_one_active ON characters(user_id)
  WHERE is_active = TRUE;

COMMENT ON TABLE characters IS '用户角色表';

-- ============================================
-- 3. 任务模板表 (quest_templates)
-- ============================================
CREATE TABLE quest_templates (
  -- 主键
  id VARCHAR(100) PRIMARY KEY,

  -- 任务信息
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  zone VARCHAR(50) NOT NULL,
  quest_order INTEGER NOT NULL,

  -- 难度和要求
  difficulty VARCHAR(20) DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard', 'boss')),
  required_level INTEGER DEFAULT 1,
  prerequisite_quests TEXT[],

  -- 任务类型和内容
  quest_type VARCHAR(50) NOT NULL CHECK (quest_type IN (
    'dialogue',
    'pronunciation',
    'listening',
    'roleplay',
    'challenge'
  )),

  -- AI 对话配置
  npc_id VARCHAR(100),
  dialogue_context JSONB,

  -- 评分标准
  passing_score INTEGER DEFAULT 70,
  pronunciation_weight DECIMAL(3,2) DEFAULT 0.40,
  grammar_weight DECIMAL(3,2) DEFAULT 0.30,
  fluency_weight DECIMAL(3,2) DEFAULT 0.20,
  completeness_weight DECIMAL(3,2) DEFAULT 0.10,

  -- 奖励
  exp_reward INTEGER NOT NULL,
  coin_reward INTEGER NOT NULL,
  special_rewards JSONB,

  -- 时间限制
  time_limit_seconds INTEGER,

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

COMMENT ON TABLE quest_templates IS '任务模板表（静态配置）';

-- ============================================
-- 4. 用户任务进度表 (user_quests)
-- ============================================
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
  attempts INTEGER DEFAULT 0,
  best_score INTEGER,
  completion_data JSONB,

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

-- 唯一约束
CREATE UNIQUE INDEX idx_user_quests_unique ON user_quests(user_id, quest_id);

COMMENT ON TABLE user_quests IS '用户任务进度表';

-- ============================================
-- 5. 用户统计表 (user_stats)
-- ============================================
CREATE TABLE user_stats (
  -- 主键
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- 任务统计
  total_quests_completed INTEGER DEFAULT 0,
  total_quests_failed INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
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

COMMENT ON TABLE user_stats IS '用户学习统计表';

-- ============================================
-- 6. 好友关系表 (friendships)
-- ============================================
CREATE TABLE friendships (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 关联用户
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending',
    'accepted',
    'rejected',
    'blocked'
  )),

  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(user_id, status);

-- 唯一约束
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

COMMENT ON TABLE friendships IS '好友关系表';

-- ============================================
-- 7. 支付订单表 (payment_orders)
-- ============================================
CREATE TABLE payment_orders (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,

  -- 关联用户
  user_id UUID NOT NULL REFERENCES users(id),

  -- 订单信息
  product_type VARCHAR(50) NOT NULL CHECK (product_type IN (
    'membership',
    'diamonds',
    'special_package'
  )),
  product_id VARCHAR(100),

  -- 金额
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'CNY',

  -- 支付信息
  payment_method VARCHAR(50),
  payment_provider_order_id VARCHAR(200),

  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending',
    'paid',
    'completed',
    'refunded',
    'failed'
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

COMMENT ON TABLE payment_orders IS '支付订单表';

-- ============================================
-- 完成
-- ============================================
\echo '✅ 数据库初始化完成！'
