'use client'
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, RotateCcw, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { mockDailyData, mockDiagnostics } from '@/lib/mock-data'

const kpis = [
  { label: '本月营业额', value: '¥18.65万', change: '+12.3%', up: true, icon: DollarSign },
  { label: '本月订单数', value: '3,720', change: '+8.7%', up: true, icon: ShoppingBag },
  { label: '客单价', value: '¥50.1', change: '+3.2%', up: true, icon: Users },
  { label: '复购率', value: '34.2%', change: '-2.1%', up: false, icon: RotateCcw },
]

const diagIcons = { warning: AlertTriangle, success: CheckCircle, info: Info }
const diagColors = { warning: 'text-yellow-500 bg-yellow-50', success: 'text-green-500 bg-green-50', info: 'text-blue-500 bg-blue-50' }

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">数据Agent</h1>
        <p className="text-gray-500 mt-1">经营数据看板 · AI智能诊断</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{k.label}</span>
              <k.icon className="w-5 h-5 text-gray-300" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <span className={`text-sm ${k.up ? 'text-green-600' : 'text-red-500'} flex items-center gap-0.5 mt-1`}>
              {k.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}{k.change} <span className="text-gray-400 ml-1">vs上月</span>
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">营业额趋势</h3>
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
          <h3 className="font-semibold text-gray-900 mb-4">订单量 vs 客单价</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mockDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar yAxisId="left" dataKey="orders" fill="#2563eb" radius={[2, 2, 0, 0]} name="订单量" />
              <Line yAxisId="right" type="monotone" dataKey="avgPrice" stroke="#f59e0b" strokeWidth={2} name="客单价" dot={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">新客 vs 回头客（近30天）</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mockDailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="newCustomers" fill="#2563eb" name="新客" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Diagnostics */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">🤖 AI 诊断报告</h3>
        <div className="space-y-3">
          {mockDiagnostics.map((d, i) => {
            const Icon = diagIcons[d.type]
            return (
              <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${diagColors[d.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{d.title}</p>
                    <span className="text-xs text-gray-400">{d.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{d.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
