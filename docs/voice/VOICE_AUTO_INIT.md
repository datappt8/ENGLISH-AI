# 🎤 语音功能自动初始化

## 功能说明

游戏加载时会自动初始化和测试语音功能，确保最佳体验。

## 初始化流程

```
游戏启动
    ↓
等待1秒（确保页面完全加载）
    ↓
检查麦克风权限状态
    ↓
测试语音合成（静音测试）
    ↓
预加载语音列表
    ↓
初始化完成 ✅
```

## 控制台日志

打开浏览器控制台（F12），你会看到：

```
✅ 语音功能已启用
🎤 开始自动初始化语音功能...
🎤 检查麦克风权限...
🎤 麦克风权限状态: granted/prompt/denied
🔊 测试语音合成...
✅ 语音合成测试成功
✅ 已加载 XX 个语音
   其中英语语音: XX 个
✅ 语音功能初始化完成
💡 点击"🎤 语音回复"按钮时会请求麦克风权限
```

## 权限状态说明

### ✅ granted（已授予）
- 之前已经允许过麦克风权限
- 可以直接使用语音功能
- 点击"🎤 语音回复"会立即开始监听

### 💡 prompt（待请求）
- 首次使用，尚未请求权限
- 点击"🎤 语音回复"时会弹出权限请求
- 允许后即可使用

### ⚠️ denied（已拒绝）
- 之前拒绝过麦克风权限
- 需要在浏览器设置中手动允许
- 参考 `VOICE_TROUBLESHOOTING.md`

## 自动测试内容

### 1. 麦克风权限检查
- 使用 `navigator.permissions.query()` 检查权限状态
- 不会强制请求权限（避免打扰用户）
- 仅查询当前状态

### 2. 语音合成测试
- 静音播放测试语音（volume = 0）
- 快速播放（rate = 2）
- 验证 TTS 功能是否正常

### 3. 语音列表预加载
- 加载系统所有可用语音
- 统计英语语音数量
- 为后续使用做准备

## 优势

### ✅ 提前发现问题
- 在用户使用前就知道是否支持语音
- 提前加载语音列表，减少首次使用延迟

### ✅ 不打扰用户
- 不会强制请求麦克风权限
- 仅在用户点击"🎤 语音回复"时才请求

### ✅ 详细的日志
- 完整的初始化日志
- 方便调试和排查问题

### ✅ 优雅降级
- 即使初始化失败也不影响游戏
- 用户仍可使用文字对话

## 浏览器兼容性

| 浏览器 | 权限查询 | 语音合成 | 语音识别 |
|--------|---------|---------|---------|
| Chrome | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari | ⚠️ 部分支持 | ✅ | ✅ |
| Firefox | ⚠️ 部分支持 | ✅ | ❌ |
| 微信浏览器 | ❌ | ❌ | ❌ |

## 使用建议

### 桌面端
1. 使用 Chrome 或 Edge（推荐）
2. 首次使用时允许麦克风权限
3. 查看控制台确认初始化成功

### 移动端
1. 使用 Safari (iOS) 或 Chrome (Android)
2. 确保在浏览器设置中允许麦克风
3. 横屏游戏以获得最佳体验

## 故障排查

### 问题1: 控制台显示"浏览器不支持语音功能"
**解决**: 更换浏览器，使用 Chrome、Edge 或 Safari

### 问题2: 麦克风权限状态为 denied
**解决**:
1. Chrome: 设置 → 隐私和安全 → 网站设置 → 麦克风
2. Safari: 设置 → Safari → 网站设置 → 麦克风
3. 找到游戏网站，改为"允许"

### 问题3: 语音合成测试失败
**解决**:
1. 检查系统音量
2. 检查浏览器是否静音
3. 重启浏览器

### 问题4: 没有加载到英语语音
**解决**:
1. 检查系统语言设置
2. Windows: 设置 → 时间和语言 → 语音
3. macOS: 系统偏好设置 → 辅助功能 → 语音内容
4. 下载英语语音包

## 技术细节

### 权限查询 API
```typescript
const permissionStatus = await navigator.permissions.query({
  name: 'microphone' as PermissionName
})
console.log(permissionStatus.state) // 'granted', 'prompt', 'denied'
```

### 静音测试
```typescript
const utterance = new SpeechSynthesisUtterance('Test')
utterance.volume = 0  // 静音
utterance.rate = 2    // 快速
speechSynthesis.speak(utterance)
```

### 语音列表加载
```typescript
const voices = speechSynthesis.getVoices()
const enVoices = voices.filter(v => v.lang.startsWith('en'))
```

## 相关文档

- `VOICE_TROUBLESHOOTING.md` - 语音功能故障排查
- `MOBILE_USAGE_GUIDE.md` - 手机端使用指南
- `WECHAT_BROWSER_FIX.md` - 微信浏览器兼容性

---

**总结**: 自动初始化功能让语音系统在后台静默准备，用户点击"🎤 语音回复"时可以立即使用，提供流畅的体验。
