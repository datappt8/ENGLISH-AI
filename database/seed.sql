-- English Quest MVP 种子数据
-- 插入初始任务模板数据

\c english_quest_mvp;

-- ============================================
-- 新手村任务 (Starter Village Quests)
-- ============================================

-- 任务 001: 初次见面
INSERT INTO quest_templates (
  id, title, description, zone, quest_order,
  difficulty, required_level, quest_type,
  npc_id, dialogue_context,
  passing_score, pronunciation_weight, grammar_weight, fluency_weight, completeness_weight,
  exp_reward, coin_reward,
  tags, learning_objectives
) VALUES (
  'starter_village_001',
  '初次见面',
  '与村长喵喵进行一次友好的对话，学习基础问候语',
  'starter_village',
  1,
  'easy',
  1,
  'dialogue',
  'village_chief_meow',
  '{
    "scenario": "你刚刚来到英语世界的新手村，村长喵喵正站在村口迎接新来的冒险者",
    "objectives": ["向村长问好", "介绍自己的名字", "回应村长的欢迎"],
    "min_turns": 3,
    "npc_personality": "温和、智慧、有点懒洋洋但很靠谱"
  }'::jsonb,
  60,
  0.40, 0.10, 0.20, 0.30,
  100, 50,
  ARRAY['greeting', 'introduction', 'beginner'],
  ARRAY['基础问候语', '自我介绍', '简单对话']
);

-- 任务 002: 自我介绍
INSERT INTO quest_templates (
  id, title, description, zone, quest_order,
  difficulty, required_level, prerequisite_quests, quest_type,
  npc_id, dialogue_context,
  passing_score, pronunciation_weight, grammar_weight, fluency_weight, completeness_weight,
  exp_reward, coin_reward,
  tags, learning_objectives
) VALUES (
  'starter_village_002',
  '自我介绍',
  '与柴犬小柴交流，学习如何用英语介绍自己',
  'starter_village',
  2,
  'easy',
  1,
  ARRAY['starter_village_001'],
  'dialogue',
  'villager_shiba',
  '{
    "scenario": "热情的柴犬小柴想更多地了解你",
    "objectives": ["介绍自己的来源", "分享自己的爱好", "说明学英语的原因"],
    "min_turns": 4,
    "npc_personality": "超级热情、话多、好奇心强"
  }'::jsonb,
  65,
  0.35, 0.25, 0.25, 0.15,
  150, 75,
  ARRAY['self-introduction', 'hobbies', 'beginner'],
  ARRAY['介绍姓名和来历', '表达爱好', '说明原因']
);

-- 任务 003: 探索村庄
INSERT INTO quest_templates (
  id, title, description, zone, quest_order,
  difficulty, required_level, prerequisite_quests, quest_type,
  npc_id, dialogue_context,
  passing_score, pronunciation_weight, grammar_weight, fluency_weight, completeness_weight,
  exp_reward, coin_reward,
  tags, learning_objectives
) VALUES (
  'starter_village_003',
  '探索村庄',
  '跟随小柴参观村庄，学习询问地点和方向',
  'starter_village',
  3,
  'easy',
  2,
  ARRAY['starter_village_002'],
  'dialogue',
  'villager_shiba',
  '{
    "scenario": "小柴带你参观新手村，教你如何用英语问路",
    "objectives": ["询问地点位置", "理解方向指示", "表达感谢"],
    "min_turns": 5,
    "npc_personality": "活泼、热情、话多"
  }'::jsonb,
  70,
  0.35, 0.30, 0.20, 0.15,
  200, 100,
  ARRAY['directions', 'locations', 'questions'],
  ARRAY['询问地点', '理解方向', '表达感谢']
);

-- 任务 004: 面包店购物
INSERT INTO quest_templates (
  id, title, description, zone, quest_order,
  difficulty, required_level, prerequisite_quests, quest_type,
  npc_id, dialogue_context,
  passing_score, pronunciation_weight, grammar_weight, fluency_weight, completeness_weight,
  exp_reward, coin_reward,
  tags, learning_objectives
) VALUES (
  'starter_village_004',
  '面包店购物',
  '在小猪培根的面包店学习购物用语',
  'starter_village',
  4,
  'medium',
  3,
  ARRAY['starter_village_003'],
  'roleplay',
  'baker_bacon',
  '{
    "scenario": "你来到培根的面包店，学习如何用英语购物",
    "objectives": ["点餐/购物", "询问价格", "使用礼貌用语"],
    "min_turns": 5,
    "npc_personality": "憨厚、善良、有点慢热但很可靠"
  }'::jsonb,
  70,
  0.30, 0.25, 0.25, 0.20,
  250, 125,
  ARRAY['shopping', 'numbers', 'polite-expressions'],
  ARRAY['购物用语', '询问价格', '礼貌表达']
);

-- 任务 005: 帮助村民
INSERT INTO quest_templates (
  id, title, description, zone, quest_order,
  difficulty, required_level, prerequisite_quests, quest_type,
  npc_id, dialogue_context,
  passing_score, pronunciation_weight, grammar_weight, fluency_weight, completeness_weight,
  exp_reward, coin_reward,
  special_rewards,
  tags, learning_objectives
) VALUES (
  'starter_village_005',
  '帮助村民',
  '帮助兔子露露找到她的猫咪，学习提供帮助和表达同情',
  'starter_village',
  5,
  'medium',
  4,
  ARRAY['starter_village_004'],
  'roleplay',
  'villager_lulu',
  '{
    "scenario": "露露丢失了她的猫咪Mimi，你主动提供帮助",
    "objectives": ["主动提供帮助", "理解和描述物品特征", "表达同情和祝贺"],
    "min_turns": 7,
    "npc_personality": "温柔、善良、有点害羞、爱哭但很坚强"
  }'::jsonb,
  75,
  0.30, 0.25, 0.25, 0.20,
  300, 150,
  '{
    "achievements": ["helpful_soul", "starter_village_graduate"],
    "items": ["carrot_accessory"]
  }'::jsonb,
  ARRAY['helping', 'describing', 'empathy'],
  ARRAY['提供帮助', '描述特征', '表达情感']
);

-- ============================================
-- 完成
-- ============================================
\echo '✅ 种子数据插入完成！'
\echo '📊 已插入 5 个新手村任务'
