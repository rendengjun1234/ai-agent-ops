'use client'
import { MessageCircle, Bot, Clock } from 'lucide-react'
import { mockConversations } from '@/lib/mock-data'

export default function ServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">客服Agent</h1>
        <p className="text-gray-500 mt-1">智能客服 · 自动回复</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '今日会话', value: '34' },
          { label: 'AI自动回复', value: '28' },
          { label: '人工接入', value: '6' },
          { label: '平均响应', value: '12秒' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <span className="text-sm text-gray-500">{s.label}</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100"><h3 className="font-semibold text-gray-900">最近会话</h3></div>
        <div className="divide-y divide-gray-50">
          {mockConversations.map(c => (
            <div key={c.id} className="flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">{c.customer[0]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{c.customer}</span>
                    <span className="text-xs text-gray-400">{c.platform}</span>
                    {c.autoReplied && <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-600 rounded flex items-center gap-0.5"><Bot className="w-3 h-3" />AI回复</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{c.lastMsg}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{c.time}</p>
                {c.unread > 0 && <span className="inline-block mt-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full leading-5 text-center">{c.unread}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">自动回复设置</h3>
        {[
          { label: '营业时间自动回复', desc: '自动回答常见问题：营业时间、地址、预约等', enabled: true },
          { label: '非营业时间回复', desc: '非营业时间自动告知营业时间并引导留言', enabled: true },
          { label: '排队等位通知', desc: '自动发送排队进度和预计等待时间', enabled: false },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition ${item.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${item.enabled ? 'translate-x-5' : ''}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
