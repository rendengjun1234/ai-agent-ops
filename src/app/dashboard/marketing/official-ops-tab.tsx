'use client'
import { useState } from 'react'
import { Smartphone, Plus, TrendingUp, Eye, Heart, MessageSquare, Share2, Calendar, Clock, Sparkles, Users, BarChart3, Play, Pause, Edit, Copy, Download, ChevronDown, Check, Zap, X, Send, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { socialAccounts, contentPosts, contentStrategies, marketingCalendar, officialOpsStats } from '@/lib/official-ops-data'
import { useStore } from '@/lib/store-context'
import { useToast } from '@/components/ui/toast'
import { Modal } from '@/components/ui/modal'

const tabs = ['账号矩阵', '内容管理', '营销日历', '数据分析']
const statusLabels = { draft: '草稿', scheduled: '定时', published: '已发布', generating: '生成中' }
const statusColors = { draft: 'bg-gray-100 text-gray-600', scheduled: 'bg-blue-50 text-blue-600', published: 'bg-green-50 text-green-600', generating: 'bg-yellow-50 text-yellow-600' }

function AccountCard({ account, onEdit, onToggle }: { account: typeof socialAccounts[0]; onEdit: () => void; onToggle: () => void }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center text-2xl">{account.avatar}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{account.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${account.type === 'official' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                {account.type === 'official' ? '👑 官方' : '👤 员工'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{account.platformIcon} {account.platformLabel}</span>
              <span className={`w-2 h-2 rounded-full ${account.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
              <button onClick={onToggle} className="text-xs text-gray-400 hover:text-primary-600">{account.status === 'active' ? '运行中' : '已暂停'}</button>
            </div>
          </div>
        </div>
        <button onClick={onEdit} className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4 text-gray-400" /></button>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded-lg"><p className="text-lg font-bold text-gray-900">{(account.followers / 1000).toFixed(1)}k</p><p className="text-xs text-gray-500">粉丝</p></div>
        <div className="text-center p-2 bg-gray-50 rounded-lg"><p className="text-lg font-bold text-gray-900">{account.posts}</p><p className="text-xs text-gray-500">作品</p></div>
        <div className="text-center p-2 bg-gray-50 rounded-lg"><p className="text-lg font-bold text-gray-900">{(account.likes / 1000).toFixed(1)}k</p><p className="text-xs text-gray-500">获赞</p></div>
      </div>
      {account.persona && (
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-purple-600 font-medium mb-1">人设定位</p>
          <p className="text-xs text-gray-600">{account.persona}</p>
          <p className="text-xs text-purple-500 mt-1">{account.style}</p>
        </div>
      )}
    </div>
  )
}

function ContentCard({ post, onPublish, onEdit, onDelete }: { post: typeof contentPosts[0]; onPublish: () => void; onEdit: () => void; onDelete: () => void }) {
  const account = socialAccounts.find(a => a.id === post.accountId)
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[post.status]}`}>{statusLabels[post.status]}</span>
            <span className="text-xs text-gray-400">{account?.platformIcon} {account?.platformLabel}</span>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{post.content}</p>
        </div>
        <div className="flex gap-1 ml-2">
          <button onClick={onEdit} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
          <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" /></button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs">{account?.avatar}</div>
        <span className="text-xs text-gray-600">{account?.name}</span>
        <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded">{post.style}</span>
      </div>
      {post.status === 'published' && (
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
          {[
            { icon: Eye, value: `${(post.views / 1000).toFixed(1)}k`, color: 'text-gray-600' },
            { icon: Heart, value: post.likes.toString(), color: 'text-red-500' },
            { icon: MessageSquare, value: post.comments.toString(), color: 'text-blue-500' },
            { icon: Share2, value: post.shares.toString(), color: 'text-green-500' },
          ].map((s, i) => (
            <div key={i} className="text-center"><div className={`flex items-center justify-center gap-1 ${s.color}`}><s.icon className="w-3.5 h-3.5" /><span className="text-xs font-medium">{s.value}</span></div></div>
          ))}
        </div>
      )}
      {post.status === 'draft' && (
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button onClick={onPublish} className="flex-1 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 flex items-center justify-center gap-1"><Send className="w-3 h-3" />发布</button>
          <button onClick={onEdit} className="px-3 py-1.5 bg-gray-100 text-xs text-gray-600 rounded-lg hover:bg-gray-200">编辑</button>
        </div>
      )}
      {post.status === 'scheduled' && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-blue-600">
          <Clock className="w-4 h-4" /><span className="text-xs">定时发布：{post.scheduledTime}</span>
        </div>
      )}
      {post.status === 'generating' && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-yellow-600">
          <Sparkles className="w-4 h-4 animate-pulse" /><span className="text-xs">AI正在生成内容...</span>
        </div>
      )}
    </div>
  )
}

export default function OfficialOpsTab() {
  const [activeTab, setActiveTab] = useState(0)
  const [accountFilter, setAccountFilter] = useState<'all' | 'official' | 'employee'>('all')
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showNewContent, setShowNewContent] = useState(false)
  const [contentForm, setContentForm] = useState({ title: '', content: '', platform: '小红书', style: '种草推荐' })
  const [accountForm, setAccountForm] = useState({ name: '', platform: '小红书', type: 'official', persona: '' })
  const [postStatuses, setPostStatuses] = useState<Record<string, string>>({})
  const { currentStore } = useStore()
  const { toast } = useToast()

  const filteredAccounts = socialAccounts.filter(a => accountFilter === 'all' || (accountFilter === 'official' ? a.type === 'official' : a.type === 'employee'))

  const weeklyData = [
    { day: '周一', views: 12000, likes: 890, posts: 3 },
    { day: '周二', views: 15000, likes: 1200, posts: 4 },
    { day: '周三', views: 18000, likes: 1450, posts: 5 },
    { day: '周四', views: 14000, likes: 980, posts: 3 },
    { day: '周五', views: 22000, likes: 1680, posts: 6 },
    { day: '周六', views: 28000, likes: 2100, posts: 7 },
    { day: '周日', views: 25000, likes: 1890, posts: 6 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: '矩阵账号', value: officialOpsStats.totalAccounts.toString(), sub: `官方${officialOpsStats.officialAccounts} · 员工${officialOpsStats.employeeAccounts}`, icon: Users },
          { label: '本周发布', value: officialOpsStats.weeklyGrowth.posts, sub: `总计${officialOpsStats.publishedPosts}篇`, icon: Zap },
          { label: '本周曝光', value: officialOpsStats.weeklyGrowth.views, sub: `总计${(officialOpsStats.totalViews / 10000).toFixed(1)}万`, icon: Eye },
          { label: '本周互动', value: officialOpsStats.weeklyGrowth.likes, sub: `总计${(officialOpsStats.totalLikes / 1000).toFixed(1)}k`, icon: Heart },
          { label: '粉丝增长', value: officialOpsStats.weeklyGrowth.followers, sub: '本周新增', icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-500">{s.label}</span><s.icon className="w-4 h-4 text-gray-300" /></div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {([['all', '全部'], ['official', `官方号 (${officialOpsStats.officialAccounts})`], ['employee', `员工号 (${officialOpsStats.employeeAccounts})`]] as const).map(([key, label]) => (
                <button key={key} onClick={() => setAccountFilter(key)} className={`px-3 py-1.5 text-xs rounded-lg ${accountFilter === key ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>{label}</button>
              ))}
            </div>
            <button onClick={() => setShowAddAccount(true)} className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"><Plus className="w-3.5 h-3.5" />添加账号</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAccounts.map(acc => (
              <AccountCard key={acc.id} account={acc}
                onEdit={() => toast('info', `正在编辑「${acc.name}」的账号信息`)}
                onToggle={() => toast(acc.status === 'active' ? 'warning' : 'success', `「${acc.name}」已${acc.status === 'active' ? '暂停' : '恢复运行'}`)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">AI生成内容，多账号分发，定时发布</p>
            <div className="flex gap-2">
              <button onClick={() => { toast('info', 'AI正在批量生成内容...'); setTimeout(() => toast('success', '已生成3篇种草内容'), 2000) }} className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />AI批量生成</button>
              <button onClick={() => setShowNewContent(true)} className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"><Plus className="w-3.5 h-3.5" />新建内容</button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" />内容策略模板</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {contentStrategies.map(tpl => (
                <button key={tpl.id} onClick={() => { setContentForm(f => ({ ...f, style: tpl.style, content: tpl.description })); setShowNewContent(true); toast('info', `已选择「${tpl.style}」模板`) }}
                  className="p-3 bg-white rounded-lg hover:shadow-md transition text-left">
                  <p className="text-sm font-medium text-gray-900 mb-1">{tpl.style}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {contentPosts.map(post => (
              <ContentCard key={post.id} post={{ ...post, status: (postStatuses[post.id] || post.status) as any }}
                onPublish={() => { setPostStatuses(prev => ({ ...prev, [post.id]: 'published' })); toast('success', `「${post.title}」已发布`) }}
                onEdit={() => toast('info', `正在编辑「${post.title}」`)}
                onDelete={() => { if (confirm(`确定删除「${post.title}」？`)) toast('success', `「${post.title}」已删除`) }}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-500" />2026年营销节点</h3>
              <button onClick={() => toast('info', '营销节点配置开发中')} className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"><Plus className="w-3.5 h-3.5" />添加节点</button>
            </div>
            <div className="space-y-3">
              {marketingCalendar.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => toast('info', `查看「${event.name}」活动详情`)}>
                  <div className="flex items-center gap-4">
                    <div className="text-center"><p className="text-xs text-gray-400">日期</p><p className="text-sm font-bold text-gray-900">{event.date}</p></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{event.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${event.status === 'completed' ? 'bg-green-50 text-green-600' : event.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                          {event.status === 'completed' ? '已完成' : event.status === 'active' ? '进行中' : '待启动'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{event.desc}</p>
                      <p className="text-xs text-purple-600 mt-1">主题：{event.theme}</p>
                    </div>
                  </div>
                  <div className="text-right"><p className="text-sm font-bold text-primary-600">{event.notes}篇</p><p className="text-xs text-gray-400">内容</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">本周数据趋势</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} name="曝光量" />
                  <Line type="monotone" dataKey="likes" stroke="#ef4444" strokeWidth={2} name="点赞数" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">账号表现排行</h3>
              <div className="space-y-3">
                {socialAccounts.slice(0, 5).sort((a, b) => b.likes - a.likes).map((acc, i) => (
                  <div key={acc.id} onClick={() => toast('info', `查看「${acc.name}」详细数据`)} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1 -m-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</span>
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center text-lg">{acc.avatar}</div>
                    <div className="flex-1"><p className="text-sm font-medium text-gray-900">{acc.name}</p><p className="text-xs text-gray-400">{acc.platformIcon} {acc.platformLabel}</p></div>
                    <div className="text-right"><p className="text-sm font-bold text-gray-900">{(acc.likes / 1000).toFixed(1)}k</p><p className="text-xs text-gray-400">获赞</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      <Modal open={showAddAccount} onClose={() => setShowAddAccount(false)} title="添加社交账号" footer={
        <>
          <button onClick={() => setShowAddAccount(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">取消</button>
          <button onClick={() => { toast('success', `账号「${accountForm.name || '新账号'}」已添加`); setShowAddAccount(false); setAccountForm({ name: '', platform: '小红书', type: 'official', persona: '' }) }} className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">添加</button>
        </>
      }>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">账号名称</label><input value={accountForm.name} onChange={e => setAccountForm(f => ({ ...f, name: e.target.value }))} placeholder="例：湖北藕汤官方号" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">平台</label>
            <select value={accountForm.platform} onChange={e => setAccountForm(f => ({ ...f, platform: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
              {['小红书', '抖音', '大众点评', '微信视频号', '快手'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
            <div className="flex gap-2">{['official', 'employee'].map(t => (
              <button key={t} onClick={() => setAccountForm(f => ({ ...f, type: t }))} className={`flex-1 py-2 text-sm rounded-lg border ${accountForm.type === t ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}>{t === 'official' ? '👑 官方号' : '👤 员工号'}</button>
            ))}</div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">人设定位</label><textarea value={accountForm.persona} onChange={e => setAccountForm(f => ({ ...f, persona: e.target.value }))} placeholder="例：武汉本地美食探店博主..." rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
        </div>
      </Modal>

      {/* New Content Modal */}
      <Modal open={showNewContent} onClose={() => setShowNewContent(false)} title="新建内容" size="lg" footer={
        <>
          <button onClick={() => setShowNewContent(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">取消</button>
          <button onClick={() => { toast('info', '内容已保存为草稿'); setShowNewContent(false) }} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">存草稿</button>
          <button onClick={() => { toast('success', `「${contentForm.title || '新内容'}」已发布`); setShowNewContent(false); setContentForm({ title: '', content: '', platform: '小红书', style: '种草推荐' }) }} className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">发布</button>
        </>
      }>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">平台</label>
              <select value={contentForm.platform} onChange={e => setContentForm(f => ({ ...f, platform: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
                {['小红书', '抖音', '大众点评', '微信视频号'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">风格</label>
              <select value={contentForm.style} onChange={e => setContentForm(f => ({ ...f, style: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
                {['种草推荐', '探店打卡', '日常分享', '产品测评', '活动宣传'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">标题</label><input value={contentForm.title} onChange={e => setContentForm(f => ({ ...f, title: e.target.value }))} placeholder="输入内容标题..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">内容</label><textarea value={contentForm.content} onChange={e => setContentForm(f => ({ ...f, content: e.target.value }))} placeholder="输入正文内容，或点击AI生成..." rows={5} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" /></div>
          <button onClick={() => { toast('info', 'AI正在生成内容...'); setTimeout(() => { setContentForm(f => ({ ...f, title: '😱武汉这碗藕汤鲜到眉毛掉！', content: '在武汉纺大门口发现了一家宝藏藕汤店！莲藕排骨汤熬了4小时，汤色奶白浓郁，一口下去鲜到骨子里...\n\n🍲 推荐：招牌双人套餐¥88\n📍 地址：洪山区纺织路1号\n⏰ 营业时间：10:30-22:00' })); toast('success', 'AI内容已生成') }, 1500) }}
            className="w-full py-2 bg-purple-50 text-purple-600 text-sm rounded-lg hover:bg-purple-100 flex items-center justify-center gap-1"><Sparkles className="w-4 h-4" />AI一键生成内容</button>
        </div>
      </Modal>
    </div>
  )
}
