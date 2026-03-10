import { NextRequest, NextResponse } from 'next/server'
import { getDb, PLATFORM_DISPLAY, PLATFORM_ICON, PLATFORM_KEY } from '@/lib/db'

// GET /api/reviews - 获取评价列表
export async function GET(req: NextRequest) {
  try {
    const db = getDb()
    const { searchParams } = new URL(req.url)
    const platform = searchParams.get('platform')
    const status = searchParams.get('status')
    const riskLevel = searchParams.get('riskLevel')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')

    let where = 'WHERE 1=1'
    const params: any[] = []

    if (platform && platform !== '全部') {
      const key = PLATFORM_KEY[platform] || platform
      where += ' AND r.platform = ?'
      params.push(key)
    }
    if (status) { where += ' AND r.status = ?'; params.push(status) }
    if (riskLevel) { where += ' AND r.risk_level = ?'; params.push(riskLevel) }

    const countRow = db.prepare(`SELECT COUNT(*) as total FROM reviews r ${where}`).get(...params) as any
    const rows = db.prepare(`
      SELECT r.*, s.shop_name, s.address as shop_address
      FROM reviews r LEFT JOIN shops s ON r.shop_id = s.id
      ${where}
      ORDER BY
        CASE r.status WHEN 'pending' THEN 0 ELSE 1 END,
        CASE r.risk_level WHEN 'P1' THEN 0 WHEN 'P2' THEN 1 WHEN 'P3' THEN 2 ELSE 3 END,
        r.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, pageSize, (page - 1) * pageSize) as any[]

    const reviews = rows.map(r => ({
      id: r.id,
      platform: PLATFORM_DISPLAY[r.platform] || r.platform,
      platformIcon: PLATFORM_ICON[r.platform] || '⚪',
      store: r.shop_name || '未知门店',
      storeId: r.shop_id,
      rating: r.rating,
      content: r.content,
      author: r.user_name,
      time: r.created_at,
      timeAgo: getTimeAgo(r.created_at),
      hasImage: !!(r.images && r.images !== '[]'),
      hasVideo: !!r.has_video,
      tags: r.ai_tags ? JSON.parse(r.ai_tags) : [],
      riskLevel: r.risk_level || 'P4',
      aiSummary: r.ai_summary || '',
      aiReply: r.ai_reply || '',
      rootCause: r.root_cause,
      mentionedDish: r.mentioned_dish,
      mentionedStaff: r.mentioned_staff,
      mentionedPeriod: r.mentioned_period,
      status: r.status || 'pending',
      assignee: r.assignee,
      replyTime: r.replied_at,
      linkedTaskId: r.linked_task_id,
      isHighValue: !!r.is_high_value,
    }))

    return NextResponse.json({ reviews, total: countRow.total, page, pageSize })
  } catch (err: any) {
    console.error('GET /api/reviews error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/reviews - 更新评价（回复/状态）
export async function PATCH(req: NextRequest) {
  try {
    const db = getDb()
    const body = await req.json()
    const { reviewId, status, reply } = body

    if (!reviewId) return NextResponse.json({ error: '缺少 reviewId' }, { status: 400 })

    const updates: string[] = []
    const params: any[] = []

    if (status) { updates.push('status = ?'); params.push(status) }
    if (reply) {
      updates.push('reply = ?', 'replied_at = ?')
      params.push(reply, new Date().toISOString())
    }

    if (updates.length === 0) return NextResponse.json({ error: '无更新内容' }, { status: 400 })

    params.push(reviewId)
    db.prepare(`UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`).run(...params)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  return `${days}天前`
}
