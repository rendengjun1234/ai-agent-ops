'use client'
import { Zap, Gift, TrendingUp } from 'lucide-react'
import { mockCampaigns } from '@/lib/mock-data'

const statusMap: Record<string, { label: string; color: string }> = {
  active: { label: '进行中', color: 'bg-green-50 text-green-600' },
  paused: { label: '已暂停', color: 'bg-yellow-50 text-yellow-600' },
  ended: { label: '已结束', color: 'bg-gray-100 text-gray-500' },
}

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">营销Agent</h1>
          <p className="text-gray-500 mt-1">优惠券管理 · 活动投放</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">创建活动</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: '进行中活动', value: '2', icon: Zap },
          { label: '本月发券', value: '779', icon: Gift },
          { label: '核销率', value: '42.3%', icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <span className="text-sm text-gray-500">{s.label}</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {mockCampaigns.map(c => {
          const s = statusMap[c.status]
          return (
            <div key={c.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                </div>
                <span className="text-xs text-gray-400">{c.platform}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div><p className="text-lg font-bold text-gray-900">{c.used}</p><p className="text-xs text-gray-500">已使用</p></div>
                <div><p className="text-lg font-bold text-gray-900">¥{c.spent}</p><p className="text-xs text-gray-500">已花费</p></div>
                <div><p className="text-lg font-bold text-gray-900">¥{c.budget}</p><p className="text-xs text-gray-500">总预算</p></div>
                <div><p className="text-lg font-bold text-primary-600">{Math.round(c.spent / c.budget * 100)}%</p><p className="text-xs text-gray-500">消耗率</p></div>
              </div>
              <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                <div className="bg-primary-600 rounded-full h-2 transition-all" style={{ width: `${Math.round(c.spent / c.budget * 100)}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
