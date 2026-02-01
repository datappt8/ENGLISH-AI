# 📱 手机麦克风调用完整指南

## 概述

本指南详细说明如何在手机浏览器中调用和启用麦克风功能。

## 核心API

### 1. MediaDevices API（麦克风权限）

```javascript
// 请求麦克风权限
const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

// 使用完毕后停止
stream.getTracks().forEach(track => track.stop())
```

### 2. Web Speech API（语音识别）

```javascript
// 创建语音识别实例
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

// 配置
recognition.lang = 'en-US'
recognition.continuous = false
recognition.interimResults = false

// 开始识别
recognition.start()

// 监听结果
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript
  console.log('识别结果:', transcript)
}
```

## 手机端调用流程

### 方案1: 用户主动触发（推荐）

```javascript
// ✅ 必须在用户交互事件中调用
button.onclick = async () => {
  try {
    // 1. 请求麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // 2. 权限获取成功
    console.log('✅ 麦克风权限已获取')

    // 3. 停止流（我们只需要权限）
    stream.getTracks().forEach(track => track.stop())

    // 4. 启动语音识别
    recognition.start()

  } catch (error) {
    console.error('❌ 麦克风权限被拒绝:', error)
  }
}
```

### 方案2: 预先检查权限状态

```javascript
// 检查权限状态（不会触发权限请求）
const checkPermission = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' })

    if (result.state === 'granted') {
      console.log('✅ 已有麦克风权限')
      return true
    } else if (result.state === 'prompt') {
      console.log('💡 需要请求权限')
      return false
    } else {
      console.log('❌ 权限被拒绝')
      return false
    }
  } catch (e) {
    console.log('⚠️ 无法查询权限状态')
    return false
  }
}
```

## 本项目实现

### 1. MicrophoneSetup 组件

位置: `frontend/src/components/MicrophoneSetup.tsx`

**功能**:
- 游戏启动前的麦克风设置流程
- 检测浏览器兼容性
- 请求麦克风权限
- 测试麦克风功能
- 提供详细的错误提示

**使用方式**:
```tsx
<MicrophoneSetup onComplete={() => {
  // 麦克风设置完成，进入游戏
  setShowMicSetup(false)
}} />
```

### 2. VoiceManager 类

位置: `frontend/src/game/managers/VoiceManager.ts`

**功能**:
- 语音识别（Speech Recognition）
- 语音合成（Text-to-Speech）
- 自动初始化和测试
- 美式英语语音选择

**使用方式**:
```typescript
import { getVoiceManager } from './VoiceManager'

const voiceManager = getVoiceManager()

// 开始语音识别
await voiceManager.startListening(
  (transcript, confidence) => {
    console.log('识别结果:', transcript)
  },
  (error) => {
    console.error('错误:', error)
  }
)

// 语音合成（朗读）
voiceManager.speak('Hello, how are you?', {
  lang: 'en-US',
  rate: 0.9,
  voice: voiceManager.getRecommendedVoice()
})
```

## 手机端最佳实践

### ✅ 正确做法

1. **在用户交互中请求权限**
```javascript
// ✅ 在按钮点击事件中
button.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
}
```

2. **提供清晰的UI提示**
```javascript
// ✅ 显示"请允许麦克风权限"提示
showPermissionHint()
await requestMicrophone()
```

3. **处理权限被拒绝的情况**
```javascript
// ✅ 提供设置指引
if (error.name === 'NotAllowedError') {
  showSettingsGuide()
}
```

4. **使用HTTPS**
```
✅ https://example.com  （支持麦克风）
❌ http://example.com   （不支持麦克风）
```

### ❌ 错误做法

1. **页面加载时自动请求**
```javascript
// ❌ 不要在页面加载时请求
window.onload = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: true }) // 会被阻止
}
```

2. **没有用户交互**
```javascript
// ❌ 不要在定时器中请求
setTimeout(async () => {
  await navigator.mediaDevices.getUserMedia({ audio: true }) // 会被阻止
}, 1000)
```

3. **使用HTTP协议**
```
❌ http://localhost:3000  （生产环境不支持）
✅ https://localhost:3000 （支持）
```

## 不同浏览器的差异

### iOS Safari
- ✅ 支持 getUserMedia
- ✅ 支持 Web Speech API
- ⚠️ 必须在用户交互中调用
- ⚠️ 不支持 `navigator.permissions.query()`

### Android Chrome
- ✅ 完全支持
- ✅ 支持权限查询
- ✅ 支持后台运行

### 微信浏览器
- ❌ 不支持 Web Speech API
- ⚠️ 需要使用微信 JSSDK
- 💡 建议提示用户"在浏览器中打开"

### Firefox Mobile
- ✅ 支持 getUserMedia
- ❌ 不支持 Web Speech API（语音识别）
- ✅ 支持 Speech Synthesis（语音合成）

## 常见问题

### Q1: 为什么手机上麦克风权限请求失败？

**原因**:
1. 不在用户交互事件中调用
2. 使用HTTP而非HTTPS
3. 浏览器不支持
4. 用户拒绝了权限

**解决**:
```javascript
// ✅ 确保在用户点击事件中调用
button.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    console.log('✅ 成功')
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      alert('请在浏览器设置中允许麦克风权限')
    }
  }
})
```

### Q2: 如何在iOS上可靠地获取麦克风权限？

**方案**:
```javascript
// iOS需要在用户交互中直接调用
const iosRequestMicrophone = async () => {
  // 1. 必须在touchstart/click等事件中
  // 2. 不能有异步延迟
  // 3. 直接调用getUserMedia

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  return stream
}

// ✅ 正确
button.onclick = async () => {
  const stream = await iosRequestMicrophone()
}

// ❌ 错误（有延迟）
button.onclick = async () => {
  await someAsyncFunction() // 延迟会导致失败
  const stream = await iosRequestMicrophone()
}
```

### Q3: 如何检测浏览器是否支持语音功能？

```javascript
const checkVoiceSupport = () => {
  // 检查语音识别
  const hasSpeechRecognition = 'SpeechRecognition' in window ||
                                'webkitSpeechRecognition' in window

  // 检查语音合成
  const hasSpeechSynthesis = 'speechSynthesis' in window

  // 检查麦克风
  const hasMicrophone = 'mediaDevices' in navigator &&
                        'getUserMedia' in navigator.mediaDevices

  return {
    recognition: hasSpeechRecognition,
    synthesis: hasSpeechSynthesis,
    microphone: hasMicrophone,
    supported: hasSpeechRecognition && hasSpeechSynthesis && hasMicrophone
  }
}

const support = checkVoiceSupport()
console.log('语音支持:', support)
```

### Q4: 微信浏览器如何处理？

**方案1: 提示用户切换浏览器**
```javascript
const isWeChat = /MicroMessenger/i.test(navigator.userAgent)

if (isWeChat) {
  alert('微信浏览器不支持语音功能\n请点击右上角"..."，选择"在浏览器中打开"')
}
```

**方案2: 使用微信JSSDK（需要后端支持）**
```javascript
// 需要微信公众号配置
wx.startRecord({
  success: function() {
    console.log('开始录音')
  }
})
```

## 调试技巧

### 1. 查看权限状态
```javascript
navigator.permissions.query({ name: 'microphone' }).then(result => {
  console.log('麦克风权限:', result.state)
  // 'granted' | 'denied' | 'prompt'
})
```

### 2. 测试麦克风
```javascript
const testMicrophone = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // 创建音频上下文
    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    source.connect(analyser)

    // 检测音量
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    const checkVolume = () => {
      analyser.getByteFrequencyData(dataArray)
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length
      console.log('音量:', volume)
    }

    setInterval(checkVolume, 100)

  } catch (error) {
    console.error('麦克风测试失败:', error)
  }
}
```

### 3. 控制台日志
```javascript
// 在VoiceManager中已经添加了详细日志
// 打开浏览器控制台（F12）查看：
// 🎤 开始自动初始化语音功能...
// 🎤 检查麦克风权限...
// 🎤 麦克风权限状态: granted
// ✅ 语音功能初始化完成
```

## 生产环境检查清单

- [ ] 使用HTTPS协议
- [ ] 在用户交互中请求权限
- [ ] 提供清晰的权限请求说明
- [ ] 处理权限被拒绝的情况
- [ ] 检测浏览器兼容性
- [ ] 提供降级方案（文字输入）
- [ ] 测试iOS Safari
- [ ] 测试Android Chrome
- [ ] 处理微信浏览器
- [ ] 添加错误日志

## 相关文档

- `VOICE_AUTO_INIT.md` - 语音功能自动初始化
- `VOICE_TROUBLESHOOTING.md` - 语音功能故障排查
- `MOBILE_USAGE_GUIDE.md` - 手机端使用指南

---

**总结**: 手机端麦克风调用的关键是**在用户交互事件中直接调用**，使用**HTTPS协议**，并提供**清晰的权限说明**和**错误处理**。
