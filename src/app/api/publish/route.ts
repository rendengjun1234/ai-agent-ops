import { NextRequest, NextResponse } from 'next/server'
import { publishImageNote } from '@/lib/xhs-service'
import { publishImageWorkApi } from '@/lib/douyin-service'
import type { PlatformType, PublishResult } from '@/lib/platform-types'

// POST /api/publish - 统一多平台发布
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      platform: PlatformType
      cookies: Array<{ name: string; value: string }>
      params: {
        title: string
        desc: string
        images?: string[]
        topics?: Array<{ topicId: string; topicName: string }>
        visibility?: number
        // 抖音特有
        hot_sentence?: string
        activity?: Array<{ value: string; label: string }>
        tokens?: any
      }
    }

    const { platform, cookies, params } = body

    if (!cookies?.length) {
      return NextResponse.json({ success: false, error: '缺少 cookies' }, { status: 400 })
    }
    if (!params?.title) {
      return NextResponse.json({ success: false, error: '缺少标题' }, { status: 400 })
    }

    let result: PublishResult

    switch (platform) {
      case 'xiaohongshu': {
        if (!params.images?.length) {
          return NextResponse.json({ success: false, error: '小红书至少需要一张图片' }, { status: 400 })
        }
        const xhsResult = await publishImageNote(cookies, {
          title: params.title,
          desc: params.desc,
          images: params.images,
          topics: params.topics,
          visibility: (params.visibility ?? 0) as 0 | 1 | 4,
        })
        result = {
          success: xhsResult.success,
          publishId: xhsResult.publishId,
          shareLink: xhsResult.shareLink,
          error: xhsResult.error,
        }
        break
      }

      case 'douyin': {
        if (!params.images?.length) {
          return NextResponse.json({ success: false, error: '抖音图文至少需要一张图片' }, { status: 400 })
        }
        const douyinResult = await publishImageWorkApi(cookies, params.tokens || {}, {
          title: params.title,
          caption: params.desc,
          images: params.images,
          topics: params.topics?.map(t => t.topicName),
          visibility_type: (params.visibility === 1 ? 1 : 0) as 0 | 1,
          hot_sentence: params.hot_sentence,
          activity: params.activity,
        })
        result = {
          success: douyinResult.success,
          publishId: douyinResult.publishId,
          shareLink: douyinResult.shareLink,
          error: douyinResult.error,
        }
        break
      }

      case 'kwai': {
        // 快手目前只支持视频发布，图文暂不支持
        return NextResponse.json({ success: false, error: '快手暂只支持视频发布，图文发布功能开发中' }, { status: 400 })
      }

      case 'wxsph': {
        // 微信视频号发布功能尚未实现
        return NextResponse.json({ success: false, error: '微信视频号发布功能开发中' }, { status: 400 })
      }

      default:
        return NextResponse.json({ success: false, error: `不支持的平台: ${platform}` }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Publish error:', err)
    return NextResponse.json({ success: false, error: err.message || '发布失败' }, { status: 500 })
  }
}
