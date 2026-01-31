import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>English Quest</h1>
        <p className="subtitle">AI 英语口语冒险游戏</p>
        <p className="description">
          通过与可爱的宠物角色对话，在冒险中提升英语口语能力
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">
            开始冒险
          </Link>
          <Link to="/login" className="btn btn-secondary">
            登录
          </Link>
        </div>
      </header>

      <section className="features">
        <h2>游戏特色</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🐱</div>
            <h3>可爱角色</h3>
            <p>与橘猫村长、柴犬小柴等萌宠互动</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI 对话</h3>
            <p>真实的语音对话，智能评分反馈</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>游戏化学习</h3>
            <p>完成任务，升级角色，解锁新区域</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>进度追踪</h3>
            <p>详细的学习统计和成就系统</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
