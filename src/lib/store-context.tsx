'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export interface StoreInfo {
  id: string
  name: string
  shortName: string
  address: string
  phone: string
  platforms: string[]
  rating: number
  monthlyRevenue: number
  monthlyOrders: number
  avgPrice: number
  openDate: string
  manager: string
  status: 'active' | 'preparing' | 'closed'
}

export const allStores: StoreInfo[] = [
  {
    id: 'store_001', name: '湖北藕汤（纺大店）', shortName: '纺大店',
    address: '武汉市洪山区纺织大学南门', phone: '027-8888-6666',
    platforms: ['美团', '大众点评', '抖音', '高德', '京东外卖', '淘宝闪购'],
    rating: 4.6, monthlyRevenue: 186500, monthlyOrders: 3720, avgPrice: 50.1,
    openDate: '2024-03-15', manager: '张店长', status: 'active',
  },
  {
    id: 'store_002', name: '湖北藕汤（光谷店）', shortName: '光谷店',
    address: '武汉市洪山区光谷广场D座1层', phone: '027-8888-7777',
    platforms: ['美团', '大众点评', '抖音', '高德', '京东外卖'],
    rating: 4.5, monthlyRevenue: 152000, monthlyOrders: 3040, avgPrice: 50.0,
    openDate: '2024-08-20', manager: '李店长', status: 'active',
  },
  {
    id: 'store_003', name: '湖北藕汤（汉口店）', shortName: '汉口店',
    address: '武汉市江汉区江汉路步行街', phone: '027-8888-8888',
    platforms: ['美团', '大众点评', '抖音'],
    rating: 4.4, monthlyRevenue: 134000, monthlyOrders: 2680, avgPrice: 50.0,
    openDate: '2025-01-10', manager: '王店长', status: 'active',
  },
  {
    id: 'store_004', name: '湖北藕汤（武昌站店）', shortName: '武昌站店',
    address: '武汉市武昌区武昌火车站广场', phone: '027-8888-9999',
    platforms: ['美团', '大众点评'],
    rating: 4.3, monthlyRevenue: 98000, monthlyOrders: 2450, avgPrice: 40.0,
    openDate: '2025-06-01', manager: '赵店长', status: 'active',
  },
  {
    id: 'store_005', name: '湖北藕汤（徐东店）', shortName: '徐东店',
    address: '武汉市武昌区徐东大街销品茂', phone: '027-8888-5555',
    platforms: [],
    rating: 0, monthlyRevenue: 0, monthlyOrders: 0, avgPrice: 0,
    openDate: '2026-04-01', manager: '刘店长', status: 'preparing',
  },
]

// 全部门店汇总的虚拟Store
export const chainOverview: StoreInfo = {
  id: 'all',
  name: '全部门店（连锁总览）',
  shortName: '连锁总览',
  address: '武汉市',
  phone: '',
  platforms: ['美团', '大众点评', '抖音', '高德', '京东外卖', '淘宝闪购'],
  rating: +(allStores.filter(s => s.status === 'active').reduce((s, st) => s + st.rating, 0) / allStores.filter(s => s.status === 'active').length).toFixed(1),
  monthlyRevenue: allStores.reduce((s, st) => s + st.monthlyRevenue, 0),
  monthlyOrders: allStores.reduce((s, st) => s + st.monthlyOrders, 0),
  avgPrice: +(allStores.filter(s => s.monthlyOrders > 0).reduce((s, st) => s + st.avgPrice, 0) / allStores.filter(s => s.monthlyOrders > 0).length).toFixed(1),
  openDate: '',
  manager: '',
  status: 'active',
}

// 按门店生成差异化的mock数据乘数
export function getStoreMultiplier(storeId: string): { revenue: number; orders: number; rating: number; reviews: number } {
  switch (storeId) {
    case 'store_001': return { revenue: 1, orders: 1, rating: 1, reviews: 1 }
    case 'store_002': return { revenue: 0.82, orders: 0.82, rating: 0.98, reviews: 0.85 }
    case 'store_003': return { revenue: 0.72, orders: 0.72, rating: 0.96, reviews: 0.7 }
    case 'store_004': return { revenue: 0.53, orders: 0.66, rating: 0.93, reviews: 0.5 }
    case 'all': return { revenue: 3.07, orders: 3.2, rating: 1, reviews: 3.05 }
    default: return { revenue: 1, orders: 1, rating: 1, reviews: 1 }
  }
}

interface StoreContextType {
  currentStore: StoreInfo
  setCurrentStore: (store: StoreInfo) => void
  stores: StoreInfo[]
  isChainView: boolean
}

const StoreContext = createContext<StoreContextType>({
  currentStore: allStores[0],
  setCurrentStore: () => {},
  stores: allStores,
  isChainView: false,
})

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentStore, setCurrentStore] = useState<StoreInfo>(allStores[0])

  return (
    <StoreContext.Provider value={{
      currentStore,
      setCurrentStore,
      stores: allStores,
      isChainView: currentStore.id === 'all',
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
