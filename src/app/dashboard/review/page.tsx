'use client'
import { useState } from 'react'
import { Star, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, ChevronRight, MessageSquare, Eye, Shield, Sparkles, Target, Users, BarChart3, Send, Copy, ThumbsUp, ThumbsDown, Flame, Filter, Search, Image as ImageIcon, Video, ExternalLink, ArrowRight, Zap } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell } from 'recharts'
import { reviews, remediationTasks, tagTrends, storeComparison, goodReviewAssets, reviewKPIs, type Review } from '@/lib/review-system-data'
import { useStore } from '@/lib/store-context'

const tabs = ['总览', '评价处理台', '问题整改', '经营洞察']
const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899']

const riskConfig = {
  P1: { label: 'P1 严重', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  P2: { label: 'P2 高优', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  P3: { label: 'P3 中优', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  P4: { label: 'P4 低优', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
}

const statusConfig = {
  pending: { label: '待处理', color: 'bg-red-50 text-red-600' },
  replied: { label: '已回复', color: 'bg-green-50 text-green-600' },
  escalated: { label: '已升级', color: 'bg-purple-50 text-purple-600' },
  closed: { label: '已关闭', color: 'bg-gray-100 text-gray-500' },
}

const taskStatusConfig = {
  open: { label: '待处理', color: 'bg-red-50 text-red-600' },
  in_progress: { label: '整改中', color: 'bg-blue-50 text-blue-600' },
  resolved: { label: '已完成', color: 'bg-green-50 text-green-600' },
  verified: { label: '已验证', color: 'bg-purple-50 text-purple-600' },
}

function ReviewDetailPanel({ review, onClose }: { review: Review; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900">评价详情</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          {/* 原始评价 */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{review.platformIcon}</span>
                <span className="text-sm font-medium">{review.author}</span>
                <span className="text-xs text-gray-400">{review.platform} · {review.store}</span>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>
            <div className="flex items-center gap-2 mt-2">
              {review.hasImage && <span className="text-xs text-gray-400 flex items-center gap-1"><ImageIcon className="w-3 h-3" />有图</span>}
              {review.hasVideo && <span className="text-xs text-gray-400 flex items-center gap-1"><Video className="w-3 h-3" />有视频</span>}
              <span className="text-xs text-gray-400">{review.timeAgo}</span>
            </div>
          </div>

          {/* AI分析 */}
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />AI分析
            </h4>
            <p className="text-sm text-gray-700 mb-3">{review.aiSummary}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16">风险等级</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${riskConfig[review.riskLevel].color}`}>{riskConfig[review.riskLevel].label}</span>
              </div>
              {review.rootCause && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-16">问题归因</span>
                  <span className="text-xs text-gray-700">{review.rootCause}</span>
                </div>
              )}
              {review.mentionedPeriod && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-16">涉及时段</span>
                  <span className="text-xs text-gray-700">{review.mentionedPeriod}</span>
                </div>
              )}
              {review.mentionedDish && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-16">涉及菜品</span>
                  <span className="text-xs text-gray-700">{review.mentionedDish}</span>
                </div>
              )}
            </div>
          </div>

          {/* AI标签 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">经营标签</h4>
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag, i) => (
                <span key={i} className={`text-xs px-2.5 py-1 rounded-full ${tag.sentiment === 'positive' ? 'bg-green-50 text-green-700' : tag.sentiment === 'negative' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                  {tag.primary}/{tag.secondary}
                  <span className="ml-1 opacity-60">{'●'.repeat(tag.intensity)}</span>
                </span>
              ))}
            </div>
          </div>

          {/* AI建议回复 */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-600" />AI建议回复
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{review.aiReply}</p>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center justify-center gap-1">
                <Send className="w-4 h-4" />采纳并发送
              </button>
              <button className="px-3 py-2 bg-white text-sm text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1">
                <Copy className="w-4 h-4" />编辑
              </button>
            </div>
          </div>

          {/* 是否需要整改 */}
          {review.rating <= 2 && (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-medium text-gray-900 mb-2">是否需要创建整改任务？</h4>
              <p className="text-xs text-gray-500 mb-3">系统检测到类似问题近7天出现{review.tags.length * 2}次</p>
              <button className="w-full py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-1">
                <Target className="w-4 h-4" />创建整改任务
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [filterPlatform, setFilterPlatform] = useState('全部')
  const { currentStore } = useStore()

  const pendingCount = reviews.filter(r => r.status === 'pending').length
  const p1Count = reviews.filter(r => r.riskLevel === 'P1' && r.status === 'pending').length
  const avgRating = +(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  const negRate = +(reviews.filter(r => r.rating <= 2).length / reviews.length * 100).toFixed(1)

  const filteredReviews = reviews.filter(r =>
    filterPlatform === '全部' || r.platform === filterPlatform
  ).sort((a, b) => {
    const priority = { P1: 0, P2: 1, P3: 2, P4: 3 }
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    return priority[a.riskLevel] - priority[b.riskLevel]
  })

  const tagDistribution = [
    { name: '出餐速度', value: 8, fill: '#ef4444' },
    { name: '服务态度', value: 6, fill: '#f59e0b' },
    { name: '产品/菜品', value: 5, fill: '#3b82f6' },
    { name: '环境卫生', value: 4, fill: '#10b981' },
    { name: '价格性价比', value: 3, fill: '#8b5cf6' },
    { name: '停车/交通', value: 2, fill: '#ec4899' },
  ]

  const healthRadar = [
    { dim: '产品', score: 82 }, { dim: '服务', score: 65 },
    { dim: '环境', score: 72 }, { dim: '出餐', score: 55 },
    { dim: '性价比', score: 88 }, { dim: '复购', score: 70 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">评价Agent</h1>
          <p className="text-gray-500 mt-1">评价驱动的门店经营优化系统</p>
        </div>
      </div>

      {/* Alert */}
      {p1Count > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
          <p className="text-sm font-medium text-red-700 flex-1">{p1Count}条P1严重差评待处理（含卫生/食安风险）</p>
          <button onClick={() => setActiveTab(1)} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg">立即处理</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-1.5 ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab}
            {i === 1 && pendingCount > 0 && <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${activeTab === i ? 'bg-white/20' : 'bg-red-500 text-white'}`}>{pendingCount}</span>}
          </button>
        ))}
      </div>

      {/* ===== Tab 0: 总览 ===== */}
      {activeTab === 0 && (
        <div className="space-y-4">
          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: '综合评分', value: avgRating.toString(), icon: Star, color: 'text-yellow-500', sub: '↑0.1 vs上周' },
              { label: '本周新评价', value: reviews.length.toString(), icon: MessageSquare, color: 'text-blue-500', sub: '好评4 差评3' },
              { label: '差评率', value: `${negRate}%`, icon: ThumbsDown, color: 'text-red-500', sub: '↓2.3% vs上周' },
              { label: '高风险问题', value: p1Count.toString(), icon: AlertTriangle, color: 'text-red-500', sub: '需立即处理' },
              { label: '待处理', value: pendingCount.toString(), icon: Clock, color: 'text-yellow-500', sub: '平均4.2h响应' },
              { label: 'AI采纳率', value: `${reviewKPIs.aiAdoptionRate}%`, icon: Sparkles, color: 'text-purple-500', sub: '回复效率↑' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 负面标签趋势 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">负面标签趋势（近7天）</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={tagTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="出餐速度" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="服务态度" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="环境卫生" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="产品菜品" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 门店风险排行 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">门店口碑对比</h3>
              <div className="space-y-3">
                {storeComparison.sort((a, b) => a.negRate - b.negRate).map((s, i) => (
                  <div key={s.store} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-green-100 text-green-600' : i >= storeComparison.length - 1 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{s.store}</span>
                        <span className="text-sm font-bold flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{s.score}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>差评率 {s.negRate}%</span>
                        <span>响应 {s.avgReplyTime}h</span>
                        <span className="text-red-500">⚠ {s.topIssue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Tab 1: 评价处理台 ===== */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['全部', '美团', '大众点评', '抖音', '小红书'].map(p => (
                <button key={p} onClick={() => setFilterPlatform(p)} className={`px-3 py-1.5 text-xs rounded-lg transition ${filterPlatform === p ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{p}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredReviews.map(review => {
              const risk = riskConfig[review.riskLevel]
              const st = statusConfig[review.status]
              return (
                <div key={review.id} onClick={() => setSelectedReview(review)}
                  className={`bg-white rounded-xl p-5 border shadow-sm cursor-pointer hover:shadow-md transition ${review.status === 'pending' && review.riskLevel === 'P1' ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${risk.color}`}>{risk.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                        <span className="text-xs text-gray-400">{review.platformIcon} {review.platform}</span>
                        <span className="text-xs text-gray-400">· {review.store}</span>
                        <span className="text-xs text-gray-400">· {review.timeAgo}</span>
                        <div className="flex gap-0.5 ml-auto">
                          {[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{review.content}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {review.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${tag.sentiment === 'negative' ? 'bg-red-50 text-red-600' : tag.sentiment === 'positive' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            {tag.primary}/{tag.secondary}
                          </span>
                        ))}
                        {review.hasImage && <span className="text-xs text-gray-400 flex items-center gap-0.5"><ImageIcon className="w-3 h-3" />图</span>}
                        {review.hasVideo && <span className="text-xs text-gray-400 flex items-center gap-0.5"><Video className="w-3 h-3" />视频</span>}
                      </div>
                      <p className="text-xs text-purple-600 mt-2 line-clamp-1">🤖 {review.aiSummary}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 mt-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ===== Tab 2: 问题整改 ===== */}
      {activeTab === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '待处理', value: remediationTasks.filter(t => t.status === 'open').length, color: 'text-red-500' },
              { label: '整改中', value: remediationTasks.filter(t => t.status === 'in_progress').length, color: 'text-blue-500' },
              { label: '已完成', value: remediationTasks.filter(t => t.status === 'resolved' || t.status === 'verified').length, color: 'text-green-500' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {remediationTasks.map(task => {
              const tRisk = riskConfig[task.riskLevel]
              const tStatus = taskStatusConfig[task.status]
              return (
                <div key={task.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tRisk.color}`}>{tRisk.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tStatus.color}`}>{tStatus.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>📊 来源{task.sourceReviewCount}条评价</span>
                        <span>📍 {task.stores.join('、')}</span>
                        <span>👤 {task.assignee}</span>
                        <span>📅 截止 {task.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-700 mb-1">💡 建议动作</p>
                    <p className="text-xs text-gray-700">{task.suggestedAction}</p>
                  </div>
                  {task.period && <p className="text-xs text-gray-500 mt-2">⏰ 涉及时段：{task.period}</p>}
                  {task.staff && <p className="text-xs text-gray-500 mt-1">👥 涉及人员：{task.staff}</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ===== Tab 3: 经营洞察 ===== */}
      {activeTab === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 口碑雷达 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">门店口碑雷达</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={healthRadar}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <p className="text-xs text-gray-500">最强：性价比(88) · 最弱：出餐(55)</p>
                <p className="text-xs text-red-500 mt-1">⚠️ 出餐速度连续3天下滑，建议优先整改</p>
              </div>
            </div>

            {/* 问题类型分布 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">负面问题分布</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={tagDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {tagDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 好评资产化 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />好评资产化
            </h3>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">顾客最常夸的关键词</p>
              <div className="flex flex-wrap gap-2">
                {goodReviewAssets.topKeywords.map(kw => (
                  <span key={kw} className="text-xs px-3 py-1.5 bg-white text-green-700 rounded-full border border-green-200 shadow-sm">{kw}</span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">AI生成的营销文案建议</p>
              {goodReviewAssets.suggestedCopy.map(copy => (
                <div key={copy.use} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded shrink-0">{copy.use}</span>
                  <p className="text-xs text-gray-700 flex-1">{copy.text}</p>
                  <button className="shrink-0 text-xs text-primary-600 hover:text-primary-700">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI经营建议 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />AI经营建议
            </h3>
            <div className="space-y-3">
              {[
                { icon: '👨‍🍳', text: '建议对晚高峰增配1名前厅服务员，当前18:00-20:00服务评分最低', urgency: '紧急' },
                { icon: '🧹', text: '建议提高翻台清洁频次，近7天"环境卫生"负面标签上升42%', urgency: '重要' },
                { icon: '📈', text: '菌菇藕汤好评率98%，建议加大推广投入（当前仅占营销预算的12%）', urgency: '建议' },
                { icon: '🔄', text: '光谷店出品与旗舰店存在差异，建议总厨每周巡店1次', urgency: '建议' },
                { icon: '💡', text: '"服务冷淡"标签连续上升，建议本周开展服务话术专项培训', urgency: '重要' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{item.text}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${item.urgency === '紧急' ? 'bg-red-100 text-red-600' : item.urgency === '重要' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>{item.urgency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail panel */}
      {selectedReview && <ReviewDetailPanel review={selectedReview} onClose={() => setSelectedReview(null)} />}
    </div>
  )
}
