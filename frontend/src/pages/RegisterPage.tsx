import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/authService'
import './AuthPage.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 前端验证
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (formData.password.length < 8) {
      setError('密码长度至少为8个字符')
      return
    }

    if (formData.username.length < 3 || formData.username.length > 50) {
      setError('用户名长度应为3-50个字符')
      return
    }

    setLoading(true)

    try {
      // 调用注册 API
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      console.log('注册成功:', response.user)

      // 注册成功后跳转到游戏页面
      navigate('/game')
    } catch (err: any) {
      // 处理错误
      const errorMessage = err.response?.data?.error?.message || err.message || '注册失败，请稍后重试'
      setError(errorMessage)
      console.error('注册失败:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>注册</h1>
        <p className="auth-subtitle">开始你的英语冒险之旅</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="3-50个字符"
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your@email.com"
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
              placeholder="至少8个字符"
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="再次输入密码"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            已有账号？ <Link to="/login">立即登录</Link>
          </p>
          <Link to="/" className="back-link">返回首页</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
