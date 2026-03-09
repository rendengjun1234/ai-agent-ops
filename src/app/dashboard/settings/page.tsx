'use client'
import { Store, Link, Bell, Sparkles, Save } from 'lucide-react'

export default function SettingsPage() {
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
          {[
            { label: '门店名称', value: '湖北藕汤（纺大店）' },
            { label: '门店地址', value: '武汉市洪山区纺织大学南门' },
            { label: '联系电话', value: '027-8888-6666' },
            { label: '营业时间', value: '10:00 - 22:00' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input defaultValue={f.value} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            </div>
          ))}
        </div>
      </div>

      {/* 平台账号 */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Link className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">平台账号绑定</h3>
        </div>
        <div className="space-y-3">
          {[
            { platform: '美团商家', status: '已绑定', account: 'hubeioutang_fd' },
            { platform: '大众点评', status: '已绑定', account: 'hubeioutang_fd' },
            { platform: '抖音来客', status: '已绑定', account: '湖北藕汤纺大店' },
            { platform: '高德商家', status: '未绑定', account: '' },
            { platform: '京东外卖', status: '已绑定', account: 'hubei_outang_001' },
            { platform: '淘宝闪购', status: '未绑定', account: '' },
          ].map(p => (
            <div key={p.platform} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{p.platform}</p>
                {p.account && <p className="text-xs text-gray-400">{p.account}</p>}
              </div>
              <button className={`text-xs px-3 py-1.5 rounded-lg ${p.status === '已绑定' ? 'bg-green-50 text-green-600' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                {p.status === '已绑定' ? '已绑定' : '去绑定'}
              </button>
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
                <button key={tone} className={`px-4 py-2 text-sm rounded-lg border transition ${i === 0 ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{tone}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">自定义签名</label>
            <input defaultValue="湖北藕汤·用心做好每一碗汤 🍲" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
          </div>
        </div>
      </div>

      {/* 通知设置 */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">通知设置</h3>
        </div>
        {[
          { label: '差评即时通知', desc: '收到差评后立即推送微信通知', enabled: true },
          { label: '日报推送', desc: '每天20:00推送经营日报', enabled: true },
          { label: '周报推送', desc: '每周一09:00推送经营周报', enabled: false },
          { label: '竞品动态提醒', desc: '竞品有新活动时推送通知', enabled: true },
        ].map(n => (
          <div key={n.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{n.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
            </div>
            <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition ${n.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${n.enabled ? 'translate-x-5' : ''}`} />
            </div>
          </div>
        ))}
      </div>

      <button className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition flex items-center gap-2">
        <Save className="w-4 h-4" />保存设置
      </button>
    </div>
  )
}
