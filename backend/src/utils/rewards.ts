/**
 * 奖励计算工具
 * 用于计算任务完成后的经验值、金币奖励和等级提升
 */

// 等级配置接口
export interface LevelConfig {
  level: number
  requiredExp: number
}

/**
 * 计算经验值奖励
 * @param baseExp - 基础经验值
 * @param score - 得分 (0-100)
 * @param multiplier - 倍数（会员加成等）
 * @returns 实际获得的经验值
 */
export const calculateExpReward = (
  baseExp: number,
  score: number,
  multiplier: number = 1.0
): number => {
  // 公式: baseExp * (score / 100) * multiplier
  const expReward = Math.floor(baseExp * (score / 100) * multiplier)
  return Math.max(0, expReward) // 确保不为负数
}

/**
 * 计算金币奖励
 * @param baseCoin - 基础金币
 * @param score - 得分 (0-100)
 * @param multiplier - 倍数（会员加成等）
 * @returns 实际获得的金币
 */
export const calculateCoinReward = (
  baseCoin: number,
  score: number,
  multiplier: number = 1.0
): number => {
  // 公式: baseCoin * (score / 100) * multiplier
  const coinReward = Math.floor(baseCoin * (score / 100) * multiplier)
  return Math.max(0, coinReward) // 确保不为负数
}

/**
 * 获取下一级所需经验值
 * @param level - 当前等级
 * @returns 升到下一级所需的总经验值
 */
export const getExpForNextLevel = (level: number): number => {
  // 公式: level * 100 + 500
  // 等级 1 -> 2: 600 exp
  // 等级 2 -> 3: 700 exp
  // 等级 3 -> 4: 800 exp
  // ...
  // 等级 10 -> 11: 1500 exp
  return level * 100 + 500
}

/**
 * 获取指定等级的累计经验值
 * @param level - 目标等级
 * @returns 达到该等级所需的累计经验值
 */
export const getTotalExpForLevel = (level: number): number => {
  if (level <= 1) return 0

  let totalExp = 0
  for (let i = 1; i < level; i++) {
    totalExp += getExpForNextLevel(i)
  }
  return totalExp
}

/**
 * 检查是否升级并返回新等级和剩余经验
 * @param currentExp - 当前经验值
 * @param currentLevel - 当前等级
 * @returns 升级信息
 */
export const checkLevelUp = (
  currentExp: number,
  currentLevel: number
): {
  newLevel: number
  remainingExp: number
  levelsGained: number
  leveledUp: boolean
} => {
  let newLevel = currentLevel
  let remainingExp = currentExp
  let levelsGained = 0
  const maxLevel = 100

  // 循环检查是否可以升级（支持连续升级）
  while (newLevel < maxLevel) {
    const expNeeded = getExpForNextLevel(newLevel)

    if (remainingExp >= expNeeded) {
      remainingExp -= expNeeded
      newLevel++
      levelsGained++
    } else {
      break
    }
  }

  return {
    newLevel,
    remainingExp,
    levelsGained,
    leveledUp: levelsGained > 0,
  }
}

/**
 * 计算当前等级的进度百分比
 * @param currentExp - 当前经验值
 * @param currentLevel - 当前等级
 * @returns 进度百分比 (0-100)
 */
export const calculateLevelProgress = (
  currentExp: number,
  currentLevel: number
): number => {
  const expNeeded = getExpForNextLevel(currentLevel)
  const progress = (currentExp / expNeeded) * 100
  return Math.min(100, Math.max(0, progress))
}

/**
 * 根据会员等级获取奖励倍数
 * @param membershipTier - 会员等级
 * @returns 奖励倍数
 */
export const getMembershipMultiplier = (
  membershipTier: 'free' | 'basic' | 'premium' | 'vip'
): number => {
  const multipliers = {
    free: 1.0,
    basic: 1.2,
    premium: 1.5,
    vip: 2.0,
  }
  return multipliers[membershipTier] || 1.0
}

/**
 * 计算连胜奖励加成
 * @param streakDays - 连续学习天数
 * @returns 额外奖励倍数
 */
export const getStreakBonus = (streakDays: number): number => {
  if (streakDays < 3) return 0
  if (streakDays < 7) return 0.1 // 3-6天: +10%
  if (streakDays < 14) return 0.2 // 7-13天: +20%
  if (streakDays < 30) return 0.3 // 14-29天: +30%
  return 0.5 // 30天以上: +50%
}

/**
 * 计算完美分数额外奖励
 * @param score - 得分
 * @returns 额外奖励倍数
 */
export const getPerfectScoreBonus = (score: number): number => {
  if (score >= 100) return 0.5 // 满分: +50%
  if (score >= 95) return 0.3 // 95-99分: +30%
  if (score >= 90) return 0.2 // 90-94分: +20%
  return 0
}

/**
 * 计算综合奖励（包含所有加成）
 * @param baseReward - 基础奖励
 * @param score - 得分
 * @param membershipTier - 会员等级
 * @param streakDays - 连续学习天数
 * @returns 最终奖励
 */
export const calculateTotalReward = (
  baseReward: number,
  score: number,
  membershipTier: 'free' | 'basic' | 'premium' | 'vip' = 'free',
  streakDays: number = 0
): {
  baseAmount: number
  membershipBonus: number
  streakBonus: number
  perfectScoreBonus: number
  totalAmount: number
  totalMultiplier: number
} => {
  // 基础奖励（根据分数）
  const baseAmount = Math.floor(baseReward * (score / 100))

  // 会员加成
  const membershipMultiplier = getMembershipMultiplier(membershipTier)
  const membershipBonus = Math.floor(baseAmount * (membershipMultiplier - 1))

  // 连胜加成
  const streakMultiplier = getStreakBonus(streakDays)
  const streakBonus = Math.floor(baseAmount * streakMultiplier)

  // 完美分数加成
  const perfectScoreMultiplier = getPerfectScoreBonus(score)
  const perfectScoreBonus = Math.floor(baseAmount * perfectScoreMultiplier)

  // 总奖励
  const totalAmount = baseAmount + membershipBonus + streakBonus + perfectScoreBonus
  const totalMultiplier =
    membershipMultiplier + streakMultiplier + perfectScoreMultiplier

  return {
    baseAmount,
    membershipBonus,
    streakBonus,
    perfectScoreBonus,
    totalAmount,
    totalMultiplier,
  }
}

/**
 * 格式化经验值显示
 * @param exp - 经验值
 * @returns 格式化后的字符串
 */
export const formatExp = (exp: number): string => {
  if (exp >= 1000000) {
    return `${(exp / 1000000).toFixed(1)}M`
  }
  if (exp >= 1000) {
    return `${(exp / 1000).toFixed(1)}K`
  }
  return exp.toString()
}

/**
 * 格式化金币显示
 * @param coins - 金币数量
 * @returns 格式化后的字符串
 */
export const formatCoins = (coins: number): string => {
  if (coins >= 1000000) {
    return `${(coins / 1000000).toFixed(1)}M`
  }
  if (coins >= 1000) {
    return `${(coins / 1000).toFixed(1)}K`
  }
  return coins.toString()
}
