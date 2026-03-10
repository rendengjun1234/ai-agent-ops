import { NextRequest, NextResponse } from 'next/server'
import { getUserInfo, type XhsCookie } from '@/lib/xhs-service'

// POST /api/xhs/accounts - 验证 cookie 并获取账号信息
export async function POST(req: NextRequest) {
  try {
    const { cookies } = await req.json() as { cookies: XhsCookie[] }
    
    if (!cookies?.length) {
      return NextResponse.json({ error: '缺少 cookies' }, { status: 400 })
    }

    const userInfo = await getUserInfo(cookies)
    if (!userInfo) {
      return NextResponse.json({ error: 'Cookie 无效或已过期' }, { status: 401 })
    }

    return NextResponse.json({ success: true, data: userInfo })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
