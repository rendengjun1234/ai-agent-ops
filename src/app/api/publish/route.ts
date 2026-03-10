import { NextRequest, NextResponse } from 'next/server'
import { publishImageNote } from '@/lib/xhs-service'
import type { PlatformType } from '@/lib/platform-types'

// POST /api/publish - 统一多平台发布
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { platform, cookies, params } = body as {
      platform: PlatformType
      cookies: Array<{ name: string; value: string }>
      params: {
        title: string
        desc: string
        images?: string[]
        topics?: Array<{ topicId: string; topicName: string }>
        visibility?: number
      }
    }

    if (!cookies?.length) {
      return NextResponse.json({ success: false, error: '缺少 cookies' }, { status: 400 })
    }
    if (!params?.title) {
      return NextResponse.json({ success: false, error: '缺少标题' }, { status: 400 })
    }

    switch (platform) {
      case 'xiaohongshu': {
        if (!params.images?.length) {
          return NextResponse.json({ success: false, error: '小红书至少需要一张图片' }, { status: 400 })
        }
        const result = await publishImageNote(cookies, {
          title: params.title,
          desc: params.desc,
          images: params.images,
          topics: params.topics,
          visibility: (params.visibility ?? 0) as 0 | 1 | 4,
        })
        return NextResponse.json(result)
      }

      case 'douyin':
        return NextResponse.json({ success: false, error: '抖音发布功能开发中' }, { status: 400 })

      case 'kwai':
        return NextResponse.json({ success: false, error: '快手发布功能开发中' }, { status: 400 })

      case 'wxsph':
        return NextResponse.json({ success: false, error: '视频号发布功能开发中' }, { status: 400 })

      default:
        return NextResponse.json({ success: false, error: `不支持的平台: ${platform}` }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || '发布失败' }, { status: 500 })
  }
}
