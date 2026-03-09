'use client'
import { useState } from 'react'
import { MessageCircle, Bot, Clock, Users, Send, Smile, Paperclip, Phone, MoreVertical, Search, ThumbsUp, Zap, BookOpen, BarChart3, User, Check, AlertTriangle, TrendingUp, Plus, Heart, MessageSquare, AtSign, Globe, Eye, ArrowRight, Star, Sparkles, ExternalLink, Filter, Image as ImageIcon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { conversations, knowledgeBase, serviceStats, autoReplyRules, type Conversation, type Message } from '@/lib/service-data'
import { useStore } from '@/lib/store-context'
import { useToast } from '@/components/ui/toast'
import { Modal } from '@/components/ui/modal'

const tabs = ['在线客服', '评论互动', '私信管理', '知识库']

const statusLabels = { bot: '🤖 AI接待', staff: '👤 人工接待', closed: '✅ 已结束' }
const statusColors = { bot: 'bg-green-50 text-green-600', staff: 'bg-blue-50 text-blue-600', closed: 'bg-gray-100 text-gray-500' }

function ChatBubble({ msg }: { msg: Message }) {
  const isCustomer = msg.sender === 'customer'
  const isBot = msg.sender === 'bot'
  return (
    <div className={`flex gap-2 ${isCustomer ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${isCustomer ? 'bg-gray-200' : isBot ? 'bg-primary-100' : 'bg-orange-100'}`}>
        {isCustomer ? '👤' : isBot ? '🤖' : '👩'}
      </div>
      <div className="max-w-[75%]">
        {!isCustomer && <p className="text-[10px] text-gray-400 mb-0.5 px-1">{isBot ? 'AI客服' : '张店长（人工）'}</p>}
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${isCustomer ? 'bg-[#95EC69] text-gray-900 rounded-tr-sm' : isBot ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm' : 'bg-blue-50 border border-blue-100 text-gray-800 rounded-tl-sm'}`}>
          {msg.content}
        </div>
        <p className={`text-[10px] text-gray-400 mt-0.5 px-1 ${isCustomer ? 'text-right' : ''}`}>{msg.time}</p>
      </div>
    </div>
  )
}

// 评论互动数据
const comments = [
  { id: 1, platform: '小红书', platformIcon: '🔴', account: '湖北藕汤官方号', postTitle: '武汉必喝的莲藕排骨汤🍲', user: '吃货小鱼🐟', avatar: '🐟', content: '看起来好好喝！请问纺大店怎么走？', time: '5分钟前', likes: 3, replied: false, aiReply: '谢谢喜欢！纺大店在洪山区纺织路1号哦～导航搜"湖北藕汤纺大店"就能找到，每天10:30开始营业，欢迎来尝鲜！🍲', intent: '到店引导' },
  { id: 2, platform: '小红书', platformIcon: '🔴', account: '湖北藕汤官方号', postTitle: '武汉必喝的莲藕排骨汤🍲', user: '武汉美食地图', avatar: '🗺️', content: '人均多少钱呀？', time: '12分钟前', likes: 8, replied: false, aiReply: '人均35-50就能吃得很饱啦！推荐招牌双人套餐¥88，莲藕排骨汤+凉拌藕丁+藕夹+米饭，两个人刚好～', intent: '价格咨询' },
  { id: 3, platform: '抖音', platformIcon: '⬛', account: '湖北藕汤·纺大店', postTitle: '熬汤4小时的秘密', user: '爱喝汤的老王', avatar: '👴', content: '真的熬4小时吗？不是预制汤包吧', time: '28分钟前', likes: 15, replied: false, aiReply: '真的是每天凌晨4点开始熬的！我们用的是洪湖莲藕+土猪排骨，小火慢炖4小时，汤色奶白是自然熬出来的，绝对不是汤包哈～欢迎来后厨参观！', intent: '品质质疑' },
  { id: 4, platform: '小红书', platformIcon: '🔴', account: '湖北藕汤官方号', postTitle: '周末聚餐好去处', user: '甜甜圈女孩', avatar: '🍩', content: '可以预约吗？周末人多不多', time: '45分钟前', likes: 2, replied: true, myReply: '可以预约哒！周末建议11点前或者14点后来，避开高峰～私信我可以帮您留位哦😊', intent: '预约咨询' },
  { id: 5, platform: '抖音', platformIcon: '⬛', account: '湖北藕汤·纺大店', postTitle: '顾客实拍藕汤', user: '暴躁老哥', avatar: '😤', content: '上次去等了快一个小时 差评', time: '1小时前', likes: 22, replied: false, aiReply: '非常抱歉给您带来不好的体验🙏 高峰期确实等位较长，我们已经在优化出餐流程了。下次来可以提前在抖音预约，到店优先安排！再给您一张8折券作为补偿，私信我领取～', intent: '投诉处理' },
  { id: 6, platform: '大众点评', platformIcon: '🟠', account: '湖北藕汤纺大店', postTitle: '店铺评论区', user: '点评用户A', avatar: '👩', content: '藕汤确实不错，但是服务态度一般', time: '2小时前', likes: 5, replied: true, myReply: '感谢您的认可和反馈！服务方面我们一定加强培训，下次来一定给您更好的体验。回复本条评论可领取甜品一份哦～', intent: '服务反馈' },
  { id: 7, platform: '小红书', platformIcon: '🔴', account: '员工-小美', postTitle: '打工人的午餐日记', user: 'Lily在武汉', avatar: '🌸', content: '这个一人食套餐在哪点？美团有吗', time: '3小时前', likes: 6, replied: false, aiReply: '美团和抖音都可以点哦！搜"湖北藕汤"就能找到～一人食精选套餐¥38，莲藕排骨汤+凉拌藕丁+米饭，性价比超高的！', intent: '购买引导' },
]

// 私信数据
const directMessages = [
  { id: 1, platform: '小红书', platformIcon: '🔴', user: '吃货小鱼🐟', avatar: '🐟', lastMsg: '好的谢谢！那我周末去～', time: '3分钟前', unread: 0, status: 'resolved' as const, msgCount: 5, intent: '到店咨询' },
  { id: 2, platform: '小红书', platformIcon: '🔴', user: '美食博主CC', avatar: '📷', lastMsg: '想合作探店，可以聊一下吗？', time: '15分钟前', unread: 1, status: 'pending' as const, msgCount: 2, intent: '商务合作' },
  { id: 3, platform: '抖音', platformIcon: '⬛', user: '武汉吃喝玩乐', avatar: '🎬', lastMsg: '团购套餐怎么核销？', time: '32分钟前', unread: 1, status: 'pending' as const, msgCount: 3, intent: '核销问题' },
  { id: 4, platform: '小红书', platformIcon: '🔴', user: '减肥中的胖子', avatar: '🐷', lastMsg: '有没有低卡套餐推荐？', time: '1小时前', unread: 1, status: 'pending' as const, msgCount: 1, intent: '产品咨询' },
  { id: 5, platform: '抖音', platformIcon: '⬛', user: '暴躁老哥', avatar: '😤', lastMsg: '', time: '1小时前', unread: 0, status: 'waiting' as const, msgCount: 0, intent: '投诉跟进（已发券，等回复）' },
  { id: 6, platform: '大众点评', platformIcon: '🟠', user: '匿名用户', avatar: '👤', lastMsg: '请问可以带宠物吗', time: '3小时前', unread: 1, status: 'pending' as const, msgCount: 1, intent: '到店咨询' },
]

const dmStatusConfig = {
  pending: { label: '待回复', color: 'bg-red-50 text-red-600' },
  resolved: { label: '已处理', color: 'bg-green-50 text-green-600' },
  waiting: { label: '等回复', color: 'bg-yellow-50 text-yellow-600' },
}

export default function ServicePage() {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(conversations[0] || null)
  const [commentFilter, setCommentFilter] = useState('全部')
  const [chatInput, setChatInput] = useState('')
  const [extraMessages, setExtraMessages] = useState<Record<string, Message[]>>({})
  const [repliedComments, setRepliedComments] = useState<Record<number, string>>({})
  const [repliedDMs, setRepliedDMs] = useState<Set<number>>(new Set())
  const [showKBModal, setShowKBModal] = useState(false)
  const [kbForm, setKbForm] = useState({ question: '', answer: '', category: '产品' })
  const [ruleToggles, setRuleToggles] = useState(autoReplyRules.map(r => r.enabled))
  const { currentStore } = useStore()
  const { toast } = useToast()

  const unrepliedComments = comments.filter(c => !c.replied && !repliedComments[c.id]).length
  const pendingDMs = directMessages.filter(d => d.status === 'pending' && !repliedDMs.has(d.id)).length

  const handleSendChat = () => {
    if (!chatInput.trim() || !selectedConv) return
    const msg: Message = { id: Date.now().toString(), sender: 'staff', content: chatInput, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }
    setExtraMessages(prev => ({ ...prev, [selectedConv.id]: [...(prev[selectedConv.id] || []), msg] }))
    setChatInput('')
    toast('success', '消息已发送')
  }

  const handleCommentReply = (commentId: number, reply: string) => {
    setRepliedComments(prev => ({ ...prev, [commentId]: reply }))
    toast('success', '评论回复已发送')
  }

  const handleDMReply = (dmId: number) => {
    setRepliedDMs(prev => new Set(prev).add(dmId))
    toast('success', '私信已标记处理')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">客服中心</h1>
        <p className="text-gray-500 mt-1">在线客服 · 评论互动 · 私信管理 · 全平台统一处理</p>
      </div>

      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-1.5 ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab}
            {i === 1 && unrepliedComments > 0 && <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${activeTab === i ? 'bg-white/20' : 'bg-red-500 text-white'}`}>{unrepliedComments}</span>}
            {i === 2 && pendingDMs > 0 && <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${activeTab === i ? 'bg-white/20' : 'bg-red-500 text-white'}`}>{pendingDMs}</span>}
          </button>
        ))}
      </div>

      {/* ===== 在线客服 ===== */}
      {activeTab === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '今日会话', value: serviceStats.today.totalConversations.toString(), icon: MessageCircle, color: 'text-blue-600 bg-blue-50' },
              { label: 'AI处理率', value: Math.round(serviceStats.today.botHandled / serviceStats.today.totalConversations * 100) + '%', icon: Bot, color: 'text-green-600 bg-green-50' },
              { label: '平均响应', value: serviceStats.today.avgResponseTime + 's', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
              { label: '满意度', value: serviceStats.today.satisfactionRate + '%', icon: ThumbsUp, color: 'text-purple-600 bg-purple-50' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500">{s.label}</span><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="w-4 h-4" /></div></div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: '500px' }}>
            {/* 会话列表 */}
            <div className="border-r border-gray-100 overflow-y-auto">
              <div className="p-3 border-b border-gray-100">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="搜索会话..." className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg border-none outline-none" /></div>
              </div>
              {conversations.map(conv => (
                <div key={conv.id} onClick={() => setSelectedConv(conv)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 ${selectedConv?.id === conv.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm shrink-0">{conv.platformIcon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 truncate">{conv.customer}</span>
                      <span className="text-[10px] text-gray-400 shrink-0">{conv.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-gray-500 truncate">{conv.lastMsg}</p>
                      {conv.unread > 0 && <span className="w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center shrink-0">{conv.unread}</span>}
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColors[conv.status]}`}>{statusLabels[conv.status]}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* 聊天区 */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConv ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedConv.customer}</p>
                      <p className="text-xs text-gray-400">{selectedConv.platform}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[selectedConv.status]}`}>{statusLabels[selectedConv.status]}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f5f5f5]">
                    {selectedConv.messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}
                    {(extraMessages[selectedConv.id] || []).map(msg => <ChatBubble key={msg.id} msg={msg} />)}
                  </div>
                  <div className="p-3 border-t border-gray-100 flex gap-2">
                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()} placeholder="输入回复..." className="flex-1 px-4 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 outline-none" />
                    <button onClick={handleSendChat} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"><Send className="w-4 h-4" /></button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">选择一个会话开始回复</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== 评论互动 ===== */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '今日新评论', value: comments.length.toString(), icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
              { label: '待回复', value: unrepliedComments.toString(), icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
              { label: '已回复', value: comments.filter(c => c.replied).length.toString(), icon: Check, color: 'text-green-600 bg-green-50' },
              { label: '互动引流', value: '3人', icon: ArrowRight, color: 'text-purple-600 bg-purple-50' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500">{s.label}</span><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="w-4 h-4" /></div></div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {['全部', '小红书', '抖音', '大众点评'].map(p => (
              <button key={p} onClick={() => setCommentFilter(p)} className={`px-3 py-1.5 text-xs rounded-lg ${commentFilter === p ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{p}</button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400">💡 评论互动需先在「内容营销→账号矩阵」绑定账号</span>
            </div>
          </div>

          <div className="space-y-3">
            {comments.filter(c => commentFilter === '全部' || c.platform === commentFilter).map(comment => {
              const isReplied = comment.replied || !!repliedComments[comment.id]
              return (
              <div key={comment.id} className={`bg-white rounded-xl p-5 border shadow-sm ${!isReplied ? 'border-orange-200' : 'border-gray-100'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{comment.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                      <span className="text-xs text-gray-400">{comment.platformIcon} {comment.platform} · {comment.account}</span>
                      <span className="text-xs text-gray-400">· {comment.time}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${isReplied ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                        {isReplied ? '已回复' : '待回复'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">评论于「{comment.postTitle}」</p>
                    <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{comment.likes}</span>
                      <span className={`px-2 py-0.5 rounded-full ${comment.intent === '投诉处理' ? 'bg-red-50 text-red-600' : comment.intent === '品质质疑' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>{comment.intent}</span>
                    </div>

                    {(isReplied) && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <p className="text-xs text-green-700">💬 已回复：{repliedComments[comment.id] || comment.myReply}</p>
                      </div>
                    )}

                    {!isReplied && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-xs text-purple-700 mb-2">🤖 AI建议回复：</p>
                        <p className="text-xs text-gray-700">{comment.aiReply}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleCommentReply(comment.id, comment.aiReply || '')} className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 flex items-center gap-1"><Send className="w-3 h-3" />采纳发送</button>
                          <button onClick={() => { const r = prompt('编辑回复内容：', comment.aiReply || ''); if (r) handleCommentReply(comment.id, r) }} className="px-3 py-1.5 bg-white text-xs text-gray-600 rounded-lg border hover:bg-gray-50">编辑后发</button>
                          <button onClick={() => toast('info', '已忽略该评论')} className="px-3 py-1.5 bg-white text-xs text-gray-600 rounded-lg border hover:bg-gray-50">忽略</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      )}

      {/* ===== 私信管理 ===== */}
      {activeTab === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '今日私信', value: directMessages.length.toString(), icon: MessageCircle, color: 'text-blue-600 bg-blue-50' },
              { label: '待回复', value: pendingDMs.toString(), icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
              { label: '已处理', value: directMessages.filter(d => d.status === 'resolved').length.toString(), icon: Check, color: 'text-green-600 bg-green-50' },
              { label: '商务合作', value: directMessages.filter(d => d.intent === '商务合作').length.toString(), icon: Star, color: 'text-yellow-600 bg-yellow-50' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500">{s.label}</span><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="w-4 h-4" /></div></div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="divide-y divide-gray-50">
              {directMessages.map(dm => {
                const isDmReplied = repliedDMs.has(dm.id)
                const effectiveStatus = isDmReplied ? 'resolved' : dm.status
                const stCfg = dmStatusConfig[effectiveStatus as keyof typeof dmStatusConfig] || dmStatusConfig.pending
                return (
                  <div key={dm.id} onClick={() => { if (!isDmReplied && dm.status === 'pending') handleDMReply(dm.id) }}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer ${effectiveStatus === 'pending' ? 'bg-orange-50/30' : ''}`}>
                    <div className="relative">
                      <span className="text-2xl">{dm.avatar}</span>
                      <span className="absolute -bottom-1 -right-1 text-xs">{dm.platformIcon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-gray-900">{dm.user}</span>
                        <span className="text-xs text-gray-400">{dm.platform}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${stCfg.color}`}>{stCfg.label}</span>
                        {dm.unread > 0 && <span className="w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{dm.unread}</span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{dm.lastMsg || '（等待用户回复）'}</p>
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full mt-1 inline-block">{dm.intent}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">{dm.time}</p>
                      <p className="text-xs text-gray-400 mt-1">{dm.msgCount}条消息</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== 知识库 ===== */}
      {activeTab === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">AI客服和评论互动均基于知识库回复</p>
            <button onClick={() => setShowKBModal(true)} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"><Plus className="w-4 h-4" />添加条目</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {knowledgeBase.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.category === '产品' ? 'bg-blue-50 text-blue-600' : item.category === '服务' ? 'bg-green-50 text-green-600' : item.category === '优惠' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>{item.category}</span>
                  <span className="text-xs text-gray-400">被引用 {item.hitCount} 次</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">{item.question}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">自动回复规则</h3>
            <div className="space-y-2">
              {autoReplyRules.map((rule, i) => (
                <div key={rule.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${ruleToggles[i] ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{rule.trigger}</p>
                    <p className="text-xs text-gray-500">→ {rule.reply} · 命中{rule.hitCount}次</p>
                  </div>
                  <button onClick={() => { const n = [...ruleToggles]; n[i] = !n[i]; setRuleToggles(n); toast(n[i] ? 'success' : 'info', `自动回复规则「${rule.trigger}」已${n[i] ? '启用' : '关闭'}`) }}
                    className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${ruleToggles[i] ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{ruleToggles[i] ? '启用' : '关闭'}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Base Add Modal */}
      <Modal open={showKBModal} onClose={() => setShowKBModal(false)} title="添加知识库条目" footer={
        <>
          <button onClick={() => setShowKBModal(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">取消</button>
          <button onClick={() => { toast('success', '知识库条目已添加'); setShowKBModal(false); setKbForm({ question: '', answer: '', category: '产品' }) }} className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">添加</button>
        </>
      }>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select value={kbForm.category} onChange={e => setKbForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
              {['产品', '服务', '优惠', '其他'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">常见问题</label>
            <input value={kbForm.question} onChange={e => setKbForm(f => ({ ...f, question: e.target.value }))} placeholder="例：你们的汤是现熬的吗？" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标准回复</label>
            <textarea value={kbForm.answer} onChange={e => setKbForm(f => ({ ...f, answer: e.target.value }))} placeholder="输入标准回复内容..." rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
