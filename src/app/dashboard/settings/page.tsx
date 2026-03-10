'use client'
import { useState, useEffect, useCallback } from 'react'
import { Store, Link, Bell, Sparkles, Save, Shield, Users, Plus, Trash2, Check, X, RefreshCw } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { Modal } from '@/components/ui/modal'
import BindPlatformModal from '@/components/BindPlatformModal'
import { PLATFORM_CONFIG, PlatformType } from '@/lib/platform-service'

interface BoundAccount {
  platform: PlatformType
  accountId: string
  accountName: string
  shops: { shopId: string; shopName: string }[]
  bindTime: number
  lastSyncTime?: number
  status: string
}

const initialPlatforms = [
  { platform: '美团商家', status: '已绑定', account: 'hubeioutang_fd' },
  { platform: '大众点评', status: '已绑定', account: 'hubeioutang_fd' },
  { platform: '抖音来客', status: '已绑定', account: '湖北藕汤纺大店' },
  { platform: '高德商家', status: '未绑定', account: '' },
  { platform: '京东外卖', status: '已绑定', account: 'hubei_outang_001' },
  { platform: '淘宝闪购', status: '未绑定', account: '' },
]

const initialNotifications = [
  { id: 1, label: '差评即时通知', desc: '收到差评后立即推送微信通知', enabled: true },
  { id: 2, label: '日报推送', desc: '每天20:00推送经营日报', enabled: true },
  { id: 3, label: '周报推送', desc: '每周一09:00推送经营周报', enabled: false },
  { id: 4, label: '竞品动态提醒', desc: '竞品有新活动时推送通知', enabled: true },
]

const employees = [
  { id: 1, name: '张店长', role: '店长', phone: '138****6688', stores: ['纺大店'] },
  { id: 2, name: '李经理', role: '区域经理', phone: '139****5566', stores: ['纺大店', '光谷店', '汉口店'] },
  { id: 3, name: '小美', role: '运营专员', phone: '137****4455', stores: ['纺大店'] },
]

export default function SettingsPage() {
  const { toast } = useToast()
  const [activeTone, setActiveTone] = useState(0)
  const [signature, setSignature] = useState('湖北藕汤·用心做好每一碗汤 🍲')
  const [notifications, setNotifications] = useState(initialNotifications)
  const [platforms, setPlatforms] = useState(initialPlatforms)
  const [storeFields, setStoreFields] = useState({
    name: '湖北藕汤（纺大店）', address: '武汉市洪山区纺织大学南门',
    phone: '027-8888-6666', hours: '10:00 - 22:00',
  })
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [empForm, setEmpForm] = useState({ name: '', role: '运营专员', phone: '' })
  const [saving, setSaving] = useState(false)
  const [showBindModal, setShowBindModal] = useState(false)
  const [boundAccounts, setBoundAccounts] = useState<BoundAccount[]>([])

  const fetchBoundAccounts = useCallback(async () => {
    try {
      const res = await fetch('/api/platform/accounts')
      const data = await res.json()
      if (data.success) setBoundAccounts(data.data)
    } catch {}
  }, [])

  useEffect(() => { fetchBoundAccounts() }, [fetchBoundAccounts])

  const toggleNotification = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n))
  }

  const handleBind = (index: number) => {
    const p = platforms[index]
    if (p.status === '已绑定') {
      if (confirm(`确定解绑${p.platform}？`)) {
        setPlatforms(prev => prev.map((pp, i) => i === index ? { ...pp, status: '未绑定', account: '' } : pp))
        toast('info', `${p.platform}已解绑`)
      }
    } else {
      const account = prompt(`请输入${p.platform}账号：`)
      if (account) {
        setPlatforms(prev => prev.map((pp, i) => i === index ? { ...pp, status: '已绑定', account } : pp))
        toast('success', `${p.platform}已绑定`)
      }
    }
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); toast('success', '设置已保存') }, 800)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>

      {/* 门店信息 */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">门店信息</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(storeFields).map(([key, value]) => {
            const labels: Record<string, string> = { name: '门店名称', address: '门店地址', phone: '联系电话', hours: '营业时间' }
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{labels[key]}</label>
                <input value={value} onChange={e => setStoreFields(prev => ({ ...prev, [key]: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
              </div>
            )
          })}
        </div>
      </div>

      {/* 平台账号 - Cookie绑定 */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">平台账号绑定</h3>
          </div>
          <button onClick={() => setShowBindModal(true)} className="text-xs px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1">
            <Plus className="w-3 h-3" />Cookie绑定
          </button>
        </div>

        {/* 已通过Cookie绑定的账号 */}
        {boundAccounts.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">已通过Cookie绑定的账号：</p>
            {boundAccounts.map(acc => {
              const cfg = PLATFORM_CONFIG[acc.platform]
              return (
                <div key={acc.accountId} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span>{cfg?.icon || '📦'}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cfg?.name || acc.platform} · {acc.accountName}</p>
                      <p className="text-xs text-gray-400">
                        {acc.shops.length} 个门店 · {acc.lastSyncTime ? `最后同步 ${new Date(acc.lastSyncTime).toLocaleString('zh-CN')}` : '未同步'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${acc.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {acc.status === 'active' ? '正常' : '已过期'}
                    </span>
                    <button onClick={async () => {
                      if (!confirm('确定解绑？')) return
                      await fetch('/api/platform/accounts', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ platform: acc.platform, accountId: acc.accountId }),
                      })
                      fetchBoundAccounts()
                      toast('info', '已解绑')
                    }} className="text-xs text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 原有的静态平台列表 */}
        <div className="space-y-3">
          {platforms.map((p, i) => (
            <div key={p.platform} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{p.platform}</p>
                {p.account && <p className="text-xs text-gray-400">{p.account}</p>}
              </div>
              <button onClick={() => handleBind(i)} className={`text-xs px-3 py-1.5 rounded-lg ${p.status === '已绑定' ? 'bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-600' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                {p.status === '已绑定' ? '已绑定' : '去绑定'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 员工管理 */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">员工管理</h3>
          </div>
          <button onClick={() => setShowEmployeeModal(true)} className="text-xs px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"><Plus className="w-3 h-3" />添加员工</button>
        </div>
        <div className="space-y-2">
          {employees.map(emp => (
            <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-700">{emp.name[0]}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.role} · {emp.phone} · {emp.stores.join('、')}</p>
                </div>
              </div>
              <button onClick={() => toast('info', `编辑${emp.name}的权限`)} className="text-xs text-primary-600 hover:text-primary-700">编辑</button>
            </div>
          ))}
        </div>
      </div>

      {/* AI设置 */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">AI回复风格</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">回复语气</label>
            <div className="flex gap-2">
              {['亲切温暖', '专业正式', '活泼俏皮'].map((tone, i) => (
                <button key={tone} onClick={() => { setActiveTone(i); toast('success', `回复语气已切换为「${tone}」`) }}
                  className={`px-4 py-2 text-sm rounded-lg border transition ${i === activeTone ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{tone}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">自定义签名</label>
            <input value={signature} onChange={e => setSignature(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
          </div>
        </div>
      </div>

      {/* 通知设置 */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">通知设置</h3>
        </div>
        {notifications.map(n => (
          <div key={n.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{n.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
            </div>
            <button onClick={() => toggleNotification(n.id)} className={`w-11 h-6 rounded-full p-0.5 transition ${n.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${n.enabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-60">
        <Save className="w-4 h-4" />{saving ? '保存中...' : '保存设置'}
      </button>

      {/* Add Employee Modal */}
      <Modal open={showEmployeeModal} onClose={() => setShowEmployeeModal(false)} title="添加员工" footer={
        <>
          <button onClick={() => setShowEmployeeModal(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">取消</button>
          <button onClick={() => { toast('success', `员工「${empForm.name || '新员工'}」已添加`); setShowEmployeeModal(false); setEmpForm({ name: '', role: '运营专员', phone: '' }) }} className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">添加</button>
        </>
      }>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">姓名</label><input value={empForm.name} onChange={e => setEmpForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
            <select value={empForm.role} onChange={e => setEmpForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
              {['店长', '区域经理', '运营专员', '客服'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">手机号</label><input value={empForm.phone} onChange={e => setEmpForm(f => ({ ...f, phone: e.target.value }))} placeholder="138xxxx6688" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
        </div>
      </Modal>

      {/* 平台绑定弹窗 */}
      <BindPlatformModal
        open={showBindModal}
        onClose={() => setShowBindModal(false)}
        onSuccess={() => { fetchBoundAccounts(); toast('success', '平台绑定成功') }}
      />
    </div>
  )
}
