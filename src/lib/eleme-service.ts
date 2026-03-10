/**
 * 饿了么商家后台服务
 * 域名: napos.ele.me
 * 
 * TODO: 替换为真实API。当前返回 mock 数据。
 */

import {
  PlatformService, PlatformCookie, PlatformShop, PlatformReview,
  PlatformReviewReply, cookieArrayToString,
} from './platform-service'

const API_BASE = 'https://napos.ele.me'
const USER_INFO_URL = `${API_BASE}/api/v1/user/info`
const SHOP_LIST_URL = `${API_BASE}/api/v1/shop/list`
const REVIEW_LIST_URL = `${API_BASE}/api/v1/review/list`
const REVIEW_REPLY_URL = `${API_BASE}/api/v1/review/reply`

export class ElemeService implements PlatformService {
  platform = 'eleme' as const
  platformName = '饿了么'
  domains = ['napos.ele.me', 'app-merchant.ele.me']

  async validateCookies(cookies: PlatformCookie[]) {
    try {
      const hasToken = cookies.some(c =>
        c.name === 'SID' || c.name === 'USERID' || c.name === '_ga'
      )
      if (!hasToken) {
        return { valid: false, error: '缺少必要的认证Cookie，请确保已登录饿了么商家后台' }
      }

      // TODO: 真实API验证
      return {
        valid: true,
        accountId: 'ele_' + Date.now().toString(36),
        accountName: '饿了么商家-示例账号',
      }
    } catch (err: any) {
      return { valid: false, error: err.message || '验证失败' }
    }
  }

  async getShops(cookies: PlatformCookie[]): Promise<PlatformShop[]> {
    // TODO: 替换为真实API
    return [
      {
        shopId: 'ele_shop_001',
        shopName: '湖北藕汤（纺大店）',
        platform: 'eleme',
        bindAccountId: '',
        rating: 4.7,
        address: '武汉市洪山区纺织大学南门',
      },
    ]
  }

  async getReviews(cookies: PlatformCookie[], shopId: string, page = 1) {
    // TODO: 替换为真实API
    const mockReviews: PlatformReview[] = [
      {
        reviewId: 'ele_rev_001',
        platform: 'eleme',
        shopId,
        shopName: '湖北藕汤（纺大店）',
        userName: '饿了么用户B',
        rating: 4,
        content: '味道不错，就是分量可以再多一点',
        reviewTime: Date.now() - 5400000,
        hasReplied: false,
      },
    ]
    return { reviews: mockReviews, total: 1, hasMore: false }
  }

  async replyReview(cookies: PlatformCookie[], reply: PlatformReviewReply) {
    // TODO: 替换为真实API
    return { success: true }
  }
}

export const elemeService = new ElemeService()
