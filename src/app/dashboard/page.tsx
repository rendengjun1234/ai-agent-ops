'use client'
import { BarChart3, MessageSquare, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Star, ShoppingBag, DollarSign, Users } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { mockDashboardStats, mockDailyData, mockPlatformStats, mockTasks } from '@/lib/mock-data'

const statCards = [
  { label: '本月营业额', value: `¥${(mockDashboardStats.totalRevenue / 10000).toFixed(1)}万`, change: '+12.3%', up: true, icon: DollarSign, color: 'blue' },
  { label: '本月订单', value: mockDashboardStats.totalOrders.toLocaleString(), change: '+8.7%', up: true, icon: ShoppingBag, color: 'green' },
  { label: '综合评分', value: mockDashboardStats.avgRating.toString(), change: `+${mockDashboardStats.ratingChange}`, up: true, icon: Star, color: 'yellow' },
  { label: '待回复评价', value: mockDashboardStats.unrepliedCount.toString(), change: `${mockDashboardStats.negativeCount}条差评`, up: false, icon: MessageSquare, color: 'red' },
]

const colorMap: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', yellow: 'bg-yellow-50 text-yellow-600', red: 'bg-red-50 text-red-600' }
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
        <p className="text-gray-500 mt-1">湖北藕汤（纺大店）· 运营概览</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[card.color]}`}>
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

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">营业额趋势（近30天）</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip formatter={(v: any) => [`¥${v}`, '营业额']} />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Platform distribution */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">各平台评价分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={mockPlatformStats} dataKey="reviews" nameKey="platform" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {mockPlatformStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {mockPlatformStats.map((p, i) => (
              <div key={p.platform} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-600">{p.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="font-medium">{p.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent status + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Agent status */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Agent 状态</h3>
          <div className="space-y-3">
            {mockDashboardStats.agentStatus.map(agent => (
              <div key={agent.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700">{agent.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">已处理 {agent.processed}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {agent.status === 'active' ? '运行中' : '待机'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">待办任务</h3>
          <div className="space-y-3">
            {mockTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${task.status === 'done' ? 'bg-green-100' : task.priority === 'high' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                  {task.status === 'done' ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <AlertTriangle className={`w-3.5 h-3.5 ${task.priority === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{task.agent} · {task.dueTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
