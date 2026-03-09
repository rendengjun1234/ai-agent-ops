'use client'
import { BarChart3, MessageSquare, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Star, ShoppingBag, DollarSign, Users, Building2, Store as StoreIcon, Brain, Sparkles, ChevronRight, Clock, Target, Eye, Heart, Zap, Send } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { mockDashboardStats, mockDailyData, mockPlatformStats } from '@/lib/mock-data'
import { useStore, allStores, getStoreMultiplier } from '@/lib/store-context'
import { useState } from 'react'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

// AI运营健康度
const healthData = [
  { dimension: '流量', score: 72, fullMark: 100 },
  { dimension: '转化', score: 85, fullMark: 100 },
  { dimension: '评价', score: 68, fullMark: 100 },
  { dimension: '复购', score: 56, fullMark: 100 },
  { dimension: '利润', score: 78, fullMark: 100 },
  { dimension: '效率', score: 63, fullMark: 100 },
]

// AI诊断
const diagnosisItems = [
  { id: 1, level: 'critical' as const, title: '3条差评超24小时未回复', impact: '评分可能下降0.1，影响周营收¥2,000', action: '立即回复', link: '/dashboard/review', agent: '评价Agent' },
  { id: 2, level: 'warning' as const, title: '美团推广通余额¥128，预计明天耗尽', impact: '日订单预计减少15-20单', action: '充值推广', link: '/dashboard/traffic', agent: '获客Agent' },
  { id: 3, level: 'warning' as const, title: '抖音限定套餐库存偏低，预计2天售罄', impact: '日营收预计减少¥1,400', action: '补充库存', link: '/dashboard/sales', agent: '销售Agent' },
  { id: 4, level: 'info' as const, title: '种草内容发布18/30篇，完成率60%', impact: '曝光量环比可能下降20%', action: '加速生成', link: '/dashboard/marketing', agent: '营销Agent' },
  { id: 5, level: 'good' as const, title: '菌菇藕汤好评率98%，成为新爆品', impact: '建议加大推广，有望成为第二招牌菜', action: '查看详情', link: '/dashboard/analytics', agent: '数据Agent' },
]

// 待办
const todoItems = [
  { id: 1, title: '回复美团差评（等太久）', agent: '评价Agent', priority: 'urgent' as const, time: '32小时前', overdue: true },
  { id: 2, title: '回复点评差评（服务差）', agent: '评价Agent', priority: 'urgent' as const, time: '26小时前', overdue: true },
  { id: 3, title: '充值美团推广通', agent: '获客Agent', priority: 'high' as const, time: '今天', overdue: false },
  { id: 4, title: '审核12条种草内容', agent: '营销Agent', priority: 'medium' as const, time: '今天', overdue: false },
  { id: 5, title: '补充抖音套餐库存', agent: '销售Agent', priority: 'high' as const, time: '今天', overdue: false },
]

const levelConfig = {
  critical: { label: '🔴 紧急', bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-600' },
  warning: { label: '🟡 注意', bg: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-600' },
  info: { label: '🔵 关注', bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-600' },
  good: { label: '🟢 亮点', bg: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-600' },
}

const priorityColors = {
  urgent: 'bg-red-500 text-white',
  high: 'bg-orange-100 text-orange-600',
  medium: 'bg-blue-100 text-blue-600',
  low: 'bg-gray-100 text-gray-500',
}

export default function DashboardPage() {
  const { currentStore, isChainView } = useStore()
  const mult = getStoreMultiplier(currentStore.id)

  const revenue = isChainView
    ? allStores.filter(s => s.status === 'active').reduce((s, st) => s + st.monthlyRevenue, 0)
    : currentStore.monthlyRevenue
  const orders = isChainView
    ? allStores.filter(s => s.status === 'active').reduce((s, st) => s + st.monthlyOrders, 0)
    : currentStore.monthlyOrders

  const overallScore = Math.round(healthData.reduce((s, d) => s + d.score, 0) / healthData.length)
  const criticalCount = diagnosisItems.filter(d => d.level === 'critical').length
  const overdueCount = todoItems.filter(t => t.overdue).length
  const activeStores = allStores.filter(s => s.status === 'active')

  return (
    <div className="space-y-6">
      {/* Header with score */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary-600" />
            {isChainView ? '连锁总览' : '运营工作台'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isChainView ? `${activeStores.length}家门店营业中 · AI全局监控` : `${currentStore.name} · AI店长为你值守`}
          </p>
        </div>
        <div className={`px-5 py-3 rounded-xl text-center ${overallScore >= 80 ? 'bg-green-50' : overallScore >= 60 ? 'bg-yellow-50' : 'bg-red-50'}`}>
          <div className={`text-3xl font-bold ${overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{overallScore}</div>
          <p className="text-xs text-gray-500">健康度</p>
        </div>
      </div>

      {/* Alert bar */}
      {(criticalCount > 0 || overdueCount > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm font-medium text-red-700 flex-1">
            {criticalCount > 0 && `${criticalCount}项紧急问题`}
            {criticalCount > 0 && overdueCount > 0 && '、'}
            {overdueCount > 0 && `${overdueCount}项待办超时`}
          </p>
        </div>
      )}

      {/* Chain overview banner */}
      {isChainView && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-5 text-white">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {activeStores.map(store => (
              <div key={store.id} className="bg-white/10 rounded-lg p-3">
                <p className="text-sm font-medium text-white/90">{store.shortName}</p>
                <p className="text-lg font-bold">¥{(store.monthlyRevenue / 10000).toFixed(1)}万</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  <span className="text-sm text-white/80">{store.rating}</span>
                </div>
              </div>
            ))}
            <div className="bg-white/10 rounded-lg p-3 border border-dashed border-white/30 flex items-center justify-center">
              <div className="text-center"><p className="text-sm text-white/60">徐东店</p><p className="text-xs text-white/40">筹备中</p></div>
            </div>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '本月营收', value: `¥${(revenue / 10000).toFixed(1)}万`, change: '+12.3%', up: true, icon: DollarSign, color: 'bg-blue-50 text-blue-600' },
          { label: '本月订单', value: orders.toLocaleString(), change: '+8.7%', up: true, icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
          { label: '综合评分', value: isChainView ? '4.5' : currentStore.rating.toString(), change: '+0.1', up: true, icon: Star, color: 'bg-yellow-50 text-yellow-600' },
          { label: '待处理', value: todoItems.length.toString(), change: `${overdueCount}项超时`, up: false, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className={`flex items-center gap-1 mt-1 text-sm ${card.up ? 'text-green-600' : 'text-red-500'}`}>
              {card.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI诊断 + 待办 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI诊断 */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />AI诊断
            <span className="text-xs text-gray-400 font-normal ml-auto">5分钟前更新</span>
          </h3>
          {diagnosisItems.map(item => {
            const cfg = levelConfig[item.level]
            return (
              <div key={item.id} className={`rounded-xl p-4 border ${cfg.bg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                      <span className="text-xs text-gray-400">{item.agent}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">💡 {item.impact}</p>
                  </div>
                  <a href={item.link} className="shrink-0 ml-3 px-3 py-1.5 bg-white text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 flex items-center gap-1 shadow-sm">
                    {item.action} <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* 待办 + 健康度 */}
        <div className="space-y-4">
          {/* 健康度雷达 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">运营健康度</h3>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={healthData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 待办列表 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              待办事项
              {overdueCount > 0 && <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{overdueCount}</span>}
            </h3>
            <div className="space-y-2">
              {todoItems.map(item => (
                <div key={item.id} className={`flex items-center gap-2 p-2.5 rounded-lg ${item.overdue ? 'bg-red-50' : 'bg-gray-50'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.overdue ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-[10px] text-gray-400">{item.agent} · {item.time}</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${priorityColors[item.priority]}`}>
                    {item.priority === 'urgent' ? '紧急' : item.priority === 'high' ? '重要' : '一般'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">
            {isChainView ? '各门店营业额对比' : '营业额趋势（近30天）'}
          </h3>
          {isChainView ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activeStores.map(s => ({ name: s.shortName, revenue: s.monthlyRevenue }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => `¥${(v / 10000).toFixed(1)}万`} />
                <Bar dataKey="revenue" fill="#2563eb" name="营业额" radius={[4, 4, 0, 0]}>
                  {activeStores.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={mockDailyData.map(d => ({ ...d, revenue: Math.round(d.revenue * mult.revenue) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => [`¥${v}`, '营业额']} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">{isChainView ? '营收占比' : '各平台评价'}</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={isChainView ? activeStores.map(s => ({ name: s.shortName, value: s.monthlyRevenue })) : mockPlatformStats.map(p => ({ name: p.platform, value: p.reviews }))}
                dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {(isChainView ? activeStores : mockPlatformStats).map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {(isChainView ? activeStores.map(s => ({ name: s.shortName, value: `¥${(s.monthlyRevenue / 10000).toFixed(1)}万` })) : mockPlatformStats.map(p => ({ name: p.platform, value: `★ ${p.rating}` }))).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chain: store leaderboard */}
      {isChainView && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">门店排行榜</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-gray-500 font-medium">排名</th>
                <th className="text-left py-3 text-gray-500 font-medium">门店</th>
                <th className="text-right py-3 text-gray-500 font-medium">月营业额</th>
                <th className="text-right py-3 text-gray-500 font-medium">月订单</th>
                <th className="text-right py-3 text-gray-500 font-medium">评分</th>
                <th className="text-right py-3 text-gray-500 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {[...allStores].sort((a, b) => b.monthlyRevenue - a.monthlyRevenue).map((store, i) => (
                <tr key={store.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span></td>
                  <td className="py-3"><p className="font-medium text-gray-900">{store.name}</p><p className="text-xs text-gray-400">{store.manager}</p></td>
                  <td className="py-3 text-right font-medium">{store.monthlyRevenue > 0 ? `¥${(store.monthlyRevenue / 10000).toFixed(1)}万` : '—'}</td>
                  <td className="py-3 text-right text-gray-700">{store.monthlyOrders > 0 ? store.monthlyOrders.toLocaleString() : '—'}</td>
                  <td className="py-3 text-right">{store.rating > 0 ? <span className="flex items-center justify-end gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{store.rating}</span> : '—'}</td>
                  <td className="py-3 text-right"><span className={`text-xs px-2 py-0.5 rounded-full ${store.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{store.status === 'active' ? '营业中' : '筹备中'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
