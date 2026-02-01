# 🔄 AI模型切换完成 - 阿里云通义千问

## ✅ 已完成的工作

### 1. 创建新的AI服务
- ✅ 创建 `backend/src/services/qwenService.ts`
- ✅ 使用阿里云通义千问API (DashScope)
- ✅ 支持所有原有功能（对话、评估）

### 2. 更新控制器
- ✅ 修改 `backend/src/controllers/aiController.ts`
- ✅ 将所有 `ClaudeService` 引用改为 `QwenService`
- ✅ 保持API接口不变

### 3. 更新环境配置
- ✅ 在 `.env` 中添加 `DASHSCOPE_API_KEY`
- ✅ 注释掉旧的 `CLAUDE_API_KEY`

## 📋 配置步骤

### 获取阿里云通义千问API密钥

1. **访问阿里云DashScope控制台**
   ```
   https://dashscope.console.aliyun.com/
   ```

2. **注册/登录阿里云账号**
   - 如果没有账号，需要先注册
   - 需要实名认证

3. **开通DashScope服务**
   - 进入控制台后，开通"模型服务灵积"
   - 选择按量付费或购买资源包

4. **创建API Key**
   - 在控制台点击"API-KEY管理"
   - 点击"创建新的API-KEY"
   - 复制生成的API Key

5. **配置到项目**
   编辑 `backend/.env` 文件：
   ```bash
   # 阿里云通义千问 API
   DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

6. **重启后端服务**
   ```bash
   cd backend
   npm run dev
   ```

## 🧪 测试AI功能

运行测试脚本：
```bash
node test-ai-chat.js
```

预期输出：
```
🧪 测试AI聊天功能

1️⃣ 注册测试用户...
✅ 注册成功，获得Token

2️⃣ 测试AI聊天...
发送消息: "Hello, how are you?"

✅ AI聊天成功！
AI回复: Hello! I'm doing well, thank you for asking...

🎉 测试通过！
```

## 📊 API对比

### 通义千问 vs Claude

| 特性 | 通义千问 (Qwen) | Claude |
|------|----------------|--------|
| **提供商** | 阿里云 | Anthropic |
| **模型** | qwen-plus | claude-3-5-sonnet |
| **价格** | ¥0.004/1K tokens | $3/1M tokens |
| **中文支持** | ⭐⭐⭐⭐⭐ 优秀 | ⭐⭐⭐⭐ 良好 |
| **英文支持** | ⭐⭐⭐⭐ 良好 | ⭐⭐⭐⭐⭐ 优秀 |
| **响应速度** | 快 | 快 |
| **国内访问** | 无需VPN | 需要VPN |

## 🔧 技术细节

### API端点
```
POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
```

### 请求格式
```json
{
  "model": "qwen-plus",
  "input": {
    "messages": [
      {"role": "system", "content": "系统提示"},
      {"role": "user", "content": "用户消息"}
    ]
  },
  "parameters": {
    "result_format": "message",
    "max_tokens": 1024,
    "temperature": 0.7
  }
}
```

### 响应格式
```json
{
  "output": {
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": "AI回复内容"
        }
      }
    ]
  }
}
```

## 📝 代码变更

### 新增文件
- `backend/src/services/qwenService.ts` - 通义千问服务

### 修改文件
- `backend/src/controllers/aiController.ts` - 更新AI服务引用
- `backend/.env` - 添加DASHSCOPE_API_KEY配置

### 测试文件
- `test-ai-chat.js` - AI聊天功能测试

## ⚠️ 注意事项

1. **API密钥安全**
   - 不要将API密钥提交到Git
   - `.env` 文件已在 `.gitignore` 中

2. **费用控制**
   - 通义千问按token计费
   - 建议设置费用预警
   - 可以在控制台查看用量

3. **模型选择**
   - `qwen-plus`: 性能均衡，推荐使用
   - `qwen-turbo`: 速度快，成本低
   - `qwen-max`: 性能最强，成本高

4. **错误处理**
   - API调用失败会返回友好错误信息
   - 超时设置为30秒
   - 自动重试机制（可选）

## 🚀 下一步

配置完成后，所有AI功能将正常工作：

- ✅ 游戏内NPC对话
- ✅ 任务对话系统
- ✅ 对话评估功能
- ✅ 学习建议生成

## 📞 获取帮助

### 阿里云文档
- 官方文档: https://help.aliyun.com/zh/dashscope/
- API参考: https://help.aliyun.com/zh/dashscope/developer-reference/api-details

### 常见问题

**Q: API密钥在哪里获取？**
A: 登录 https://dashscope.console.aliyun.com/ → API-KEY管理 → 创建新的API-KEY

**Q: 如何查看API用量？**
A: 控制台 → 用量统计 → 查看详细用量

**Q: 支持哪些模型？**
A: qwen-turbo, qwen-plus, qwen-max 等，详见官方文档

**Q: 价格如何计算？**
A: 按token计费，qwen-plus约 ¥0.004/1K tokens

## 🎉 总结

✅ AI服务已成功切换到阿里云通义千问
✅ 所有功能保持不变
✅ 配置简单，只需添加API密钥
✅ 国内访问更稳定，无需VPN

**配置API密钥后即可使用！**
