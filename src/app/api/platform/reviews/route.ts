/**
 * 评价聚合接口
 * GET: 获取所有平台评价（支持platform筛选）
 * POST: 回复评价
 */

import { NextRequest, NextResponse } from 'next/server'
import { PlatformType } from '@/lib/platform-service'
import { platformStore, dbAccountToPlatformAccount } from '@/lib/store/platform-store'
import { meituanService } from '@/lib/meituan-service'
import { elemeService } from '@/lib/eleme-service'
import { douyinService } from '@/lib/douyin-service'

const services = {
  meituan: meituanService,
  eleme: elemeService,
  douyin: douyinService,
}

export async function GET(req: NextRequest) {
  try {
    const platform = req.nextUrl.searchParams.get('platform') as PlatformType | null
    const shopId = req.nextUrl.searchParams.get('shopId')
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1')

    const dbAccounts = platform
      ? await platformStore.getAccountsByPlatform(platform)
      : await platformStore.getAllAccounts()

    const accounts = dbAccounts.map(dbAccountToPlatformAccount)
    const allReviews = []

    for (const account of accounts) {
      const service = services[account.platform as keyof typeof services]
      if (!service) continue

      const targetShops = shopId
        ? account.shops.filter(s => s.shopId === shopId)
        : account.shops

      for (const shop of targetShops) {
        try {
          const result = await service.getReviews(account.cookies, shop.shopId, page)
          allReviews.push(...result.reviews)
        } catch (err) {
          console.error(`获取 ${account.platform} 评价失败:`, err)
        }
      }
    }

    allReviews.sort((a, b) => b.reviewTime - a.reviewTime)

    return NextResponse.json({ success: true, data: { reviews: allReviews, total: allReviews.length } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '获取评价失败' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { platform, reviewId, content } = await req.json()
    if (!platform || !reviewId || !content) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    const service = services[platform as keyof typeof services]
    if (!service) {
      return NextResponse.json({ error: `暂不支持平台: ${platform}` }, { status: 400 })
    }

    const dbAccounts = await platformStore.getAccountsByPlatform(platform)
    if (dbAccounts.length === 0) {
      return NextResponse.json({ error: '未找到该平台的绑定账号' }, { status: 404 })
    }

    const account = dbAccountToPlatformAccount(dbAccounts[0])
    const result = await service.replyReview(account.cookies, { reviewId, content })
    return NextResponse.json({ success: result.success, ...('error' in result ? { error: result.error } : {}) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '回复失败' }, { status: 500 })
  }
}
