/**
 * 同步管理接口
 * POST: 手动触发同步（可指定accountId或全部）
 * GET: 获取同步任务状态/历史
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { syncReviewsForAccount, syncAllAccounts } from '@/lib/sync-service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { accountId } = body as { accountId?: string }

    if (accountId) {
      await syncReviewsForAccount(accountId)
    } else {
      await syncAllAccounts()
    }

    return NextResponse.json({ success: true, message: accountId ? `已同步账号 ${accountId}` : '已同步所有账号' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '同步失败' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')
    const tasks = await prisma.syncTask.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return NextResponse.json({ success: true, data: tasks })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '获取同步状态失败' }, { status: 500 })
  }
}
