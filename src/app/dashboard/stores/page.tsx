'use client'
import { useState } from 'react'
import { Store, Star, MapPin, Phone, ChevronRight, Plus, TrendingUp, TrendingDown, BarChart3, MessageSquare } from 'lucide-react'
import { mockStores } from '@/lib/mock-data'

export default function StoresPage() {
  const [selected, setSelected] = useState(mockStores[0].id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">门店管理</h1>
          <p className="text-gray-500 mt-1">管理所有门店信息与运营状态</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />添加门店
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {mockStores.map(store => (
          <div
            key={store.id}
            onClick={() => setSelected(store.id)}
            className={`bg-white rounded-xl p-5 border-2 shadow-sm cursor-pointer transition ${selected === store.id ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{store.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{store.rating}</span>
                  </div>
                </div>
              </div>
              {selected === store.id && (
                <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">当前</span>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>{store.phone}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">¥{(store.monthlyRevenue / 10000).toFixed(1)}万</p>
                <p className="text-xs text-gray-400">月营业额</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{store.monthlyOrders.toLocaleString()}</p>
                <p className="text-xs text-gray-400">月订单</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">¥{store.avgPrice}</p>
                <p className="text-xs text-gray-400">客单价</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {store.platforms.map(p => (
                <span key={p} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 门店对比 */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">门店对比</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 text-gray-500 font-medium">门店</th>
              <th className="text-right py-3 text-gray-500 font-medium">评分</th>
              <th className="text-right py-3 text-gray-500 font-medium">月营业额</th>
              <th className="text-right py-3 text-gray-500 font-medium">月订单</th>
              <th className="text-right py-3 text-gray-500 font-medium">客单价</th>
              <th className="text-right py-3 text-gray-500 font-medium">接入平台</th>
            </tr>
          </thead>
          <tbody>
            {mockStores.map((s, i) => (
              <tr key={s.id} className="border-b border-gray-50">
                <td className="py-3 font-medium text-gray-900">{s.name}</td>
                <td className="py-3 text-right">
                  <span className="flex items-center justify-end gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    {s.rating}
                  </span>
                </td>
                <td className="py-3 text-right text-gray-700">¥{(s.monthlyRevenue / 10000).toFixed(1)}万</td>
                <td className="py-3 text-right text-gray-700">{s.monthlyOrders.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-700">¥{s.avgPrice}</td>
                <td className="py-3 text-right text-gray-400">{s.platforms.length}个</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
