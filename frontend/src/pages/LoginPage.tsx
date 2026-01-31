import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './AuthPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // TODO: 实现实际的登录 API 调用
      console.log('Login attempt:', formData)

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 登录成功后跳转到游戏页面
      navigate('/game')
    } catch (err) {
      setError('登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>登录</h1>
        <p className="auth-subtitle">欢迎回到 English Quest</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">用户名或邮箱</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="请输入用户名或邮箱"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="请输入密码"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            还没有账号？ <Link to="/register">立即注册</Link>
          </p>
          <Link to="/" className="back-link">返回首页</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
