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
  startListening(
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

    this.onResultCallback = onResult
    this.onErrorCallback = onError
    this.onStartCallback = onStart
    this.onEndCallback = onEnd

    try {
      this.recognition.start()
    } catch (error) {
      console.error('启动语音识别失败:', error)
      if (onError) onError('启动失败，请重试')
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
   * 获取推荐的英语语音
   */
  getRecommendedVoice(): SpeechSynthesisVoice | undefined {
    const voices = this.getEnglishVoices()

    // 优先选择美式英语
    const usVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
    if (usVoice) return usVoice

    // 其次选择任何美式英语
    const anyUsVoice = voices.find(v => v.lang === 'en-US')
    if (anyUsVoice) return anyUsVoice

    // 最后选择任何英语
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
