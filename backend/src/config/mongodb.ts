import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/english_quest'

let client: MongoClient
let db: Db

// 连接到 MongoDB
export const connectMongoDB = async (): Promise<Db> => {
  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db()
    console.log('✅ MongoDB connected')
    return db
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// 获取数据库实例
export const getDB = (): Db => {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongoDB first.')
  }
  return db
}

// 关闭连接
export const closeMongoDB = async (): Promise<void> => {
  if (client) {
    await client.close()
    console.log('MongoDB connection closed')
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  await closeMongoDB()
  process.exit(0)
})

export default { connectMongoDB, getDB, closeMongoDB }
