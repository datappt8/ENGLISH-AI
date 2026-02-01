# 🎤 语音功能文档

## 📋 功能概览

游戏现在支持完整的语音交互功能，包括：
- **语音识别** (Speech Recognition) - 玩家可以用语音与NPC对话
- **语音合成** (Text-to-Speech) - NPC的回复会自动朗读

---

## ✨ 功能特性

### 语音识别 (Speech-to-Text)
- ✅ 实时语音识别
- ✅ 英语识别（可扩展其他语言）
- ✅ 置信度评分
- ✅ 错误处理和重试
- ✅ 麦克风权限管理

### 语音合成 (Text-to-Speech)
- ✅ 自动朗读NPC对话
- ✅ 可选择不同语音
- ✅ 可调节语速、音调、音量
- ✅ 播放控制（播放、暂停、停止）

---

## 🎮 使用方法

### 在游戏中使用

1. **开始对话**
   - 点击NPC开始对话
   - NPC的问候语会自动朗读

2. **语音回复**
   - 点击 "🎤 语音回复" 按钮
   - 允许麦克风权限（首次使用）
   - 看到 "🎤 正在监听，请说话..." 提示
   - 说出你的回复
   - 系统自动识别并发送给AI

3. **文本回复**
   - 点击 "💬 继续对话" 或 "❓ 询问任务"
   - 使用预设的文本回复

---

## 🔧 技术实现

### VoiceManager 类

**位置**: `frontend/src/game/managers/VoiceManager.ts`

**核心方法**:

```typescript
// 开始语音识别
startListening(
  onResult: (transcript: string, confidence: number) => void,
  onError?: (error: string) => void
)

// 停止语音识别
stopListening()

// 语音合成（朗读文本）
speak(text: string, options?: {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
})

// 停止语音播放
stopSpeaking()

// 获取可用语音列表
getVoices(): SpeechSynthesisVoice[]
```

### DialogueManager 集成

**位置**: `frontend/src/game/managers/DialogueManager.ts`

**新增功能**:
- 自动朗读NPC消息
- 语音输入按钮
- 语音识别状态显示
- 错误处理和提示

---

## 🌐 浏览器支持

### 完全支持
- ✅ Chrome 25+
- ✅ Edge 79+
- ✅ Safari 14.1+
- ✅ Opera 27+

### 部分支持
- ⚠️ Firefox (需要启用实验性功能)

### 不支持
- ❌ Internet Explorer

---

## 🎯 语音识别配置

### 默认设置
```typescript
{
  lang: 'en-US',           // 美式英语
  continuous: false,       // 单次识别
  interimResults: false,   // 只返回最终结果
  maxAlternatives: 1       // 只返回最佳匹配
}
```

### 支持的语言
- `en-US` - 美式英语
- `en-GB` - 英式英语
- `en-AU` - 澳大利亚英语
- `en-CA` - 加拿大英语
- 可扩展其他语言

---

## 🔊 语音合成配置

### 默认设置
```typescript
{
  lang: 'en-US',    // 美式英语
  rate: 0.9,        // 语速（0.1-10）
  pitch: 1,         // 音调（0-2）
  volume: 1         // 音量（0-1）
}
```

### 推荐语音
系统会自动选择最佳英语语音：
1. 优先：Google US English
2. 其次：任何美式英语
3. 最后：任何英语语音

---

## 🐛 错误处理

### 常见错误及解决方案

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `no-speech` | 没有检测到语音 | 请重试，确保麦克风正常 |
| `audio-capture` | 无法访问麦克风 | 检查麦克风连接 |
| `not-allowed` | 权限被拒绝 | 在浏览器设置中允许麦克风权限 |
| `network` | 网络错误 | 检查网络连接 |
| `aborted` | 识别被中止 | 重新开始识别 |

### 权限管理

首次使用时，浏览器会请求麦克风权限：
1. 点击 "允许"
2. 如果误点 "拒绝"，需要在浏览器设置中手动允许

**Chrome**: 地址栏左侧 → 网站设置 → 麦克风 → 允许

---

## 📊 性能优化

### 语音识别
- 单次识别模式（`continuous: false`）
- 只返回最终结果（`interimResults: false`）
- 自动停止监听

### 语音合成
- 使用本地语音引擎（无需网络）
- 自动停止之前的播放
- 内存占用小

---

## 🎨 用户体验

### 视觉反馈
- 🎤 监听中：显示 "正在监听，请说话..."
- ✅ 识别成功：显示识别的文本
- ❌ 识别失败：显示错误信息
- 🔊 播放中：NPC消息自动朗读

### 音频反馈
- NPC消息自动朗读
- 语速适中（0.9倍速）
- 音量适中

---

## 🧪 测试方法

### 测试语音合成
```typescript
import { getVoiceManager } from './VoiceManager'

const voiceManager = getVoiceManager()
await voiceManager.testVoice()
```

### 测试语音识别
1. 打开游戏
2. 点击NPC开始对话
3. 点击 "🎤 语音回复"
4. 说 "Hello, how are you?"
5. 检查是否正确识别

---

## 🔐 隐私和安全

### 数据处理
- ✅ 语音识别在浏览器本地进行（Chrome）
- ✅ 不存储语音数据
- ✅ 不上传语音文件
- ✅ 只发送识别后的文本到服务器

### 权限
- 需要麦克风权限
- 用户可随时撤销权限
- 不访问其他设备

---

## 📱 移动设备支持

### iOS (Safari)
- ✅ 语音合成支持
- ⚠️ 语音识别支持有限
- 需要用户交互触发

### Android (Chrome)
- ✅ 完全支持语音识别
- ✅ 完全支持语音合成

---

## 🚀 未来改进

### 计划中的功能
1. **发音评分** - 评估玩家发音准确度
2. **语音情感分析** - 检测语音情感
3. **多语言支持** - 支持更多语言
4. **离线模式** - 完全离线的语音识别
5. **自定义语音** - 为NPC定制独特语音

### 技术升级
1. 使用 Web Speech API v2
2. 集成第三方语音服务（可选）
3. 添加语音训练功能
4. 优化识别准确度

---

## 💡 使用建议

### 最佳实践
1. **安静环境** - 在安静的环境中使用语音功能
2. **清晰发音** - 说话清晰，语速适中
3. **标准英语** - 使用标准英语发音
4. **短句子** - 使用简短的句子（5-15个单词）

### 故障排除
1. **识别不准确**
   - 检查麦克风质量
   - 减少背景噪音
   - 说话更清晰

2. **无法识别**
   - 检查麦克风权限
   - 重启浏览器
   - 更换浏览器

3. **语音不播放**
   - 检查音量设置
   - 检查浏览器音频权限
   - 尝试其他语音

---

## 📞 技术支持

### 调试信息
打开浏览器控制台查看详细日志：
- `✅ 语音功能已启用` - 功能正常
- `⚠️ 浏览器不支持语音功能` - 浏览器不支持
- `🎤 识别结果: "..."` - 识别成功
- `❌ 语音识别错误: ...` - 识别失败

### 常见问题
查看项目 README 或提交 Issue

---

## 🔗 相关资源

### Web API 文档
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)

### 浏览器兼容性
- [Can I Use - Speech Recognition](https://caniuse.com/speech-recognition)
- [Can I Use - Speech Synthesis](https://caniuse.com/speech-synthesis)

---

**文档创建**: 2026-02-01
**最后更新**: 2026-02-01
**版本**: 1.0.0
