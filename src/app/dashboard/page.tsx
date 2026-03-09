'use client'
import { BarChart3, MessageSquare, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Star, ShoppingBag, DollarSign, Users, Building2, Store as StoreIcon, Brain, Sparkles, ChevronRight, Clock, Target, Eye, Heart, Zap, Send, MapPin, Award, ThumbsDown } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line } from 'recharts'
import { mockDashboardStats, mockDailyData, mockPlatformStats } from '@/lib/mock-data'
import { useStore, allStores, getStoreMultiplier } from '@/lib/store-context'
import { useState } from 'react'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

// ===== 单店数据 =====
const healthData = [
  { dimension: '流量', score: 72, fullMark: 100 },
  { dimension: '转化', score: 85, fullMark: 100 },
  { dimension: '评价', score: 68, fullMark: 100 },
  { dimension: '复购', score: 56, fullMark: 100 },
  { dimension: '利润', score: 78, fullMark: 100 },
  { dimension: '效率', score: 63, fullMark: 100 },
]
const diagnosisItems = [
  { id: 1, level: 'critical' as const, title: '3条差评超24小时未回复', impact: '评分可能下降0.1，影响周营收¥2,000', action: '立即回复', link: '/dashboard/review', agent: '评价Agent' },
  { id: 2, level: 'warning' as const, title: '美团推广通余额¥128，预计明天耗尽', impact: '日订单预计减少15-20单', action: '充值推广', link: '/dashboard/traffic', agent: '获客Agent' },
  { id: 3, level: 'warning' as const, title: '抖音限定套餐库存偏低，预计2天售罄', impact: '日营收预计减少¥1,400', action: '补充库存', link: '/dashboard/sales', agent: '销售Agent' },
  { id: 4, level: 'info' as const, title: '种草内容发布18/30篇，完成率60%', impact: '曝光量环比可能下降20%', action: '加速生成', link: '/dashboard/marketing', agent: '营销Agent' },
  { id: 5, level: 'good' as const, title: '菌菇藕汤好评率98%，成为新爆品', impact: '建议加大推广，有望成为第二招牌菜', action: '查看详情', link: '/dashboard/analytics', agent: '数据Agent' },
]
const todoItems = [
  { id: 1, title: '回复美团差评（等太久）', agent: '评价Agent', priority: 'urgent' as const, time: '32小时前', overdue: true },
  { id: 2, title: '回复点评差评（服务差）', agent: '评价Agent', priority: 'urgent' as const, time: '26小时前', overdue: true },
  { id: 3, title: '充值美团推广通', agent: '获客Agent', priority: 'high' as const, time: '今天', overdue: false },
  { id: 4, title: '审核12条种草内容', agent: '营销Agent', priority: 'medium' as const, time: '今天', overdue: false },
  { id: 5, title: '补充抖音套餐库存', agent: '销售Agent', priority: 'high' as const, time: '今天', overdue: false },
]

// ===== 连锁品牌数据 =====
const chainHealthData = [
  { dimension: '品牌口碑', score: 75, fullMark: 100 },
  { dimension: '出品一致', score: 62, fullMark: 100 },
  { dimension: '服务标准', score: 70, fullMark: 100 },
  { dimension: '营收增长', score: 82, fullMark: 100 },
  { dimension: '客户复购', score: 68, fullMark: 100 },
  { dimension: '运营效率', score: 71, fullMark: 100 },
]

// 门店多维对比
const storeMetrics = [
  { name: '纺大店', revenue: 18.5, orders: 3860, avgPrice: 48, rating: 4.6, negRate: 8.3, replyTime: 4.2, repeatRate: 34, score: 82 },
  { name: '光谷店', revenue: 14.2, orders: 2950, avgPrice: 48, rating: 4.3, negRate: 11.2, replyTime: 6.8, repeatRate: 28, score: 68 },
  { name: '汉口店', revenue: 15.8, orders: 3200, avgPrice: 49, rating: 4.5, negRate: 7.1, replyTime: 3.5, repeatRate: 32, score: 78 },
  { name: '武昌站店', revenue: 12.1, orders: 2480, avgPrice: 49, rating: 4.4, negRate: 9.0, replyTime: 5.1, repeatRate: 30, score: 72 },
]

// 门店评分趋势
const storeScoreTrends = [
  { week: 'W1', 纺大店: 4.5, 光谷店: 4.2, 汉口店: 4.3, 武昌站店: 4.3 },
  { week: 'W2', 纺大店: 4.6, 光谷店: 4.1, 汉口店: 4.4, 武昌站店: 4.4 },
  { week: 'W3', 纺大店: 4.5, 光谷店: 4.3, 汉口店: 4.4, 武昌站店: 4.3 },
  { week: 'W4', 纺大店: 4.6, 光谷店: 4.3, 汉口店: 4.5, 武昌站店: 4.4 },
]

// 品牌共性问题
const chainIssues = [
  { id: 1, level: 'critical' as const, title: '出餐速度问题蔓延至3家门店', detail: '纺大店、光谷店、武昌站店均出现晚高峰出餐超时，非个别门店问题，需品牌级流程优化', stores: ['纺大店', '光谷店', '武昌站店'], action: '统一优化出餐SOP' },
  { id: 2, level: 'warning' as const, title: '光谷店出品与旗舰店差距扩大', detail: '光谷店"口味不稳定"差评率11.2%，高于品牌均值8.9%。顾客反馈"和纺大店比差了"', stores: ['光谷店'], action: '总厨巡店+出品标准化' },
  { id: 3, level: 'warning' as const, title: '"服务态度"差评全品牌上升', detail: '4家门店"服务冷淡"标签均上升，可能是春季人员流动导致新员工占比过高', stores: ['全部门店'], action: '统一培训+神秘顾客' },
  { id: 4, level: 'good' as const, title: '汉口店可作为服务标杆', detail: '汉口店差评率最低(7.1%)、响应最快(3.5h)、复购率32%，经验可复制', stores: ['汉口店'], action: '提炼经验推广' },
  { id: 5, level: 'info' as const, title: '品牌好评关键词一致性高', detail: '"藕粉糯""汤奶白""性价比高"为全品牌TOP3好评词，品牌心智统一', stores: ['全部门店'], action: '用于统一营销素材' },
]

// 各店营收趋势
const chainRevenueTrend = [
  { month: '10月', 纺大店: 16.2, 光谷店: 12.5, 汉口店: 13.8, 武昌站店: 10.5 },
  { month: '11月', 纺大店: 17.1, 光谷店: 13.0, 汉口店: 14.5, 武昌站店: 11.2 },
  { month: '12月', 纺大店: 18.8, 光谷店: 14.8, 汉口店: 15.2, 武昌站店: 12.8 },
  { month: '1月', 纺大店: 17.5, 光谷店: 13.2, 汉口店: 14.8, 武昌站店: 11.5 },
  { month: '2月', 纺大店: 18.0, 光谷店: 13.8, 汉口店: 15.5, 武昌站店: 11.8 },
  { month: '3月', 纺大店: 18.5, 光谷店: 14.2, 汉口店: 15.8, 武昌站店: 12.1 },
]

const levelConfig = {
  critical: { label: '🔴 紧急', bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-600' },
  warning: { label: '🟡 注意', bg: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-600' },
  info: { label: '🔵 关注', bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-600' },
  good: { label: '🟢 亮点', bg: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-600' },
}
const priorityColors = { urgent: 'bg-red-500 text-white', high: 'bg-orange-100 text-orange-600', medium: 'bg-blue-100 text-blue-600', low: 'bg-gray-100 text-gray-500' }

export default function DashboardPage() {
  const { currentStore, isChainView } = useStore()
  const mult = getStoreMultiplier(currentStore.id)
  const activeStores = allStores.filter(s => s.status === 'active')

  const revenue = isChainView ? activeStores.reduce((s, st) => s + st.monthlyRevenue, 0) : currentStore.monthlyRevenue
  const orders = isChainView ? activeStores.reduce((s, st) => s + st.monthlyOrders, 0) : currentStore.monthlyOrders
  const hData = isChainView ? chainHealthData : healthData
  const overallScore = Math.round(hData.reduce((s, d) => s + d.score, 0) / hData.length)
  const overdueCount = todoItems.filter(t => t.overdue).length

  // ===== 连锁品牌视图 =====
  if (isChainView) {
    const totalRevenue = activeStores.reduce((s, st) => s + st.monthlyRevenue, 0)
    const totalOrders = activeStores.reduce((s, st) => s + st.monthlyOrders, 0)
    const avgRating = +(activeStores.reduce((s, st) => s + st.rating, 0) / activeStores.length).toFixed(1)
    const avgNegRate = +(storeMetrics.reduce((s, m) => s + m.negRate, 0) / storeMetrics.length).toFixed(1)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Building2 className="w-7 h-7 text-primary-600" />品牌运营总览</h1>
            <p className="text-gray-500 mt-1">湖北藕汤 · {activeStores.length}家门店营业中 · 1家筹备中</p>
          </div>
          <div className={`px-5 py-3 rounded-xl text-center ${overallScore >= 80 ? 'bg-green-50' : overallScore >= 60 ? 'bg-yellow-50' : 'bg-red-50'}`}>
            <div className={`text-3xl font-bold ${overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{overallScore}</div>
            <p className="text-xs text-gray-500">品牌健康度</p>
          </div>
        </div>

        {/* 品牌KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: '品牌总营收', value: `¥${(totalRevenue / 10000).toFixed(1)}万`, change: '+12.3%', up: true, icon: DollarSign },
            { label: '总订单量', value: totalOrders.toLocaleString(), change: '+8.7%', up: true, icon: ShoppingBag },
            { label: '品牌均分', value: avgRating.toString(), change: '+0.1', up: true, icon: Star },
            { label: '品牌差评率', value: `${avgNegRate}%`, change: '-1.2%', up: true, icon: ThumbsDown },
            { label: '门店数', value: `${activeStores.length}/${allStores.length}`, change: '1家筹备', up: true, icon: MapPin },
            { label: '品牌问题', value: chainIssues.filter(i => i.level === 'critical').length.toString(), change: '需品牌级处理', up: false, icon: AlertTriangle },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500">{s.label}</span><s.icon className="w-4 h-4 text-gray-300" /></div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <p className={`text-xs mt-1 ${s.up ? 'text-green-500' : 'text-red-500'}`}>{s.change}</p>
            </div>
          ))}
        </div>

        {/* 品牌健康度 + 各店评分趋势 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">品牌健康度</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={chainHealthData}>
                <PolarGrid strokeDasharray="3 3" /><PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-xs text-center text-gray-500">最强：营收增长(82) · 最弱：出品一致(62)</p>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">各门店评分趋势（近4周）</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={storeScoreTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="week" tick={{ fontSize: 11 }} /><YAxis domain={[3.8, 4.8]} tick={{ fontSize: 11 }} /><Tooltip />
                <Line type="monotone" dataKey="纺大店" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="光谷店" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="汉口店" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="武昌站店" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 门店多维PK排行 */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-yellow-500" />门店多维度PK</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-gray-500 font-medium">门店</th>
                  <th className="text-right py-3 text-gray-500 font-medium">月营收(万)</th>
                  <th className="text-right py-3 text-gray-500 font-medium">月订单</th>
                  <th className="text-right py-3 text-gray-500 font-medium">客单价</th>
                  <th className="text-right py-3 text-gray-500 font-medium">评分</th>
                  <th className="text-right py-3 text-gray-500 font-medium">差评率</th>
                  <th className="text-right py-3 text-gray-500 font-medium">响应(h)</th>
                  <th className="text-right py-3 text-gray-500 font-medium">复购率</th>
                  <th className="text-right py-3 text-gray-500 font-medium">综合分</th>
                </tr>
              </thead>
              <tbody>
                {storeMetrics.sort((a, b) => b.score - a.score).map((s, i) => (
                  <tr key={s.name} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-600' : i === storeMetrics.length - 1 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                      <span className="font-medium text-gray-900">{s.name}</span>
                    </td>
                    <td className="py-3 text-right font-medium">¥{s.revenue}</td>
                    <td className="py-3 text-right">{s.orders.toLocaleString()}</td>
                    <td className="py-3 text-right">¥{s.avgPrice}</td>
                    <td className="py-3 text-right"><span className="flex items-center justify-end gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{s.rating}</span></td>
                    <td className={`py-3 text-right ${s.negRate > 10 ? 'text-red-600 font-medium' : ''}`}>{s.negRate}%</td>
                    <td className={`py-3 text-right ${s.replyTime > 5 ? 'text-red-600' : 'text-green-600'}`}>{s.replyTime}h</td>
                    <td className="py-3 text-right">{s.repeatRate}%</td>
                    <td className="py-3 text-right"><span className={`text-sm font-bold ${s.score >= 80 ? 'text-green-600' : s.score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>{s.score}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 各店营收趋势 */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">各门店营收趋势（近6月，万元）</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chainRevenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Bar dataKey="纺大店" fill="#2563eb" radius={[2, 2, 0, 0]} />
              <Bar dataKey="光谷店" fill="#ef4444" radius={[2, 2, 0, 0]} />
              <Bar dataKey="汉口店" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="武昌站店" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 品牌AI诊断 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" />品牌级AI诊断</h3>
          {chainIssues.map(item => {
            const cfg = levelConfig[item.level]
            return (
              <div key={item.id} className={`rounded-xl p-4 border ${cfg.bg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                      <span className="text-xs text-gray-400">{item.stores.join('、')}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{item.detail}</p>
                  </div>
                  <button className="shrink-0 ml-3 px-3 py-1.5 bg-white text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 shadow-sm">
                    {item.action}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ===== 单店视图 =====
  const criticalCount = diagnosisItems.filter(d => d.level === 'critical').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Brain className="w-7 h-7 text-primary-600" />运营工作台</h1>
          <p className="text-gray-500 mt-1">{currentStore.name} · AI店长为你值守</p>
        </div>
        <div className={`px-5 py-3 rounded-xl text-center ${overallScore >= 80 ? 'bg-green-50' : overallScore >= 60 ? 'bg-yellow-50' : 'bg-red-50'}`}>
          <div className={`text-3xl font-bold ${overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{overallScore}</div>
          <p className="text-xs text-gray-500">健康度</p>
        </div>
      </div>

      {(criticalCount > 0 || overdueCount > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm font-medium text-red-700 flex-1">{criticalCount > 0 && `${criticalCount}项紧急问题`}{criticalCount > 0 && overdueCount > 0 && '、'}{overdueCount > 0 && `${overdueCount}项待办超时`}</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '本月营收', value: `¥${(revenue / 10000).toFixed(1)}万`, change: '+12.3%', up: true, icon: DollarSign, color: 'bg-blue-50 text-blue-600' },
          { label: '本月订单', value: orders.toLocaleString(), change: '+8.7%', up: true, icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
          { label: '综合评分', value: currentStore.rating.toString(), change: '+0.1', up: true, icon: Star, color: 'bg-yellow-50 text-yellow-600' },
          { label: '待处理', value: todoItems.length.toString(), change: `${overdueCount}项超时`, up: false, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3"><span className="text-sm text-gray-500">{card.label}</span><div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}><card.icon className="w-5 h-5" /></div></div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className={`flex items-center gap-1 mt-1 text-sm ${card.up ? 'text-green-600' : 'text-red-500'}`}>{card.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}<span>{card.change}</span></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" />AI诊断<span className="text-xs text-gray-400 font-normal ml-auto">5分钟前</span></h3>
          {diagnosisItems.map(item => {
            const cfg = levelConfig[item.level]
            return (
              <div key={item.id} className={`rounded-xl p-4 border ${cfg.bg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"><span className={`text-xs px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span><span className="text-xs text-gray-400">{item.agent}</span></div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">💡 {item.impact}</p>
                  </div>
                  <a href={item.link} className="shrink-0 ml-3 px-3 py-1.5 bg-white text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 flex items-center gap-1 shadow-sm">{item.action} <ChevronRight className="w-3.5 h-3.5" /></a>
                </div>
              </div>
            )
          })}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">运营健康度</h3>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={healthData}><PolarGrid strokeDasharray="3 3" /><PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} /><Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} /></RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">待办{overdueCount > 0 && <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{overdueCount}</span>}</h3>
            <div className="space-y-2">
              {todoItems.map(item => (
                <div key={item.id} className={`flex items-center gap-2 p-2.5 rounded-lg ${item.overdue ? 'bg-red-50' : 'bg-gray-50'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.overdue ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0"><p className="text-xs font-medium text-gray-900 truncate">{item.title}</p><p className="text-[10px] text-gray-400">{item.agent} · {item.time}</p></div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${priorityColors[item.priority]}`}>{item.priority === 'urgent' ? '紧急' : item.priority === 'high' ? '重要' : '一般'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">营业额趋势（近30天）</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mockDailyData.map(d => ({ ...d, revenue: Math.round(d.revenue * mult.revenue) }))}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip formatter={(v: any) => [`¥${v}`, '营业额']} /><Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} /></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">各平台评价</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={mockPlatformStats.map(p => ({ name: p.platform, value: p.reviews }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>{mockPlatformStats.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">{mockPlatformStats.map((p, i) => (<div key={p.platform} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} /><span className="text-gray-600">{p.platform}</span></div><span className="font-medium">★ {p.rating}</span></div>))}</div>
        </div>
      </div>
    </div>
  )
}
