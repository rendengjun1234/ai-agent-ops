'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, RotateCcw, AlertTriangle, CheckCircle, Info, Sparkles, Star, Clock, Percent, Lightbulb, Download, ArrowRight } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { mockDailyData } from '@/lib/mock-data'
import { menuItems, comboPackages, platformAnalytics, hourlyData, aiDiagnostics, commissionSummary } from '@/lib/analytics-data'

const tabs = ['经营概览', '套餐分析', '分平台数据', '佣金分析', 'AI诊断']
const COLORS = ['#FF6B00', '#FF4F00', '#000000', '#2B7FFF', '#E42313', '#FF5000']
const diagIcons = { warning: AlertTriangle, success: CheckCircle, info: Info, opportunity: Lightbulb }
const diagColors = { warning: 'text-yellow-600 bg-yellow-50 border-yellow-200', success: 'text-green-600 bg-green-50 border-green-200', info: 'text-blue-500 bg-blue-50 border-blue-200', opportunity: 'text-purple-600 bg-purple-50 border-purple-200' }

const totalRevenue = platformAnalytics.reduce((s, p) => s + p.revenue, 0)
const totalOrders = platformAnalytics.reduce((s, p) => s + p.orders, 0)

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据Agent</h1>
          <p className="text-gray-500 mt-1">经营数据看板 · 套餐分析 · 分平台数据 · AI智能诊断</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
          <Download className="w-4 h-4" />导出报告
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-x-auto">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '本月营业额', value: `¥${(totalRevenue / 10000).toFixed(1)}万`, change: '+12.3%', up: true, icon: DollarSign },
              { label: '本月订单数', value: totalOrders.toLocaleString(), change: '+8.7%', up: true, icon: ShoppingBag },
              { label: '客单价', value: `¥${(totalRevenue / totalOrders).toFixed(1)}`, change: '+3.2%', up: true, icon: Users },
              { label: '复购率', value: '34.2%', change: '-2.1%', up: false, icon: RotateCcw },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{k.label}</span>
                  <k.icon className="w-5 h-5 text-gray-300" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{k.value}</div>
                <span className={`text-sm ${k.up ? 'text-green-600' : 'text-red-500'} flex items-center gap-0.5 mt-1`}>
                  {k.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}{k.change}
                  <span className="text-gray-400 ml-1">vs上月</span>
                </span>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">营业额趋势（近30天）</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={mockDailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [`¥${v}`, '营业额']} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">时段分析（日均）</h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="orders" fill="#2563eb" name="订单量" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="avgWait" stroke="#ef4444" strokeWidth={2} dot={false} name="等待(分钟)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 热销菜品TOP */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">热销菜品TOP 8</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {menuItems.sort((a, b) => b.monthSales - a.monthSales).map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i < 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      <span className="text-sm font-bold text-gray-900">¥{item.price}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-gray-400">{item.category} · 月销{item.monthSales}份</span>
                      <span className={`text-xs ${item.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {item.trend >= 0 ? '↑' : '↓'}{Math.abs(item.trend)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 1 && (
        /* 套餐分析 */
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '套餐总销量', value: comboPackages.reduce((s, c) => s + c.monthSales, 0).toLocaleString() },
              { label: '套餐收入', value: `¥${(comboPackages.reduce((s, c) => s + c.monthSales * c.price, 0) / 10000).toFixed(1)}万` },
              { label: '套餐占比', value: `${Math.round(comboPackages.reduce((s, c) => s + c.monthSales, 0) / totalOrders * 100)}%` },
              { label: '平均转化率', value: `${(comboPackages.reduce((s, c) => s + c.conversionRate, 0) / comboPackages.length).toFixed(1)}%` },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-500">{s.label}</span>
                <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
              </div>
            ))}
          </div>

          {/* 套餐详情卡片 */}
          <div className="space-y-4">
            {comboPackages.sort((a, b) => b.monthSales - a.monthSales).map((combo, i) => (
              <div key={combo.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</span>
                      <h3 className="font-semibold text-gray-900 text-lg">{combo.name}</h3>
                      {combo.trend > 20 && <span className="text-xs px-2 py-0.5 bg-red-50 text-red-500 rounded-full">🔥 爆款</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{combo.items.join(' + ')}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 line-through">¥{combo.originalPrice}</span>
                      <span className="text-xl font-bold text-red-500">¥{combo.price}</span>
                    </div>
                    <span className="text-xs text-green-600">{Math.round((1 - combo.price / combo.originalPrice) * 100)}% OFF</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{combo.monthSales}</p>
                    <p className="text-xs text-gray-500">月销量</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">¥{(combo.monthSales * combo.price / 10000).toFixed(1)}万</p>
                    <p className="text-xs text-gray-500">月收入</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className={`text-lg font-bold ${combo.trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {combo.trend > 0 ? '+' : ''}{combo.trend}%
                    </p>
                    <p className="text-xs text-gray-500">环比增长</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-primary-600">{combo.conversionRate}%</p>
                    <p className="text-xs text-gray-500">转化率</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <p className="text-lg font-bold text-gray-900">{combo.avgRating}</p>
                    </div>
                    <p className="text-xs text-gray-500">评分</p>
                  </div>
                </div>

                {/* 分平台销量 */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">分平台销量</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(combo.platforms).map(([plat, count]) => (
                      <div key={plat} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-600">{plat}</span>
                        <span className="text-xs font-bold text-gray-900">{count}</span>
                        <span className="text-xs text-gray-400">({Math.round(count / combo.monthSales * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                  {/* 平台占比条 */}
                  <div className="flex h-2 rounded-full overflow-hidden mt-2">
                    {Object.entries(combo.platforms).map(([plat, count], j) => (
                      <div key={plat} style={{ width: `${count / combo.monthSales * 100}%`, backgroundColor: COLORS[j] }} title={`${plat}: ${count}份`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        /* 分平台数据 */
        <div className="space-y-4">
          {/* 平台概览 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">各平台营收占比</h3>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={platformAnalytics.map(p => ({ name: p.platform, value: p.revenue }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {platformAnalytics.map((p, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => `¥${(v / 10000).toFixed(1)}万`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 各平台详情卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {platformAnalytics.map((p, i) => (
              <div key={p.platform} className={`bg-white rounded-xl border-2 shadow-sm transition cursor-pointer ${selectedPlatform === p.platform ? 'border-primary-400' : 'border-gray-100 hover:border-gray-200'}`}
                onClick={() => setSelectedPlatform(selectedPlatform === p.platform ? null : p.platform)}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <h3 className="font-semibold text-gray-900">{p.platform}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-900">{p.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">¥{(p.revenue / 10000).toFixed(1)}万</p>
                      <p className="text-xs text-gray-500">月营收</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{p.orders.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">月订单</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">¥{p.avgPrice}</p>
                      <p className="text-xs text-gray-500">客单价</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.newCustomers}</p>
                      <p className="text-xs text-gray-500">新客</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.returnRate}%</p>
                      <p className="text-xs text-gray-500">复购率</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.commission}%</p>
                      <p className="text-xs text-gray-500">佣金率</p>
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-xs text-gray-500">热卖：</span>
                    {p.topItems.map(item => (
                      <span key={item} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{item}</span>
                    ))}
                  </div>
                </div>

                {/* 展开的趋势图 */}
                {selectedPlatform === p.platform && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500 mb-2">近30天营收趋势</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <AreaChart data={p.dailyData}>
                        <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.1} strokeWidth={2} name="营收" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 平台对比表 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm overflow-x-auto">
            <h3 className="font-semibold text-gray-900 mb-4">平台数据对比</h3>
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-gray-500 font-medium">平台</th>
                  <th className="text-right py-3 text-gray-500 font-medium">月营收</th>
                  <th className="text-right py-3 text-gray-500 font-medium">月订单</th>
                  <th className="text-right py-3 text-gray-500 font-medium">客单价</th>
                  <th className="text-right py-3 text-gray-500 font-medium">新客</th>
                  <th className="text-right py-3 text-gray-500 font-medium">复购率</th>
                  <th className="text-right py-3 text-gray-500 font-medium">评分</th>
                  <th className="text-right py-3 text-gray-500 font-medium">佣金率</th>
                  <th className="text-right py-3 text-gray-500 font-medium">佣金额</th>
                </tr>
              </thead>
              <tbody>
                {platformAnalytics.map((p, i) => (
                  <tr key={p.platform} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                      <span className="font-medium text-gray-900">{p.platform}</span>
                    </td>
                    <td className="py-3 text-right font-medium">¥{(p.revenue / 10000).toFixed(1)}万</td>
                    <td className="py-3 text-right text-gray-700">{p.orders.toLocaleString()}</td>
                    <td className="py-3 text-right text-gray-700">¥{p.avgPrice}</td>
                    <td className="py-3 text-right text-gray-700">{p.newCustomers}</td>
                    <td className="py-3 text-right text-gray-700">{p.returnRate}%</td>
                    <td className="py-3 text-right font-medium">{p.rating}</td>
                    <td className="py-3 text-right text-gray-700">{p.commission}%</td>
                    <td className="py-3 text-right text-red-500">¥{p.commissionAmount.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="py-3 text-gray-900">合计</td>
                  <td className="py-3 text-right">¥{(totalRevenue / 10000).toFixed(1)}万</td>
                  <td className="py-3 text-right">{totalOrders.toLocaleString()}</td>
                  <td className="py-3 text-right">¥{(totalRevenue / totalOrders).toFixed(1)}</td>
                  <td className="py-3 text-right">{platformAnalytics.reduce((s, p) => s + p.newCustomers, 0)}</td>
                  <td className="py-3 text-right">—</td>
                  <td className="py-3 text-right">—</td>
                  <td className="py-3 text-right">{commissionSummary.avgCommissionRate}%</td>
                  <td className="py-3 text-right text-red-500">¥{commissionSummary.totalCommission.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        /* 佣金分析 */
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '月总营收', value: `¥${(totalRevenue / 10000).toFixed(1)}万`, color: 'text-gray-900' },
              { label: '月佣金支出', value: `¥${(commissionSummary.totalCommission / 10000).toFixed(1)}万`, color: 'text-red-500' },
              { label: '平均佣金率', value: `${commissionSummary.avgCommissionRate}%`, color: 'text-yellow-600' },
              { label: '实际到手', value: `¥${((totalRevenue - commissionSummary.totalCommission) / 10000).toFixed(1)}万`, color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-500">{s.label}</span>
                <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 佣金占比饼图 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">各平台佣金支出</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={commissionSummary.byPlatform.filter(p => p.amount > 0)} dataKey="amount" nameKey="platform" cx="50%" cy="50%" outerRadius={80} innerRadius={45}
                    label={({ platform, percent }: any) => `${platform} ${(percent * 100).toFixed(0)}%`}>
                    {commissionSummary.byPlatform.map((p, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => `¥${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 佣金vs营收对比 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">各平台佣金率对比</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={platformAnalytics} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 20]} />
                  <YAxis type="category" dataKey="platform" tick={{ fontSize: 12 }} width={70} />
                  <Tooltip formatter={(v: any) => `${v}%`} />
                  <Bar dataKey="commission" fill="#ef4444" name="佣金率%" radius={[0, 4, 4, 0]}>
                    {platformAnalytics.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 佣金明细 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">佣金明细</h3>
            <div className="space-y-3">
              {platformAnalytics.filter(p => p.commissionAmount > 0).sort((a, b) => b.commissionAmount - a.commissionAmount).map((p, i) => (
                <div key={p.platform} className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[platformAnalytics.indexOf(p)] }} />
                  <span className="text-sm text-gray-700 w-20">{p.platform}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">营收 ¥{p.revenue.toLocaleString()} × {p.commission}%</span>
                      <span className="font-medium text-red-500">= ¥{p.commissionAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-red-400 rounded-full h-2" style={{ width: `${p.commissionAmount / commissionSummary.totalCommission * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI建议 */}
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">AI省钱建议</span>
              </div>
              <div className="space-y-2 text-sm text-purple-800">
                <p>💰 美团佣金占总佣金的<strong>66%</strong>（¥14,850/月），是最大成本。建议将10%美团订单引导至小程序（零佣金），预计月省¥1,485。</p>
                <p>📱 自建微信小程序已有月营收¥3,400（零佣金），通过扫码引流+会员折扣，目标提升至¥20,000/月，减少平台依赖。</p>
                <p>🎯 抖音佣金率仅5%但新客获取能力最强（520新客），建议加大抖音投放，性价比最优。</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 4 && (
        /* AI诊断 */
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI经营诊断报告
            </h3>
            <p className="text-sm text-gray-500 mb-4">基于近30天经营数据自动生成，每日更新</p>

            <div className="space-y-4">
              {aiDiagnostics.map((d, i) => {
                const Icon = diagIcons[d.type]
                const colors = diagColors[d.type]
                return (
                  <div key={i} className={`p-4 rounded-lg border ${colors}`}>
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{d.title}</h4>
                          <span className="text-xs opacity-60">{d.date}</span>
                        </div>
                        <p className="text-sm mt-1 opacity-90">{d.desc}</p>
                        <div className="mt-2 flex items-center gap-1 text-xs font-medium">
                          <ArrowRight className="w-3 h-3" />
                          {d.impact}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
