-- 迁移脚本: 添加任务会话表
-- 创建日期: 2026-02-01
-- 用途: 修复会话管理漏洞，防止用户跳过任务直接提交

\c englishai;

-- ============================================
-- 创建任务会话表 (quest_sessions)
-- ============================================
CREATE TABLE IF NOT EXISTS quest_sessions (
  -- 主键
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 关联
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id VARCHAR(100) NOT NULL REFERENCES quest_templates(id),
  user_quest_id UUID NOT NULL REFERENCES user_quests(id) ON DELETE CASCADE,

  -- 会话信息
  session_id VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN (
    'active',
    'completed',
    'expired',
    'abandoned'
  )),

  -- 会话数据
  dialogue_history JSONB DEFAULT '[]'::jsonb,
  current_turn INTEGER DEFAULT 0,

  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_quest_sessions_user_id ON quest_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quest_sessions_session_id ON quest_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_quest_sessions_status ON quest_sessions(status);
CREATE INDEX IF NOT EXISTS idx_quest_sessions_expires_at ON quest_sessions(expires_at);

-- 触发器
DROP TRIGGER IF EXISTS update_quest_sessions_updated_at ON quest_sessions;
CREATE TRIGGER update_quest_sessions_updated_at BEFORE UPDATE ON quest_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE quest_sessions IS '任务会话表（用于验证任务执行）';

\echo '✅ 迁移完成：quest_sessions 表已创建'
