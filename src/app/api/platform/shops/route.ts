/**
 * 门店管理接口
 * GET: 获取所有平台的门店列表
 */

import { NextRequest, NextResponse } from 'next/server'
import { PlatformType } from '@/lib/platform-service'
import { platformStore } from '@/lib/store/platform-store'

export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get('platform') as PlatformType | null

  const shops = platform
    ? platformStore.getShopsByPlatform(platform)
    : platformStore.getAllShops()

  return NextResponse.json({ success: true, data: shops })
}
