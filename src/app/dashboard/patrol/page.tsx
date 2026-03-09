'use client'
import { AlertTriangle, CheckCircle, Info, Radar, Wifi, Database } from 'lucide-react'
import { mockAlerts } from '@/lib/mock-data'

const typeConfig = {
  error: { icon: AlertTriangle, color: 'text-red-500 bg-red-50', border: 'border-red-200' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500 bg-yellow-50', border: 'border-yellow-200' },
  info: { icon: CheckCircle, color: 'text-green-500 bg-green-50', border: 'border-green-200' },
}

export default function PatrolPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">巡检Agent</h1>
        <p className="text-gray-500 mt-1">7×24系统健康监控 · 异常告警</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '系统状态', value: '正常', icon: Radar, color: 'text-green-600' },
          { label: 'API连接', value: '6/6', icon: Wifi, color: 'text-green-600' },
          { label: '今日告警', value: '2', icon: AlertTriangle, color: 'text-yellow-500' },
          { label: '数据同步', value: '实时', icon: Database, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">告警列表</h3>
        <div className="space-y-3">
          {mockAlerts.map(a => {
            const cfg = typeConfig[a.type]
            const Icon = cfg.icon
            return (
              <div key={a.id} className={`flex gap-3 p-4 rounded-lg border ${cfg.border} bg-white`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{a.title}</p>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{a.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">平台连接状态</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {['美团', '大众点评', '抖音', '高德', '京东外卖', '淘宝闪购'].map(p => (
            <div key={p} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-700">{p}</span>
              <span className="text-xs text-green-600 ml-auto">已连接</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
