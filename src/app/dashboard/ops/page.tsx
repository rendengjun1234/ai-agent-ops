'use client'
import { useState } from 'react'
import { Brain, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, ArrowRight, Zap, Target, Star, MessageSquare, Eye, ShoppingCart, Users, Flame, ChevronRight, Send, FileText, Sparkles, ThumbsDown, DollarSign, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { useStore } from '@/lib/store-context'

const tabs = ['AI诊断', '待办中心', '日报/周报']

// AI运营健康度雷达图
const healthData = [
  { dimension: '流量', score: 72, fullMark: 100 },
  { dimension: '转化', score: 85, fullMark: 100 },
  { dimension: '评价', score: 68, fullMark: 100 },
  { dimension: '复购', score: 56, fullMark: 100 },
  { dimension: '利润', score: 78, fullMark: 100 },
  { dimension: '效率', score: 63, fullMark: 100 },
]

// AI诊断结果
const diagnosisItems = [
  {
    id: 1, level: 'critical' as const, category: '评价管理',
    title: '差评响应超时：3条差评超过24小时未回复',
    detail: '美团2条、大众点评1条差评未回复，平均等待时间32小时。行业标准为4小时内回复。',
    impact: '评分可能下降0.1分，预计影响周营收约¥2,000',
    action: '立即回复差评',
    actionLink: '/dashboard/review',
    agent: '评价Agent',
  },
  {
    id: 2, level: 'warning' as const, category: '流量获客',
    title: '美团推广通余额不足，预计明天耗尽',
    detail: '当前余额¥128，日均消耗¥95。推广停投后预计日订单下降15-20单。',
    impact: '日营收预计减少¥800-1,200',
    action: '充值推广通',
    actionLink: '/dashboard/traffic',
    agent: '获客Agent',
  },
  {
    id: 3, level: 'warning' as const, category: '销售转化',
    title: '抖音限定套餐库存偏低，本周可能售罄',
    detail: '当前剩余82份，日均销量35份，预计2.3天后售罄。该套餐贡献日营收的18%。',
    impact: '售罄后日营收预计下降¥1,400',
    action: '补充库存或替换套餐',
    actionLink: '/dashboard/sales',
    agent: '销售Agent',
  },
  {
    id: 4, level: 'info' as const, category: '内容运营',
    title: '本周种草内容发布量低于目标',
    detail: '目标30篇，实际发布18篇，完成率60%。小红书发布节奏偏慢。',
    impact: '曝光量环比可能下降20%',
    action: '加速内容生成',
    actionLink: '/dashboard/marketing',
    agent: '营销Agent',
  },
  {
    id: 5, level: 'info' as const, category: '客户服务',
    title: '午高峰等餐时间超标准',
    detail: '近3天午高峰（11:30-13:00）平均等餐时间35分钟，超过30分钟标准。',
    impact: '可能导致差评增加和回头客流失',
    action: '优化出餐流程',
    actionLink: '/dashboard/service',
    agent: '客服Agent',
  },
  {
    id: 6, level: 'good' as const, category: '数据表现',
    title: '菌菇藕汤好评率达98%，成为新爆品',
    detail: '上市2周，累计销量420份，好评率98%，复购率34%。',
    impact: '建议加大推广力度，有望成为第二招牌菜',
    action: '增加推广预算',
    actionLink: '/dashboard/analytics',
    agent: '数据Agent',
  },
]

// 待办事项
const todoItems = [
  { id: 1, title: '回复美团差评（王先生：菜品等太久）', agent: '评价Agent', priority: 'urgent' as const, time: '32小时前', status: 'overdue' as const },
  { id: 2, title: '回复美团差评（李女士：藕汤不够热）', agent: '评价Agent', priority: 'urgent' as const, time: '28小时前', status: 'overdue' as const },
  { id: 3, title: '回复点评差评（匿名：服务态度差）', agent: '评价Agent', priority: 'urgent' as const, time: '26小时前', status: 'overdue' as const },
  { id: 4, title: '充值美团推广通（余额¥128）', agent: '获客Agent', priority: 'high' as const, time: '今天', status: 'pending' as const },
  { id: 5, title: '补充抖音限定套餐库存', agent: '销售Agent', priority: 'high' as const, time: '今天', status: 'pending' as const },
  { id: 6, title: '审核AI生成的12条种草内容', agent: '营销Agent', priority: 'medium' as const, time: '今天', status: 'pending' as const },
  { id: 7, title: '确认本周周报内容', agent: '运营Agent', priority: 'medium' as const, time: '周一', status: 'pending' as const },
  { id: 8, title: '查看光谷店开业筹备进度', agent: '巡检Agent', priority: 'low' as const, time: '本周', status: 'pending' as const },
]

// 日报
const reportConfig = {
  daily: { enabled: true, time: '20:00', groups: ['老板群', '纺大店店长群', '运营管理群'] },
  weekly: { enabled: true, day: '周一', time: '09:00', groups: ['老板群', '运营管理群'] },
}

const reportHistory = [
  { id: 1, type: 'daily' as const, date: '2026-03-09', groups: 3, time: '20:00' },
  { id: 2, type: 'daily' as const, date: '2026-03-08', groups: 3, time: '20:00' },
  { id: 3, type: 'weekly' as const, date: '2026-03-08', groups: 2, time: '09:00' },
  { id: 4, type: 'daily' as const, date: '2026-03-07', groups: 3, time: '20:00' },
]

const levelConfig = {
  critical: { label: '🔴 紧急', bg: 'bg-red-50 border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-600' },
  warning: { label: '🟡 注意', bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-600' },
  info: { label: '🔵 关注', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-600' },
  good: { label: '🟢 亮点', bg: 'bg-green-50 border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-600' },
}

const priorityConfig = {
  urgent: { label: '紧急', color: 'bg-red-500 text-white' },
  high: { label: '重要', color: 'bg-orange-100 text-orange-600' },
  medium: { label: '一般', color: 'bg-blue-100 text-blue-600' },
  low: { label: '低优', color: 'bg-gray-100 text-gray-500' },
}

function DailyReportPreview() {
  const { currentStore } = useStore()
  const today = new Date()
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-[#95EC69] rounded-2xl rounded-tr-sm p-4 text-sm leading-relaxed text-gray-900 shadow-sm">
        <p className="font-bold mb-2">📊 【{currentStore.shortName || currentStore.name}】{dateStr}经营日报</p>
        <p className="mb-1">━━━━━━━━━━━━</p>
        <p>💰 今日营收：¥6,850（<span className="text-green-800">↑12%</span> vs昨日）</p>
        <p>📦 订单量：137单（<span className="text-green-800">↑8%</span>）</p>
        <p>⭐ 新增评价：8条（好评7 · 差评1）</p>
        <p>📈 综合评分：4.6（持平）</p>
        <p className="mt-2 font-bold">⚠️ 需关注：</p>
        <p>• 3条差评超时未回复</p>
        <p>• 推广余额仅¥128</p>
        <p>• 午高峰等餐超标准</p>
        <p className="mt-2">🔥 爆款TOP3：排骨藕汤42份 · 一人食38份 · 抖音套餐35份</p>
        <p className="mt-1">━━━━━━━━━━━━</p>
        <p className="text-xs text-gray-600">🤖 由智店AI · 运营Agent自动生成</p>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">↑ 微信群中收到的日报效果</p>
    </div>
  )
}

export default function OpsPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily')
  const { currentStore } = useStore()

  const overallScore = Math.round(healthData.reduce((s, d) => s + d.score, 0) / healthData.length)
  const criticalCount = diagnosisItems.filter(d => d.level === 'critical').length
  const warningCount = diagnosisItems.filter(d => d.level === 'warning').length
  const overdueCount = todoItems.filter(t => t.status === 'overdue').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary-600" />
            运营Agent
          </h1>
          <p className="text-gray-500 mt-1">AI店长 · 全局诊断 · 主动运营</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl font-bold text-lg ${overallScore >= 80 ? 'bg-green-50 text-green-600' : overallScore >= 60 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
            {overallScore}分
          </div>
        </div>
      </div>

      {/* Alert bar */}
      {(criticalCount > 0 || overdueCount > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">
              {criticalCount > 0 && `${criticalCount}项紧急问题`}
              {criticalCount > 0 && overdueCount > 0 && '、'}
              {overdueCount > 0 && `${overdueCount}项待办超时`}
              ，需要立即处理
            </p>
          </div>
          <button onClick={() => setActiveTab(1)} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">
            去处理
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-1.5 ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab}
            {i === 1 && overdueCount > 0 && (
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${activeTab === i ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>{overdueCount}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        /* AI诊断 */
        <div className="space-y-4">
          {/* 健康度 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm col-span-1">
              <h3 className="font-semibold text-gray-900 mb-1">运营健康度</h3>
              <p className="text-xs text-gray-500 mb-4">AI综合评估门店运营6大维度</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={healthData}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <span className={`text-3xl font-bold ${overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{overallScore}</span>
                <span className="text-sm text-gray-500">/100</span>
                <p className="text-xs text-gray-400 mt-1">
                  {overallScore >= 80 ? '运营状态良好 👍' : overallScore >= 60 ? '有提升空间，关注以下问题' : '需紧急干预 ⚠️'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />AI诊断报告
                <span className="text-xs text-gray-400 font-normal ml-auto">更新于 5分钟前</span>
              </h3>
              {diagnosisItems.map(item => {
                const config = levelConfig[item.level]
                return (
                  <div key={item.id} className={`rounded-xl p-4 border ${config.bg}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${config.badge}`}>{config.label}</span>
                          <span className="text-xs text-gray-400">{item.category}</span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-400">{item.agent}</span>
                        </div>
                        <h4 className={`text-sm font-medium ${config.text}`}>{item.title}</h4>
                      </div>
                      <a href={item.actionLink} className="shrink-0 px-3 py-1.5 bg-white text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 flex items-center gap-1 shadow-sm">
                        {item.action} <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{item.detail}</p>
                    <p className="text-xs text-gray-500 italic">💡 影响预估：{item.impact}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        /* 待办中心 */
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '超时待办', value: overdueCount, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
              { label: '今日待办', value: todoItems.filter(t => t.time === '今天').length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
              { label: '本周待办', value: todoItems.length, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-5 border border-gray-100 shadow-sm ${s.bg}`}>
                <s.icon className={`w-6 h-6 mb-2 ${s.color}`} />
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">全部待办</h3>
              <p className="text-xs text-gray-500">来自各个Agent的待处理事项，按紧急程度排序</p>
            </div>
            <div className="divide-y divide-gray-50">
              {todoItems.map(item => {
                const pConfig = priorityConfig[item.priority]
                return (
                  <div key={item.id} className={`flex items-center justify-between p-5 hover:bg-gray-50 ${item.status === 'overdue' ? 'bg-red-50/50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${item.status === 'overdue' ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{item.agent}</span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className={`text-xs ${item.status === 'overdue' ? 'text-red-500 font-medium' : 'text-gray-400'}`}>{item.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${pConfig.color}`}>{pConfig.label}</span>
                      <button className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700">处理</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        /* 日报/周报 */
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setReportType('daily')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${reportType === 'daily' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-600 border border-gray-200'}`}>
              📋 经营日报
            </button>
            <button onClick={() => setReportType('weekly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${reportType === 'weekly' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-600 border border-gray-200'}`}>
              📊 经营周报
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              {/* 推送配置 */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{reportType === 'daily' ? '日报推送' : '周报推送'}</h3>
                  <div className="w-11 h-6 rounded-full bg-primary-600 p-0.5 cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full shadow translate-x-5" />
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">推送时间</span>
                    <span className="font-medium">{reportType === 'daily' ? `每天 ${reportConfig.daily.time}` : `${reportConfig.weekly.day} ${reportConfig.weekly.time}`}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">推送群组</span>
                    <div className="mt-2 space-y-1.5">
                      {(reportType === 'daily' ? reportConfig.daily.groups : reportConfig.weekly.groups).map(g => (
                        <div key={g} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                          <span className="text-sm">💬 {g}</span>
                          <span className="text-xs text-green-600">已连接</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 bg-white border border-gray-200 text-sm rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1.5">
                    <Eye className="w-4 h-4" />预览
                  </button>
                  <button className="flex-1 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 flex items-center justify-center gap-1.5">
                    <Send className="w-4 h-4" />立即发送
                  </button>
                </div>
              </div>

              {/* 历史 */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">发送历史</h3>
                {reportHistory.filter(r => r.type === reportType).map(r => (
                  <div key={r.id} className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-900">{r.date}</span>
                      <span className="text-xs text-gray-400">{r.groups}个群 · {r.time}</span>
                    </div>
                    <button className="text-xs text-primary-600">查看</button>
                  </div>
                ))}
              </div>
            </div>

            {/* 预览 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">报告预览</h3>
              <div className="bg-[#EDEDED] rounded-xl p-4">
                <DailyReportPreview />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
