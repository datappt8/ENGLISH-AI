import { useState, useEffect } from 'react'
import './MicrophoneSetup.css'

interface MicrophoneSetupProps {
  onComplete: () => void
}

export function MicrophoneSetup({ onComplete }: MicrophoneSetupProps) {
  const [step, setStep] = useState<'welcome' | 'requesting' | 'testing' | 'success' | 'error'>('welcome')
  const [errorMessage, setErrorMessage] = useState('')
  const [browserInfo, setBrowserInfo] = useState('')

  useEffect(() => {
    // 检测浏览器
    detectBrowser()
    // 检查权限状态
    checkPermissionStatus()
  }, [])

  const detectBrowser = () => {
    const ua = navigator.userAgent
    let browser = ''

    if (ua.includes('MicroMessenger')) {
      browser = '微信浏览器（不支持语音功能）'
    } else if (ua.includes('Chrome')) {
      browser = 'Chrome'
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browser = 'Safari'
    } else if (ua.includes('Firefox')) {
      browser = 'Firefox（不支持语音识别）'
    } else if (ua.includes('Edge')) {
      browser = 'Edge'
    } else {
      browser = '未知浏览器'
    }

    setBrowserInfo(browser)
  }

  const checkPermissionStatus = async () => {
    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })

        if (result.state === 'granted') {
          // 已有权限，直接测试
          testMicrophone()
        }
      }
    } catch (e) {
      console.log('无法查询权限状态')
    }
  }

  const requestMicrophone = async () => {
    setStep('requesting')
    setErrorMessage('')

    try {
      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // 权限获取成功，进入测试
      testMicrophone()

      // 停止流
      stream.getTracks().forEach(track => track.stop())

    } catch (error: any) {
      console.error('麦克风权限请求失败:', error)
      setStep('error')

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setErrorMessage('麦克风权限被拒绝')
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('未找到麦克风设备')
      } else if (error.name === 'NotReadableError') {
        setErrorMessage('麦克风被其他应用占用')
      } else {
        setErrorMessage(`无法访问麦克风: ${error.message}`)
      }
    }
  }

  const testMicrophone = async () => {
    setStep('testing')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // 简单测试，2秒后成功
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop())
        setStep('success')
      }, 2000)

    } catch (error) {
      setStep('error')
      setErrorMessage('麦克风测试失败')
    }
  }

  const openBrowserSettings = () => {
    alert('请按照以下步骤操作：\n\n1. 点击浏览器地址栏左侧的锁图标\n2. 找到"麦克风"权限\n3. 改为"允许"\n4. 刷新页面重试')
  }

  return (
    <div className="microphone-setup">
      <div className="setup-container">
        {step === 'welcome' && (
          <>
            <div className="setup-icon">🎤</div>
            <h1>英语口语游戏</h1>
            <p className="setup-description">
              本游戏通过<strong>语音对话</strong>帮助您提升英语口语能力。
            </p>
            <div className="setup-features">
              <div className="feature">
                <span className="feature-icon">🎙️</span>
                <span>语音识别</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔊</span>
                <span>AI朗读</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💬</span>
                <span>实时对话</span>
              </div>
            </div>
            <div className="browser-info">
              <strong>当前浏览器：</strong> {browserInfo}
            </div>
            {browserInfo.includes('不支持') ? (
              <div className="setup-warning">
                <p>⚠️ {browserInfo}</p>
                <p>请使用 <strong>Chrome</strong> 或 <strong>Safari</strong> 浏览器</p>
                <p className="small-text">点击右上角"..."，选择"在浏览器中打开"</p>
              </div>
            ) : (
              <>
                <p className="setup-note">
                  点击下方按钮，浏览器会请求麦克风权限。<br/>
                  <strong>请务必点击"允许"</strong>以启用语音功能。
                </p>
                <div className="setup-buttons">
                  <button className="btn-primary" onClick={requestMicrophone}>
                    🎤 启用麦克风（必需）
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {step === 'requesting' && (
          <>
            <div className="setup-icon loading">🎤</div>
            <h1>请求麦克风权限</h1>
            <p className="setup-description">
              请在浏览器弹出的对话框中点击<strong>"允许"</strong>
            </p>
            <div className="loading-spinner"></div>
            <p className="setup-hint">
              💡 如果没有看到弹窗，请检查浏览器地址栏左侧是否有权限图标
            </p>
          </>
        )}

        {step === 'testing' && (
          <>
            <div className="setup-icon pulse">🎤</div>
            <h1>测试麦克风</h1>
            <p className="setup-description">
              正在测试麦克风功能...
            </p>
            <div className="audio-visualizer">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="setup-icon success">✅</div>
            <h1>麦克风已就绪！</h1>
            <p className="setup-description">
              您可以开始使用语音功能了
            </p>
            <div className="setup-tips">
              <h3>🎮 游戏玩法：</h3>
              <ul>
                <li>点击NPC（村长喵喵、面包师等）开始对话</li>
                <li>点击"🎤 语音回复"按钮</li>
                <li>用<strong>英语</strong>说话，系统会自动识别</li>
                <li>AI会用英语回复并朗读</li>
              </ul>
            </div>
            <button className="btn-primary btn-large" onClick={onComplete}>
              🎮 开始游戏
            </button>
          </>
        )}

        {step === 'error' && (
          <>
            <div className="setup-icon error">❌</div>
            <h1>麦克风设置失败</h1>
            <p className="setup-description error-text">
              {errorMessage}
            </p>
            <div className="setup-help">
              <h3>📋 解决步骤：</h3>
              <ul>
                <li><strong>步骤1：</strong> 检查浏览器地址栏左侧的权限图标</li>
                <li><strong>步骤2：</strong> 点击图标，找到"麦克风"权限</li>
                <li><strong>步骤3：</strong> 改为"允许"</li>
                <li><strong>步骤4：</strong> 刷新页面重新尝试</li>
              </ul>
            </div>
            {browserInfo.includes('不支持') && (
              <div className="setup-warning">
                <p>⚠️ 当前浏览器不支持语音功能</p>
                <p>请使用以下浏览器：</p>
                <ul>
                  <li>✅ Chrome（推荐）</li>
                  <li>✅ Safari（iOS/macOS）</li>
                  <li>✅ Edge</li>
                </ul>
              </div>
            )}
            <div className="setup-buttons">
              <button className="btn-primary" onClick={requestMicrophone}>
                🔄 重新尝试
              </button>
              <button className="btn-secondary" onClick={openBrowserSettings}>
                ⚙️ 查看设置帮助
              </button>
            </div>
            <p className="setup-footer">
              💡 这是口语游戏，必须使用麦克风才能游戏
            </p>
          </>
        )}
      </div>
    </div>
  )
}
