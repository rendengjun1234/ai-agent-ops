'use client'
import { useState, useMemo } from 'react'
import { Star, Search, MessageSquare, Send, Sparkles, ThumbsUp, ThumbsDown, Minus, TrendingUp, TrendingDown, Check, X, ChevronDown, Copy, Download, Filter, Image as ImageIcon, Clock, BarChart3, Users, Zap, ArrowUpDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts'
import { mockPlatformStats } from '@/lib/mock-data'
import { detailedReviews, replyTemplates, competitorData, reviewDailyStats, keywordAnalysis, inviteReviewConfig } from '@/lib/review-data'
import type { Review } from '@/lib/mock-data'

const tabs = ['全部评价', '待回复', '差评预警', '趋势分析', '竞品对比', '邀评管理']
const platformFilters = ['全部', '美团', '大众点评', '抖音', '高德', '京东外卖', '淘宝闪购']
const ratingFilters = ['全部评分', '5星', '4星', '3星', '2星', '1星']
const sortOptions = ['最新优先', '评分最高', '评分最低']
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
const TREND_COLORS = { up: 'text-red-500', down: 'text-green-500', stable: 'text-gray-400' }

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const s = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${s} ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

function ReviewCard({ review, selected, onSelect, onReply, onUseTemplate }: {
  review: Review
  selected: boolean
  onSelect: (id: string) => void
  onReply: (id: string, text: string) => void
  onUseTemplate: (review: Review) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)

  const sentimentIcon = review.sentiment === 'positive'
    ? <ThumbsUp className="w-3.5 h-3.5 text-green-500" />
    : review.sentiment === 'negative'
    ? <ThumbsDown className="w-3.5 h-3.5 text-red-500" />
    : <Minus className="w-3.5 h-3.5 text-yellow-500" />

  const sentimentLabel = review.sentiment === 'positive' ? '好评' : review.sentiment === 'negative' ? '差评' : '中评'
  const sentimentColor = review.sentiment === 'positive' ? 'bg-green-50 text-green-600' : review.sentiment === 'negative' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'

  return (
    <div className={`bg-white rounded-xl border-2 shadow-sm transition ${selected ? 'border-primary-400 ring-2 ring-primary-100' : 'border-gray-100'}`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          {!review.replied && (
            <button onClick={() => onSelect(review.id)} className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition ${selected ? 'bg-primary-600 border-primary-600' : 'border-gray-300 hover:border-primary-400'}`}>
              {selected && <Check className="w-3 h-3 text-white" />}
            </button>
          )}

          {/* Avatar */}
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-700 shrink-0">
            {review.userName[0]}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900">{review.userName}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${sentimentColor} flex items-center gap-0.5`}>
                {sentimentIcon}{sentimentLabel}
              </span>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">{review.platform}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <StarRating rating={review.rating} />
              <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              {review.images.length > 0 && (
                <span className="text-xs text-gray-400 flex items-center gap-0.5">
                  <ImageIcon className="w-3 h-3" />{review.images.length}张图
                </span>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="shrink-0">
            {review.replied ? (
              <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />已回复
              </span>
            ) : (
              <span className="text-xs px-2 py-1 bg-red-50 text-red-500 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />待回复
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-3 ml-0 lg:ml-[52px]">
          <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {review.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">#{tag}</span>
            ))}
          </div>

          {/* Reply */}
          {review.replied && review.replyContent && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-1.5 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">商家回复</span>
              </div>
              <p className="text-sm text-blue-800">{review.replyContent}</p>
            </div>
          )}

          {/* Reply actions for unreplied */}
          {!review.replied && (
            <div className="mt-3">
              <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                <Sparkles className="w-4 h-4" />
                {expanded ? '收起回复' : 'AI智能回复'}
              </button>

              {expanded && (
                <div className="mt-3 space-y-3">
                  {/* AI suggestion */}
                  {review.aiSuggestion && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-purple-600 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />AI推荐回复
                        </span>
                        <button onClick={() => setReplyText(review.aiSuggestion || '')} className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-0.5">
                          <Copy className="w-3 h-3" />使用
                        </button>
                      </div>
                      <p className="text-sm text-purple-800">{review.aiSuggestion}</p>
                    </div>
                  )}

                  {/* Template selector */}
                  <div>
                    <button onClick={() => setShowTemplates(!showTemplates)} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <ChevronDown className={`w-3 h-3 transition ${showTemplates ? 'rotate-180' : ''}`} />
                      从模板选择
                    </button>
                    {showTemplates && (
                      <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {replyTemplates
                          .filter(t => t.category === review.sentiment || t.category === 'neutral')
                          .map(t => (
                            <button key={t.id} onClick={() => { setReplyText(t.content); setShowTemplates(false) }}
                              className="text-left p-2 text-xs bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-100 transition">
                              <span className="font-medium text-gray-700">{t.name}</span>
                              <p className="text-gray-500 mt-0.5 line-clamp-2">{t.content}</p>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Reply input */}
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="输入回复内容..."
                    className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{replyText.length}/500字</span>
                    <div className="flex gap-2">
                      <button onClick={() => { setExpanded(false); setReplyText('') }} className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg">取消</button>
                      <button
                        onClick={() => { onReply(review.id, replyText); setExpanded(false); setReplyText('') }}
                        disabled={!replyText.trim()}
                        className="px-4 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1 disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />发送回复
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 批量回复面板
function BatchReplyPanel({ count, onBatchReply, onClear }: { count: number; onBatchReply: (text: string) => void; onClear: () => void }) {
  const [text, setText] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)

  if (count === 0) return null

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-primary-700">已选择 {count} 条评价</span>
        <button onClick={onClear} className="text-xs text-primary-600 hover:text-primary-700">取消选择</button>
      </div>
      <div className="flex gap-2 mb-2">
        {replyTemplates.slice(0, 3).map(t => (
          <button key={t.id} onClick={() => setText(t.content)} className="text-xs px-3 py-1.5 bg-white border border-primary-200 rounded-lg hover:bg-primary-100 text-primary-700 truncate max-w-[200px]">
            {t.name}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="输入批量回复内容（AI会根据每条评价自动调整措辞）..."
          className="flex-1 p-2 text-sm border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
          rows={2}
        />
        <button
          onClick={() => { onBatchReply(text); setText('') }}
          disabled={!text.trim()}
          className="px-4 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 shrink-0"
        >
          批量回复 ({count})
        </button>
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [platform, setPlatform] = useState('全部')
  const [ratingFilter, setRatingFilter] = useState('全部评分')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('最新优先')
  const [reviews, setReviews] = useState(detailedReviews)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  // Stats
  const totalReviews = reviews.length
  const unrepliedCount = reviews.filter(r => !r.replied).length
  const negativeCount = reviews.filter(r => r.sentiment === 'negative').length
  const positiveRate = Math.round(reviews.filter(r => r.sentiment === 'positive').length / totalReviews * 100)
  const avgRating = +(reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)

  // Filter
  const filtered = useMemo(() => {
    let result = reviews.filter(r => {
      if (activeTab === 1 && r.replied) return false
      if (activeTab === 2 && r.sentiment !== 'negative') return false
      if (platform !== '全部' && r.platform !== platform) return false
      if (ratingFilter !== '全部评分') {
        const stars = parseInt(ratingFilter)
        if (r.rating !== stars) return false
      }
      if (search && !r.content.includes(search) && !r.userName.includes(search) && !r.tags.some(t => t.includes(search))) return false
      return true
    })

    if (sortBy === '评分最高') result.sort((a, b) => b.rating - a.rating)
    else if (sortBy === '评分最低') result.sort((a, b) => a.rating - b.rating)
    else result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return result
  }, [reviews, activeTab, platform, ratingFilter, search, sortBy])

  const handleReply = (id: string, text: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, replied: true, replyContent: text } : r))
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next })
  }

  const handleBatchReply = (text: string) => {
    setReviews(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, replied: true, replyContent: text } : r))
    setSelectedIds(new Set())
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllUnreplied = () => {
    const ids = filtered.filter(r => !r.replied).map(r => r.id)
    setSelectedIds(new Set(ids))
  }

  const sentimentData = [
    { name: '好评', value: reviews.filter(r => r.sentiment === 'positive').length, color: '#10b981' },
    { name: '中评', value: reviews.filter(r => r.sentiment === 'neutral').length, color: '#f59e0b' },
    { name: '差评', value: reviews.filter(r => r.sentiment === 'negative').length, color: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">评价Agent</h1>
          <p className="text-gray-500 mt-1">全平台评价聚合管理 · AI智能回复 · 趋势分析</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
          <Download className="w-4 h-4" />导出报告
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: '综合评分', value: avgRating.toString(), sub: '较上月+0.1', color: 'text-primary-600', icon: Star },
          { label: '总评价数', value: totalReviews.toString(), sub: '近30天', color: 'text-gray-900', icon: MessageSquare },
          { label: '待回复', value: unrepliedCount.toString(), sub: `回复率${Math.round((1 - unrepliedCount / totalReviews) * 100)}%`, color: unrepliedCount > 10 ? 'text-red-500' : 'text-green-600', icon: Clock },
          { label: '好评率', value: `${positiveRate}%`, sub: '较上月+2.1%', color: 'text-green-600', icon: ThumbsUp },
          { label: '差评预警', value: negativeCount.toString(), sub: `${negativeCount > 5 ? '⚠️ 偏高' : '✅ 正常'}`, color: negativeCount > 5 ? 'text-red-500' : 'text-green-600', icon: ThumbsDown },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{card.label}</span>
              <card.icon className="w-4 h-4 text-gray-300" />
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <span className="text-xs text-gray-400">{card.sub}</span>
          </div>
        ))}
      </div>

      {/* Platform ratings row */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {mockPlatformStats.map(p => (
          <div key={p.platform} className="bg-white rounded-lg px-4 py-2.5 border border-gray-100 shadow-sm flex items-center gap-3 shrink-0">
            <span className="text-sm font-medium text-gray-700">{p.platform}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-gray-900">{p.rating}</span>
            </div>
            <span className={`text-xs ${p.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {p.trend >= 0 ? '↑' : '↓'}{Math.abs(p.trend)}
            </span>
            <span className="text-xs text-gray-400">{p.reviews}条</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-x-auto">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab}
            {i === 1 && unrepliedCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">{unrepliedCount}</span>}
            {i === 2 && negativeCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">{negativeCount}</span>}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab <= 2 ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索评价内容、用户、标签..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            </div>
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 overflow-x-auto">
              {platformFilters.map(p => (
                <button key={p} onClick={() => setPlatform(p)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${platform === p ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-50'}`}>{p}</button>
              ))}
            </div>
            <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-600">
              {ratingFilters.map(r => <option key={r}>{r}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-600">
              {sortOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Batch actions */}
          {activeTab <= 1 && (
            <div className="flex items-center gap-3">
              <button onClick={selectAllUnreplied} className="text-xs text-primary-600 hover:text-primary-700 font-medium">全选待回复</button>
              <span className="text-xs text-gray-400">共 {filtered.length} 条评价</span>
            </div>
          )}

          <BatchReplyPanel count={selectedIds.size} onBatchReply={handleBatchReply} onClear={() => setSelectedIds(new Set())} />

          {/* Review list */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>暂无匹配的评价</p>
              </div>
            ) : (
              filtered.map(r => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  selected={selectedIds.has(r.id)}
                  onSelect={toggleSelect}
                  onReply={handleReply}
                  onUseTemplate={() => {}}
                />
              ))
            )}
          </div>
        </>
      ) : activeTab === 3 ? (
        /* 趋势分析 - 增强版 */
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 评分走势 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">评分走势（近30天）</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={reviewDailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[3.5, 5]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} name="评分" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 好差评分布 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">好差评分布</h3>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {sentimentData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {sentimentData.map(d => (
                    <div key={d.name} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                      <span className="text-sm text-gray-600 w-8">{d.name}</span>
                      <span className="text-sm font-bold text-gray-900">{d.value}条</span>
                      <span className="text-xs text-gray-400">({Math.round(d.value / totalReviews * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 每日评价量+回复率 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">每日评价量与回复率</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={reviewDailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="positive" stackId="reviews" fill="#10b981" name="好评" radius={[0, 0, 0, 0]} />
                <Bar yAxisId="left" dataKey="neutral" stackId="reviews" fill="#f59e0b" name="中评" radius={[0, 0, 0, 0]} />
                <Bar yAxisId="left" dataKey="negative" stackId="reviews" fill="#ef4444" name="差评" radius={[2, 2, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="replyRate" stroke="#2563eb" strokeWidth={2} dot={false} name="回复率%" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* 关键词分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">🟢 高频好评关键词</h3>
              <div className="space-y-2.5">
                {keywordAnalysis.positive.map((k, i) => (
                  <div key={k.keyword} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                    <span className="text-sm text-gray-700 w-20">{k.keyword}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 rounded-full h-2" style={{ width: `${k.count / keywordAnalysis.positive[0].count * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{k.count}</span>
                    <span className={`text-xs ${TREND_COLORS[k.trend]}`}>
                      {k.trend === 'up' ? '↑' : k.trend === 'down' ? '↓' : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">🔴 高频差评关键词</h3>
              <div className="space-y-2.5">
                {keywordAnalysis.negative.map((k, i) => (
                  <div key={k.keyword} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                    <span className="text-sm text-gray-700 w-24">{k.keyword}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-red-500 rounded-full h-2" style={{ width: `${k.count / keywordAnalysis.negative[0].count * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{k.count}</span>
                    <span className={`text-xs ${k.trend === 'up' ? 'text-red-500' : k.trend === 'down' ? 'text-green-500' : 'text-gray-400'}`}>
                      {k.trend === 'up' ? '↑' : k.trend === 'down' ? '↓' : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 4 ? (
        /* 竞品对比 */
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">竞品评价对比</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-gray-500 font-medium">店铺</th>
                  <th className="text-center py-3 text-gray-500 font-medium">评分</th>
                  <th className="text-center py-3 text-gray-500 font-medium">评价数</th>
                  <th className="text-center py-3 text-gray-500 font-medium">好评率</th>
                  <th className="text-center py-3 text-gray-500 font-medium">回复率</th>
                  <th className="text-center py-3 text-gray-500 font-medium">平均回复时长</th>
                  <th className="text-left py-3 text-gray-500 font-medium">高频标签</th>
                </tr>
              </thead>
              <tbody>
                {competitorData.map(c => (
                  <tr key={c.name} className={`border-b border-gray-50 ${c.isOwn ? 'bg-primary-50/50' : ''}`}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${c.isOwn ? 'text-primary-700' : 'text-gray-900'}`}>{c.name}</span>
                        {c.isOwn && <span className="text-xs px-1.5 py-0.5 bg-primary-100 text-primary-600 rounded">本店</span>}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className="flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">{c.rating}</span>
                      </span>
                    </td>
                    <td className="py-3 text-center text-gray-700">{c.reviewCount}</td>
                    <td className="py-3 text-center">
                      <span className={c.positiveRate >= 85 ? 'text-green-600 font-medium' : 'text-gray-700'}>{c.positiveRate}%</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={c.replyRate >= 90 ? 'text-green-600 font-medium' : 'text-gray-700'}>{c.replyRate}%</span>
                    </td>
                    <td className="py-3 text-center text-gray-700">{c.avgReplyTime}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {c.topTags.map(t => <span key={t} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">#{t}</span>)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 竞品评分趋势 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">评分趋势对比（近12周）</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={competitorData[0].trend.map((_, i) => ({
                week: `W${i + 1}`,
                ...Object.fromEntries(competitorData.map(c => [c.name, c.trend[i]]))
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[4, 5]} tick={{ fontSize: 11 }} />
                <Tooltip />
                {competitorData.map((c, i) => (
                  <Line key={c.name} type="monotone" dataKey={c.name} stroke={COLORS[i]} strokeWidth={c.isOwn ? 3 : 1.5} strokeDasharray={c.isOwn ? undefined : '5 5'} dot={false} name={c.name} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI分析 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />AI竞品分析
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>📊 <strong>评分领先：</strong>本店评分4.6，在4家竞品中排名第1。但"武汉印象藕汤"（4.5分）增速较快，近12周上升0.2分，需要关注。</p>
              <p>⏱️ <strong>回复效率优势明显：</strong>本店平均回复时长2.3小时，远快于竞品平均5.7小时，回复率92%也是最高。这是重要的竞争优势，需要保持。</p>
              <p>⚠️ <strong>差评关键词预警：</strong>"等位久""上菜慢"两个关键词趋势上升，与竞品"荆楚藕汤王"的"环境好"形成反差。建议：优化高峰期排队体验。</p>
              <p>💡 <strong>建议：</strong>1）关注"武汉印象藕汤"的运营策略（偏年轻化打卡风格）；2）加强高峰期服务效率；3）保持回复速度优势。</p>
            </div>
          </div>
        </div>
      ) : (
        /* 邀评管理 */
        <div className="space-y-4">
          {/* 邀评概览 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '今日邀评发送', value: `${inviteReviewConfig.sms.sentToday + inviteReviewConfig.wechat.sentToday}条` },
              { label: '店内扫码', value: `${inviteReviewConfig.inStore.scansToday}次` },
              { label: '平均转化率', value: `${((inviteReviewConfig.sms.conversionRate + inviteReviewConfig.wechat.conversionRate + inviteReviewConfig.inStore.conversionRate) / 3).toFixed(1)}%` },
              { label: '本月新增好评', value: '86条' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-500">{s.label}</span>
                <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
              </div>
            ))}
          </div>

          {/* 渠道配置 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 短信邀评 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">📱 短信邀评</h3>
                <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition ${inviteReviewConfig.sms.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${inviteReviewConfig.sms.enabled ? 'translate-x-5' : ''}`} />
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">发送时机</span><span className="text-gray-700">消费后{inviteReviewConfig.sms.delayHours}小时</span></div>
                <div className="flex justify-between"><span className="text-gray-500">今日发送</span><span className="text-gray-700">{inviteReviewConfig.sms.sentToday}条</span></div>
                <div className="flex justify-between"><span className="text-gray-500">转化率</span><span className="text-green-600 font-medium">{inviteReviewConfig.sms.conversionRate}%</span></div>
                <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
                  <p className="font-medium text-gray-700 mb-1">模板预览</p>
                  {inviteReviewConfig.sms.template}
                </div>
              </div>
            </div>

            {/* 微信邀评 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">💬 微信邀评</h3>
                <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition ${inviteReviewConfig.wechat.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${inviteReviewConfig.wechat.enabled ? 'translate-x-5' : ''}`} />
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">发送时机</span><span className="text-gray-700">消费后{inviteReviewConfig.wechat.delayHours}小时</span></div>
                <div className="flex justify-between"><span className="text-gray-500">今日发送</span><span className="text-gray-700">{inviteReviewConfig.wechat.sentToday}条</span></div>
                <div className="flex justify-between"><span className="text-gray-500">转化率</span><span className="text-green-600 font-medium">{inviteReviewConfig.wechat.conversionRate}%</span></div>
                <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
                  <p className="font-medium text-gray-700 mb-1">模板预览</p>
                  {inviteReviewConfig.wechat.template}
                </div>
              </div>
            </div>

            {/* 店内邀评 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">🏪 店内扫码邀评</h3>
                <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition ${inviteReviewConfig.inStore.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${inviteReviewConfig.inStore.enabled ? 'translate-x-5' : ''}`} />
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">方式</span><span className="text-gray-700">桌面二维码</span></div>
                <div className="flex justify-between"><span className="text-gray-500">奖励</span><span className="text-gray-700">{inviteReviewConfig.inStore.reward}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">今日扫码</span><span className="text-gray-700">{inviteReviewConfig.inStore.scansToday}次</span></div>
                <div className="flex justify-between"><span className="text-gray-500">转化率</span><span className="text-green-600 font-medium">{inviteReviewConfig.inStore.conversionRate}%</span></div>
              </div>
            </div>

            {/* 满意度预筛 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">🔍 满意度预筛</h3>
                <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition ${inviteReviewConfig.preFilter.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${inviteReviewConfig.preFilter.enabled ? 'translate-x-5' : ''}`} />
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="text-gray-500">预筛问题</span><p className="text-gray-700 mt-1">"{inviteReviewConfig.preFilter.question}"</p></div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700"><strong>满意 →</strong> {inviteReviewConfig.preFilter.satisfiedAction}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-700"><strong>不满意 →</strong> {inviteReviewConfig.preFilter.unsatisfiedAction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
