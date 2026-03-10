import { NextRequest, NextResponse } from 'next/server'
import { platformStore } from '@/lib/store/platform-store'
import { getServiceByPlatform, type PlatformType } from '@/lib/platform-service'
import { PLATFORM_DISPLAY, PLATFORM_ICON } from '@/lib/db'

// GET - 获取评价（通过平台API）
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const platform = searchParams.get('platform') as PlatformType | null

    if (!platform) return NextResponse.json({ error: '缺少platform参数' }, { status: 400 })

    const service = getServiceByPlatform(platform)
    if (!service) return NextResponse.json({ error: `不支持的平台: ${platform}` }, { status: 400 })

    const accounts = platformStore.getAccountsByPlatform(platform)
    if (accounts.length === 0) return NextResponse.json({ error: '未找到该平台的绑定账号' }, { status: 404 })

    const shops = platformStore.getShopsByPlatform(platform)
    const allReviews: any[] = []

    for (const shop of shops) {
      const result = await service.getReviews(accounts[0].cookies, shop.shopId)
      allReviews.push(...result.reviews.map((r: any) => ({
        ...r,
        platformName: PLATFORM_DISPLAY[platform] || platform,
        platformIcon: PLATFORM_ICON[platform] || '⚪',
        shopName: shop.shopName,
      })))
    }

    return NextResponse.json({ reviews: allReviews })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST - 回复评价
export async function POST(req: NextRequest) {
  try {
    const { platform, reviewId, content } = await req.json()
    if (!platform || !reviewId || !content) return NextResponse.json({ error: '缺少参数' }, { status: 400 })

    const service = getServiceByPlatform(platform as PlatformType)
    if (!service) return NextResponse.json({ error: `不支持的平台` }, { status: 400 })

    const accounts = platformStore.getAccountsByPlatform(platform)
    if (accounts.length === 0) return NextResponse.json({ error: '未找到绑定账号' }, { status: 404 })

    const result = await service.replyReview(accounts[0].cookies, { reviewId, content })
    return NextResponse.json({ success: result.success, ...('error' in result ? { error: result.error } : {}) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
