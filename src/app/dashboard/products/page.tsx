'use client'
import { useState } from 'react'
import { ShoppingBag, Store, Globe, Package, TrendingUp, TrendingDown, Star, Eye, CheckCircle, XCircle, AlertTriangle, Clock, Edit, Plus, MoreHorizontal, Search, Filter, Sparkles, ExternalLink, ArrowUpDown, Copy, Zap, BarChart3, DollarSign, Users, Flame, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { useStore } from '@/lib/store-context'
import { useToast } from '@/components/ui/toast'
import { Modal } from '@/components/ui/modal'

const tabs = ['渠道管理', '套餐管理', '商品分析']

// 渠道数据
const channels = [
  { id: 1, name: '美团', icon: '🟡', status: 'active', rating: 4.6, reviews: 856, monthlyViews: 12800, monthlyOrders: 1580, commission: '18%', poiBound: true, infoSync: true, lastSync: '5分钟前' },
  { id: 2, name: '大众点评', icon: '🟠', status: 'active', rating: 4.5, reviews: 623, monthlyViews: 9500, monthlyOrders: 420, commission: '15%', poiBound: true, infoSync: true, lastSync: '5分钟前' },
  { id: 3, name: '抖音', icon: '⬛', status: 'active', rating: 4.7, reviews: 312, monthlyViews: 45000, monthlyOrders: 860, commission: '6%', poiBound: true, infoSync: false, lastSync: '2小时前' },
  { id: 4, name: '小红书', icon: '🔴', status: 'active', rating: 4.8, reviews: 89, monthlyViews: 8200, monthlyOrders: 120, commission: '0%', poiBound: false, infoSync: false, lastSync: '-' },
  { id: 5, name: '饿了么', icon: '🔵', status: 'active', rating: 4.4, reviews: 445, monthlyViews: 8600, monthlyOrders: 920, commission: '20%', poiBound: true, infoSync: true, lastSync: '10分钟前' },
  { id: 6, name: '快手', icon: '🟤', status: 'inactive', rating: 0, reviews: 0, monthlyViews: 0, monthlyOrders: 0, commission: '-', poiBound: false, infoSync: false, lastSync: '-' },
]

// 门店基础信息
const storeInfo = {
  name: '湖北藕汤（纺大店）',
  address: '武汉市洪山区纺织路1号',
  phone: '027-8888-6666',
  hours: '10:30-22:00',
  headerImage: '已上传',
  logo: '已上传',
  description: '武汉本土30年藕汤老店，招牌莲藕排骨汤，每日现熬4小时...',
}

// 套餐数据
const packages = [
  { id: 1, name: '招牌双人藕汤套餐', price: 88, originalPrice: 108, items: ['莲藕排骨汤(大)', '凉拌藕丁', '藕夹', '米饭x2'], sales30d: 520, platforms: { 美团: 'active', 大众点评: 'active', 抖音: 'active', 饿了么: 'active' }, stock: null, status: 'active', hot: true },
  { id: 2, name: '家庭欢聚四人餐', price: 168, originalPrice: 198, items: ['莲藕排骨汤(大)', '菌菇藕汤(大)', '藕夹x2', '凉拌藕丁', '时蔬', '米饭x4'], sales30d: 280, platforms: { 美团: 'active', 大众点评: 'active', 抖音: 'inactive', 饿了么: 'active' }, stock: null, status: 'active', hot: false },
  { id: 3, name: '一人食精选套餐', price: 38, originalPrice: 45, items: ['莲藕排骨汤(小)', '凉拌藕丁', '米饭x1'], sales30d: 890, platforms: { 美团: 'active', 大众点评: 'active', 抖音: 'active', 饿了么: 'active' }, stock: null, status: 'active', hot: true },
  { id: 4, name: '抖音限定尝鲜套餐', price: 29.9, originalPrice: 58, items: ['莲藕排骨汤(小)', '藕夹', '米饭x1'], sales30d: 1240, platforms: { 美团: 'inactive', 大众点评: 'inactive', 抖音: 'active', 饿了么: 'inactive' }, stock: 86, status: 'active', hot: true },
  { id: 5, name: '菌菇藕汤养生套餐', price: 58, originalPrice: 68, items: ['菌菇藕汤(大)', '凉拌藕丁', '米饭x1'], sales30d: 340, platforms: { 美团: 'active', 大众点评: 'active', 抖音: 'inactive', 饿了么: 'active' }, stock: null, status: 'active', hot: false },
  { id: 6, name: '新品：酸辣藕粉套餐', price: 42, originalPrice: 52, items: ['酸辣藕粉', '藕夹', '饮品x1'], sales30d: 45, platforms: { 美团: 'active', 大众点评: 'inactive', 抖音: 'inactive', 饿了么: 'inactive' }, stock: 200, status: 'new', hot: false },
]

// 销量趋势
const salesTrend = [
  { date: '3/3', 美团: 52, 抖音: 41, 点评: 14, 饿了么: 30 },
  { date: '3/4', 美团: 48, 抖音: 55, 点评: 12, 饿了么: 28 },
  { date: '3/5', 美团: 55, 抖音: 38, 点评: 16, 饿了么: 32 },
  { date: '3/6', 美团: 60, 抖音: 62, 点评: 18, 饿了么: 35 },
  { date: '3/7', 美团: 58, 抖音: 45, 点评: 15, 饿了么: 30 },
  { date: '3/8', 美团: 72, 抖音: 58, 点评: 22, 饿了么: 38 },
  { date: '3/9', 美团: 65, 抖音: 50, 点评: 18, 饿了么: 33 },
]

// 套餐销量排行
const packageRanking = [
  { name: '抖音限定尝鲜', sales: 1240, revenue: 37116, trend: '+18%' },
  { name: '一人食精选', sales: 890, revenue: 33820, trend: '+5%' },
  { name: '招牌双人藕汤', sales: 520, revenue: 45760, trend: '+8%' },
  { name: '菌菇养生套餐', sales: 340, revenue: 19720, trend: '+22%' },
  { name: '家庭欢聚四人', sales: 280, revenue: 47040, trend: '+3%' },
]

const platformRevenue = [
  { name: '美团', value: 72800, fill: '#FFAA00' },
  { name: '抖音', value: 45200, fill: '#000000' },
  { name: '饿了么', value: 38500, fill: '#2196F3' },
  { name: '大众点评', value: 18900, fill: '#FF6B00' },
  { name: '小红书', value: 5200, fill: '#FF2442' },
]

const aiPricingAdvice = [
  { icon: '💰', title: '抖音限定套餐可提价至¥32.9', detail: '当前核销率92%，价格弹性分析显示提价3元后预计核销率仍保持85%以上，月增收¥3,720', type: 'revenue' as const },
  { icon: '🔥', title: '一人食套餐建议上架抖音', detail: '该套餐在美团销量第二，但未上架抖音。抖音午间流量大，预计可新增日均15单', type: 'growth' as const },
  { icon: '📦', title: '家庭套餐可增加周末限时折扣', detail: '家庭套餐周末销量是工作日的2.3倍，建议周末推出¥148限时价，预计周末订单+30%', type: 'strategy' as const },
  { icon: '⚠️', title: '酸辣藕粉套餐需关注', detail: '新品上架7天仅45单，转化率2.1%偏低。建议优化主图和详情页，或调整价格至¥35试水', type: 'warning' as const },
]

const COLORS = ['#FFAA00', '#000000', '#2196F3', '#FF6B00', '#FF2442']

const platformIcon: Record<string, string> = { 美团: '🟡', 大众点评: '🟠', 抖音: '⬛', 饿了么: '🔵', 小红书: '🔴' }

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [showCreatePkg, setShowCreatePkg] = useState(false)
  const [showEditStore, setShowEditStore] = useState(false)
  const [storeForm, setStoreForm] = useState({ name: storeInfo.name, address: storeInfo.address, phone: storeInfo.phone, hours: storeInfo.hours })
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', originalPrice: '', items: '' })
  const { currentStore } = useStore()
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">商品套餐管理</h1>
        <p className="text-gray-500 mt-1">管理线上渠道、套餐商品、销售分析</p>
      </div>

      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{tab}</button>
        ))}
      </div>

      {/* ===== 渠道管理 ===== */}
      {activeTab === 0 && (
        <div className="space-y-4">
          {/* 渠道概览 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '已开通渠道', value: channels.filter(c => c.status === 'active').length + '/' + channels.length, icon: Globe, color: 'text-blue-600 bg-blue-50' },
              { label: '本月总曝光', value: (channels.reduce((s, c) => s + c.monthlyViews, 0) / 10000).toFixed(1) + '万', icon: Eye, color: 'text-purple-600 bg-purple-50' },
              { label: '本月总订单', value: channels.reduce((s, c) => s + c.monthlyOrders, 0).toLocaleString(), icon: ShoppingBag, color: 'text-green-600 bg-green-50' },
              { label: 'POI已绑定', value: channels.filter(c => c.poiBound).length + '/' + channels.filter(c => c.status === 'active').length, icon: Store, color: 'text-orange-600 bg-orange-50' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500">{s.label}</span><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="w-4 h-4" /></div></div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              </div>
            ))}
          </div>

          {/* 门店信息卡片 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">门店基础信息（全平台同步）</h3>
              <button onClick={() => setShowEditStore(true)} className="text-xs text-primary-600 flex items-center gap-1"><Edit className="w-3 h-3" />编辑</button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {[
                { label: '店名', value: storeInfo.name },
                { label: '地址', value: storeInfo.address },
                { label: '电话', value: storeInfo.phone },
                { label: '营业时间', value: storeInfo.hours },
              ].map(f => (
                <div key={f.label}><p className="text-xs text-gray-500 mb-1">{f.label}</p><p className="text-gray-900">{f.value}</p></div>
              ))}
            </div>
          </div>

          {/* 各渠道状态 */}
          <div className="space-y-3">
            {channels.map(ch => (
              <div key={ch.id} className={`bg-white rounded-xl p-5 border shadow-sm ${ch.status === 'inactive' ? 'border-gray-200 opacity-60' : 'border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{ch.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{ch.name}</span>
                      {ch.status === 'active' ? <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">已开通</span> : <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">未开通</span>}
                      {ch.poiBound && <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">POI已绑</span>}
                      {ch.infoSync && <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">信息同步</span>}
                    </div>
                    {ch.status === 'active' && (
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{ch.rating}</span>
                        <span>{ch.reviews}条评价</span>
                        <span>月曝光 {(ch.monthlyViews / 10000).toFixed(1)}万</span>
                        <span>月订单 {ch.monthlyOrders}</span>
                        <span>佣金 {ch.commission}</span>
                        <span className="text-gray-400">更新: {ch.lastSync}</span>
                      </div>
                    )}
                  </div>
                  {ch.status === 'active' ? (
                    <button onClick={() => toast('info', `${ch.name}渠道管理页开发中`)} className="px-3 py-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 border">管理</button>
                  ) : (
                    <button onClick={() => toast('success', `已申请开通${ch.name}渠道`)} className="px-3 py-1.5 text-xs text-white bg-primary-600 rounded-lg hover:bg-primary-700">开通</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== 套餐管理 ===== */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">共 {packages.length} 个套餐</span>
              <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">{packages.filter(p => p.status === 'active').length} 在售</span>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{packages.filter(p => p.status === 'new').length} 新品</span>
            </div>
            <button onClick={() => setShowCreatePkg(true)} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"><Plus className="w-4 h-4" />创建套餐</button>
          </div>

          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🍲</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                    {pkg.hot && <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded">🔥 热销</span>}
                    {pkg.status === 'new' && <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">🆕 新品</span>}
                    {pkg.stock !== null && <span className={`text-xs px-1.5 py-0.5 rounded ${pkg.stock < 100 ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>库存 {pkg.stock}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{pkg.items.join(' + ')}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-red-600">¥{pkg.price}</span>
                    <span className="text-sm text-gray-400 line-through">¥{pkg.originalPrice}</span>
                    <span className="text-xs text-green-600">{Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% off</span>
                    <span className="text-xs text-gray-400 ml-auto">30天销量 <strong className="text-gray-900">{pkg.sales30d}</strong></span>
                  </div>
                  {/* 各平台上架状态 */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500">平台状态：</span>
                    {Object.entries(pkg.platforms).map(([name, status]) => (
                      <span key={name} className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {platformIcon[name]} {name} {status === 'active' ? '✓' : '✗'}
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => toast('info', `正在编辑「${pkg.name}」`)} className="shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><Edit className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== 商品分析 ===== */}
      {activeTab === 2 && (
        <div className="space-y-4">
          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '本月总销量', value: packages.reduce((s, p) => s + p.sales30d, 0).toLocaleString() + '单', change: '+12%', up: true },
              { label: '本月总营收', value: '¥' + (platformRevenue.reduce((s, p) => s + p.value, 0) / 10000).toFixed(1) + '万', change: '+8.5%', up: true },
              { label: '平均客单价', value: '¥47.2', change: '+2.1', up: true },
              { label: '套餐转化率', value: '24.8%', change: '-1.2%', up: false },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-500">{s.label}</span>
                <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
                <p className={`text-xs mt-1 ${s.up ? 'text-green-500' : 'text-red-500'}`}>{s.change} vs上周</p>
              </div>
            ))}
          </div>

          {/* 各平台销量趋势 + 营收占比 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">各平台日销量趋势</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
                  <Line type="monotone" dataKey="美团" stroke="#FFAA00" strokeWidth={2} />
                  <Line type="monotone" dataKey="抖音" stroke="#000000" strokeWidth={2} />
                  <Line type="monotone" dataKey="点评" stroke="#FF6B00" strokeWidth={2} />
                  <Line type="monotone" dataKey="饿了么" stroke="#2196F3" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">平台营收占比</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart><Pie data={platformRevenue} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={30}>{platformRevenue.map((e, i) => <Cell key={i} fill={e.fill} />)}</Pie><Tooltip formatter={(v: any) => `¥${(v / 10000).toFixed(1)}万`} /></PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {platformRevenue.map(p => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: p.fill }} /><span className="text-gray-600">{p.name}</span></div>
                    <span className="font-medium">¥{(p.value / 10000).toFixed(1)}万</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 套餐销量排行 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">套餐销量排行（近30天）</h3>
            <div className="space-y-3">
              {packageRanking.map((pkg, i) => (
                <div key={pkg.name} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-600' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                  <span className="text-sm font-medium text-gray-900 w-32">{pkg.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className="bg-primary-500 rounded-full h-3" style={{ width: `${(pkg.sales / packageRanking[0].sales) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-16 text-right">{pkg.sales}单</span>
                  <span className="text-sm text-gray-500 w-20 text-right">¥{(pkg.revenue / 10000).toFixed(1)}万</span>
                  <span className="text-xs text-green-500 w-10">{pkg.trend}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI定价建议 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" />AI商品建议</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {aiPricingAdvice.map((item, i) => (
                <div key={i} className={`rounded-xl p-4 border ${item.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : item.type === 'revenue' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Package Modal */}
      <Modal open={showCreatePkg} onClose={() => setShowCreatePkg(false)} title="创建新套餐" footer={
        <>
          <button onClick={() => setShowCreatePkg(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">取消</button>
          <button onClick={() => { toast('success', `套餐「${pkgForm.name || '新套餐'}」已创建`); setShowCreatePkg(false); setPkgForm({ name: '', price: '', originalPrice: '', items: '' }) }} className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">创建</button>
        </>
      }>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">套餐名称</label><input value={pkgForm.name} onChange={e => setPkgForm(f => ({ ...f, name: e.target.value }))} placeholder="例：春季限定双人餐" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">售价(¥)</label><input type="number" value={pkgForm.price} onChange={e => setPkgForm(f => ({ ...f, price: e.target.value }))} placeholder="88" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">原价(¥)</label><input type="number" value={pkgForm.originalPrice} onChange={e => setPkgForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="108" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">包含菜品（逗号分隔）</label><textarea value={pkgForm.items} onChange={e => setPkgForm(f => ({ ...f, items: e.target.value }))} placeholder="莲藕排骨汤, 凉拌藕丁, 米饭x2" rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
        </div>
      </Modal>

      {/* Edit Store Info Modal */}
      <Modal open={showEditStore} onClose={() => setShowEditStore(false)} title="编辑门店信息" footer={
        <>
          <button onClick={() => setShowEditStore(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">取消</button>
          <button onClick={() => { toast('success', '门店信息已更新，正在同步到各平台...'); setShowEditStore(false) }} className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">保存并同步</button>
        </>
      }>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">店名</label><input value={storeForm.name} onChange={e => setStoreForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">地址</label><input value={storeForm.address} onChange={e => setStoreForm(f => ({ ...f, address: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">电话</label><input value={storeForm.phone} onChange={e => setStoreForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">营业时间</label><input value={storeForm.hours} onChange={e => setStoreForm(f => ({ ...f, hours: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
        </div>
      </Modal>
    </div>
  )
}
