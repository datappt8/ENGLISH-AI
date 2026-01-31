import api from './api'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  User
} from '@types/index'

// 用户注册
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<any, ApiResponse<AuthResponse>>('/auth/register', data)
  if (response.success && response.data) {
    // 保存 token
    localStorage.setItem('token', response.data.token)
    return response.data
  }
  throw new Error(response.error?.message || '注册失败')
}

// 用户登录
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<any, ApiResponse<AuthResponse>>('/auth/login', data)
  if (response.success && response.data) {
    // 保存 token
    localStorage.setItem('token', response.data.token)
    return response.data
  }
  throw new Error(response.error?.message || '登录失败')
}

// 用户登出
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
  localStorage.removeItem('token')
}

// 刷新 token
export const refreshToken = async (): Promise<string> => {
  const response = await api.post<any, ApiResponse<{ token: string }>>('/auth/refresh')
  if (response.success && response.data) {
    localStorage.setItem('token', response.data.token)
    return response.data.token
  }
  throw new Error('Token 刷新失败')
}

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<any, ApiResponse<{ user: User }>>('/users/me')
  if (response.success && response.data) {
    return response.data.user
  }
  throw new Error('获取用户信息失败')
}

// 更新用户资料
export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.patch<any, ApiResponse<{ user: User }>>('/users/me', data)
  if (response.success && response.data) {
    return response.data.user
  }
  throw new Error('更新用户资料失败')
}
