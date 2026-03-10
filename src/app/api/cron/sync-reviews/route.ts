/**
 * 定时同步评价 (Cron endpoint)
 * GET: 被 Vercel Cron 调用，触发全部账号同步
 * 需要 CRON_SECRET 环境变量验证
 */

import { NextRequest, NextResponse } from 'next/server'
import { syncAllAccounts } from '@/lib/sync-service'

export async function GET(req: NextRequest) {
  // 验证 API key
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await syncAllAccounts()
    return NextResponse.json({ success: true, message: '同步完成', time: new Date().toISOString() })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '同步失败' }, { status: 500 })
  }
}
