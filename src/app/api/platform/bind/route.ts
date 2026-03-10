import { NextRequest, NextResponse } from 'next/server'
import { platformStore } from '@/lib/store/platform-store'
import { getServiceByPlatform, type PlatformType } from '@/lib/platform-service'

export async function POST(req: NextRequest) {
  try {
    const { platform, cookies } = await req.json() as { platform: PlatformType; cookies: any[] }
    if (!platform || !cookies?.length) {
      return NextResponse.json({ error: '缺少平台或cookies' }, { status: 400 })
    }

    const service = getServiceByPlatform(platform)
    if (!service) return NextResponse.json({ error: `不支持的平台: ${platform}` }, { status: 400 })

    // Validate cookies
    const result = await service.validateCookies(cookies)
    if (!result.valid) {
      return NextResponse.json({ error: result.error || 'Cookie无效' }, { status: 401 })
    }

    // Store account
    const accountId = platformStore.addAccount({
      platform, accountId: result.accountId!, accountName: result.accountName!, cookies,
    })

    // Get shops
    const shops = await service.getShops(cookies)
    if (shops.length > 0) {
      platformStore.addShops(accountId, shops.map((s: any) => ({
        shopId: s.shopId, shopName: s.shopName, platform, address: s.address, rating: s.rating,
      })))
    }

    return NextResponse.json({
      success: true,
      account: { id: accountId, platform, accountId: result.accountId, accountName: result.accountName },
      shops,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
