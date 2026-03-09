'use client'
import { useState } from 'react'
import { MessageCircle, Bot, Clock, Users, Send, Smile, Paperclip, Phone, MoreVertical, ArrowLeft, Search, ThumbsUp, Zap, BookOpen, BarChart3, Settings, User, Check, AlertTriangle, TrendingUp, Plus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { conversations, knowledgeBase, serviceStats, autoReplyRules, type Conversation, type Message } from '@/lib/service-data'
import { useStore } from '@/lib/store-context'

const tabs = ['会话列表', '数据统计', '知识库', '自动回复设置']
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
      <div className={`max-w-[75%]`}>
        {!isCustomer && (
          <p className="text-[10px] text-gray-400 mb-0.5 px-1">
            {isBot ? 'AI客服' : '张店长（人工）'}
          </p>
        )}
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${isCustomer ? 'bg-[#95EC69] text-gray-900 rounded-tr-sm' : isBot ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm' : 'bg-blue-50 border border-blue-100 text-gray-800 rounded-tl-sm'}`}>
          {msg.content}
        </div>
        <p className={`text-[10px] text-gray-400 mt-0.5 px-1 ${isCustomer ? 'text-right' : ''}`}>
          {msg.time}
          {!isCustomer && msg.status && (
            <span className="ml-1">{msg.status === 'read' ? '✓✓' : '✓'}</span>
          )}
        </p>
      </div>
    </div>
  )
}

function ChatWindow({ conversation, onBack }: { conversation: Conversation; onBack: () => void }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(conversation.messages)
  const [mode, setMode] = useState(conversation.status)

  const handleSend = () => {
    if (!input.trim()) return
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      sender: mode === 'bot' ? 'bot' : 'staff',
      content: input,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    }
    setMessages([...messages, newMsg])
    setInput('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Chat header */}
      <div className="bg-white rounded-t-xl border border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="lg:hidden p-1">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
            {conversation.platformIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{conversation.customer}</span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{conversation.platform}</span>
            </div>
            <span className={`text-xs px-1.5 py-0.5 rounded ${statusColors[mode]}`}>{statusLabels[mode]}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'bot' ? (
            <button onClick={() => setMode('staff')} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center gap-1">
              <User className="w-3 h-3" />转人工
            </button>
          ) : mode === 'staff' ? (
            <button onClick={() => setMode('bot')} className="px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-1">
              <Bot className="w-3 h-3" />转AI
            </button>
          ) : null}
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#F5F5F5] p-4 space-y-4">
        <div className="text-center">
          <span className="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full">今天</span>
        </div>
        {mode !== 'closed' && (
          <div className="text-center">
            <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
              {mode === 'bot' ? '🤖 AI客服已接入，平均响应<3秒' : '👤 人工客服已接入'}
            </span>
          </div>
        )}
        {messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}
      </div>

      {/* Input */}
      {mode !== 'closed' && (
        <div className="bg-white border-t border-gray-200 rounded-b-xl p-3">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-gray-50 rounded-xl border border-gray-200 px-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={mode === 'bot' ? 'AI自动回复中，也可手动输入...' : '输入回复内容...'}
                className="flex-1 py-2.5 bg-transparent text-sm outline-none"
              />
              <Smile className="w-5 h-5 text-gray-300 cursor-pointer hover:text-gray-500" />
            </div>
            <button onClick={handleSend} disabled={!input.trim()} className="px-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
          {mode === 'bot' && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {['菜品推荐', '排队预约', '优惠活动', '外卖打包'].map(q => (
                <button key={q} onClick={() => setInput(`[快捷回复] ${q}`)} className="text-xs px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full whitespace-nowrap hover:bg-primary-100">
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ServicePage() {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [searchText, setSearchText] = useState('')
  const { currentStore } = useStore()

  const filteredConvs = conversations.filter(c =>
    !searchText || c.customer.includes(searchText) || c.lastMsg.includes(searchText)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客服Agent</h1>
          <p className="text-gray-500 mt-1">智能客服 · AI自动回复 · 人工协作</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: '今日会话', value: serviceStats.today.totalConversations.toString(), icon: MessageCircle },
          { label: 'AI处理', value: `${serviceStats.today.botHandled}（${Math.round(serviceStats.today.botHandled / serviceStats.today.totalConversations * 100)}%）`, icon: Bot },
          { label: '人工处理', value: serviceStats.today.staffHandled.toString(), icon: Users },
          { label: '平均响应', value: `${serviceStats.today.avgResponseTime}秒`, icon: Clock },
          { label: '满意度', value: `${serviceStats.today.satisfactionRate}%`, icon: ThumbsUp },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{s.label}</span>
              <s.icon className="w-4 h-4 text-gray-300" />
            </div>
            <div className="text-lg font-bold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => { setActiveTab(i); setSelectedConv(null) }} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        /* 会话列表 + 聊天窗口 */
        <div className="flex gap-4 min-h-[500px]">
          {/* 会话列表 */}
          <div className={`w-full lg:w-96 shrink-0 space-y-2 ${selectedConv ? 'hidden lg:block' : ''}`}>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="搜索会话..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            {filteredConvs.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`bg-white rounded-xl p-4 border shadow-sm cursor-pointer transition ${selectedConv?.id === conv.id ? 'border-primary-400 ring-2 ring-primary-100' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center text-lg shrink-0">
                    {conv.platformIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">{conv.customer}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColors[conv.status]}`}>
                          {conv.status === 'bot' ? 'AI' : conv.status === 'staff' ? '人工' : '结束'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{conv.lastMsg}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {conv.tags.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>)}
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shrink-0">{conv.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 聊天窗口 */}
          <div className={`flex-1 ${!selectedConv ? 'hidden lg:flex items-center justify-center' : ''}`}>
            {selectedConv ? (
              <ChatWindow conversation={selectedConv} onBack={() => setSelectedConv(null)} />
            ) : (
              <div className="text-center text-gray-400">
                <MessageCircle className="w-16 h-16 mx-auto mb-3 opacity-20" />
                <p className="text-lg">选择一个会话开始查看</p>
                <p className="text-sm mt-1">或等待新消息进入</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 1 && (
        /* 数据统计 */
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">每小时咨询量</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={serviceStats.hourlyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" name="咨询量" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">热门问题TOP 5</h3>
              <div className="space-y-3">
                {serviceStats.topQuestions.map((q, i) => (
                  <div key={q.question} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</span>
                    <span className="text-sm text-gray-700 flex-1">{q.question}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div className="bg-primary-500 rounded-full h-2" style={{ width: `${q.count / serviceStats.topQuestions[0].count * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{q.count}次</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">AI效能分析</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'AI解决率', value: '91.5%', desc: '无需人工即解决', color: 'text-green-600' },
                { label: 'AI响应时间', value: '<3秒', desc: '平均2.8秒', color: 'text-primary-600' },
                { label: '转人工率', value: '8.5%', desc: '仅复杂问题转人工', color: 'text-yellow-600' },
                { label: '节省人力', value: '约2人', desc: '相当于2个全职客服', color: 'text-purple-600' },
              ].map(s => (
                <div key={s.label} className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <p className="text-sm font-medium text-gray-900 mt-1">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        /* 知识库 */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">AI根据知识库自动回答客户问题，命中率越高说明问题越常见</p>
            <button className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />添加问答
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-5 text-gray-500 font-medium">分类</th>
                  <th className="text-left py-3 px-5 text-gray-500 font-medium">问题</th>
                  <th className="text-left py-3 px-5 text-gray-500 font-medium">回答</th>
                  <th className="text-right py-3 px-5 text-gray-500 font-medium">命中次数</th>
                </tr>
              </thead>
              <tbody>
                {knowledgeBase.sort((a, b) => b.hitCount - a.hitCount).map(kb => (
                  <tr key={kb.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-5"><span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">{kb.category}</span></td>
                    <td className="py-3 px-5 font-medium text-gray-900">{kb.question}</td>
                    <td className="py-3 px-5 text-gray-600 max-w-xs truncate">{kb.answer}</td>
                    <td className="py-3 px-5 text-right">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{kb.hitCount}次</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        /* 自动回复设置 */
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">AI自动回复规则</h3>
            <p className="text-sm text-gray-500 mb-4">当客户消息包含关键词时，AI自动匹配回复。支持模糊匹配和语义理解。</p>
            <div className="space-y-3">
              {autoReplyRules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">触发词：{rule.trigger}</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">→ {rule.reply}</p>
                    <p className="text-xs text-gray-400 ml-6 mt-0.5">已触发 {rule.hitCount} 次</p>
                  </div>
                  <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition ${rule.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${rule.enabled ? 'translate-x-5' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700">
              <Plus className="w-4 h-4" />添加自动回复规则
            </button>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">高级设置</h3>
            {[
              { label: '非营业时间自动回复', desc: '22:00-10:00自动告知营业时间并引导留言', enabled: true },
              { label: '客诉自动转人工', desc: '检测到投诉/不满情绪自动转人工客服', enabled: true },
              { label: '超时未回复提醒', desc: '人工接待超过5分钟未回复时提醒', enabled: true },
              { label: '对话自动评价', desc: '会话结束后邀请客户评价满意度', enabled: false },
              { label: '敏感词过滤', desc: '自动过滤不当言论，保护品牌形象', enabled: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition ${item.enabled ? 'bg-primary-600' : 'bg-gray-200'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${item.enabled ? 'translate-x-5' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
