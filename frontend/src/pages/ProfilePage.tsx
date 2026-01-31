import './ProfilePage.css'

function ProfilePage() {
  // TODO: 从 API 获取用户数据
  const userData = {
    username: 'player123',
    displayName: '冒险者',
    level: 5,
    experience: 2500,
    nextLevelExp: 3000,
    coins: 1500,
    diamonds: 10,
    membershipTier: 'free',
    avatar: '🧑',
  }

  const stats = {
    totalQuestsCompleted: 15,
    currentStreakDays: 7,
    longestStreakDays: 30,
    avgPronunciationScore: 85.5,
    totalStudyTimeMinutes: 450,
    friendsCount: 8,
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">{userData.avatar}</div>
          <div className="user-details">
            <h1>{userData.displayName}</h1>
            <p className="username">@{userData.username}</p>
            <div className="level-badge">Lv {userData.level}</div>
          </div>
        </div>

        <div className="experience-bar">
          <div className="exp-label">
            <span>经验值</span>
            <span>{userData.experience} / {userData.nextLevelExp}</span>
          </div>
          <div className="exp-bar">
            <div
              className="exp-fill"
              style={{ width: `${(userData.experience / userData.nextLevelExp) * 100}%` }}
            />
          </div>
        </div>

        <div className="currency-section">
          <div className="currency-item">
            <span className="currency-icon">💰</span>
            <span className="currency-amount">{userData.coins}</span>
            <span className="currency-label">金币</span>
          </div>
          <div className="currency-item">
            <span className="currency-icon">💎</span>
            <span className="currency-amount">{userData.diamonds}</span>
            <span className="currency-label">钻石</span>
          </div>
        </div>

        <div className="stats-section">
          <h2>学习统计</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalQuestsCompleted}</div>
              <div className="stat-label">完成任务</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.currentStreakDays} 天</div>
              <div className="stat-label">连续学习</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.avgPronunciationScore}</div>
              <div className="stat-label">平均分数</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{Math.floor(stats.totalStudyTimeMinutes / 60)}h {stats.totalStudyTimeMinutes % 60}m</div>
              <div className="stat-label">学习时长</div>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <button className="btn btn-primary">编辑资料</button>
          <button className="btn btn-secondary">升级会员</button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
