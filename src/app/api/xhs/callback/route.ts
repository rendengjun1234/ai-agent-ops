import { NextRequest, NextResponse } from 'next/server'
import { getUserInfo as getXhsUserInfo, type XhsCookie } from '@/lib/xhs-service'
import { setBound } from '@/lib/bind-store'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function parseCookies(cookieString: string): XhsCookie[] {
  return cookieString
    .split(';')
    .map(c => c.trim())
    .filter(Boolean)
    .map(c => {
      const idx = c.indexOf('=')
      return { name: c.slice(0, idx).trim(), value: c.slice(idx + 1).trim() }
    })
}

// 抖音用户信息
async function getDouyinUserInfo(cookieStr: string) {
  try {
    const res = await fetch('https://creator.douyin.com/web/api/media/user/info/', {
      headers: {
        Cookie: cookieStr,
        Referer: 'https://creator.douyin.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    })
    const data = await res.json()
    if (data?.user_info) {
      return {
        authorId: data.user_info.uid || '',
        nickname: data.user_info.nickname || '',
        avatar: data.user_info.avatar_url || '',
        fansCount: data.user_info.follower_count || 0,
      }
    }
    return null
  } catch { return null }
}

// 快手用户信息
async function getKwaiUserInfo(cookieStr: string) {
  try {
    const res = await fetch('https://cp.kuaishou.com/rest/cp/works/v2/author/info', {
      method: 'POST',
      headers: {
        Cookie: cookieStr,
        Referer: 'https://cp.kuaishou.com/',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({}),
    })
    const data = await res.json()
    if (data?.result === 1 && data?.data) {
      return {
        authorId: data.data.userId || '',
        nickname: data.data.userName || '',
        avatar: data.data.headUrl || '',
        fansCount: data.data.fan || 0,
      }
    }
    return null
  } catch { return null }
}

// 微信视频号用户信息
async function getWxsphUserInfo(cookieStr: string) {
  try {
    const res = await fetch('https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/auth/auth_data', {
      method: 'POST',
      headers: {
        Cookie: cookieStr,
        Referer: 'https://channels.weixin.qq.com/',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ timestamp: Date.now() }),
    })
    const data = await res.json()
    if (data?.data) {
      return {
        authorId: data.data.finderUser?.uniqId || '',
        nickname: data.data.finderUser?.nickname || '',
        avatar: data.data.finderUser?.headImgUrl || '',
        fansCount: data.data.finderUser?.fansCount || 0,
      }
    }
    return null
  } catch { return null }
}

export async function POST(req: NextRequest) {
  try {
    const { cookieString, platform = 'xiaohongshu', bindToken } = await req.json()

    if (!cookieString) {
      return NextResponse.json({ error: '缺少 cookie' }, { status: 400, headers: corsHeaders })
    }

    const cookies = parseCookies(cookieString)
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ')

    let userInfo = null

    switch (platform) {
      case 'xiaohongshu':
        if (!cookies.find(c => c.name === 'a1')) {
          return NextResponse.json({ error: '缺少 a1，请重新登录小红书' }, { status: 401, headers: corsHeaders })
        }
        userInfo = await getXhsUserInfo(cookies)
        break
      case 'douyin':
        userInfo = await getDouyinUserInfo(cookieStr)
        break
      case 'kwai':
        userInfo = await getKwaiUserInfo(cookieStr)
        break
      case 'wxsph':
        userInfo = await getWxsphUserInfo(cookieStr)
        break
      default:
        return NextResponse.json({ error: '不支持的平台' }, { status: 400, headers: corsHeaders })
    }

    if (!userInfo) {
      return NextResponse.json({ error: 'Cookie 无效，请重新登录' }, { status: 401, headers: corsHeaders })
    }

    const result = { userInfo, cookies, platform }

    if (bindToken) {
      setBound(bindToken, result)
    }

    return NextResponse.json({ success: true, data: result }, { headers: corsHeaders })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}
