import { NextRequest, NextResponse } from 'next/server'
import { getUserInfo, type XhsCookie } from '@/lib/xhs-service'
import { setBound } from '@/lib/bind-store'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function POST(req: NextRequest) {
  try {
    const { cookieString, bindToken } = await req.json() as { cookieString: string; bindToken?: string }

    if (!cookieString) {
      return NextResponse.json({ error: '缺少 cookie' }, { status: 400, headers: corsHeaders })
    }

    const cookies: XhsCookie[] = cookieString
      .split(';')
      .map(c => c.trim())
      .filter(Boolean)
      .map(c => {
        const idx = c.indexOf('=')
        return { name: c.slice(0, idx).trim(), value: c.slice(idx + 1).trim() }
      })

    if (!cookies.find(c => c.name === 'a1')) {
      return NextResponse.json({ error: '未检测到有效登录状态' }, { status: 401, headers: corsHeaders })
    }

    const userInfo = await getUserInfo(cookies)
    if (!userInfo) {
      return NextResponse.json({ error: 'Cookie 无效，请重新登录' }, { status: 401, headers: corsHeaders })
    }

    const result = { userInfo, cookies }

    // 如果有 bindToken，存到 store 供前端轮询
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
