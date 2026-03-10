/**
 * 抖音来客商家后台服务
 * 域名: business.douyin.com / life.douyin.com
 * 
 * TODO: 替换为真实API。当前返回 mock 数据。
 */

import {
  PlatformService, PlatformCookie, PlatformShop, PlatformReview,
  PlatformReviewReply, cookieArrayToString,
} from './platform-service'

const API_BASE = 'https://business.douyin.com'
const USER_INFO_URL = `${API_BASE}/api/account/info`
const SHOP_LIST_URL = `${API_BASE}/api/shop/list`
const REVIEW_LIST_URL = `${API_BASE}/api/review/list`
const REVIEW_REPLY_URL = `${API_BASE}/api/review/reply`

export class DouyinService implements PlatformService {
  platform = 'douyin' as const
  platformName = '抖音来客'
  domains = ['business.douyin.com', 'life.douyin.com']

  async validateCookies(cookies: PlatformCookie[]) {
    try {
      const hasToken = cookies.some(c =>
        c.name === 'sessionid' || c.name === 'sid_guard' || c.name === 'passport_csrf_token'
      )
      if (!hasToken) {
        return { valid: false, error: '缺少必要的认证Cookie，请确保已登录抖音来客后台' }
      }

      // TODO: 真实API验证
      return {
        valid: true,
        accountId: 'dy_' + Date.now().toString(36),
        accountName: '抖音来客-示例账号',
      }
    } catch (err: any) {
      return { valid: false, error: err.message || '验证失败' }
    }
  }

  async getShops(cookies: PlatformCookie[]): Promise<PlatformShop[]> {
    // TODO: 替换为真实API
    return [
      {
        shopId: 'dy_shop_001',
        shopName: '湖北藕汤纺大店',
        platform: 'douyin',
        bindAccountId: '',
        rating: 4.5,
        address: '武汉市洪山区纺织大学南门',
      },
    ]
  }

  async getReviews(cookies: PlatformCookie[], shopId: string, page = 1) {
    // TODO: 替换为真实API
    const mockReviews: PlatformReview[] = [
      {
        reviewId: 'dy_rev_001',
        platform: 'douyin',
        shopId,
        shopName: '湖北藕汤纺大店',
        userName: '抖音用户C',
        rating: 5,
        content: '刷到视频过来的，果然名不虚传！',
        reviewTime: Date.now() - 1800000,
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

export const douyinService = new DouyinService()
