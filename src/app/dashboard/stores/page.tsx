'use client'
import { mockStores } from '@/lib/mock-data'
import { Store, Star, MapPin, Phone, Plus } from 'lucide-react'

export default function StoresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">门店管理</h1>
          <p className="text-gray-500 mt-1">管理所有门店信息</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" /> 添加门店
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {mockStores.map(store => (
          <div key={store.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{store.name}</div>
                <div className="flex items-center gap-1 text-sm text-yellow-500"><Star className="w-3.5 h-3.5 fill-yellow-400" />{store.rating}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" />{store.address}</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{store.phone}</div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {store.platforms.map(p => <span key={p} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{p}</span>)}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
              <div><div className="text-xs text-gray-400">月营业额</div><div className="text-sm font-bold text-gray-900">¥{(store.monthlyRevenue/10000).toFixed(1)}万</div></div>
              <div><div className="text-xs text-gray-400">月订单量</div><div className="text-sm font-bold text-gray-900">{store.monthlyOrders}</div></div>
            </div>
            <button className="mt-3 w-full py-2 text-sm text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">管理门店</button>
          </div>
        ))}
      </div>
    </div>
  )
}
