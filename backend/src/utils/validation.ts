/**
 * 验证工具函数
 * 用于验证用户输入数据的格式和有效性
 */

// 邮箱正则表达式
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 用户名正则表达式（字母、数字、下划线）
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/

/**
 * 验证邮箱格式
 * @param email - 邮箱地址
 * @returns 是否有效
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false
  }
  return EMAIL_REGEX.test(email.trim())
}

/**
 * 验证用户名格式
 * @param username - 用户名
 * @returns 是否有效
 */
export const isValidUsername = (username: string): boolean => {
  if (!username || typeof username !== 'string') {
    return false
  }

  const trimmed = username.trim()

  // 长度检查：3-50 个字符
  if (trimmed.length < 3 || trimmed.length > 50) {
    return false
  }

  // 格式检查：只允许字母、数字、下划线
  return USERNAME_REGEX.test(trimmed)
}

/**
 * 验证密码强度
 * @param password - 密码
 * @returns 是否有效
 */
export const isValidPassword = (password: string): boolean => {
  if (!password || typeof password !== 'string') {
    return false
  }

  // 最少 8 个字符
  return password.length >= 8
}

/**
 * 验证密码强度（详细）
 * @param password - 密码
 * @returns 验证结果和错误信息
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (!password || typeof password !== 'string') {
    errors.push('密码不能为空')
    return { isValid: false, errors }
  }

  // 长度检查
  if (password.length < 8) {
    errors.push('密码长度至少为 8 个字符')
  }

  if (password.length > 128) {
    errors.push('密码长度不能超过 128 个字符')
  }

  // 可选：添加更严格的密码要求
  // if (!/[a-z]/.test(password)) {
  //   errors.push('密码必须包含小写字母')
  // }
  // if (!/[A-Z]/.test(password)) {
  //   errors.push('密码必须包含大写字母')
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push('密码必须包含数字')
  // }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 验证注册数据
 * @param data - 注册数据
 * @returns 验证结果
 */
export const validateRegisterData = (data: {
  username?: string
  email?: string
  password?: string
}): {
  isValid: boolean
  errors: Record<string, string>
} => {
  const errors: Record<string, string> = {}

  // 验证用户名
  if (!data.username) {
    errors.username = '用户名不能为空'
  } else if (!isValidUsername(data.username)) {
    errors.username = '用户名格式无效（3-50个字符，只允许字母、数字、下划线）'
  }

  // 验证邮箱
  if (!data.email) {
    errors.email = '邮箱不能为空'
  } else if (!isValidEmail(data.email)) {
    errors.email = '邮箱格式无效'
  }

  // 验证密码
  if (!data.password) {
    errors.password = '密码不能为空'
  } else {
    const passwordValidation = validatePasswordStrength(data.password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors.join('；')
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * 验证登录数据
 * @param data - 登录数据
 * @returns 验证结果
 */
export const validateLoginData = (data: {
  username?: string
  password?: string
}): {
  isValid: boolean
  errors: Record<string, string>
} => {
  const errors: Record<string, string> = {}

  // 验证用户名或邮箱
  if (!data.username) {
    errors.username = '用户名或邮箱不能为空'
  }

  // 验证密码
  if (!data.password) {
    errors.password = '密码不能为空'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * 清理和标准化用户输入
 * @param input - 输入字符串
 * @returns 清理后的字符串
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return ''
  }
  return input.trim()
}
