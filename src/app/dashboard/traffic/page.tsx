'use client'
import { TrendingUp, Eye, MousePointerClick, ShoppingCart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { mockTrafficData } from '@/lib/mock-data'

export default function TrafficPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">获客Agent</h1>
        <p className="text-gray-500 mt-1">全渠道流量获取与优化</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '本月曝光量', value: '37,600', icon: Eye },
          { label: '访客数', value: '12,500', icon: MousePointerClick },
          { label: '转化订单', value: '4,366', icon: ShoppingCart },
          { label: '平均转化率', value: '11.6%', icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{s.label}</span>
              <s.icon className="w-5 h-5 text-gray-300" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">各渠道流量对比</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockTrafficData.channels}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="visitors" fill="#2563eb" name="访客" radius={[4, 4, 0, 0]} />
            <Bar dataKey="orders" fill="#10b981" name="订单" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">渠道明细</h3>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left py-3 text-gray-500 font-medium">渠道</th>
            <th className="text-right py-3 text-gray-500 font-medium">访客</th>
            <th className="text-right py-3 text-gray-500 font-medium">订单</th>
            <th className="text-right py-3 text-gray-500 font-medium">转化率</th>
          </tr></thead>
          <tbody>
            {mockTrafficData.channels.map(c => (
              <tr key={c.name} className="border-b border-gray-50">
                <td className="py-3 text-gray-900">{c.name}</td>
                <td className="py-3 text-right text-gray-700">{c.visitors.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-700">{c.orders.toLocaleString()}</td>
                <td className="py-3 text-right font-medium text-primary-600">{c.rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
