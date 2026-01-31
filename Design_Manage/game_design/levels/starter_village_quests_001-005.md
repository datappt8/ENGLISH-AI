# 新手村任务设计 - 前5个关卡

**区域**: 新手村 (Starter Village)
**目标等级**: Lv 1-5
**难度级别**: ⭐ (A1水平)
**设计日期**: 2026-01-31
**设计者**: 游戏策划 Agent

## 📋 设计理念

新手村的任务设计遵循以下原则：
1. **循序渐进**: 从最简单的问候开始，逐步引入新概念
2. **即时反馈**: 每个任务都有清晰的学习目标和反馈
3. **情景化学习**: 所有对话都基于真实生活场景
4. **游戏化引导**: 通过故事情节吸引玩家继续
5. **鼓励为主**: 新手阶段重在建立信心，评分宽松

## 🎯 任务总览

| 任务ID | 任务名称 | 学习目标 | 预计时长 | 奖励 |
|--------|---------|----------|----------|------|
| starter_village_001 | 初次见面 | 基础问候 | 3-5分钟 | 100 EXP + 50 Coins |
| starter_village_002 | 自我介绍 | 介绍姓名和来历 | 5-7分钟 | 150 EXP + 75 Coins |
| starter_village_003 | 探索村庄 | 询问地点和方向 | 7-10分钟 | 200 EXP + 100 Coins |
| starter_village_004 | 面包店购物 | 购物场景对话 | 10-12分钟 | 250 EXP + 125 Coins |
| starter_village_005 | 帮助村民 | 提供帮助和感谢 | 12-15分钟 | 300 EXP + 150 Coins |

---

## 任务 001: 初次见面

### 基本信息

- **任务ID**: `starter_village_001`
- **任务名称**: 初次见面
- **难度**: ⭐ (非常简单)
- **所需等级**: Lv 1
- **前置任务**: 无
- **预计时长**: 3-5分钟
- **任务类型**: dialogue (对话任务)

### 故事背景

你刚刚来到英语世界的新手村，村长汤姆(Chief Tom)正站在村口迎接新来的冒险者。这是你学习英语冒险的第一步——学会用英语打招呼！

### 学习目标

1. 学会基础问候语（Hello, Hi, Good morning/afternoon/evening）
2. 学会回应问候
3. 理解简单的欢迎用语

### NPC信息

- **NPC ID**: `village_chief_meow`
- **姓名**: Chief Meow (村长喵喵)
- **动物**: 橘猫 🐱
- **性格**: 温和、智慧、有点懒洋洋但很靠谱
- **外貌**: 橘白相间的毛色，戴着小圆眼镜，穿着村长背心，总是眯着眼睛微笑，尾巴会随心情摆动
- **声音**: 温和的男性声音，偶尔带点"喵"的尾音
- **经典动作**: 打招呼时会举起小爪子，说话时耳朵会动，开心时会"喵~"一声

### 对话脚本

#### 第一轮 - 开场

**Chief Meow**:
> "Hello there, meow~ Welcome to Starter Village! I'm Chief Meow, the village chief. *purr* It's wonderful to see a new adventurer!"

**玩家提示**:
- 回应村长的问候
- 可以说 "Hello" 或 "Hi"

**期望回应示例**:
- "Hello, Chief Meow!"
- "Hi!"
- "Good morning/afternoon!"

**AI评价重点**:
- ✅ 能清晰说出问候语
- ✅ 发音基本准确
- ❌ 不要求完整句子
- ❌ 语法错误可接受

#### 第二轮 - 询问名字

**Chief Meow**:
> "Great to meet you, meow! *tail wagging* What should I call you?"

**玩家提示**:
- 告诉村长你的名字
- 可以说 "I'm [name]" 或 "My name is [name]"

**期望回应示例**:
- "I'm John."
- "My name is Mary."

#### 第三轮 - 表达欢迎

**Chief Meow**:
> "Nice to meet you, [name]! *purr purr* This is a special place where you can practice English while having adventures. Are you ready to start, meow?"

**玩家提示**:
- 回答是否准备好
- 可以说 "Yes" 或 "Yes, I'm ready"

**期望回应示例**:
- "Yes!"
- "Yes, I'm ready!"
- "Sure!"

#### 结束

**Chief Meow**:
> "Excellent, meow! *stretches and yawns* I can see you're going to do great here. Let's begin your adventure!"

### 任务目标

完成与村长的对话（最少3轮）并达到及格分数。

### 成功条件

- ✅ 完成3轮对话
- ✅ 总分 ≥ 60分（新手任务评分宽松）
- ✅ 能基本听懂NPC的话并做出回应

### 评分标准

| 维度 | 权重 | 评分要点 |
|------|------|---------|
| 发音准确度 | 40% | Hello/Hi/Yes 等基础词发音清晰 |
| 完整度 | 30% | 完成所有对话轮次 |
| 流利度 | 20% | 停顿不影响理解 |
| 语法正确性 | 10% | 可忽略语法错误 |

### 奖励

- **经验值**: +100 EXP
- **金币**: +50 Coins
- **成就**: 首次对话（First Conversation）
- **解锁**: 任务002

### AI反馈示例

**优秀 (90-100分)**:
> "Perfect! Your pronunciation is very clear and you responded confidently. Well done!"

**良好 (70-89分)**:
> "Good job! You understood everything and responded appropriately. Keep practicing your pronunciation!"

**及格 (60-69分)**:
> "Not bad for your first try! You completed the conversation. Try to speak a little more clearly next time."

**需改进 (<60分)**:
> "Don't worry! Let's try again. Remember to speak slowly and clearly. You can do it!"

### 教学提示

任务前提示玩家：
```
💡 新手提示：
- 不用紧张，这是最简单的任务
- 说话慢一点没关系，清晰最重要
- 如果没听懂，可以让NPC重复一次
- 勇敢开口，错了也没关系！
```

---

## 任务 002: 自我介绍

### 基本信息

- **任务ID**: `starter_village_002`
- **任务名称**: 自我介绍
- **难度**: ⭐ (简单)
- **所需等级**: Lv 1
- **前置任务**: starter_village_001
- **预计时长**: 5-7分钟
- **任务类型**: dialogue (对话任务)

### 故事背景

村长喵喵想更多地了解你。在英语世界里，介绍自己是很重要的技能。让我们学习如何用英语介绍自己吧！

### 学习目标

1. 学会介绍自己的姓名
2. 学会说自己来自哪里
3. 学会表达自己的兴趣爱好
4. 理解和回答简单的个人问题

### NPC信息

- **NPC ID**: `villager_shiba`
- **姓名**: Shiba (柴犬小柴)
- **动物**: 柴犬 🐶
- **性格**: 超级热情、话多、好奇心强、有点傻乎乎
- **外貌**: 经典柴犬配色（黄色+白色），永远笑眯眯的表情，戴着红色围巾，穿着休闲冒险装，尾巴总是摇个不停
- **声音**: 活泼清脆的声音，充满活力
- **经典动作**: 兴奋时会跳起来，说话时会歪头，开心时尾巴摇得特别快

### 对话脚本

#### 第一轮 - 询问更多信息

**Shiba**:
> "Woof woof! *tail wagging excitedly* So, tell me more about yourself! Where are you from? I LOVE meeting new friends!"

**学习重点**: 国家/城市表达
**期望回应**:
- "I'm from China."
- "I come from Beijing."
- "I'm from Shanghai, China."

**AI评价重点**:
- ✅ 能说出 "I'm from..." 或 "I come from..."
- ✅ 国家/城市名称发音合理
- ⚠️ 介词使用不正确可接受

#### 第二轮 - 询问爱好

**Shiba**:
> "Wonderful! *jumps up and down* And what do you like to do? What are your hobbies? I love running and playing fetch!"

**学习重点**: 爱好表达
**期望回应**:
- "I like reading."
- "I enjoy playing games."
- "I love learning English."

**AI评价重点**:
- ✅ 使用 like/enjoy/love 表达爱好
- ✅ 动词 -ing 形式基本正确
- ⚠️ 可以只说爱好名词（reading, music, games）

#### 第三轮 - 为什么学英语

**Shiba**:
> "That's great! *tilts head* Why do you want to learn English? I'm so curious!"

**学习重点**: 表达原因
**期望回应**:
- "For work."
- "I want to travel."
- "To communicate with people."
- "Because it's useful."

#### 第四轮 - 鼓励

**Shiba**:
> "Those are all excellent reasons! *wags tail super fast* I'm sure you'll do very well here! One more question - how do you feel right now?"

**学习重点**: 感受表达
**期望回应**:
- "I'm excited!"
- "I feel nervous."
- "I'm happy."

### 成功条件

- ✅ 完成4-5轮对话
- ✅ 总分 ≥ 65分
- ✅ 至少介绍3个个人信息（来源、爱好、学英语原因）

### 评分标准

| 维度 | 权重 | 评分要点 |
|------|------|---------|
| 发音准确度 | 35% | 重点词汇发音清晰 |
| 语法正确性 | 25% | 基本句型使用正确 |
| 完整度 | 25% | 回答完整，信息充分 |
| 流利度 | 15% | 表达比较流畅 |

### 奖励

- **经验值**: +150 EXP
- **金币**: +75 Coins
- **可能升级**: Lv 1 → Lv 2
- **解锁**: 任务003

### 词汇列表

任务前显示可能用到的词汇：
```
📖 参考词汇：
国家: China, USA, Japan, UK, Canada
爱好: reading, music, sports, games, cooking, traveling
感受: happy, excited, nervous, confident, curious
```

---

## 任务 003: 探索村庄

### 基本信息

- **任务ID**: `starter_village_003`
- **任务名称**: 探索村庄
- **难度**: ⭐⭐ (简单+)
- **所需等级**: Lv 2
- **前置任务**: starter_village_002
- **预计时长**: 7-10分钟
- **任务类型**: dialogue + exploration (对话+探索)

### 故事背景

村长建议你先熟悉一下新手村的环境。热情的柴犬小柴(Shiba)会带你参观村庄，并教你如何用英语询问地点和方向。

### 学习目标

1. 学会询问"某地在哪里"（Where is...?）
2. 学会理解方向指示（left, right, straight, next to, behind）
3. 学会表达感谢（Thank you, Thanks）
4. 认识村庄的主要建筑

### NPC信息

- **NPC ID**: `villager_shiba`
- **姓名**: Shiba (柴犬小柴)
- **动物**: 柴犬 🐶
- **性格**: 活泼、热情、话多
- **外貌**: 经典柴犬配色（黄色+白色），永远笑眯眯的表情，戴着红色围巾
- **声音**: 清脆活泼的声音

### 对话脚本

#### 第一轮 - 见面

**Shiba**:
> "Hi there! Woof! *bouncing excitedly* I'm Shiba. Chief Meow asked me to show you around the village. Are you ready for a tour?"

**期望回应**:
- "Yes, I'm ready!"
- "Sure, let's go!"

#### 第二轮 - 询问第一个地点

**Shiba**:
> "Great! *tail wagging* Let me tell you about our village. We have a bakery, a library, a training ground, and a shop. Which place would you like to visit first?"

**学习重点**: 选择表达
**期望回应**:
- "The bakery, please."
- "I want to see the library."
- "Can we go to the shop?"

#### 第三轮 - 指路

**Shiba**:
> "Good choice! *sniff sniff* The [place] is over there. Go straight ahead and turn right. It's next to the big tree. Can you see it?"

**学习重点**: 方向理解
**期望回应**:
- "Yes, I can see it."
- "Where exactly?"
- "Is it that building?"

#### 第四轮 - 玩家主动询问

**Shiba**:
> "This is the heart of our village! *spins around* If you want to find any place, just ask me. Try asking me where something is!"

**学习重点**: Where is 问句
**期望回应**:
- "Where is the library?"
- "Where can I find the shop?"
- "How can I get to the training ground?"

**AI评价重点**:
- ✅ 能使用 "Where is...?" 句型
- ✅ 地点名词基本正确
- ⚠️ 语序不对可提示修正

#### 第五轮 - 回应指路

**Shiba**:
> "The [place] is on the left, behind the bakery. It's easy to find! *wags tail happily*"

**期望回应**:
- "Thank you!"
- "Thanks for your help!"
- "Got it, thank you!"

### 成功条件

- ✅ 完成5-6轮对话
- ✅ 总分 ≥ 70分
- ✅ 能主动问出至少1个 "Where is...?" 问题
- ✅ 表达感谢

### 评分标准

| 维度 | 权重 | 评分要点 |
|------|------|---------|
| 发音准确度 | 35% | 方向词汇和地点名词发音 |
| 语法正确性 | 30% | 疑问句结构正确 |
| 主动性 | 20% | 能主动提问 |
| 流利度 | 15% | 表达流畅 |

### 奖励

- **经验值**: +200 EXP
- **金币**: +100 Coins
- **成就**: 探险家（Explorer）
- **解锁**: 任务004、村庄地图功能

### 词汇列表

```
📖 参考词汇：
建筑: bakery, library, shop, training ground, house
方向: left, right, straight, forward, backward
位置: next to, behind, in front of, between, near
```

---

## 任务 004: 面包店购物

### 基本信息

- **任务ID**: `starter_village_004`
- **任务名称**: 面包店购物
- **难度**: ⭐⭐ (中等)
- **所需等级**: Lv 3
- **前置任务**: starter_village_003
- **预计时长**: 10-12分钟
- **任务类型**: roleplay (角色扮演)

### 故事背景

你的第一个真实场景挑战来了！面包师小猪培根(Bacon)经营着村里最好的面包店。让我们学习如何在真实场景中用英语购物。

### 学习目标

1. 学会点餐/购物用语（I'd like..., Can I have...?）
2. 学会询问价格（How much is...?）
3. 学会数字表达（1-20）
4. 学会礼貌用语（Please, Thank you, You're welcome）

### NPC信息

- **NPC ID**: `baker_bacon`
- **姓名**: Bacon (小猪培根)
- **动物**: 粉红小猪 🐷
- **性格**: 憨厚、善良、有点慢热但很可靠、美食家
- **外貌**: 粉嫩的猪皮肤，圆滚滚的身材，戴着厨师帽，穿着围裙（上面有面包图案），大大的猪鼻子
- **声音**: 憨厚温和的男性声音，偶尔"哼哼"
- **经典动作**: 思考时会用蹄子挠头，开心时鼻子会哼哼，推荐美食时眼睛会发光

### 对话脚本

#### 第一轮 - 欢迎

**Bacon**:
> "Oink oink~ Welcome to Bacon's Bakery! *sniff sniff* We have fresh bread, cookies, and cakes today. What would you like?"

**学习重点**: 表达需求
**期望回应**:
- "I'd like some bread, please."
- "Can I have a cake?"
- "I want to buy cookies."

**AI评价重点**:
- ✅ 使用礼貌请求（I'd like / Can I have / May I have）
- ✅ 包含 "please"
- ⚠️ "I want" 可接受但会提示使用更礼貌的表达

#### 第二轮 - 推荐

**Bacon**:
> "Good choice! *eyes sparkling* I recommend our chocolate cookies. They're very popular. *oink* Would you like to try them?"

**期望回应**:
- "Yes, please!"
- "Sure, I'd like to try."
- "How much are they?"

#### 第三轮 - 询问价格

**Bacon**:
> "The chocolate cookies are 5 coins, and the bread is 3 coins. *scratches head with hoof*"

**学习重点**: 价格理解和回应
**期望回应**:
- "Okay, I'll take the cookies."
- "I'll have both, please."
- "Just the bread, please."

**AI评价重点**:
- ✅ 理解价格信息
- ✅ 做出购买决定

#### 第四轮 - 结账

**Bacon**:
> "Great! *oink oink* That will be [X] coins in total. Here you go! Enjoy your [items]!"

**学习重点**: 表达感谢
**期望回应**:
- "Thank you!"
- "Thanks a lot!"
- "Thank you very much!"

#### 第五轮 - 告别

**Bacon**:
> "You're very welcome! *happy oink* Come back anytime!"

**期望回应**:
- "Goodbye!"
- "See you later!"
- "Bye!"

### 成功条件

- ✅ 完成完整的购物流程
- ✅ 总分 ≥ 70分
- ✅ 成功"购买"至少一件商品
- ✅ 使用礼貌用语（please, thank you）

### 评分标准

| 维度 | 权重 | 评分要点 |
|------|------|---------|
| 发音准确度 | 30% | 商品名称、数字发音 |
| 语法正确性 | 25% | 请求句型正确 |
| 礼貌程度 | 25% | 使用礼貌用语 |
| 完整度 | 20% | 完成购物全流程 |

### 商品菜单

任务前显示菜单：
```
🍞 Baker's Bakery Menu:
- Bread 面包 - 3 Coins
- Chocolate Cookies 巧克力饼干 - 5 Coins
- Cake 蛋糕 - 8 Coins
- Muffin 松饼 - 4 Coins
```

### 奖励

- **经验值**: +250 EXP
- **金币**: +125 Coins（扣除购物花费后）
- **道具**: 购买的食物（可恢复体力，装饰用）
- **成就**: 第一次购物（First Purchase）
- **解锁**: 任务005

### 词汇列表

```
📖 参考词汇：
购物用语: I'd like, Can I have, How much, That's all
商品: bread, cookies, cake, muffin
数字: one, two, three, four, five, ten, twenty
礼貌: please, thank you, you're welcome, excuse me
```

---

## 任务 005: 帮助村民

### 基本信息

- **任务ID**: `starter_village_005`
- **任务名称**: 帮助村民
- **难度**: ⭐⭐⭐ (中等+)
- **所需等级**: Lv 4
- **前置任务**: starter_village_004
- **预计时长**: 12-15分钟
- **任务类型**: roleplay + challenge (角色扮演+挑战)

### 故事背景

村民兔子露露(Lulu)遇到了困难，她在找她的猫咪。这是你第一次帮助别人的机会！学会提供帮助和接受感谢是很重要的社交技能。

### 学习目标

1. 学会提供帮助（Can I help you? / Do you need help?）
2. 学会描述物品特征（color, size, appearance）
3. 学会表达同情（I'm sorry to hear that）
4. 学会接受和给予感谢
5. 能进行较长的对话（8-10轮）

### NPC信息

- **NPC ID**: `villager_lulu`
- **姓名**: Lulu (兔子露露)
- **动物**: 白兔 🐰
- **性格**: 温柔、善良、有点害羞、爱哭但很坚强
- **外貌**: 雪白的毛发，粉色的长耳朵（会根据情绪变化），大大的红眼睛（容易泪汪汪），穿着粉色连衣裙，戴着蝴蝶结
- **声音**: 温柔甜美的女性声音，有点颤抖
- **经典动作**: 紧张时耳朵会垂下来，害羞时会捂脸，开心时会蹦蹦跳跳，着急时会跺脚
- **情绪变化**: 开始着急 → 感激 → 开心

### 对话脚本

#### 第一轮 - 注意到困难

**Lulu**:
> "Oh no... *ears drooping* where could it be? I've been looking everywhere... *sniff*"

**学习重点**: 主动提供帮助
**期望回应**:
- "Can I help you?"
- "Do you need help?"
- "What's wrong?"
- "Are you okay?"

**AI评价重点**:
- ✅ 能主动关心别人
- ✅ 使用正确的疑问句

#### 第二轮 - 说明问题

**Lulu**:
> "Oh, thank you for asking! *teary eyes* I lost my cat. Her name is Mimi. *sob sob* Have you seen a cat around here?"

**学习重点**: 回应并询问详情
**期望回应**:
- "I'm sorry to hear that."
- "What does your cat look like?"
- "Can you describe your cat?"

**AI评价重点**:
- ✅ 表达同情
- ✅ 询问更多信息

#### 第三轮 - 描述特征

**Lulu**:
> "Mimi is a small white cat with blue eyes. *wipes tears* She has a pink collar. She's very shy and likes to hide in quiet places."

**学习重点**: 理解描述
**期望回应**:
- "I understand."
- "Where did you last see her?"
- "When did she disappear?"
- "I'll help you look for her!"

#### 第四轮 - 讨论寻找地点

**Lulu**:
> "I last saw her near the library this morning. *ears twitching nervously* Maybe she's hiding somewhere nearby?"

**学习重点**: 提出建议
**期望回应**:
- "Let's check behind the library."
- "Maybe she's in the garden?"
- "We should look near the trees."
- "I think we should search together."

#### 第五轮 - 找到猫咪（剧情转折）

**Lulu**:
> "Wait! *ears perking up* I hear something... Is that... Yes! There she is! Behind that tree! Oh, Mimi! *hopping excitedly*"

**期望回应**:
- "Great! I'm glad we found her!"
- "I'm happy for you!"
- "She's so cute!"

#### 第六轮 - 表达感谢

**Lulu**:
> "Thank you so much for helping me! *happy bunny hops* I was so worried. You're very kind!"

**学习重点**: 谦虚回应
**期望回应**:
- "You're welcome!"
- "No problem!"
- "I'm happy to help!"
- "Glad I could help!"

#### 第七轮 - 额外奖励对话

**Lulu**:
> "You're such a helpful person! *shy smile, covering face with paws* The village is lucky to have you. Please, take this as a thank you gift."

**期望回应**:
- "Thank you!"
- "That's very kind of you!"
- "You don't have to, but thank you!"

### 成功条件

- ✅ 完成7-10轮对话
- ✅ 总分 ≥ 75分
- ✅ 主动提供帮助
- ✅ 能描述或理解描述（颜色、大小等）
- ✅ 正确表达同情和祝贺

### 评分标准

| 维度 | 权重 | 评分要点 |
|------|------|---------|
| 发音准确度 | 30% | 描述词汇发音清晰 |
| 语法正确性 | 25% | 句型结构正确 |
| 主动性和同理心 | 25% | 主动帮助、表达同情 |
| 对话流畅度 | 20% | 多轮对话连贯 |

### 奖励

- **经验值**: +300 EXP
- **金币**: +150 Coins
- **特殊奖励**: 露露的礼物（胡萝卜饰品）
- **成就**:
  - 乐于助人（Helpful Soul）
  - 新手村毕业（Starter Village Graduate）
- **升级**: Lv 4 → Lv 5
- **解锁**:
  - 初级森林区域
  - 新的NPC对话
  - 每日任务系统

### 词汇列表

```
📖 参考词汇：
帮助: help, assist, support, aid
描述: color (white, black, brown), size (small, big), appearance
情感: worried, happy, glad, sorry, grateful
位置: behind, near, in, under, around
```

### 剧情彩蛋

如果玩家表现特别好（得分≥90），触发额外对话：

**Lulu**:
> "Your English is so good! *ears standing up proudly* And you're very kind. I'm sure Chief Meow will be proud of you. Please visit me anytime!"

---

## 📊 任务难度曲线

```
难度
 ^
 |                              ★★★
 |                          ★★
 |                      ★★
 |                  ★
 |              ★
 +-------------------------------------------> 任务
   001      002      003      004      005

及格分: 60 → 65 → 70 → 70 → 75
对话轮次: 3 → 4-5 → 5-6 → 5 → 7-10
词汇量: 5-10 → 15-20 → 25-30 → 30-40 → 40-50
```

---

## 🎓 学习进度追踪

完成这5个任务后，玩家将学会：

### 核心句型
- ✅ 问候: Hello, Hi, Good morning/afternoon
- ✅ 自我介绍: I'm..., My name is..., I'm from...
- ✅ 询问: Where is...?, How much is...?, What is...?
- ✅ 请求: Can I have...?, I'd like..., May I...?
- ✅ 帮助: Can I help you?, Do you need help?

### 词汇量
- ✅ 基础词汇: 约 80-100 个
- ✅ 常用短语: 约 20-30 个

### 语法点
- ✅ 简单现在时
- ✅ 基本疑问句
- ✅ 介词使用（from, to, in, on, near）

---

## 🎮 游戏化元素

### 连续任务奖励
完成全部5个任务可获得：
- **额外奖励**: +500 EXP bonus
- **称号**: "新手村毕业生"
- **解锁**: 专属头像框

### 每日首次完成奖励
每个任务每日首次完成（重玩）可获得：
- 50% 经验值奖励
- 25% 金币奖励

---

## 📝 设计笔记

### 为什么这样设计？

1. **任务001-002**: 建立信心
   - 极简单的对话
   - 评分非常宽松
   - 重点是让玩家敢开口

2. **任务003**: 引入互动性
   - 玩家开始主动提问
   - 学习实用的问路技能

3. **任务004**: 真实场景
   - 第一次完整的场景模拟
   - 引入数字和价格概念

4. **任务005**: 情感连接
   - 通过帮助别人建立成就感
   - 最长的对话，检验前面学习成果
   - 情绪化的故事增加代入感

### 后续任务方向

- **任务006-010**: 初级森林
  - 难度: A2 级别
  - 引入过去时态
  - 更复杂的对话场景

---

**设计完成时间**: 2026-01-31
**下一步**: 等待 character-design Agent 设计NPC角色外观和场景
