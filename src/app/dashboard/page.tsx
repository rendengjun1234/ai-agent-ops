'use client'
import { BarChart3, MessageSquare, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Star, ShoppingBag, DollarSign, Users, Building2, Store as StoreIcon } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { mockDashboardStats, mockDailyData, mockPlatformStats, mockTasks } from '@/lib/mock-data'
import { useStore, allStores, getStoreMultiplier } from '@/lib/store-context'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function DashboardPage() {
  const { currentStore, isChainView } = useStore()
  const mult = getStoreMultiplier(currentStore.id)

  const revenue = isChainView
    ? allStores.filter(s => s.status === 'active').reduce((s, st) => s + st.monthlyRevenue, 0)
    : currentStore.monthlyRevenue
  const orders = isChainView
    ? allStores.filter(s => s.status === 'active').reduce((s, st) => s + st.monthlyOrders, 0)
    : currentStore.monthlyOrders

  const statCards = [
    { label: '本月营业额', value: `¥${(revenue / 10000).toFixed(1)}万`, change: '+12.3%', up: true, icon: DollarSign, color: 'blue' },
    { label: '本月订单', value: orders.toLocaleString(), change: '+8.7%', up: true, icon: ShoppingBag, color: 'green' },
    { label: '综合评分', value: isChainView ? '4.5' : currentStore.rating.toString(), change: '+0.1', up: true, icon: Star, color: 'yellow' },
    { label: '待回复评价', value: Math.round(mockDashboardStats.unrepliedCount * mult.reviews).toString(), change: `${Math.round(mockDashboardStats.negativeCount * mult.reviews)}条差评`, up: false, icon: MessageSquare, color: 'red' },
  ]

  const colorMap: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', yellow: 'bg-yellow-50 text-yellow-600', red: 'bg-red-50 text-red-600' }

  // 门店对比数据
  const activeStores = allStores.filter(s => s.status === 'active')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
        <p className="text-gray-500 mt-1">
          {isChainView ? `连锁总览 · ${activeStores.length}家门店营业中` : `${currentStore.name} · 运营概览`}
        </p>
      </div>

      {/* Chain overview banner */}
      {isChainView && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5" />
            <h2 className="font-semibold text-lg">连锁经营概览</h2>
          </div>
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
              <div className="text-center">
                <p className="text-sm text-white/60">徐东店</p>
                <p className="text-xs text-white/40">筹备中</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">
            {isChainView ? '各门店营业额对比（近30天合计）' : '营业额趋势（近30天）'}
          </h3>
          {isChainView ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={activeStores.map(s => ({ name: s.shortName, revenue: s.monthlyRevenue, orders: s.monthlyOrders }))}>
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
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={mockDailyData.map(d => ({ ...d, revenue: Math.round(d.revenue * mult.revenue) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip formatter={(v: any) => [`¥${v}`, '营业额']} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">
            {isChainView ? '营收占比' : '各平台评价分布'}
          </h3>
          {isChainView ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={activeStores.map(s => ({ name: s.shortName, value: s.monthlyRevenue }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {activeStores.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => `¥${(v / 10000).toFixed(1)}万`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {activeStores.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-gray-600">{s.shortName}</span>
                    </div>
                    <span className="font-medium">¥{(s.monthlyRevenue / 10000).toFixed(1)}万</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={mockPlatformStats} dataKey="reviews" nameKey="platform" cx="50%" cy="50%" outerRadius={70}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
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
            </>
          )}
        </div>
      </div>

      {/* Chain view: store comparison table */}
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
                <th className="text-right py-3 text-gray-500 font-medium">客单价</th>
                <th className="text-right py-3 text-gray-500 font-medium">评分</th>
                <th className="text-right py-3 text-gray-500 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {[...allStores].sort((a, b) => b.monthlyRevenue - a.monthlyRevenue).map((store, i) => (
                <tr key={store.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                  </td>
                  <td className="py-3">
                    <p className="font-medium text-gray-900">{store.name}</p>
                    <p className="text-xs text-gray-400">{store.manager}</p>
                  </td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    {store.monthlyRevenue > 0 ? `¥${(store.monthlyRevenue / 10000).toFixed(1)}万` : '—'}
                  </td>
                  <td className="py-3 text-right text-gray-700">
                    {store.monthlyOrders > 0 ? store.monthlyOrders.toLocaleString() : '—'}
                  </td>
                  <td className="py-3 text-right text-gray-700">
                    {store.avgPrice > 0 ? `¥${store.avgPrice}` : '—'}
                  </td>
                  <td className="py-3 text-right">
                    {store.rating > 0 ? (
                      <span className="flex items-center justify-end gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {store.rating}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-3 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${store.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {store.status === 'active' ? '营业中' : '筹备中'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Agent status + Tasks (single store view) */}
      {!isChainView && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    <span className="text-xs text-gray-400">已处理 {Math.round(agent.processed * mult.orders)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {agent.status === 'active' ? '运行中' : '待机'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
      )}
    </div>
  )
}
