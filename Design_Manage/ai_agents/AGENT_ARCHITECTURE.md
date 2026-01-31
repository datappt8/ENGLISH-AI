# AI Agent 架构文档

## 概述
本项目采用多Agent协作开发模式，每个Agent负责特定领域的工作，通过统一的协调机制实现高效协作。

## Agent 团队结构

### 1. 游戏策划Agent (Game Design Agent)
**职责**:
- 游戏玩法设计
- 关卡和任务设计
- 游戏平衡性调整
- 用户体验优化
- 变现策略制定

**输入**:
- 用户需求和反馈
- 市场调研数据
- 测试数据和分析

**输出**:
- 游戏设计文档
- 关卡设计方案
- 任务脚本
- 平衡性调整方案

**工作流程**:
```
用户需求 → 需求分析 → 玩法设计 → 文档输出 → 评审迭代
```

**存储位置**: `Design_Manage/ai_agents/game_design_agent/`

---

### 2. 游戏架构Agent (Architecture Agent)
**职责**:
- 系统架构设计
- 技术选型
- 数据库设计
- API设计
- 性能优化方案

**输入**:
- 游戏设计需求
- 技术约束条件
- 性能要求

**输出**:
- 系统架构图
- 技术选型文档
- 数据库设计文档
- API接口文档
- 部署方案

**工作流程**:
```
功能需求 → 架构设计 → 技术选型 → 文档输出 → 技术评审
```

**存储位置**: `Design_Manage/ai_agents/architecture_agent/`

---

### 3. 角色设计Agent (Character Design Agent)
**职责**:
- 角色设计和建模
- 场景设计
- UI/UX设计
- 动画设计
- 视觉风格统一

**输入**:
- 游戏世界观设定
- 角色需求列表
- 美术风格指导

**输出**:
- 角色设计稿
- 场景设计图
- UI设计原型
- 动画脚本
- 资源文件清单

**工作流程**:
```
设计需求 → 概念设计 → 详细设计 → 资源制作 → 设计评审
```

**工具**:
- Gemini Nano (AI图像生成)
- Banana (3D模型)
- 其他免费设计工具

**存储位置**: `Design_Manage/ai_agents/character_design_agent/`

---

### 4. 代码生成Agent (Code Generation Agent)
**职责**:
- 前端代码实现
- 后端代码实现
- AI功能集成
- 数据库操作
- 代码优化

**输入**:
- 技术架构文档
- API接口文档
- 功能需求说明

**输出**:
- 前端代码
- 后端代码
- 配置文件
- 部署脚本
- 代码文档

**工作流程**:
```
需求文档 → 代码设计 → 代码实现 → 代码审查 → 提交版本
```

**技术栈**:
- 前端: React/Vue + Canvas/WebGL
- 后端: Node.js/Python
- 数据库: PostgreSQL/MongoDB
- AI: Claude API, 语音识别API

**存储位置**: `Design_Manage/ai_agents/code_generation_agent/`

---

### 5. 游戏测试Agent (Testing Agent)
**职责**:
- 功能测试
- 性能测试
- 用户体验测试
- Bug追踪
- 测试报告生成

**输入**:
- 测试版本代码
- 测试用例
- 用户反馈

**输出**:
- 测试报告
- Bug列表
- 性能分析报告
- 优化建议

**工作流程**:
```
获取版本 → 执行测试 → 记录问题 → 生成报告 → 反馈开发
```

**测试类型**:
- 单元测试
- 集成测试
- 端到端测试
- 压力测试
- 用户验收测试

**存储位置**: `Design_Manage/ai_agents/testing_agent/`

---

## Agent 协作机制

### 工作流程
```
[用户需求]
    ↓
[游戏策划Agent] → 设计文档
    ↓
[游戏架构Agent] → 技术方案
    ↓
[角色设计Agent] → 视觉资源
    ↓
[代码生成Agent] → 代码实现
    ↓
[游戏测试Agent] → 测试反馈
    ↓
[迭代循环]
```

### 通信协议

#### 1. 任务分配
```json
{
  "task_id": "TASK-001",
  "agent": "game_design_agent",
  "priority": "high",
  "description": "设计新手村关卡",
  "deadline": "2026-02-05",
  "dependencies": []
}
```

#### 2. 任务完成
```json
{
  "task_id": "TASK-001",
  "agent": "game_design_agent",
  "status": "completed",
  "output_files": [
    "Design_Manage/game_design/level_01.md"
  ],
  "next_agent": "architecture_agent",
  "notes": "已完成新手村10个关卡设计"
}
```

#### 3. 问题反馈
```json
{
  "issue_id": "ISSUE-001",
  "agent": "testing_agent",
  "severity": "high",
  "description": "发音评分功能延迟过高",
  "assigned_to": "code_generation_agent",
  "status": "open"
}
```

### 版本控制

#### Git 分支策略
```
main (生产环境)
  ↑
develop (开发环境)
  ↑
├── feature/game-design (游戏策划)
├── feature/architecture (架构设计)
├── feature/character-design (角色设计)
├── feature/code-implementation (代码实现)
└── feature/testing (测试)
```

#### 提交规范
```
[Agent名称] 类型: 简短描述

详细说明

相关任务: TASK-001
```

示例:
```
[GameDesign] feat: 添加新手村关卡设计

- 完成10个新手关卡
- 设计3个Boss战
- 添加20个支线任务

相关任务: TASK-001
```

### 日志系统

#### 项目日志
**位置**: `Design_Manage/logs/PROJECT_LOG.md`

**格式**:
```markdown
## 2026-01-31

### 游戏策划Agent
- [完成] 游戏核心玩法设计
- [进行中] 关卡详细设计

### 游戏架构Agent
- [待开始] 技术架构设计

### 问题
- 需要确认语音识别API选择
```

#### Agent工作日志
**位置**: `Design_Manage/ai_agents/{agent_name}/work_log.md`

**格式**:
```markdown
## 2026-01-31 14:30

### 任务: TASK-001
**状态**: 进行中
**进度**: 60%

### 完成内容
- 设计了5个关卡
- 编写了任务脚本

### 遇到的问题
- 需要确认难度曲线

### 下一步
- 完成剩余5个关卡
- 提交设计评审
```

## Agent 启动和管理

### 启动Agent
```bash
# 启动特定Agent
claude-code agent start game_design_agent

# 启动所有Agent
claude-code agent start --all

# 查看Agent状态
claude-code agent status
```

### Agent 命令

#### 分配任务
```bash
claude-code agent assign game_design_agent "设计中级城堡关卡"
```

#### 查看进度
```bash
claude-code agent progress game_design_agent
```

#### 暂停/恢复
```bash
claude-code agent pause game_design_agent
claude-code agent resume game_design_agent
```

#### 获取输出
```bash
claude-code agent output game_design_agent
```

## 迭代流程

### 迭代周期
```
第1周: 规划和设计
第2-3周: 原型开发
第4周: 测试和优化
第5周: 用户测试和反馈
第6周: 迭代改进
```

### 评审机制

#### 设计评审
- **参与者**: 游戏策划Agent + 用户
- **内容**: 游戏设计文档、关卡设计
- **输出**: 评审意见、修改方案

#### 技术评审
- **参与者**: 游戏架构Agent + 代码生成Agent
- **内容**: 技术方案、代码实现
- **输出**: 技术可行性报告

#### 用户验收
- **参与者**: 所有Agent + 用户
- **内容**: 完整功能演示
- **输出**: 验收报告、下一步计划

### 用户交互点

#### 1. 需求确认
```
用户 → 描述需求 → 游戏策划Agent → 需求文档 → 用户确认
```

#### 2. 设计评审
```
游戏策划Agent → 设计方案 → 用户评审 → 反馈意见 → 修改迭代
```

#### 3. 原型测试
```
代码生成Agent → 原型版本 → 用户测试 → 测试反馈 → 优化改进
```

#### 4. 版本发布
```
所有Agent → 完整版本 → 用户验收 → 发布决策 → 下一迭代
```

## 持久化和恢复

### 项目状态保存
**位置**: `Design_Manage/PROJECT_STATE.json`

**内容**:
```json
{
  "project_name": "English Quest",
  "version": "0.1.0",
  "last_update": "2026-01-31",
  "current_phase": "planning",
  "active_agents": [
    "game_design_agent",
    "architecture_agent"
  ],
  "completed_tasks": [],
  "pending_tasks": [
    "TASK-001",
    "TASK-002"
  ],
  "next_milestone": "完成游戏设计文档"
}
```

### 恢复机制
当重新启动Claude Code时:
1. 读取 `PROJECT_STATE.json`
2. 加载各Agent的工作日志
3. 恢复任务队列
4. 继续未完成的工作

## 性能监控

### Agent性能指标
- 任务完成时间
- 输出质量评分
- 迭代次数
- 用户满意度

### 优化策略
- 并行执行独立任务
- 缓存常用数据
- 优化Agent提示词
- 减少重复工作

## 扩展性

### 添加新Agent
1. 创建Agent目录
2. 编写Agent配置
3. 定义输入输出格式
4. 集成到工作流程
5. 更新文档

### Agent模板
```
Design_Manage/ai_agents/{new_agent_name}/
├── config.json          # Agent配置
├── work_log.md          # 工作日志
├── input/               # 输入文件
├── output/              # 输出文件
└── README.md            # Agent说明
```
