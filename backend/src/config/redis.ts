import { createClient } from 'redis'

// 创建 Redis 客户端
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  password: process.env.REDIS_PASSWORD || undefined,
})

// 连接事件
redisClient.on('connect', () => {
  console.log('✅ Redis connected')
})

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err)
})

// 连接到 Redis
redisClient.connect().catch(console.error)

// Redis 辅助函数
export const redisGet = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key)
  } catch (error) {
    console.error('Redis GET error:', error)
    return null
  }
}

export const redisSet = async (
  key: string,
  value: string,
  expirationSeconds?: number
): Promise<void> => {
  try {
    if (expirationSeconds) {
      await redisClient.setEx(key, expirationSeconds, value)
    } else {
      await redisClient.set(key, value)
    }
  } catch (error) {
    console.error('Redis SET error:', error)
  }
}

export const redisDel = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key)
  } catch (error) {
    console.error('Redis DEL error:', error)
  }
}

export const redisExists = async (key: string): Promise<boolean> => {
  try {
    const result = await redisClient.exists(key)
    return result === 1
  } catch (error) {
    console.error('Redis EXISTS error:', error)
    return false
  }
}

export default redisClient
