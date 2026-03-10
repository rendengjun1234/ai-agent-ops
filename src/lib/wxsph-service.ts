/**
 * 微信视频号服务 - 从 AiToEarn 提取
 * 适配 Next.js API Routes
 */

const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const LOGIN_URL = 'https://channels.weixin.qq.com'
const USER_INFO_URL = 'https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/auth/auth_data'
const WORKS_URL = 'https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/post/post_list'

export interface WxsphCookie {
  name: string
  value: string
}

export interface WxsphUserInfo {
  authorId: string
  nickname: string
  avatar: string
  fansCount: number
}

function cookieArrayToString(cookies: WxsphCookie[]): string {
  return cookies.map(c => `${c.name}=${c.value}`).join('; ')
}

export async function getUserInfo(cookies: WxsphCookie[]): Promise<WxsphUserInfo | null> {
  try {
    const cookieStr = cookieArrayToString(cookies)
    const res = await fetch(USER_INFO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStr,
        Referer: LOGIN_URL + '/',
        'User-Agent': DEFAULT_UA,
      },
      body: JSON.stringify({ timestamp: Date.now() }),
    })
    const data = await res.json()
    if (data?.data?.finderUser) {
      const u = data.data.finderUser
      return {
        authorId: u.uniqId || '',
        nickname: u.nickname || '',
        avatar: u.headImgUrl || '',
        fansCount: u.fansCount || 0,
      }
    }
    return null
  } catch {
    return null
  }
}

export async function getWorks(cookies: WxsphCookie[], pageIndex = 0) {
  const cookieStr = cookieArrayToString(cookies)
  const res = await fetch(WORKS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStr,
      Referer: LOGIN_URL + '/',
      'User-Agent': DEFAULT_UA,
    },
    body: JSON.stringify({
      pageIndex,
      pageSize: 20,
      timestamp: Date.now(),
    }),
  })
  return res.json()
}
