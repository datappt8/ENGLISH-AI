import axios, { AxiosInstance, AxiosError } from 'axios'

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error: AxiosError) => {
    if (error.response) {
      // 服务器返回错误
      const status = error.response.status

      if (status === 401) {
        // Token 过期或无效，清除本地存储并跳转到登录页
        localStorage.removeItem('token')
        window.location.href = '/login'
      } else if (status === 403) {
        console.error('没有权限访问该资源')
      } else if (status === 404) {
        console.error('请求的资源不存在')
      } else if (status >= 500) {
        console.error('服务器错误，请稍后重试')
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误，请检查网络连接')
    } else {
      // 其他错误
      console.error('请求失败:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api
