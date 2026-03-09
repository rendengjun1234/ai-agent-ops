'use client'
import { Phone, Mail, Clock, DollarSign } from 'lucide-react'
import { mockLeads } from '@/lib/mock-data'

const statusColors: Record<string, string> = { '跟进中': 'bg-blue-50 text-blue-600', '待联系': 'bg-yellow-50 text-yellow-600', '已成交': 'bg-green-50 text-green-600' }

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">销售Agent</h1>
        <p className="text-gray-500 mt-1">线索管理 · 智能跟进</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '总线索', value: '128', icon: Phone },
          { label: '待跟进', value: '23', icon: Clock },
          { label: '本月成交', value: '8', icon: DollarSign },
          { label: '成交金额', value: '¥36万', icon: DollarSign },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <span className="text-sm text-gray-500">{s.label}</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">线索列表</h3>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left py-3 px-5 text-gray-500 font-medium">联系人</th>
            <th className="text-left py-3 px-5 text-gray-500 font-medium">来源</th>
            <th className="text-left py-3 px-5 text-gray-500 font-medium">状态</th>
            <th className="text-right py-3 px-5 text-gray-500 font-medium">金额</th>
            <th className="text-right py-3 px-5 text-gray-500 font-medium">最近联系</th>
          </tr></thead>
          <tbody>
            {mockLeads.map(l => (
              <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-5">
                  <p className="font-medium text-gray-900">{l.name}</p>
                  <p className="text-xs text-gray-400">{l.company}</p>
                </td>
                <td className="py-3 px-5 text-gray-600">{l.source}</td>
                <td className="py-3 px-5"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[l.status]}`}>{l.status}</span></td>
                <td className="py-3 px-5 text-right font-medium">¥{(l.amount / 10000).toFixed(1)}万</td>
                <td className="py-3 px-5 text-right text-gray-400">{l.lastContact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
