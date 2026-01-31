# MVP API 规范文档

**项目**: English Quest MVP
**版本**: v1.0.0
**Base URL**: `https://api.englishquest.com/v1`
**设计日期**: 2026-01-31
**设计者**: 架构 Agent

## 📋 目录

1. [认证系统 API](#认证系统-api)
2. [用户管理 API](#用户管理-api)
3. [游戏核心 API](#游戏核心-api)
4. [AI 对话 API](#ai-对话-api)
5. [社交功能 API](#社交功能-api)
6. [支付系统 API](#支付系统-api)
7. [WebSocket 协议](#websocket-协议)

---

## 🔐 认证系统 API

### 1.1 用户注册

**端点**: `POST /auth/register`
**认证**: 不需要
**描述**: 创建新用户账号

#### 请求体

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### 响应

**成功 (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "level": 1,
      "membership_tier": "free"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

**错误 (400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "用户名已存在",
    "details": {
      "field": "username"
    }
  }
}
```

#### 验证规则
- `username`: 3-50字符，字母数字下划线，唯一
- `email`: 有效邮箱格式，唯一
- `password`: 最少8字符，包含字母和数字

---

### 1.2 用户登录

**端点**: `POST /auth/login`
**认证**: 不需要
**描述**: 用户登录获取 JWT Token

#### 请求体

```json
{
  "username": "john_doe",  // 或使用 email
  "password": "securePassword123"
}
```

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "level": 5,
      "experience": 2500,
      "coins": 1500,
      "diamonds": 10,
      "membership_tier": "premium",
      "avatar_url": "https://cdn.example.com/avatars/uuid.png"
    },
    "character": {
      "id": "uuid",
      "character_name": "冒险者约翰",
      "current_zone": "starter_village",
      "level": 5
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误 (401 Unauthorized)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "用户名或密码错误"
  }
}
```

---

### 1.3 刷新 Token

**端点**: `POST /auth/refresh`
**认证**: 需要有效 Token（即使过期）
**描述**: 刷新访问令牌

#### 请求头

```
Authorization: Bearer <expired_or_valid_token>
```

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_string",
    "expires_in": 604800
  }
}
```

---

### 1.4 登出

**端点**: `POST /auth/logout`
**认证**: 需要
**描述**: 登出并清除会话

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "message": "登出成功"
}
```

---

## 👤 用户管理 API

### 2.1 获取用户资料

**端点**: `GET /users/me`
**认证**: 需要
**描述**: 获取当前用户的完整信息

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "level": 5,
      "experience": 2500,
      "coins": 1500,
      "diamonds": 10,
      "membership_tier": "premium",
      "membership_expires_at": "2026-12-31T23:59:59Z",
      "avatar_url": "https://...",
      "display_name": "约翰",
      "bio": "热爱学习英语",
      "created_at": "2026-01-01T00:00:00Z",
      "last_login_at": "2026-01-31T12:00:00Z"
    },
    "character": {
      "id": "uuid",
      "character_name": "冒险者约翰",
      "current_zone": "starter_village",
      "strength": 12,
      "intelligence": 15,
      "charisma": 13
    },
    "stats": {
      "total_quests_completed": 15,
      "current_streak_days": 7,
      "longest_streak_days": 30,
      "avg_pronunciation_score": 85.5,
      "total_study_time_minutes": 450,
      "friends_count": 8
    }
  }
}
```

---

### 2.2 更新用户资料

**端点**: `PATCH /users/me`
**认证**: 需要
**描述**: 更新用户信息

#### 请求体

```json
{
  "display_name": "新昵称",
  "bio": "新的个人简介",
  "avatar_url": "https://..."
}
```

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": { /* 更新后的用户信息 */ }
  }
}
```

---

### 2.3 获取学习统计

**端点**: `GET /users/me/stats`
**认证**: 需要
**描述**: 获取详细的学习统计数据

#### 查询参数

- `period`: 统计周期 (`week`, `month`, `all`)

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "period": "week",
    "stats": {
      "quests_completed": 12,
      "study_time_minutes": 180,
      "avg_score": 84.5,
      "daily_breakdown": [
        { "date": "2026-01-25", "quests": 2, "minutes": 30, "score": 82 },
        { "date": "2026-01-26", "quests": 1, "minutes": 25, "score": 85 }
      ]
    },
    "progress": {
      "current_level": 5,
      "next_level_exp": 3000,
      "current_exp": 2500,
      "exp_to_next_level": 500,
      "progress_percentage": 83.3
    }
  }
}
```

---

## 🎮 游戏核心 API

### 3.1 获取任务列表

**端点**: `GET /quests`
**认证**: 需要
**描述**: 获取可用的任务列表

#### 查询参数

- `zone`: 区域筛选 (`starter_village`, `forest`, 等)
- `status`: 状态筛选 (`available`, `in_progress`, `completed`)

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "quests": [
      {
        "id": "starter_village_quest_001",
        "title": "初次见面",
        "description": "与村长进行一次友好的对话",
        "zone": "starter_village",
        "difficulty": "easy",
        "quest_type": "dialogue",
        "required_level": 1,
        "rewards": {
          "exp": 100,
          "coins": 50
        },
        "user_progress": {
          "status": "available",
          "attempts": 0,
          "best_score": null
        },
        "estimated_time_minutes": 5,
        "is_locked": false
      }
    ],
    "total": 15,
    "available_count": 10,
    "completed_count": 5
  }
}
```

---

### 3.2 开始任务

**端点**: `POST /quests/:questId/start`
**认证**: 需要
**描述**: 开始一个任务

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "quest": {
      "id": "starter_village_quest_001",
      "title": "初次见面",
      "description": "与村长进行一次友好的对话",
      "npc": {
        "id": "village_chief",
        "name": "村长汤姆",
        "avatar_url": "https://...",
        "personality": "友好、耐心"
      },
      "dialogue_context": {
        "scenario": "你刚来到新手村...",
        "objectives": [
          "向村长问好",
          "介绍自己",
          "询问村子的情况"
        ]
      },
      "passing_score": 70,
      "time_limit_seconds": null
    },
    "session_id": "uuid"  // 用于对话会话
  }
}
```

---

### 3.3 提交任务

**端点**: `POST /quests/:questId/submit`
**认证**: 需要
**描述**: 提交任务完成结果（由 AI 评分后调用）

#### 请求体

```json
{
  "session_id": "uuid",
  "score": 85,
  "completion_data": {
    "pronunciation_score": 88,
    "grammar_score": 84,
    "fluency_score": 82,
    "completeness_score": 86,
    "total_turns": 8,
    "time_spent_seconds": 245
  }
}
```

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "result": "passed",  // "passed" | "failed"
    "score": 85,
    "rewards": {
      "exp_gained": 100,
      "coins_gained": 50,
      "level_up": false,
      "new_level": 5,
      "achievements_unlocked": []
    },
    "feedback": {
      "overall": "做得很好！你的发音很清晰。",
      "strengths": ["发音准确", "语句流畅"],
      "improvements": ["可以使用更多的连接词"]
    },
    "user_quest": {
      "status": "completed",
      "attempts": 2,
      "best_score": 85,
      "completed_at": "2026-01-31T12:30:00Z"
    }
  }
}
```

---

### 3.4 获取任务详情

**端点**: `GET /quests/:questId`
**认证**: 需要
**描述**: 获取任务的详细信息

---

### 3.5 获取排行榜

**端点**: `GET /leaderboard`
**认证**: 需要
**描述**: 获取排行榜数据

#### 查询参数

- `type`: 排行榜类型 (`global`, `friends`, `zone`)
- `limit`: 返回数量 (默认50)

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "id": "uuid",
          "username": "top_player",
          "display_name": "顶级玩家",
          "avatar_url": "https://...",
          "level": 50,
          "experience": 125000
        }
      }
    ],
    "current_user_rank": 127,
    "total_players": 5000
  }
}
```

---

## 🤖 AI 对话 API

### 4.1 发送对话消息

**端点**: `POST /ai/dialogue`
**认证**: 需要
**描述**: 向 AI 发送对话消息并获取响应

#### 请求体

```json
{
  "session_id": "uuid",
  "quest_id": "starter_village_quest_001",
  "message": {
    "type": "text" | "audio",
    "content": "Hello, I'm new here!",
    "audio_url": "https://..." // 如果是语音
  }
}
```

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "response": {
      "role": "assistant",
      "content": "Welcome to our village! I'm Chief Tom. What's your name?",
      "audio_url": "https://tts-cdn.example.com/response.mp3"
    },
    "evaluation": {
      "pronunciation_score": 85,
      "grammar_score": 90,
      "fluency_score": 80,
      "issues": [
        {
          "type": "pronunciation",
          "word": "village",
          "suggestion": "注意 'v' 的发音"
        }
      ]
    },
    "suggestions": [
      "Try to speak a bit more slowly",
      "Great use of greeting!"
    ],
    "progress": {
      "current_turn": 3,
      "total_turns_target": 8,
      "objectives_completed": ["向村长问好"],
      "objectives_remaining": ["介绍自己", "询问村子的情况"]
    }
  }
}
```

#### 限流
- 每分钟最多 30 次请求
- 每次对话会话最多 50 轮对话

---

### 4.2 结束对话会话

**端点**: `POST /ai/dialogue/:sessionId/end`
**认证**: 需要
**描述**: 结束对话会话并获取最终评分

#### 响应

**成功 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "session_summary": {
      "session_id": "uuid",
      "total_turns": 8,
      "duration_seconds": 245,
      "final_score": 85,
      "breakdown": {
        "pronunciation": 88,
        "grammar": 84,
        "fluency": 82,
        "completeness": 86
      }
    },
    "passed": true,
    "can_submit_quest": true
  }
}
```

---

## 👥 社交功能 API

### 5.1 搜索用户

**端点**: `GET /users/search`
**认证**: 需要
**描述**: 搜索用户

#### 查询参数

- `q`: 搜索关键词（用户名或昵称）
- `limit`: 返回数量

---

### 5.2 发送好友请求

**端点**: `POST /friends/request`
**认证**: 需要
**描述**: 发送好友请求

#### 请求体

```json
{
  "user_id": "uuid"
}
```

---

### 5.3 获取好友列表

**端点**: `GET /friends`
**认证**: 需要
**描述**: 获取好友列表

---

### 5.4 接受/拒绝好友请求

**端点**: `POST /friends/request/:requestId/:action`
**认证**: 需要
**参数**: action = `accept` | `reject`

---

## 💳 支付系统 API

### 6.1 创建订单

**端点**: `POST /payments/orders`
**认证**: 需要
**描述**: 创建支付订单

#### 请求体

```json
{
  "product_type": "membership",
  "product_id": "premium_monthly",
  "payment_method": "alipay"
}
```

#### 响应

**成功 (201 Created)**:
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "order_number": "EQ20260131123456",
      "amount": 99.00,
      "currency": "CNY",
      "status": "pending"
    },
    "payment_url": "https://payment-gateway.example.com/pay?order_id=..."
  }
}
```

---

### 6.2 查询订单状态

**端点**: `GET /payments/orders/:orderId`
**认证**: 需要

---

### 6.3 支付回调（Webhook）

**端点**: `POST /payments/webhook/:provider`
**认证**: 验签
**描述**: 接收支付网关的回调通知

---

## 🔌 WebSocket 协议

### 连接

**URL**: `wss://ws.englishquest.com/v1/game`
**认证**: URL参数传递token: `?token=jwt_token`

### 事件类型

#### 客户端 → 服务端

```json
// 1. 心跳
{
  "type": "ping"
}

// 2. 加入游戏房间
{
  "type": "join_room",
  "data": {
    "room_id": "uuid"
  }
}

// 3. 发送实时消息
{
  "type": "message",
  "data": {
    "room_id": "uuid",
    "message": "Hello!"
  }
}
```

#### 服务端 → 客户端

```json
// 1. 心跳响应
{
  "type": "pong"
}

// 2. 用户状态更新
{
  "type": "user_update",
  "data": {
    "level": 6,
    "experience": 3000,
    "coins": 1600
  }
}

// 3. 通知
{
  "type": "notification",
  "data": {
    "title": "新好友请求",
    "message": "用户 john_doe 想加你为好友",
    "action_url": "/friends/requests"
  }
}

// 4. 房间消息
{
  "type": "room_message",
  "data": {
    "room_id": "uuid",
    "user": {
      "id": "uuid",
      "username": "player1"
    },
    "message": "Hello!",
    "timestamp": "2026-01-31T12:00:00Z"
  }
}
```

---

## 📊 通用响应格式

### 成功响应

```json
{
  "success": true,
  "data": { /* 响应数据 */ },
  "message": "操作成功" // 可选
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": { /* 详细错误信息 */ } // 可选
  }
}
```

### 错误代码

| 代码 | HTTP状态 | 说明 |
|------|---------|------|
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `UNAUTHORIZED` | 401 | 未认证或Token无效 |
| `FORBIDDEN` | 403 | 无权限访问 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `CONFLICT` | 409 | 资源冲突（如用户名已存在） |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求频率超限 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |
| `SERVICE_UNAVAILABLE` | 503 | 服务暂时不可用 |

---

## 🔐 认证机制

### JWT Token

所有需要认证的 API 都需要在请求头中携带 JWT Token：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token 结构

```json
{
  "user_id": "uuid",
  "username": "john_doe",
  "membership_tier": "premium",
  "iat": 1706688000,
  "exp": 1707292800
}
```

### Token 过期

- 有效期：7天
- 刷新机制：使用 `/auth/refresh` 端点

---

## ⚡ 限流策略

| 端点类型 | 限制 |
|---------|------|
| 认证端点 | 5次/分钟 |
| AI对话 | 30次/分钟 |
| 一般API | 100次/分钟 |
| 支付API | 10次/分钟 |

超过限制返回 `429 Too Many Requests`

---

## 📝 开发注意事项

1. **时间格式**: 统一使用 ISO 8601 格式（UTC时间）
2. **分页**: 使用 `limit` 和 `offset` 参数
3. **排序**: 使用 `sort_by` 和 `order` 参数
4. **CORS**: 允许的域名需要在服务端配置
5. **HTTPS**: 生产环境强制使用 HTTPS

---

**API 设计完成时间**: 2026-01-31
**下一步**: 等待 code-generation Agent 实现 API
