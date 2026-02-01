import { useState, useEffect } from 'react'

function DebugPage() {
  const [token, setToken] = useState<string | null>(null)
  const [decoded, setDecoded] = useState<any>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)

    if (storedToken) {
      try {
        // 解码 JWT token (不验证签名)
        const parts = storedToken.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          setDecoded(payload)
        }
      } catch (err) {
        console.error('解码 token 失败:', err)
      }
    }
  }, [])

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('API 响应:', data)
      alert(JSON.stringify(data, null, 2))
    } catch (err) {
      console.error('API 请求失败:', err)
      alert('请求失败: ' + err)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 调试信息</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Token 状态:</h2>
        <p><strong>是否存在:</strong> {token ? '✅ 是' : '❌ 否'}</p>
        {token && (
          <>
            <p><strong>Token 长度:</strong> {token.length}</p>
            <details>
              <summary>查看完整 Token</summary>
              <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                {token}
              </pre>
            </details>
          </>
        )}
      </div>

      {decoded && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Token 内容:</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(decoded, null, 2)}
          </pre>
          <p><strong>过期时间:</strong> {decoded.exp ? new Date(decoded.exp * 1000).toLocaleString() : '无'}</p>
          <p><strong>是否过期:</strong> {decoded.exp && decoded.exp * 1000 < Date.now() ? '❌ 是' : '✅ 否'}</p>
        </div>
      )}

      <div>
        <h2>测试 API:</h2>
        <button
          onClick={testAPI}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          测试 /api/quests
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>操作:</h2>
        <button
          onClick={() => {
            localStorage.removeItem('token')
            window.location.reload()
          }}
          style={{
            padding: '10px 20px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          清除 Token
        </button>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '10px 20px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          去登录
        </button>
      </div>
    </div>
  )
}

export default DebugPage
