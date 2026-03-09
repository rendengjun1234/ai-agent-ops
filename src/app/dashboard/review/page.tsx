'use client'
import { useState } from 'react'
import { Star, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, ChevronRight, MessageSquare, Eye, Shield, Sparkles, Target, Users, BarChart3, Send, Copy, ThumbsUp, ThumbsDown, Flame, Filter, Search, Image as ImageIcon, Video, ExternalLink, ArrowRight, Zap, FileText, Settings } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell } from 'recharts'
import { reviews, remediationTasks, tagTrends, storeComparison, goodReviewAssets, reviewKPIs, type Review } from '@/lib/review-system-data'
import { useStore } from '@/lib/store-context'

const tabs = ['总览', '评价处理台', '整改任务中心', '经营洞察']
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

// 评分趋势数据
const scoreTrend = [
  { date: '2/3', score: 4.1 }, { date: '2/10', score: 4.05 },
  { date: '2/17', score: 4.15 }, { date: '2/24', score: 4.0 },
  { date: '3/3', score: 3.95 }, { date: '3/9', score: 3.92 },
]
const negTrend = [
  { date: '2/3', count: 12 }, { date: '2/10', count: 8 },
  { date: '2/17', count: 15 }, { date: '2/24', count: 10 },
  { date: '3/3', count: 18 }, { date: '3/9', count: 14 },
]
const sentimentData = [
  { name: '正向', value: 52, fill: '#10b981' },
  { name: '中性', value: 28, fill: '#f59e0b' },
  { name: '负向', value: 20, fill: '#ef4444' },
]
const platformSource = [
  { name: '大众点评', value: 35, fill: '#FF6B00' },
  { name: '美团', value: 28, fill: '#FFAA00' },
  { name: '抖音', value: 18, fill: '#000000' },
  { name: '小红书', value: 12, fill: '#FF2442' },
  { name: '饿了么', value: 7, fill: '#2196F3' },
]
const negTags = [
  { name: '出餐速度', count: 23, trend: '↑5' },
  { name: '服务态度', count: 19, trend: '↑3' },
  { name: '环境卫生', count: 14, trend: '↑8' },
  { name: '外卖包装', count: 12, trend: '↑2' },
  { name: '性价比', count: 10, trend: '↑1' },
  { name: '产品口味', count: 9, trend: '-' },
]
const posTags = [
  { name: '环境氛围', count: 45, trend: '↑3' },
  { name: '服务热情', count: 38, trend: '↑5' },
  { name: '产品好吃', count: 35, trend: '↑2' },
  { name: '性价比高', count: 28, trend: '↑1' },
  { name: '适合聚会', count: 22, trend: '↑4' },
  { name: '出片拍照', count: 18, trend: '↑6' },
]
const riskStores = [
  { rank: 1, name: '纺大店', negRate: '35%', trend: '↑8%' },
  { rank: 2, name: '光谷店', negRate: '28%', trend: '↑5%' },
  { rank: 3, name: '汉口店', negRate: '22%', trend: '↑4%' },
]

// AI建议
const aiAdvice = [
  { level: 'critical' as const, icon: '⚠️', title: '出餐效率持续下降', badge: '紧急', text: '晚高峰出餐慢问题连续3周上升，涉及纺大店和光谷店。建议优化前厅与后厨衔接流程，增加高峰期备菜量。', stores: ['纺大店', '光谷店'] },
  { level: 'critical' as const, icon: '🔥', title: '服务态度差评增长明显', badge: '紧急', text: '纺大店服务态度类差评本周同比增长40%，建议安排服务SOP复训，引入神秘顾客暗访。', stores: ['纺大店'] },
  { level: 'info' as const, icon: '💡', title: '新品评价两极分化', badge: '关注', text: '菌菇藕汤评价出现两极分化，好评集中在分量足，差评集中在口味偏淡。建议优化调味配比。', stores: ['光谷店'] },
  { level: 'good' as const, icon: '✅', title: '汉口店口碑持续上升', badge: '亮点', text: '汉口店连续4周好评率提升，平均评分达4.5。可提炼成功经验推广至其他门店。', stores: ['汉口店'] },
  { level: 'info' as const, icon: '📈', title: '正向口碑资产可利用', badge: '建议', text: '"环境舒服"、"适合拍照"、"服务热情"为本周最高频好评关键词，建议用于官号内容和门店宣传。', stores: [] },
]
const adviceColors = {
  critical: 'border-red-200 bg-red-50',
  info: 'border-blue-200 bg-blue-50',
  good: 'border-green-200 bg-green-50',
}
const badgeColors = {
  '紧急': 'bg-red-500 text-white',
  '关注': 'bg-blue-100 text-blue-600',
  '亮点': 'bg-green-100 text-green-600',
  '建议': 'bg-purple-100 text-purple-600',
}

function ReviewDetailPanel({ review, onClose }: { review: Review; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">评价详情</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{review.platformIcon}</span>
                <span className="text-sm font-medium">{review.author}</span>
                <span className="text-xs text-gray-400">{review.platform} · {review.store}</span>
              </div>
              <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}</div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>
            <div className="flex items-center gap-2 mt-2">
              {review.hasImage && <span className="text-xs text-gray-400 flex items-center gap-1"><ImageIcon className="w-3 h-3" />有图</span>}
              {review.hasVideo && <span className="text-xs text-gray-400 flex items-center gap-1"><Video className="w-3 h-3" />视频</span>}
              <span className="text-xs text-gray-400">{review.timeAgo}</span>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-500" />AI分析</h4>
            <p className="text-sm text-gray-700 mb-3">{review.aiSummary}</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex gap-2"><span className="text-gray-500 w-14">风险</span><span className={`px-2 py-0.5 rounded-full ${riskConfig[review.riskLevel].color}`}>{riskConfig[review.riskLevel].label}</span></div>
              {review.rootCause && <div className="flex gap-2"><span className="text-gray-500 w-14">归因</span><span>{review.rootCause}</span></div>}
              {review.mentionedPeriod && <div className="flex gap-2"><span className="text-gray-500 w-14">时段</span><span>{review.mentionedPeriod}</span></div>}
              {review.mentionedDish && <div className="flex gap-2"><span className="text-gray-500 w-14">菜品</span><span>{review.mentionedDish}</span></div>}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">经营标签</p>
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag, i) => (
                <span key={i} className={`text-xs px-2.5 py-1 rounded-full ${tag.sentiment === 'positive' ? 'bg-green-50 text-green-700' : tag.sentiment === 'negative' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                  {tag.primary}/{tag.secondary} <span className="opacity-50">{'●'.repeat(tag.intensity)}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-green-600" />AI建议回复</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{review.aiReply}</p>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center justify-center gap-1"><Send className="w-4 h-4" />采纳并发送</button>
              <button className="px-3 py-2 bg-white text-sm text-gray-600 rounded-lg border hover:bg-gray-50">编辑</button>
            </div>
          </div>
          {review.rating <= 2 && (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm font-medium mb-2">是否创建整改任务？</p>
              <button className="w-full py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-1"><Target className="w-4 h-4" />创建整改任务</button>
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

  const filteredReviews = reviews.filter(r => filterPlatform === '全部' || r.platform === filterPlatform)
    .sort((a, b) => {
      const p = { P1: 0, P2: 1, P3: 2, P4: 3 }
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (a.status !== 'pending' && b.status === 'pending') return 1
      return p[a.riskLevel] - p[b.riskLevel]
    })

  const healthRadar = [
    { dim: '产品', score: 82 }, { dim: '服务', score: 65 },
    { dim: '环境', score: 72 }, { dim: '出餐', score: 55 },
    { dim: '性价比', score: 88 }, { dim: '复购', score: 70 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">口碑运营总览</h1>
          <p className="text-gray-500 mt-1">全门店口碑健康一览，快速定位问题与机会</p>
        </div>
        {p1Count > 0 && (
          <button onClick={() => setActiveTab(1)} className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="w-4 h-4" />处理高风险评价
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-1.5 ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab}
            {i === 1 && pendingCount > 0 && <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${activeTab === i ? 'bg-white/20' : 'bg-red-500 text-white'}`}>{pendingCount}</span>}
          </button>
        ))}
      </div>

      {/* ===== 总览 ===== */}
      {activeTab === 0 && (
        <div className="space-y-4">
          {/* 6个KPI卡片 - 对标截图 */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: '平均评分', value: '3.92', icon: Star, change: '↘ -0.08 vs上周', down: true },
              { label: '本周新增评价', value: '87', icon: MessageSquare, change: '↗ +12 vs上周', down: false },
              { label: '差评率', value: '18%', icon: TrendingUp, change: '↗ +2 vs上周', down: true },
              { label: '待处理评价', value: '14', icon: Clock, change: '↗ +3 vs上周', down: true },
              { label: '高风险问题', value: '4', icon: AlertTriangle, change: '↗ +1 vs上周', down: true },
              { label: '本周关闭任务', value: '6', icon: CheckCircle, change: '↗ +2 vs上周', down: false },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <s.icon className="w-4 h-4 text-gray-300" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <p className={`text-xs mt-1 ${s.down ? 'text-red-500' : 'text-green-500'}`}>{s.change}</p>
              </div>
            ))}
          </div>

          {/* 评分趋势 + 差评趋势 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">评分趋势</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[3.5, 4.5]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">差评趋势</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={negTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} name="差评数" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 情绪分布 + 平台来源 + 高风险门店 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">情绪分布</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={sentimentData} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                    {sentimentData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {sentimentData.map(s => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
                    <span className="text-gray-600">{s.name}</span>
                    <span className="font-medium">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">平台来源分布</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={platformSource} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                    {platformSource.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {platformSource.map(p => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: p.fill }} /><span className="text-gray-600">{p.name}</span></div>
                    <span className="font-medium">{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">高风险门店</h3>
                <button className="text-xs text-primary-600 hover:text-primary-700">查看全部 →</button>
              </div>
              <div className="space-y-3">
                {riskStores.map(s => (
                  <div key={s.rank} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.rank === 1 ? 'bg-red-100 text-red-600' : s.rank === 2 ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600'}`}>{s.rank}</span>
                    <span className="text-sm font-medium text-gray-900 flex-1">{s.name}</span>
                    <span className="text-sm text-red-600 font-medium">差评率 {s.negRate}</span>
                    <span className="text-xs text-red-500">{s.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 高频差评标签 + 高频好评标签 - 对标截图的横条样式 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">高频差评标签</h3>
              <div className="space-y-3">
                {negTags.map(tag => (
                  <div key={tag.name} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 w-20 shrink-0">{tag.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div className="bg-red-500 rounded-full h-3 transition-all" style={{ width: `${(tag.count / negTags[0].count) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{tag.count}</span>
                    <span className={`text-xs w-6 ${tag.trend.includes('↑') ? 'text-red-500' : 'text-gray-400'}`}>{tag.trend}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">高频好评标签</h3>
              <div className="space-y-3">
                {posTags.map(tag => (
                  <div key={tag.name} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 w-20 shrink-0">{tag.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div className="bg-green-500 rounded-full h-3 transition-all" style={{ width: `${(tag.count / posTags[0].count) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{tag.count}</span>
                    <span className={`text-xs w-6 ${tag.trend.includes('↑') ? 'text-green-500' : 'text-gray-400'}`}>{tag.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI本周经营建议 - 对标截图卡片式 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />AI 本周经营建议
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {aiAdvice.map((item, i) => (
                <div key={i} className={`rounded-xl p-4 border ${adviceColors[item.level]}`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColors[item.badge as keyof typeof badgeColors]}`}>{item.badge}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed ml-7">{item.text}</p>
                  {item.stores.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2 ml-7">涉及：{item.stores.join('、')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== 评价处理台 ===== */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            {['全部', '美团', '大众点评', '抖音', '小红书'].map(p => (
              <button key={p} onClick={() => setFilterPlatform(p)} className={`px-3 py-1.5 text-xs rounded-lg ${filterPlatform === p ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{p}</button>
            ))}
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
                        <span className="text-xs text-gray-400">{review.platformIcon} {review.platform} · {review.store} · {review.timeAgo}</span>
                        <div className="flex gap-0.5 ml-auto">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}</div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{review.content}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {review.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${tag.sentiment === 'negative' ? 'bg-red-50 text-red-600' : tag.sentiment === 'positive' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            {tag.primary}/{tag.secondary}
                          </span>
                        ))}
                        {review.hasImage && <span className="text-xs text-gray-400">📷</span>}
                        {review.hasVideo && <span className="text-xs text-gray-400">🎬</span>}
                      </div>
                      <p className="text-xs text-purple-600 mt-2">🤖 {review.aiSummary}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 mt-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ===== 整改任务中心 ===== */}
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
              const tRisk = riskConfig[task.riskLevel]; const tStatus = taskStatusConfig[task.status]
              return (
                <div key={task.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tRisk.color}`}>{tRisk.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tStatus.color}`}>{tStatus.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>📊 {task.sourceReviewCount}条评价</span><span>📍 {task.stores.join('、')}</span><span>👤 {task.assignee}</span><span>📅 截止 {task.deadline}</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">💡 {task.suggestedAction}</p>
                  </div>
                  {task.period && <p className="text-xs text-gray-500 mt-2">⏰ {task.period}</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ===== 经营洞察 ===== */}
      {activeTab === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">门店口碑雷达</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={healthRadar}>
                  <PolarGrid strokeDasharray="3 3" /><PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-gray-500 mt-2">最强：性价比(88) · 最弱：出餐(55)</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">负面标签趋势（近7天）</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={tagTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
                  <Line type="monotone" dataKey="出餐速度" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="服务态度" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="环境卫生" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* 好评资产化 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-green-600" />好评资产化</h3>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">顾客最常夸的关键词</p>
              <div className="flex flex-wrap gap-2">
                {goodReviewAssets.topKeywords.map(kw => <span key={kw} className="text-xs px-3 py-1.5 bg-white text-green-700 rounded-full border border-green-200 shadow-sm">{kw}</span>)}
              </div>
            </div>
            <div className="space-y-2">
              {goodReviewAssets.suggestedCopy.map(c => (
                <div key={c.use} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded shrink-0">{c.use}</span>
                  <p className="text-xs text-gray-700 flex-1">{c.text}</p>
                  <Copy className="w-3.5 h-3.5 text-gray-400 shrink-0 cursor-pointer hover:text-primary-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedReview && <ReviewDetailPanel review={selectedReview} onClose={() => setSelectedReview(null)} />}
    </div>
  )
}
