/**
 * 多平台服务抽象层
 * 统一定义各外卖/本地生活平台的类型和接口
 */

// ====== 类型定义 ======

export type PlatformType = 'meituan' | 'eleme' | 'douyin' | 'xhs' | 'dianping'

export interface PlatformCookie {
  name: string
  value: string
  domain?: string
}

export interface PlatformShop {
  shopId: string
  shopName: string
  platform: PlatformType
  bindAccountId: string
  rating?: number
  address?: string
  logo?: string
  categoryName?: string
}

export interface PlatformAccount {
  platform: PlatformType
  accountId: string
  accountName: string
  cookies: PlatformCookie[]
  shops: PlatformShop[]
  bindTime: number       // timestamp ms
  lastSyncTime?: number  // timestamp ms
  status: 'active' | 'expired' | 'error'
  avatar?: string
}

export interface PlatformReview {
  reviewId: string
  platform: PlatformType
  shopId: string
  shopName: string
  userName: string
  userAvatar?: string
  rating: number          // 1-5
  content: string
  images?: string[]
  orderInfo?: string
  reviewTime: number      // timestamp ms
  replyContent?: string
  replyTime?: number
  hasReplied: boolean
}

export interface PlatformReviewReply {
  reviewId: string
  content: string
}

// ====== 服务接口 ======

export interface PlatformService {
  /** 平台标识 */
  platform: PlatformType

  /** 平台中文名 */
  platformName: string

  /** 商家后台域名（用于扩展匹配） */
  domains: string[]

  /** 验证 Cookie 有效性，返回账号信息 */
  validateCookies(cookies: PlatformCookie[]): Promise<{
    valid: boolean
    accountId?: string
    accountName?: string
    avatar?: string
    error?: string
  }>

  /** 获取绑定的门店列表 */
  getShops(cookies: PlatformCookie[]): Promise<PlatformShop[]>

  /** 获取评价列表 */
  getReviews(cookies: PlatformCookie[], shopId: string, page?: number): Promise<{
    reviews: PlatformReview[]
    total: number
    hasMore: boolean
  }>

  /** 回复评价 */
  replyReview(cookies: PlatformCookie[], reply: PlatformReviewReply): Promise<{
    success: boolean
    error?: string
  }>
}

// ====== 平台配置 ======

export const PLATFORM_CONFIG: Record<PlatformType, {
  name: string
  icon: string
  color: string
  domains: string[]
  description: string
}> = {
  meituan: {
    name: '美团',
    icon: '🟡',
    color: '#FFD100',
    domains: ['e.waimai.meituan.com', 'shangou.meituan.com'],
    description: '美团外卖/到店商家后台',
  },
  eleme: {
    name: '饿了么',
    icon: '🔵',
    color: '#0097FF',
    domains: ['napos.ele.me', 'app-merchant.ele.me'],
    description: '饿了么商家后台',
  },
  douyin: {
    name: '抖音来客',
    icon: '⚫',
    color: '#000000',
    domains: ['business.douyin.com', 'life.douyin.com'],
    description: '抖音本地生活商家后台',
  },
  xhs: {
    name: '小红书',
    icon: '🔴',
    color: '#FF2442',
    domains: ['creator.xiaohongshu.com', 'www.xiaohongshu.com'],
    description: '小红书创作者平台',
  },
  dianping: {
    name: '大众点评',
    icon: '🟠',
    color: '#FF6633',
    domains: ['e.dianping.com', 'emc.dianping.com'],
    description: '大众点评商家后台',
  },
}

// ====== 工具函数 ======

export function cookieArrayToString(cookies: PlatformCookie[]): string {
  return cookies.map(c => `${c.name}=${c.value}`).join('; ')
}

export function parseCookieString(cookieStr: string): PlatformCookie[] {
  return cookieStr.split(';').map(pair => {
    const [name, ...rest] = pair.trim().split('=')
    return { name: name.trim(), value: rest.join('=').trim() }
  }).filter(c => c.name && c.value)
}

// ====== 获取平台服务实例 ======

import { MeituanService } from './meituan-service'
import { ElemeService } from './eleme-service'
import { DouyinService } from './douyin-service'

const services: Record<string, PlatformService> = {
  meituan: new MeituanService(),
  eleme: new ElemeService(),
  douyin: new DouyinService(),
}

export function getServiceByPlatform(platform: PlatformType | string): PlatformService | null {
  return services[platform] || null
}
