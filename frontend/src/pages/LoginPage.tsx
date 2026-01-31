import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'
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
      // 调用登录 API
      const response = await login({
        username: formData.username,
        password: formData.password,
      })

      console.log('登录成功:', response.user)

      // 登录成功后跳转到游戏页面
      navigate('/game')
    } catch (err: any) {
      // 处理错误
      const errorMessage = err.response?.data?.error?.message || err.message || '登录失败，请检查用户名和密码'
      setError(errorMessage)
      console.error('登录失败:', err)
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
