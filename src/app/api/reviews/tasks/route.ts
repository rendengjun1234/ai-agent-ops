import { NextRequest, NextResponse } from 'next/server'
import { getDb, genId } from '@/lib/db'

// GET /api/reviews/tasks - 获取整改任务列表
export async function GET() {
  try {
    const db = getDb()
    const rows = db.prepare('SELECT * FROM remediation_tasks ORDER BY CASE status WHEN \'open\' THEN 0 WHEN \'in_progress\' THEN 1 ELSE 2 END, created_at DESC').all() as any[]

    const tasks = rows.map(t => ({
      id: t.id,
      title: t.title,
      category: t.category,
      sourceReviewCount: t.source_review_count,
      stores: t.stores ? JSON.parse(t.stores) : [],
      riskLevel: t.risk_level,
      assignee: t.assignee,
      deadline: t.deadline,
      status: t.status,
      suggestedAction: t.suggested_action,
      period: t.period,
      staff: t.staff,
      createdAt: t.created_at,
      resolvedAt: t.resolved_at,
      scoreImpact: t.score_impact,
    }))

    return NextResponse.json({ tasks })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/reviews/tasks - 创建整改任务
export async function POST(req: NextRequest) {
  try {
    const db = getDb()
    const body = await req.json()
    const { title, category, stores, riskLevel, assignee, deadline, suggestedAction, period, staff } = body

    if (!title) return NextResponse.json({ error: '缺少标题' }, { status: 400 })

    const id = genId()
    db.prepare(`INSERT INTO remediation_tasks (id, title, category, source_review_count, stores, risk_level, assignee, deadline, status, suggested_action, period, staff)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      id, title, category || '其他', 1,
      JSON.stringify(stores || []), riskLevel || 'P3',
      assignee || '待分配', deadline || '',
      'open', suggestedAction || '', period || null, staff || null
    )

    return NextResponse.json({ success: true, taskId: id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/reviews/tasks - 更新任务状态
export async function PATCH(req: NextRequest) {
  try {
    const db = getDb()
    const body = await req.json()
    const { taskId, status } = body

    if (!taskId || !status) return NextResponse.json({ error: '缺少参数' }, { status: 400 })

    const updates = ['status = ?']
    const params: any[] = [status]

    if (status === 'resolved' || status === 'verified') {
      updates.push('resolved_at = ?')
      params.push(new Date().toISOString())
    }

    params.push(taskId)
    db.prepare(`UPDATE remediation_tasks SET ${updates.join(', ')} WHERE id = ?`).run(...params)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
