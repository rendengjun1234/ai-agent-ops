'use client'
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react'
import { mockAppeals } from '@/lib/mock-data'

const statusMap: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  processing: { label: '处理中', icon: Clock, color: 'text-yellow-500 bg-yellow-50' },
  success: { label: '申诉成功', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  rejected: { label: '已驳回', icon: XCircle, color: 'text-red-500 bg-red-50' },
}

export default function AppealPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">申诉Agent</h1>
          <p className="text-gray-500 mt-1">差评申诉 · 自动化处理</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">新建申诉</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '总申诉', value: mockAppeals.length },
          { label: '成功率', value: '33%' },
          { label: '处理中', value: mockAppeals.filter(a => a.status === 'processing').length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {mockAppeals.map(a => {
          const s = statusMap[a.status]
          const Icon = s.icon
          return (
            <div key={a.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">{a.platform}</span>
                  <span className="text-sm font-medium text-gray-900">{a.type}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${s.color}`}>
                  <Icon className="w-3.5 h-3.5" />{s.label}
                </span>
              </div>
              <p className="text-sm text-gray-600">{a.content}</p>
              {a.result && <p className="text-sm mt-2 text-gray-500 bg-gray-50 p-3 rounded-lg">{a.result}</p>}
              <p className="text-xs text-gray-400 mt-2">提交于 {a.submitDate}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
