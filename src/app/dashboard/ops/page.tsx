'use client'
import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react'
import { mockTasks } from '@/lib/mock-data'

const priorityColors = { high: 'bg-red-50 text-red-600', medium: 'bg-yellow-50 text-yellow-600', low: 'bg-gray-100 text-gray-500' }
const priorityLabels = { high: '紧急', medium: '普通', low: '低优' }
const statusLabels: Record<string, string> = { pending: '待处理', in_progress: '进行中', done: '已完成' }

export default function OpsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">运营Agent</h1>
          <p className="text-gray-500 mt-1">任务看板 · SOP管理</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">新建任务</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '待处理', value: mockTasks.filter(t => t.status === 'pending').length, icon: Clock, color: 'text-yellow-500' },
          { label: '进行中', value: mockTasks.filter(t => t.status === 'in_progress').length, icon: ListTodo, color: 'text-blue-500' },
          { label: '已完成', value: mockTasks.filter(t => t.status === 'done').length, icon: CheckCircle, color: 'text-green-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
            <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100"><h3 className="font-semibold text-gray-900">任务列表</h3></div>
        <div className="divide-y divide-gray-50">
          {mockTasks.map(t => (
            <div key={t.id} className="flex items-center justify-between p-5 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${t.status === 'done' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {t.status === 'done' ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Clock className="w-3.5 h-3.5 text-gray-400" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${t.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{t.title}</p>
                  <p className="text-xs text-gray-400">{t.agent} · {t.dueTime}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[t.priority]}`}>{priorityLabels[t.priority]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
