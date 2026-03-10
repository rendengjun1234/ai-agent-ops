import { NextResponse } from 'next/server'
import { getDb, PLATFORM_DISPLAY } from '@/lib/db'

// GET /api/reviews/stats - 评价统计数据
export async function GET() {
  try {
    const db = getDb()

    const total = (db.prepare('SELECT COUNT(*) as c FROM reviews').get() as any).c
    const pending = (db.prepare("SELECT COUNT(*) as c FROM reviews WHERE status = 'pending'").get() as any).c
    const p1Pending = (db.prepare("SELECT COUNT(*) as c FROM reviews WHERE risk_level = 'P1' AND status = 'pending'").get() as any).c
    const avgRating = (db.prepare('SELECT AVG(rating) as avg FROM reviews').get() as any).avg || 0
    const negCount = (db.prepare('SELECT COUNT(*) as c FROM reviews WHERE rating <= 2').get() as any).c
    const negRate = total > 0 ? Math.round((negCount / total) * 100) : 0

    // 按平台分布
    const platformRows = db.prepare('SELECT platform, COUNT(*) as count FROM reviews GROUP BY platform').all() as any[]
    const platformDistribution = platformRows.map(r => ({
      name: PLATFORM_DISPLAY[r.platform] || r.platform,
      value: Math.round((r.count / total) * 100),
    }))

    // 按评分分布
    const ratingRows = db.prepare('SELECT rating, COUNT(*) as count FROM reviews GROUP BY rating ORDER BY rating').all() as any[]
    const ratingDistribution = ratingRows.map(r => ({ rating: r.rating, count: r.count }))

    // 情绪分布（基于rating）
    const positive = (db.prepare('SELECT COUNT(*) as c FROM reviews WHERE rating >= 4').get() as any).c
    const neutral = (db.prepare('SELECT COUNT(*) as c FROM reviews WHERE rating = 3').get() as any).c
    const negative = (db.prepare('SELECT COUNT(*) as c FROM reviews WHERE rating <= 2').get() as any).c

    return NextResponse.json({
      total, pending, p1Pending,
      avgRating: Math.round(avgRating * 100) / 100,
      negRate, negCount,
      platformDistribution,
      ratingDistribution,
      sentiment: {
        positive: total > 0 ? Math.round((positive / total) * 100) : 0,
        neutral: total > 0 ? Math.round((neutral / total) * 100) : 0,
        negative: total > 0 ? Math.round((negative / total) * 100) : 0,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
