/**
 * 账号管理接口
 * GET: 获取所有已绑定账号
 * DELETE: 解绑账号
 */

import { NextRequest, NextResponse } from 'next/server'
import { PlatformType } from '@/lib/platform-service'
import { platformStore } from '@/lib/store/platform-store'

export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get('platform') as PlatformType | null

  const accounts = platform
    ? await platformStore.getAccountsByPlatform(platform)
    : await platformStore.getAllAccounts()

  // 返回时隐藏 cookies 敏感信息
  const safeAccounts = accounts.map(({ cookies, ...rest }) => ({
    ...rest,
    hasCookies: cookies.length > 0,
  }))

  return NextResponse.json({ success: true, data: safeAccounts })
}

export async function DELETE(req: NextRequest) {
  try {
    const { platform, accountId } = await req.json()
    if (!platform || !accountId) {
      return NextResponse.json({ error: '缺少 platform 或 accountId' }, { status: 400 })
    }

    const removed = await platformStore.removeAccount(platform, accountId)
    if (!removed) {
      return NextResponse.json({ error: '账号不存在' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '操作失败' }, { status: 500 })
  }
}
