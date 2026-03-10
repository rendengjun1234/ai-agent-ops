import { NextRequest, NextResponse } from 'next/server'
import { publishImageNote, type XhsCookie, type XhsPublishParams } from '@/lib/xhs-service'

// POST /api/xhs/publish - 发布图文笔记
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      cookies: XhsCookie[]
      params: XhsPublishParams
    }

    if (!body.cookies?.length) {
      return NextResponse.json({ error: '缺少 cookies' }, { status: 400 })
    }
    if (!body.params?.title) {
      return NextResponse.json({ error: '缺少标题' }, { status: 400 })
    }
    if (!body.params?.images?.length) {
      return NextResponse.json({ error: '至少需要一张图片' }, { status: 400 })
    }

    const result = await publishImageNote(body.cookies, body.params)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
