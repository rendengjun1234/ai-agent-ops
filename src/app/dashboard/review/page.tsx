'use client'
import { useState } from 'react'
import { Star, Search, Filter, MessageSquare, Send, Sparkles, ThumbsUp, ThumbsDown, Minus, ChevronDown, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { mockReviews, mockPlatformStats, type Review } from '@/lib/mock-data'

const tabs = ['全部评价', '待回复', '差评预警', '趋势分析', '邀评设置']
const platformFilters = ['全部', '美团', '大众点评', '抖音', '高德', '京东外卖', '淘宝闪购']
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

// 生成评分趋势数据
const ratingTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i))
  return { date: `${d.getMonth() + 1}/${d.getDate()}`, rating: +(4.3 + Math.random() * 0.5).toFixed(1), reviews: Math.floor(Math.random() * 8) + 2 }
})

const sentimentData = [
  { name: '好评', value: mockReviews.filter(r => r.sentiment === 'positive').length, color: '#10b981' },
  { name: '中评', value: mockReviews.filter(r => r.sentiment === 'neutral').length, color: '#f59e0b' },
  { name: '差评', value: mockReviews.filter(r => r.sentiment === 'negative').length, color: '#ef4444' },
]

const keywordData = [
  { keyword: '味道好', count: 32 }, { keyword: '正宗', count: 28 }, { keyword: '推荐', count: 25 },
  { keyword: '好喝', count: 22 }, { keyword: '实惠', count: 18 }, { keyword: '环境好', count: 15 },
  { keyword: '等位久', count: 8 }, { keyword: '上菜慢', count: 6 }, { keyword: '太咸', count: 4 },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

function ReviewCard({ review, onReply }: { review: Review; onReply: (id: string, text: string) => void }) {
  const [showAI, setShowAI] = useState(false)
  const [replyText, setReplyText] = useState('')

  const sentimentIcon = review.sentiment === 'positive' ? <ThumbsUp className="w-4 h-4 text-green-500" /> : review.sentiment === 'negative' ? <ThumbsDown className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-yellow-500" />

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-700">
            {review.userName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{review.userName}</span>
              {sentimentIcon}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">{review.platform}</span>
              <StarRating rating={review.rating} />
              <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </div>
        {!review.replied && (
          <span className="text-xs px-2 py-1 bg-red-50 text-red-500 rounded-full">待回复</span>
        )}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>

      {review.replied && review.replyContent && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600 font-medium mb-1">商家回复</p>
          <p className="text-sm text-blue-800">{review.replyContent}</p>
        </div>
      )}

      {!review.replied && (
        <div className="mt-3 space-y-2">
          {review.aiSuggestion && (
            <button onClick={() => { setShowAI(!showAI); setReplyText(review.aiSuggestion || '') }} className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700">
              <Sparkles className="w-3.5 h-3.5" />
              AI推荐回复
            </button>
          )}
          {showAI && (
            <div className="space-y-2">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAI(false)} className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg">取消</button>
                <button onClick={() => onReply(review.id, replyText)} className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1">
                  <Send className="w-3 h-3" />发送回复
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [platform, setPlatform] = useState('全部')
  const [search, setSearch] = useState('')
  const [reviews, setReviews] = useState(mockReviews)

  const filtered = reviews.filter(r => {
    if (activeTab === 1 && r.replied) return false
    if (activeTab === 2 && r.sentiment !== 'negative') return false
    if (platform !== '全部' && r.platform !== platform) return false
    if (search && !r.content.includes(search) && !r.userName.includes(search)) return false
    return true
  })

  const handleReply = (id: string, text: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, replied: true, replyContent: text } : r))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">评价Agent</h1>
        <p className="text-gray-500 mt-1">全平台评价聚合管理 · AI智能回复</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockPlatformStats.slice(0, 4).map(p => (
          <div key={p.platform} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">{p.platform}评分</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">{p.rating}</span>
              <span className={`text-sm flex items-center ${p.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {p.trend >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                {p.trend >= 0 ? '+' : ''}{p.trend}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{p.reviews}条评价</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab}
            {i === 1 && <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">{reviews.filter(r => !r.replied).length}</span>}
            {i === 2 && <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">{reviews.filter(r => r.sentiment === 'negative').length}</span>}
          </button>
        ))}
      </div>

      {activeTab <= 2 ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索评价内容或用户..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            </div>
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {platformFilters.map(p => (
                <button key={p} onClick={() => setPlatform(p)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${platform === p ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-50'}`}>{p}</button>
              ))}
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">暂无匹配的评价</div>
            ) : (
              filtered.map(r => <ReviewCard key={r.id} review={r} onReply={handleReply} />)
            )}
          </div>
        </>
      ) : activeTab === 3 ? (
        /* 趋势分析 */
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">评分走势（近30天）</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ratingTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis domain={[3.5, 5]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">好差评分布</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {sentimentData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">高频关键词</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={keywordData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="keyword" tick={{ fontSize: 12 }} width={60} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* 邀评设置 */
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-semibold text-gray-900">主动邀评设置</h3>
          {[
            { label: '消费后自动发送评价邀请', desc: '顾客消费2小时后通过微信/短信推送评价链接', enabled: true },
            { label: '会员积分奖励', desc: '写评价送50积分，带图评价送100积分', enabled: true },
            { label: '好评返现', desc: '5星好评自动返现3元到顾客账户', enabled: false },
            { label: '差评预警通知', desc: '收到3星及以下评价时立即推送通知给店长', enabled: true },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition ${item.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${item.enabled ? 'translate-x-5' : ''}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
