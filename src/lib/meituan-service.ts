/**
 * 美团商家后台服务
 * 域名: e.waimai.meituan.com (外卖) / shangou.meituan.com (到店)
 * 
 * TODO: 替换为真实API。当前返回 mock 数据，但架构按真实逻辑设计。
 */

import {
  PlatformService, PlatformCookie, PlatformShop, PlatformReview,
  PlatformReviewReply, cookieArrayToString,
} from './platform-service'

// 美团商家后台 API 路径（真实路径结构）
const API_BASE = 'https://e.waimai.meituan.com'
const USER_INFO_URL = `${API_BASE}/gw/operator/v2/user/getInfo`
const SHOP_LIST_URL = `${API_BASE}/gw/operator/v2/shop/list`
const REVIEW_LIST_URL = `${API_BASE}/gw/operator/v2/review/list`
const REVIEW_REPLY_URL = `${API_BASE}/gw/operator/v2/review/reply`

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

export class MeituanService implements PlatformService {
  platform = 'meituan' as const
  platformName = '美团'
  domains = ['e.waimai.meituan.com', 'shangou.meituan.com']

  async validateCookies(cookies: PlatformCookie[]) {
    try {
      const cookieStr = cookieArrayToString(cookies)
      
      // TODO: 替换为真实API请求
      // const res = await fetch(USER_INFO_URL, {
      //   headers: { Cookie: cookieStr, 'User-Agent': UA },
      // })
      // const data = await res.json()
      // if (data.code !== 0) return { valid: false, error: data.msg }

      // Mock: 检查是否包含关键cookie（token/WEBDFPID等）
      const hasToken = cookies.some(c => c.name === 'token' || c.name === 'WEBDFPID' || c.name === 'wpush_server_url')
      if (!hasToken) {
        return { valid: false, error: '缺少必要的认证Cookie，请确保已登录美团商家后台' }
      }

      return {
        valid: true,
        accountId: 'mt_' + Date.now().toString(36),
        accountName: '美团商家-示例账号',
        avatar: '',
      }
    } catch (err: any) {
      return { valid: false, error: err.message || '验证失败' }
    }
  }

  async getShops(cookies: PlatformCookie[]): Promise<PlatformShop[]> {
    // TODO: 替换为真实API
    // const cookieStr = cookieArrayToString(cookies)
    // const res = await fetch(SHOP_LIST_URL, { headers: { Cookie: cookieStr, 'User-Agent': UA } })
    // const data = await res.json()

    return [
      {
        shopId: 'mt_shop_001',
        shopName: '湖北藕汤（纺大店）',
        platform: 'meituan',
        bindAccountId: '',
        rating: 4.8,
        address: '武汉市洪山区纺织大学南门',
        categoryName: '中餐/汤粉面',
      },
      {
        shopId: 'mt_shop_002',
        shopName: '湖北藕汤（光谷店）',
        platform: 'meituan',
        bindAccountId: '',
        rating: 4.6,
        address: '武汉市洪山区光谷广场',
        categoryName: '中餐/汤粉面',
      },
    ]
  }

  async getReviews(cookies: PlatformCookie[], shopId: string, page = 1) {
    // TODO: 替换为真实API
    const mockReviews: PlatformReview[] = [
      {
        reviewId: 'mt_rev_001',
        platform: 'meituan',
        shopId,
        shopName: '湖北藕汤（纺大店）',
        userName: '美团用户A',
        rating: 5,
        content: '藕汤很好喝，料很足，下次还来！',
        reviewTime: Date.now() - 3600000,
        hasReplied: false,
      },
      {
        reviewId: 'mt_rev_002',
        platform: 'meituan',
        shopId,
        shopName: '湖北藕汤（纺大店）',
        userName: '匿名用户',
        rating: 2,
        content: '等了很久才送到，汤都凉了',
        reviewTime: Date.now() - 7200000,
        hasReplied: false,
      },
    ]

    return { reviews: mockReviews, total: 2, hasMore: false }
  }

  async replyReview(cookies: PlatformCookie[], reply: PlatformReviewReply) {
    // TODO: 替换为真实API
    // const cookieStr = cookieArrayToString(cookies)
    // const res = await fetch(REVIEW_REPLY_URL, {
    //   method: 'POST',
    //   headers: { Cookie: cookieStr, 'Content-Type': 'application/json', 'User-Agent': UA },
    //   body: JSON.stringify({ reviewId: reply.reviewId, content: reply.content }),
    // })

    return { success: true }
  }
}

export const meituanService = new MeituanService()
