/**
 * 语音管理器
 * 处理语音识别（Speech Recognition）和语音合成（Text-to-Speech）
 */
export class VoiceManager {
  private recognition?: SpeechRecognition
  private synthesis: SpeechSynthesis
  private isListening: boolean = false
  private isSupported: boolean = false
  private currentUtterance?: SpeechSynthesisUtterance

  // 回调函数
  private onResultCallback?: (transcript: string, confidence: number) => void
  private onErrorCallback?: (error: string) => void
  private onStartCallback?: () => void
  private onEndCallback?: () => void

  constructor() {
    this.synthesis = window.speechSynthesis
    this.checkSupport()
    this.initRecognition()

    // 自动初始化和测试
    this.autoInitialize()
  }

  /**
   * 自动初始化和测试语音功能
   */
  private async autoInitialize() {
    if (!this.isSupported) {
      console.log('⚠️ 跳过语音初始化：浏览器不支持')
      return
    }

    console.log('🎤 开始自动初始化语音功能...')

    // 等待一小段时间，确保页面完全加载
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      // 1. 测试麦克风权限（静默测试，不强制请求）
      console.log('🎤 检查麦克风权限...')

      // 检查权限状态（如果浏览器支持）
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          console.log('🎤 麦克风权限状态:', permissionStatus.state)

          if (permissionStatus.state === 'granted') {
            console.log('✅ 麦克风权限已授予')
          } else if (permissionStatus.state === 'prompt') {
            console.log('💡 首次使用时会请求麦克风权限')
          } else {
            console.log('⚠️ 麦克风权限被拒绝')
          }
        } catch (e) {
          console.log('💡 无法查询权限状态（某些浏览器不支持）')
        }
      }

      // 2. 测试语音合成
      console.log('🔊 测试语音合成...')
      await this.testSpeechSynthesis()

      // 3. 预加载语音列表
      this.loadVoices()

      console.log('✅ 语音功能初始化完成')
      console.log('💡 点击"🎤 语音回复"按钮时会请求麦克风权限')
    } catch (error: any) {
      console.warn('⚠️ 语音功能初始化失败:', error.message)
    }
  }

  /**
   * 测试语音合成
   */
  private async testSpeechSynthesis(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance('Test')
        utterance.volume = 0 // 静音测试
        utterance.rate = 2 // 快速测试

        utterance.onend = () => {
          console.log('✅ 语音合成测试成功')
          resolve()
        }

        utterance.onerror = (error) => {
          console.warn('⚠️ 语音合成测试失败:', error)
          resolve() // 继续执行
        }

        // 设置超时
        setTimeout(() => {
          resolve() // 即使失败也继续
        }, 2000)

        speechSynthesis.speak(utterance)
      } catch (error) {
        console.warn('⚠️ 语音合成测试异常:', error)
        resolve() // 继续执行
      }
    })
  }

  /**
   * 预加载语音列表
   */
  private loadVoices() {
    const voices = speechSynthesis.getVoices()
    if (voices.length > 0) {
      console.log(`✅ 已加载 ${voices.length} 个语音`)
      const enVoices = voices.filter(v => v.lang.startsWith('en'))
      console.log(`   其中英语语音: ${enVoices.length} 个`)
    } else {
      // 某些浏览器需要等待 voiceschanged 事件
      speechSynthesis.addEventListener('voiceschanged', () => {
        const voices = speechSynthesis.getVoices()
        console.log(`✅ 已加载 ${voices.length} 个语音`)
      }, { once: true })
    }
  }

  /**
   * 检查浏览器支持
   */
  private checkSupport() {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    const hasSynthesis = 'speechSynthesis' in window

    this.isSupported = !!(SpeechRecognition && hasSynthesis)

    if (!this.isSupported) {
      console.warn('⚠️ 浏览器不支持语音功能')
      console.log('💡 建议使用 Chrome、Edge 或 Safari')
    } else {
      console.log('✅ 语音功能已启用')
    }
  }

  /**
   * 初始化语音识别
   */
  private initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    this.recognition = new SpeechRecognition()
    this.recognition.lang = 'en-US'
    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.maxAlternatives = 1

    // 识别结果
    this.recognition.onresult = (event) => {
      const result = event.results[0][0]
      const transcript = result.transcript
      const confidence = result.confidence

      console.log(`🎤 识别结果: "${transcript}" (置信度: ${(confidence * 100).toFixed(1)}%)`)

      if (this.onResultCallback) {
        this.onResultCallback(transcript, confidence)
      }
    }

    // 识别开始
    this.recognition.onstart = () => {
      this.isListening = true
      console.log('🎤 开始监听...')
      if (this.onStartCallback) {
        this.onStartCallback()
      }
    }

    // 识别结束
    this.recognition.onend = () => {
      this.isListening = false
      console.log('🎤 停止监听')
      if (this.onEndCallback) {
        this.onEndCallback()
      }
    }

    // 识别错误
    this.recognition.onerror = (event) => {
      this.isListening = false
      const errorMessage = this.getErrorMessage(event.error)
      console.error('❌ 语音识别错误:', errorMessage)

      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage)
      }
    }
  }

  /**
   * 获取错误信息
   */
  private getErrorMessage(error: string): string {
    const errorMessages: { [key: string]: string } = {
      'no-speech': '没有检测到语音，请重试',
      'audio-capture': '无法访问麦克风',
      'not-allowed': '麦克风权限被拒绝',
      'network': '网络错误',
      'aborted': '识别被中止',
      'language-not-supported': '不支持该语言'
    }

    return errorMessages[error] || `未知错误: ${error}`
  }

  /**
   * 开始语音识别
   */
  async startListening(
    onResult: (transcript: string, confidence: number) => void,
    onError?: (error: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!this.isSupported || !this.recognition) {
      const error = '浏览器不支持语音识别'
      console.error(error)
      if (onError) onError(error)
      return
    }

    if (this.isListening) {
      console.warn('⚠️ 已在监听中')
      return
    }

    // 先请求麦克风权限
    try {
      console.log('🎤 请求麦克风权限...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log('✅ 麦克风权限已获取')

      // 立即停止流，我们只是需要权限
      stream.getTracks().forEach(track => track.stop())

      // 设置回调
      this.onResultCallback = onResult
      this.onErrorCallback = onError
      this.onStartCallback = onStart
      this.onEndCallback = onEnd

      // 启动识别
      console.log('🎤 启动语音识别...')
      this.recognition.start()
    } catch (error: any) {
      console.error('❌ 麦克风权限请求失败:', error)
      let errorMsg = '无法访问麦克风'

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMsg = '麦克风权限被拒绝，请在浏览器设置中允许访问麦克风'
      } else if (error.name === 'NotFoundError') {
        errorMsg = '未找到麦克风设备'
      } else if (error.name === 'NotReadableError') {
        errorMsg = '麦克风被其他应用占用'
      }

      if (onError) onError(errorMsg)
    }
  }

  /**
   * 停止语音识别
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  /**
   * 语音合成（朗读文本）
   */
  speak(
    text: string,
    options?: {
      lang?: string
      rate?: number
      pitch?: number
      volume?: number
      voice?: SpeechSynthesisVoice
      onStart?: () => void
      onEnd?: () => void
      onError?: (error: string) => void
    }
  ) {
    if (!this.isSupported) {
      console.error('浏览器不支持语音合成')
      if (options?.onError) options.onError('浏览器不支持语音合成')
      return
    }

    // 停止当前播放
    this.stopSpeaking()

    // 创建语音合成实例
    this.currentUtterance = new SpeechSynthesisUtterance(text)
    this.currentUtterance.lang = options?.lang || 'en-US'
    this.currentUtterance.rate = options?.rate || 0.9
    this.currentUtterance.pitch = options?.pitch || 1
    this.currentUtterance.volume = options?.volume || 1

    // 设置语音
    if (options?.voice) {
      this.currentUtterance.voice = options.voice
    }

    // 事件监听
    this.currentUtterance.onstart = () => {
      console.log('🔊 开始播放语音')
      if (options?.onStart) options.onStart()
    }

    this.currentUtterance.onend = () => {
      console.log('🔊 语音播放完成')
      if (options?.onEnd) options.onEnd()
    }

    this.currentUtterance.onerror = (event) => {
      console.error('❌ 语音合成错误:', event.error)
      if (options?.onError) options.onError(event.error)
    }

    // 播放
    this.synthesis.speak(this.currentUtterance)
  }

  /**
   * 停止语音播放
   */
  stopSpeaking() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel()
    }
  }

  /**
   * 暂停语音播放
   */
  pauseSpeaking() {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause()
    }
  }

  /**
   * 恢复语音播放
   */
  resumeSpeaking() {
    if (this.synthesis.paused) {
      this.synthesis.resume()
    }
  }

  /**
   * 获取可用的语音列表
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices()
  }

  /**
   * 获取英语语音
   */
  getEnglishVoices(): SpeechSynthesisVoice[] {
    return this.getVoices().filter(voice => voice.lang.startsWith('en'))
  }

  /**
   * 获取推荐的英语语音（优先美国本土人声音）
   */
  getRecommendedVoice(): SpeechSynthesisVoice | undefined {
    const voices = this.getVoices()

    console.log('🔍 搜索最佳美式英语语音...')
    console.log(`   可用语音总数: ${voices.length}`)

    // 打印所有英语语音供调试
    const enVoices = voices.filter(v => v.lang.startsWith('en'))
    console.log(`   英语语音数量: ${enVoices.length}`)
    enVoices.forEach(v => {
      console.log(`   - ${v.name} (${v.lang}) ${v.localService ? '[本地]' : '[在线]'}`)
    })

    // 优先级1: 明确排除中文相关的语音，只选择纯正美式英语
    const pureUSVoices = voices.filter(v => {
      const name = v.name.toLowerCase()
      const lang = v.lang.toLowerCase()

      // 必须是 en-US
      if (lang !== 'en-us') return false

      // 排除任何可能的中文相关
      const excludeKeywords = ['chinese', '中文', 'mandarin', 'china', 'cn', 'zh', 'huihui', 'yaoyao']
      if (excludeKeywords.some(keyword => name.includes(keyword))) return false

      return true
    })

    console.log(`   纯正美式英语语音: ${pureUSVoices.length} 个`)
    pureUSVoices.forEach(v => {
      console.log(`   ✓ ${v.name} (${v.lang})`)
    })

    // 在纯正美式语音中按优先级选择
    const preferredNames = [
      'david',      // Microsoft David
      'zira',       // Microsoft Zira
      'mark',       // Microsoft Mark
      'samantha',   // macOS Samantha
      'alex',       // macOS Alex
      'google us',  // Google US English
    ]

    for (const preferred of preferredNames) {
      const voice = pureUSVoices.find(v =>
        v.name.toLowerCase().includes(preferred)
      )
      if (voice) {
        console.log(`✅ 选择语音: ${voice.name} (${voice.lang})`)
        return voice
      }
    }

    // 如果没有找到首选，选择第一个纯正美式语音
    if (pureUSVoices.length > 0) {
      console.log(`✅ 选择第一个纯正美式语音: ${pureUSVoices[0].name}`)
      return pureUSVoices[0]
    }

    // 最后备选：任何 en-GB（英式英语）也比中文口音好
    const gbVoice = voices.find(v => v.lang === 'en-GB')
    if (gbVoice) {
      console.log(`⚠️ 使用英式英语: ${gbVoice.name}`)
      return gbVoice
    }

    console.warn('❌ 未找到合适的英语语音，使用默认')
    return voices[0]
  }

  /**
   * 检查是否支持语音功能
   */
  isVoiceSupported(): boolean {
    return this.isSupported
  }

  /**
   * 检查是否正在监听
   */
  isCurrentlyListening(): boolean {
    return this.isListening
  }

  /**
   * 检查是否正在播放
   */
  isSpeaking(): boolean {
    return this.synthesis.speaking
  }

  /**
   * 设置语音识别语言
   */
  setRecognitionLanguage(lang: string) {
    if (this.recognition) {
      this.recognition.lang = lang
    }
  }

  /**
   * 测试语音功能
   */
  async testVoice(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isSupported) {
        console.error('❌ 语音功能不支持')
        resolve(false)
        return
      }

      console.log('🧪 测试语音合成...')
      this.speak('Hello! Voice test successful.', {
        onEnd: () => {
          console.log('✅ 语音合成测试通过')
          resolve(true)
        },
        onError: () => {
          console.error('❌ 语音合成测试失败')
          resolve(false)
        }
      })
    })
  }
}

// 全局单例
let voiceManagerInstance: VoiceManager | null = null

/**
 * 获取语音管理器实例
 */
export function getVoiceManager(): VoiceManager {
  if (!voiceManagerInstance) {
    voiceManagerInstance = new VoiceManager()
  }
  return voiceManagerInstance
}
