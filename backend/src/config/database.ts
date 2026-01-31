import { Pool } from 'pg'

// PostgreSQL 连接池配置
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'english_quest_mvp',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// 测试连接
pool.on('connect', () => {
  console.log('✅ PostgreSQL connected')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err)
  process.exit(-1)
})

// 查询辅助函数
export const query = async (text: string, params?: any[]) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}

// 事务辅助函数
export const transaction = async (callback: (client: any) => Promise<any>) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export default pool
