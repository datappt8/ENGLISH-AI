# 技术架构文档

## 系统架构概览

### 整体架构
```
┌─────────────────────────────────────────────────────────┐
│                    客户端层 (Client)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Web App  │  │ Mobile   │  │ Desktop  │              │
│  │ (React)  │  │ (React   │  │ (Electron│              │
│  │          │  │  Native) │  │  /Tauri) │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↓ HTTPS/WSS
┌─────────────────────────────────────────────────────────┐
│                   API网关层 (Gateway)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Nginx / Traefik (负载均衡、SSL、限流)            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   应用服务层 (Services)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ 用户服务 │  │ 游戏服务 │  │ AI服务   │              │
│  │ (Auth)   │  │ (Game)   │  │ (AI)     │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ 支付服务 │  │ 社交服务 │  │ 分析服务 │              │
│  │ (Payment)│  │ (Social) │  │(Analytics│              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   数据层 (Data Layer)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │PostgreSQL│  │  Redis   │  │  MongoDB │              │
│  │(关系数据)│  │  (缓存)  │  │(日志/文档│              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                 第三方服务 (External APIs)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Claude   │  │ 语音识别 │  │ 支付网关 │              │
│  │   API    │  │   API    │  │ (Stripe) │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

## 技术栈选择

### 前端技术栈

#### Web客户端
- **框架**: React 18+ with TypeScript
- **状态管理**: Zustand / Redux Toolkit
- **路由**: React Router v6
- **UI组件**:
  - Tailwind CSS (样式)
  - Framer Motion (动画)
  - Radix UI (无障碍组件)
- **游戏渲染**:
  - Phaser 3 (2D游戏引擎)
  - Three.js (2.5D效果)
  - PixiJS (高性能2D渲染)
- **实时通信**: Socket.io-client
- **语音处理**:
  - Web Speech API
  - MediaRecorder API
- **构建工具**: Vite

#### 移动端
- **框架**: React Native + TypeScript
- **导航**: React Navigation
- **状态管理**: Zustand
- **UI库**: React Native Paper
- **游戏引擎**: React Native Game Engine

### 后端技术栈

#### 主服务器
- **运行时**: Node.js 20+ / Bun
- **框架**:
  - Express.js (REST API)
  - Socket.io (WebSocket)
- **语言**: TypeScript
- **API文档**: Swagger/OpenAPI

#### 微服务架构（可选）
- **用户服务**: Node.js + Express
- **游戏服务**: Node.js + Socket.io
- **AI服务**: Python + FastAPI
- **支付服务**: Node.js + Express

### 数据库

#### 主数据库 - PostgreSQL
**用途**: 用户数据、游戏数据、交易记录

**表结构设计**:
```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  membership_tier VARCHAR(20) DEFAULT 'free',
  level INT DEFAULT 1,
  experience INT DEFAULT 0,
  coins INT DEFAULT 0,
  diamonds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- 用户进度表
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  current_zone VARCHAR(50),
  completed_tasks JSONB,
  achievements JSONB,
  stats JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 任务表
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  zone VARCHAR(50) NOT NULL,
  difficulty INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  rewards JSONB NOT NULL,
  required_level INT DEFAULT 1
);

-- 交易记录表
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 缓存 - Redis
**用途**:
- 会话管理
- 实时排行榜
- 游戏房间状态
- API限流

**数据结构**:
```
# 用户会话
session:{user_id} → {session_data}

# 排行榜
leaderboard:global → ZSET (score: level+exp)
leaderboard:weekly → ZSET

# 游戏房间
room:{room_id} → {room_state}

# 限流
ratelimit:{user_id}:{endpoint} → counter
```

#### 文档数据库 - MongoDB
**用途**:
- 对话记录
- 学习日志
- 分析数据

**集合设计**:
```javascript
// 对话记录
{
  _id: ObjectId,
  user_id: UUID,
  session_id: UUID,
  messages: [
    {
      role: "user" | "ai",
      content: String,
      timestamp: Date,
      audio_url: String,
      pronunciation_score: Number
    }
  ],
  created_at: Date
}

// 学习日志
{
  _id: ObjectId,
  user_id: UUID,
  date: Date,
  activities: [
    {
      type: String,
      duration: Number,
      tasks_completed: Number,
      experience_gained: Number
    }
  ]
}
```

### AI服务集成

#### Claude API
**用途**: AI对话、语法纠正、内容生成

**配置**:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// AI对话
async function chatWithAI(userMessage: string, context: any) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: userMessage }
    ],
    system: `You are an English teacher in a game...`
  });
  return response.content;
}
```

#### 语音识别服务
**选项**:
1. **Web Speech API** (免费，浏览器内置)
2. **Google Cloud Speech-to-Text** (高精度)
3. **Azure Speech Services** (多语言支持)
4. **Whisper API** (OpenAI，高质量)

**实现示例**:
```typescript
// Web Speech API
const recognition = new webkitSpeechRecognition();
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  const confidence = event.results[0][0].confidence;
  // 处理识别结果
};
```

#### 语音合成服务
**选项**:
1. **Web Speech API** (免费)
2. **ElevenLabs** (高质量，自然)
3. **Google Cloud TTS**
4. **Azure TTS**

#### 发音评分算法
**方案**:
```typescript
interface PronunciationScore {
  overall: number;        // 总分 0-100
  accuracy: number;       // 准确度
  fluency: number;        // 流利度
  completeness: number;   // 完整度
  prosody: number;        // 韵律
}

async function scorePronunciation(
  audioBlob: Blob,
  expectedText: string
): Promise<PronunciationScore> {
  // 1. 语音识别获取实际文本
  const actualText = await speechToText(audioBlob);

  // 2. 文本相似度比较
  const accuracy = calculateSimilarity(expectedText, actualText);

  // 3. 音频特征分析
  const audioFeatures = await analyzeAudio(audioBlob);

  // 4. 综合评分
  return {
    overall: calculateOverallScore(accuracy, audioFeatures),
    accuracy,
    fluency: audioFeatures.fluency,
    completeness: audioFeatures.completeness,
    prosody: audioFeatures.prosody
  };
}
```

### 实时通信架构

#### WebSocket服务
```typescript
import { Server } from 'socket.io';

const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// 命名空间
const gameNamespace = io.of('/game');
const chatNamespace = io.of('/chat');

// 游戏事件
gameNamespace.on('connection', (socket) => {
  // 加入房间
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  // 任务更新
  socket.on('task_update', (data) => {
    gameNamespace.to(data.roomId).emit('task_updated', data);
  });

  // 实时对话
  socket.on('voice_message', async (audioData) => {
    const result = await processVoice(audioData);
    socket.emit('voice_result', result);
  });
});
```

### 角色和场景资源

#### 2D资源制作
**工具**:
- **Gemini Nano**: AI生成角色和场景图片
- **Stable Diffusion**: 开源图像生成
- **Aseprite**: 像素艺术制作
- **Figma**: UI设计

**资源规格**:
```
角色精灵图: 512x512px, PNG, 透明背景
场景背景: 1920x1080px, JPG/PNG
UI元素: SVG格式（可缩放）
动画帧: 每秒12-24帧
```

#### 2.5D效果
**实现方案**:
```typescript
// 使用Three.js创建2.5D场景
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(/*...*/);

// 添加2D精灵到3D空间
const sprite = new THREE.Sprite(material);
sprite.position.z = layerDepth; // 控制层次

// 视差滚动效果
function updateParallax(cameraX: number) {
  backgroundLayer.position.x = cameraX * 0.5;
  midgroundLayer.position.x = cameraX * 0.8;
  foregroundLayer.position.x = cameraX * 1.0;
}
```

#### 3D模型（可选）
**工具**:
- **Banana**: 免费3D模型库
- **Blender**: 开源3D建模
- **Ready Player Me**: 虚拟形象生成

### 部署架构

#### 开发环境
```
本地开发 → Docker Compose
├── Frontend (localhost:5173)
├── Backend (localhost:3000)
├── PostgreSQL (localhost:5432)
├── Redis (localhost:6379)
└── MongoDB (localhost:27017)
```

#### 生产环境
```
云服务提供商: AWS / Azure / Google Cloud / 阿里云

架构:
├── CDN (CloudFlare) → 静态资源
├── Load Balancer → 负载均衡
├── App Servers (Auto Scaling) → 应用服务器
├── Database Cluster → 数据库集群
├── Redis Cluster → 缓存集群
└── Object Storage (S3) → 媒体文件
```

#### Docker配置
```dockerfile
# Frontend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]

# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/englishquest
      - REDIS_URL=redis://redis:6379
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=englishquest
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  mongodb:
    image: mongo:7
    volumes:
      - mongo_data:/data/db

volumes:
  postgres_data:
  redis_data:
  mongo_data:
```

### 安全性

#### 认证和授权
```typescript
// JWT认证
import jwt from 'jsonwebtoken';

function generateToken(userId: string) {
  return jwt.sign(
    { userId, timestamp: Date.now() },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}

// 中间件
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

#### 数据加密
- 密码: bcrypt哈希
- 敏感数据: AES-256加密
- 传输: HTTPS/WSS
- 数据库: 加密存储

#### 防护措施
- **CSRF**: CSRF Token
- **XSS**: 内容安全策略(CSP)
- **SQL注入**: 参数化查询
- **DDoS**: 限流、CDN防护
- **数据验证**: Zod/Joi验证

### 性能优化

#### 前端优化
- 代码分割和懒加载
- 图片优化（WebP格式）
- 资源预加载
- Service Worker缓存
- 虚拟滚动

#### 后端优化
- 数据库索引优化
- Redis缓存策略
- API响应压缩
- 连接池管理
- 异步处理

#### 监控和日志
- **APM**: New Relic / Datadog
- **日志**: Winston / Pino
- **错误追踪**: Sentry
- **性能监控**: Lighthouse CI

### 开发工具链

#### 代码质量
- **Linter**: ESLint
- **Formatter**: Prettier
- **Type Check**: TypeScript
- **Testing**: Jest + React Testing Library
- **E2E**: Playwright

#### CI/CD
```yaml
# GitHub Actions
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # 部署脚本
```

### 成本估算

#### 基础设施成本（月）
- 服务器: $50-200
- 数据库: $30-100
- CDN: $20-50
- 对象存储: $10-30
- **小计**: $110-380/月

#### API成本（月）
- Claude API: $100-500（取决于使用量）
- 语音识别: $50-200
- 其他服务: $50-100
- **小计**: $200-800/月

#### 总成本
- **初期**: $300-1000/月
- **成长期**: $1000-3000/月
- **成熟期**: $3000-10000/月

### 扩展性考虑

#### 水平扩展
- 无状态应用服务器
- 数据库读写分离
- 缓存集群
- 消息队列（RabbitMQ/Kafka）

#### 垂直扩展
- 升级服务器配置
- 数据库性能优化
- 代码性能优化

### 技术债务管理
- 定期代码审查
- 重构计划
- 技术升级路线图
- 文档维护
