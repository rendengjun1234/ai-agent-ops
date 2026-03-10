/**
 * 统一平台绑定接口
 * POST: 接收 {platform, cookies} → 验证cookie → 存储 → 返回账号信息和门店列表
 */

import { NextRequest, NextResponse } from 'next/server'
import { PlatformType, PlatformCookie, PlatformAccount, parseCookieString } from '@/lib/platform-service'
import { platformStore } from '@/lib/store/platform-store'
import { meituanService } from '@/lib/meituan-service'
import { elemeService } from '@/lib/eleme-service'
import { douyinService } from '@/lib/douyin-service'

const services = {
  meituan: meituanService,
  eleme: elemeService,
  douyin: douyinService,
  // xhs 和 dianping 可后续添加
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { platform, cookies, cookieString } = body as {
      platform: PlatformType
      cookies?: PlatformCookie[]
      cookieString?: string  // 支持直接粘贴cookie字符串
    }

    if (!platform) {
      return NextResponse.json({ error: '缺少 platform 参数' }, { status: 400 })
    }

    const service = services[platform as keyof typeof services]
    if (!service) {
      return NextResponse.json({ error: `暂不支持平台: ${platform}` }, { status: 400 })
    }

    // 解析 cookies
    const parsedCookies = cookies || (cookieString ? parseCookieString(cookieString) : null)
    if (!parsedCookies || parsedCookies.length === 0) {
      return NextResponse.json({ error: '缺少 Cookie 数据' }, { status: 400 })
    }

    // 1. 验证 Cookie
    const validation = await service.validateCookies(parsedCookies)
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.error || 'Cookie 验证失败',
      }, { status: 401 })
    }

    // 2. 获取门店列表
    const shops = await service.getShops(parsedCookies)
    const shopsWithAccount = shops.map(s => ({ ...s, bindAccountId: validation.accountId! }))

    // 3. 存储账号信息
    const account: PlatformAccount = {
      platform,
      accountId: validation.accountId!,
      accountName: validation.accountName || '',
      cookies: parsedCookies,
      shops: shopsWithAccount,
      bindTime: Date.now(),
      lastSyncTime: Date.now(),
      status: 'active',
      avatar: (validation as any).avatar,
    }
    platformStore.addAccount(account)

    return NextResponse.json({
      success: true,
      data: {
        accountId: account.accountId,
        accountName: account.accountName,
        platform,
        shops: shopsWithAccount,
        bindTime: account.bindTime,
      },
    })
  } catch (err: any) {
    console.error('平台绑定失败:', err)
    return NextResponse.json({ success: false, error: err.message || '绑定失败' }, { status: 500 })
  }
}
