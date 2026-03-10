import { NextRequest, NextResponse } from 'next/server'
import { syncAllAccounts, syncReviewsForAccount } from '@/lib/sync-service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { accountId } = body as { accountId?: string }

    if (accountId) {
      await syncReviewsForAccount(accountId)
    } else {
      await syncAllAccounts()
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { getDb } = await import('@/lib/db')
    const db = getDb()
    const tasks = db.prepare('SELECT * FROM sync_tasks ORDER BY created_at DESC LIMIT 20').all()
    return NextResponse.json({ tasks })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
