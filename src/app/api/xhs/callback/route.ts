import { NextRequest, NextResponse } from 'next/server'
import { getUserInfo, type XhsCookie } from '@/lib/xhs-service'

// POST /api/xhs/callback - 接收书签栏一键提交的 cookie
export async function POST(req: NextRequest) {
  try {
    const { cookieString } = await req.json() as { cookieString: string }

    if (!cookieString) {
      return NextResponse.json({ error: '缺少 cookie' }, { status: 400 })
    }

    // 解析 cookie 字符串
    const cookies: XhsCookie[] = cookieString
      .split(';')
      .map(c => c.trim())
      .filter(Boolean)
      .map(c => {
        const idx = c.indexOf('=')
        return { name: c.slice(0, idx).trim(), value: c.slice(idx + 1).trim() }
      })

    if (!cookies.find(c => c.name === 'a1')) {
      return NextResponse.json({ error: '未检测到有效登录状态，请先登录小红书' }, { status: 401 })
    }

    const userInfo = await getUserInfo(cookies)
    if (!userInfo) {
      return NextResponse.json({ error: 'Cookie 无效，请重新登录小红书' }, { status: 401 })
    }

    // 返回成功 HTML 页面（bookmarklet 会在新窗口打开）
    return NextResponse.json({
      success: true,
      data: {
        userInfo,
        cookies,
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// OPTIONS for CORS (bookmarklet 跨域)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
