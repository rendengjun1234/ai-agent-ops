'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  Bot, LayoutDashboard, MessageSquare, BarChart3, Megaphone, Globe,
  TrendingUp, Gift, ClipboardList, Headphones, Shield, Eye, Settings, Store, ChevronDown
} from 'lucide-react'
import { useState } from 'react'
import { mockStores } from '@/lib/mock-data'

const navItems = [
  { href: '/dashboard', label: '总览', icon: LayoutDashboard },
  { label: '获客层', divider: true },
  { href: '/dashboard/traffic', label: '获客Agent', icon: Megaphone },
  { href: '/dashboard/site', label: '建站Agent', icon: Globe },
  { href: '/dashboard/review', label: '评价Agent', icon: MessageSquare },
  { label: '赢单层', divider: true },
  { href: '/dashboard/sales', label: '销售Agent', icon: TrendingUp },
  { href: '/dashboard/marketing', label: '营销Agent', icon: Gift },
  { label: '运营层', divider: true },
  { href: '/dashboard/analytics', label: '数据Agent', icon: BarChart3 },
  { href: '/dashboard/ops', label: '运营Agent', icon: ClipboardList },
  { href: '/dashboard/service', label: '客服Agent', icon: Headphones },
  { label: '保障层', divider: true },
  { href: '/dashboard/appeal', label: '申诉Agent', icon: Shield },
  { href: '/dashboard/patrol', label: '巡检Agent', icon: Eye },
  { label: '', divider: true },
  { href: '/dashboard/stores', label: '门店管理', icon: Store },
  { href: '/dashboard/settings', label: '系统设置', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [storeOpen, setStoreOpen] = useState(false)
  const [currentStore, setCurrentStore] = useState(mockStores[0])

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">智店AI</span>
        </div>
      </div>

      {/* Store Selector */}
      <div className="px-3 py-3 border-b border-gray-100">
        <button
          onClick={() => setStoreOpen(!storeOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900 truncate">{currentStore.name}</div>
            <div className="text-xs text-gray-500">评分 {currentStore.rating}</div>
          </div>
          <ChevronDown className={clsx('w-4 h-4 text-gray-400 transition', storeOpen && 'rotate-180')} />
        </button>
        {storeOpen && (
          <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {mockStores.map(store => (
              <button
                key={store.id}
                onClick={() => { setCurrentStore(store); setStoreOpen(false) }}
                className={clsx(
                  'w-full text-left px-3 py-2 text-sm hover:bg-primary-50 transition',
                  store.id === currentStore.id && 'bg-primary-50 text-primary-700'
                )}
              >
                {store.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
        {navItems.map((item, i) => {
          if ('divider' in item && item.divider) {
            return item.label ? (
              <div key={i} className="pt-4 pb-1 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                {item.label}
              </div>
            ) : <div key={i} className="pt-2" />
          }
          const Icon = item.icon!
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition',
                active
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
        智店AI v1.0 · 10个Agent就绪
      </div>
    </aside>
  )
}
