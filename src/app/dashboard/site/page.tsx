'use client'
import { Globe, Smartphone, Eye, ShoppingCart, TrendingUp } from 'lucide-react'

export default function SitePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">建站Agent</h1>
        <p className="text-gray-500 mt-1">自有渠道建设与管理</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">微信小程序</h3>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">已上线</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[{ label: '本月访问', value: '3,400' }, { label: '订单数', value: '510' }, { label: '转化率', value: '15%' }].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✅ 在线点餐 · ✅ 会员积分 · ✅ 优惠券</p>
            <p>✅ 微信支付 · ✅ 排队取号</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">品牌官网</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">待开通</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">AI自动生成SEO优化的品牌官网，支持在线点餐和会员系统。</p>
          <button className="w-full py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition">开始创建</button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">菜单管理</h3>
        <div className="space-y-3">
          {[
            { name: '招牌排骨藕汤', price: 38, category: '招牌汤品', status: '在售' },
            { name: '三鲜藕汤', price: 42, category: '招牌汤品', status: '在售' },
            { name: '莲藕丸子汤', price: 35, category: '招牌汤品', status: '在售' },
            { name: '热干面', price: 12, category: '主食', status: '在售' },
            { name: '豆皮', price: 8, category: '小吃', status: '售罄' },
          ].map(item => (
            <div key={item.name} className="flex items-center justify-between py-3 border-b border-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">{item.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900">¥{item.price}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${item.status === '在售' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
