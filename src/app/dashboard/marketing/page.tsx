'use client'
import { useState } from 'react'
import { Smartphone, QrCode } from 'lucide-react'
import dynamic from 'next/dynamic'

const OfficialOps = dynamic(() => import('./official-ops-tab'), { ssr: false })
const GrassPlanting = dynamic(() => import('./grass-planting-tab'), { ssr: false })

const modules = [
  { key: 'official', label: '官号运营', icon: Smartphone, desc: '账号矩阵 · 内容管理 · 营销日历' },
  { key: 'grass', label: '种草码', icon: QrCode, desc: '种草计划 · 素材库 · 数据看板' },
]

export default function MarketingPage() {
  const [activeModule, setActiveModule] = useState('official')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">内容营销</h1>
        <p className="text-gray-500 mt-1">官号运营与种草推广一站式管理</p>
      </div>

      {/* 模块切换 */}
      <div className="flex gap-3">
        {modules.map(m => (
          <button key={m.key} onClick={() => setActiveModule(m.key)}
            className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition ${activeModule === m.key ? 'border-primary-500 bg-primary-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeModule === m.key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <m.icon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className={`text-sm font-semibold ${activeModule === m.key ? 'text-primary-700' : 'text-gray-900'}`}>{m.label}</p>
              <p className="text-xs text-gray-500">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {activeModule === 'official' && <OfficialOps />}
      {activeModule === 'grass' && <GrassPlanting />}
    </div>
  )
}
