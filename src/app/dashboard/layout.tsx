'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Bot, LayoutDashboard, MessageSquare, BarChart3, Megaphone, Globe,
  Target, Zap, ClipboardList, Headphones, Shield, Radar, Settings,
  Store, ChevronDown, LogOut, Menu, X, Check, Building2, Plus, MapPin, Smartphone
} from 'lucide-react'
import { StoreProvider, useStore, allStores, chainOverview } from '@/lib/store-context'
import type { StoreInfo } from '@/lib/store-context'

const navItems = [
  { href: '/dashboard', label: '工作台', icon: LayoutDashboard },
  { href: '/dashboard/review', label: '评价Agent', icon: MessageSquare, badge: 3 },
  { href: '/dashboard/analytics', label: '数据Agent', icon: BarChart3 },
  { href: '/dashboard/traffic', label: '获客Agent', icon: Megaphone },
  { href: '/dashboard/site', label: '建站Agent', icon: Globe },
  { href: '/dashboard/sales', label: '销售Agent', icon: Target },
  { href: '/dashboard/marketing', label: '营销Agent', icon: Zap },
  { href: '/dashboard/official-ops', label: '官号运营', icon: Smartphone },
  { href: '/dashboard/ops', label: '运营Agent', icon: ClipboardList },
  { href: '/dashboard/service', label: '客服Agent', icon: Headphones },
  { href: '/dashboard/appeal', label: '申诉Agent', icon: Shield },
  { href: '/dashboard/patrol', label: '巡检Agent', icon: Radar },
  { href: '/dashboard/stores', label: '门店管理', icon: Store },
  { href: '/dashboard/settings', label: '系统设置', icon: Settings },
]

function StoreSelector() {
  const { currentStore, setCurrentStore, stores } = useStore()
  const [open, setOpen] = useState(false)

  const options: StoreInfo[] = [chainOverview, ...stores]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
      >
        {currentStore.id === 'all' ? (
          <Building2 className="w-4 h-4 text-primary-500 shrink-0" />
        ) : (
          <Store className="w-4 h-4 text-gray-500 shrink-0" />
        )}
        <div className="flex-1 text-left min-w-0">
          <p className="text-gray-900 font-medium truncate text-xs">{currentStore.shortName || currentStore.name}</p>
          {currentStore.id !== 'all' && (
            <p className="text-[10px] text-gray-400 truncate">{currentStore.address}</p>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1 max-h-[400px] overflow-y-auto">
            {options.map(store => (
              <button
                key={store.id}
                onClick={() => { setCurrentStore(store); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition ${currentStore.id === store.id ? 'bg-primary-50' : ''}`}
              >
                {store.id === 'all' ? (
                  <Building2 className="w-5 h-5 text-primary-500 shrink-0" />
                ) : (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${store.status === 'active' ? 'bg-green-100' : store.status === 'preparing' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${store.status === 'active' ? 'bg-green-500' : store.status === 'preparing' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{store.name}</p>
                  {store.id !== 'all' && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400 truncate">{store.address}</span>
                      {store.status === 'preparing' && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-600 rounded shrink-0">筹备中</span>
                      )}
                    </div>
                  )}
                  {store.id === 'all' && (
                    <p className="text-[10px] text-primary-500">{allStores.filter(s => s.status === 'active').length}家营业中</p>
                  )}
                </div>
                {currentStore.id === store.id && <Check className="w-4 h-4 text-primary-600 shrink-0" />}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <Link href="/dashboard/stores" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50">
                <Plus className="w-4 h-4" />管理门店
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { currentStore, isChainView } = useStore()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-100 shrink-0">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-gray-900 text-lg">智店AI</span>}
        </div>

        {/* Store selector */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-gray-100">
            <StoreSelector />
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map(item => {
            const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">{item.badge}</span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-3 border-t border-gray-100">
            <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition">
              <LogOut className="w-4 h-4" />
              <span>退出登录</span>
            </Link>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden mr-3 p-1">
            <Menu className="w-6 h-6 text-gray-500" />
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block mr-3 p-1 hover:bg-gray-100 rounded">
            {collapsed ? <Menu className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-500" />}
          </button>

          {/* Current store indicator */}
          <div className="flex items-center gap-2">
            {isChainView ? (
              <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full flex items-center gap-1">
                <Building2 className="w-3 h-3" />连锁总览
              </span>
            ) : (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3" />{currentStore.shortName}
              </span>
            )}
          </div>

          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">A</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <DashboardContent>{children}</DashboardContent>
    </StoreProvider>
  )
}
