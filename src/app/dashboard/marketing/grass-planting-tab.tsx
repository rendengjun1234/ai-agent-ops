'use client'
import { useState } from 'react'
import { QrCode, Plus, Eye, Share2, TrendingUp, Sparkles, Image as ImageIcon, Calendar, Users, BarChart3, Download, Settings, Play, Pause, Copy, ExternalLink, Smartphone, Heart, MessageSquare, ChevronRight, Folder, Upload, Check, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { useStore } from '@/lib/store-context'
import { useToast } from '@/components/ui/toast'
import { Modal } from '@/components/ui/modal'

const tabs = ['种草计划', '素材库', '数据看板']
const COLORS = ['#FF2442', '#FF4F00', '#000000', '#FF6B00']

const campaigns = [
  { id: 'camp_001', name: '春季新品推广', status: 'active' as const, store: '纺大店', createdAt: '2026-03-01', tasks: 2, materials: 12, scans: 156, published: 23, views: 12500, leads: 8 },
  { id: 'camp_002', name: '三八女神节活动', status: 'ended' as const, store: '全部门店', createdAt: '2026-03-05', tasks: 4, materials: 28, scans: 340, published: 67, views: 45600, leads: 34 },
]

const materialFolders = [
  { id: 'f1', name: '纺大店素材', type: 'store' as const, count: 45 },
  { id: 'f2', name: '光谷店素材', type: 'store' as const, count: 32 },
  { id: 'f3', name: '品牌通用素材', type: 'free' as const, count: 67 },
  { id: 'f4', name: '节日活动素材', type: 'free' as const, count: 28 },
]

const tasks = [
  { id: 'task_001', campaignId: 'camp_001', name: '春季新品种草', target: 30, generated: 28, published: 23, status: 'running' as const, accounts: ['官方号', '员工号×2'] },
  { id: 'task_002', campaignId: 'camp_001', name: '菌菇藕汤推广', target: 20, generated: 18, published: 15, status: 'running' as const, accounts: ['员工号×3'] },
]

const generatedContents = [
  { id: 'c1', taskId: 'task_001', platform: '小红书', title: '😱武汉这碗藕汤鲜到眉毛掉！', status: 'published' as const, views: 3200, likes: 234, time: '2小时前' },
  { id: 'c2', taskId: 'task_001', platform: '小红书', title: '春天必喝！菌菇藕汤养生又美味', status: 'published' as const, views: 5600, likes: 456, time: '5小时前' },
  { id: 'c3', taskId: 'task_002', platform: '抖音', title: '武汉排队王！纺大门口的藕汤...', status: 'published' as const, views: 12000, likes: 890, time: '昨天' },
]

function PhoneMockup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="mx-auto w-[320px]">
      <div className="bg-black rounded-[2.5rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2rem] overflow-hidden">
          <div className="bg-gray-50 px-5 py-2 flex justify-between text-xs text-gray-500"><span>9:41</span><span className="font-medium">{title}</span><span>📶 🔋</span></div>
          <div className="h-[500px] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function GrassPlantingTab() {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedCampaign, setSelectedCampaign] = useState<typeof campaigns[0] | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [campaignForm, setCampaignForm] = useState({ name: '', store: '纺大店', reward: '' })
  const { currentStore } = useStore()
  const { toast } = useToast()

  const dailyTrend = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i))
    return { date: `${d.getMonth() + 1}/${d.getDate()}`, scans: 30 + Math.floor(Math.random() * 40), published: 8 + Math.floor(Math.random() * 15) }
  })

  const platformData = [
    { platform: '小红书', published: 156, views: 82000, likes: 3400 },
    { platform: '大众点评', published: 89, views: 45000, likes: 1200 },
    { platform: '抖音', published: 67, views: 128000, likes: 8900 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 flex items-center gap-1.5"><Plus className="w-4 h-4" />新建计划</button>
      </div>

      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
        {tabs.map((tab, i) => (<button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{tab}</button>))}
      </div>

      {activeTab === 0 && (
        <div className="space-y-4">
          {campaigns.map(camp => (
            <div key={camp.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{camp.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${camp.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{camp.status === 'active' ? '🟢 运行中' : '⏸️ 已结束'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500"><span>📍 {camp.store}</span><span>📅 创建于 {camp.createdAt}</span></div>
                </div>
                <div className="flex gap-2">
                  {camp.status === 'active' && <button onClick={() => toast('warning', `已暂停「${camp.name}」`)} className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-1"><Pause className="w-3 h-3" />暂停</button>}
                  <button onClick={() => toast('info', `查看「${camp.name}」详情`)} className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg flex items-center gap-1">详情 <ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                {[
                  { label: '任务数', value: camp.tasks, color: '' },
                  { label: '素材数', value: camp.materials, color: '' },
                  { label: '扫码次数', value: camp.scans, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: '已发布', value: camp.published, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: '预估曝光', value: `${(camp.views / 1000).toFixed(1)}k`, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: '获取线索', value: camp.leads, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map(s => (
                  <div key={s.label} className={`p-3 rounded-lg text-center ${s.bg || 'bg-gray-50'}`}>
                    <p className={`text-lg font-bold ${s.color || 'text-gray-900'}`}>{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-500">种草任务</p>
                {tasks.filter(t => t.campaignId === camp.id).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">{task.name}</p>
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded">运行中</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>目标 {task.target} 篇</span><span>已生成 {task.generated}</span><span>已发布 {task.published}</span>
                        <span className="text-blue-600">{task.accounts.join(' · ')}</span>
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 rounded-full h-2" style={{ width: `${(task.published / task.target * 100)}%` }} /></div>
                      <p className="text-xs text-gray-500 text-center mt-1">{Math.round(task.published / task.target * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-500">最近发布</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                  {generatedContents.filter(c => tasks.some(t => t.id === c.taskId && t.campaignId === camp.id)).map(content => (
                    <div key={content.id} onClick={() => toast('info', `查看「${content.title}」详情`)} className="p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-100 cursor-pointer hover:shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">📕 {content.platform}</span>
                        <span className="text-xs text-gray-400">{content.time}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-2 line-clamp-1">{content.title}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(content.views / 1000).toFixed(1)}k</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" />{content.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><QrCode className="w-5 h-5 text-primary-500" />种草码预览</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-4">顾客扫码后看到的页面效果：</p>
                <PhoneMockup title="扫码参与">
                  <div className="p-6 text-center">
                    <div className="w-48 h-48 mx-auto bg-white border-4 border-gray-200 rounded-2xl flex items-center justify-center mb-4"><QrCode className="w-32 h-32 text-gray-400" /></div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">扫码发布小红书笔记</h2>
                    <p className="text-sm text-gray-600 mb-4">AI帮你生成种草内容<br />一键发布到小红书</p>
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 text-left">
                      <p className="text-xs font-medium text-gray-900 mb-2">🎁 发布奖励</p>
                      <p className="text-xs text-gray-600">• 发布笔记送酸梅汤一杯</p>
                      <p className="text-xs text-gray-600">• 点赞超100再送代金券10元</p>
                    </div>
                  </div>
                </PhoneMockup>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" />工作流程</h4>
                  <div className="space-y-3">
                    {[{ step: '1', label: '顾客扫码', desc: '用餐后扫描桌面二维码' },{ step: '2', label: 'AI生成内容', desc: '自动生成小红书笔记草稿' },{ step: '3', label: '顾客编辑', desc: '可修改内容和添加图片' },{ step: '4', label: '一键发布', desc: '直接发布到小红书' },{ step: '5', label: '获得奖励', desc: '发布成功领取优惠' }].map(item => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{item.step}</div>
                        <div><p className="text-sm font-medium text-gray-900">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => toast('success', '种草码已下载')} className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"><Download className="w-4 h-4" />下载种草码</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">管理门店图片素材，用于AI生成内容</p>
            <button onClick={() => setShowUploadModal(true)} className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"><Upload className="w-4 h-4" />上传素材</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {materialFolders.map(folder => (
              <div key={folder.id} onClick={() => toast('info', `打开「${folder.name}」文件夹`)} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${folder.type === 'store' ? 'bg-blue-100' : 'bg-purple-100'}`}><Folder className={`w-6 h-6 ${folder.type === 'store' ? 'text-blue-600' : 'text-purple-600'}`} /></div>
                  <div className="flex-1"><h3 className="font-medium text-gray-900">{folder.name}</h3><p className="text-xs text-gray-400">{folder.type === 'store' ? '门店文件夹' : '自由文件夹'}</p></div>
                </div>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-600">{folder.count} 个素材</span><ChevronRight className="w-4 h-4 text-gray-400" /></div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" />AI智能识别</h3>
            <p className="text-sm text-gray-600 mb-4">上传图片后，AI会自动识别：</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {['产品主体', '环境氛围', '人物场景', '细节特写'].map(tag => (<div key={tag} className="p-3 bg-white rounded-lg text-center"><p className="text-sm font-medium text-gray-900">{tag}</p></div>))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '总扫码量', value: '496', icon: QrCode, color: 'text-blue-600' },
              { label: '已发布', value: '90', icon: Share2, color: 'text-green-600' },
              { label: '预估曝光', value: '25.5万', icon: Eye, color: 'text-purple-600' },
              { label: '转化率', value: '18.1%', icon: TrendingUp, color: 'text-orange-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500">{s.label}</span><s.icon className={`w-4 h-4 ${s.color}`} /></div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">扫码与发布趋势（近14天）</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
                  <Line type="monotone" dataKey="scans" stroke="#2563eb" strokeWidth={2} name="扫码量" /><Line type="monotone" dataKey="published" stroke="#10b981" strokeWidth={2} name="发布量" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">各平台种草效果</h3>
              <div className="space-y-3">
                {platformData.map((p, i) => (
                  <div key={p.platform} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1 -m-1" onClick={() => toast('info', `查看${p.platform}详细数据`)}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: COLORS[i] + '20', color: COLORS[i] }}>{i + 1}</div>
                    <div className="flex-1"><p className="text-sm font-medium text-gray-900">{p.platform}</p><p className="text-xs text-gray-400">{p.published}篇 · {(p.views / 10000).toFixed(1)}万曝光</p></div>
                    <div className="text-right"><p className="text-sm font-bold text-red-500">{p.likes.toLocaleString()}</p><p className="text-xs text-gray-400">获赞</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="新建种草计划" footer={
        <>
          <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">取消</button>
          <button onClick={() => { toast('success', `种草计划「${campaignForm.name || '新计划'}」已创建`); setShowCreateModal(false); setCampaignForm({ name: '', store: '纺大店', reward: '' }) }} className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">创建</button>
        </>
      }>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">计划名称</label><input value={campaignForm.name} onChange={e => setCampaignForm(f => ({ ...f, name: e.target.value }))} placeholder="例：春季新品推广" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">门店</label>
            <select value={campaignForm.store} onChange={e => setCampaignForm(f => ({ ...f, store: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
              {['纺大店', '光谷店', '汉口店', '武昌站店', '全部门店'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">发布奖励</label><textarea value={campaignForm.reward} onChange={e => setCampaignForm(f => ({ ...f, reward: e.target.value }))} placeholder="例：发布笔记送酸梅汤一杯，点赞超100送代金券10元" rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal open={showUploadModal} onClose={() => setShowUploadModal(false)} title="上传素材" footer={
        <>
          <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">取消</button>
          <button onClick={() => { toast('success', '素材已上传'); setShowUploadModal(false) }} className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">上传</button>
        </>
      }>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition cursor-pointer" onClick={() => toast('info', '请选择图片文件')}>
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">点击或拖拽图片到此处上传</p>
            <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG、MP4 格式</p>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">目标文件夹</label>
            <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
              {materialFolders.map(f => <option key={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
