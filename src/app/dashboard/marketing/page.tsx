'use client'
import { useState } from 'react'
import { Zap, Gift, TrendingUp, QrCode, Sparkles, Eye, Copy, Share2, BarChart3, Smartphone, Plus, ExternalLink, Heart, MessageSquare, Users, Download, Pause, Play, Settings } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'
import { mockCampaigns } from '@/lib/mock-data'
import { seedCodes, aiGeneratedContent, seedCodeStats, userGeneratedPosts } from '@/lib/seedcode-data'
import { useStore } from '@/lib/store-context'

const tabs = ['种草码', '优惠活动', '种草内容预览', '数据分析']
const COLORS = ['#FF2442', '#FF4F00', '#000000', '#FF6B00']

const statusMap: Record<string, { label: string; color: string }> = {
  active: { label: '进行中', color: 'bg-green-50 text-green-600' },
  paused: { label: '已暂停', color: 'bg-yellow-50 text-yellow-600' },
  ended: { label: '已结束', color: 'bg-gray-100 text-gray-500' },
}

const typeLabels: Record<string, { label: string; icon: string }> = {
  table: { label: '桌面码', icon: '🪑' },
  takeaway: { label: '外卖码', icon: '📦' },
  poster: { label: '海报码', icon: '📱' },
  receipt: { label: '小票码', icon: '🧾' },
}

function PhoneMockup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="mx-auto w-[320px]">
      <div className="bg-black rounded-[2.5rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-gray-50 px-5 py-2 flex justify-between text-xs text-gray-500">
            <span>9:41</span>
            <span className="font-medium">{title}</span>
            <span>📶 🔋</span>
          </div>
          <div className="h-[500px] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}

function XiaohongshuPreview() {
  const c = aiGeneratedContent.xiaohongshu
  return (
    <PhoneMockup title="小红书">
      <div className="p-4">
        {/* 模拟图片 */}
        <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl h-48 flex items-center justify-center mb-3">
          <span className="text-5xl">🍲</span>
        </div>
        <h2 className="font-bold text-base text-gray-900 mb-2">{c.title}</h2>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs">👤</div>
          <span className="text-xs text-gray-500">顾客扫码自动生成</span>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{c.content}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {c.tags.map(t => <span key={t} className="text-xs text-red-500">#{t}</span>)}
        </div>
        <div className="flex items-center justify-around mt-4 pt-3 border-t border-gray-100 text-gray-400">
          <span className="flex items-center gap-1 text-xs"><Heart className="w-4 h-4" /> 234</span>
          <span className="flex items-center gap-1 text-xs"><MessageSquare className="w-4 h-4" /> 18</span>
          <span className="flex items-center gap-1 text-xs"><Share2 className="w-4 h-4" /> 分享</span>
        </div>
      </div>
    </PhoneMockup>
  )
}

function DouyinPreview() {
  const c = aiGeneratedContent.douyin
  return (
    <PhoneMockup title="抖音">
      <div className="bg-black text-white h-full relative">
        <div className="bg-gradient-to-b from-transparent via-black/20 to-black/80 h-full flex flex-col justify-end p-4">
          {/* 模拟视频背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 to-red-900/30 flex items-center justify-center">
            <span className="text-8xl opacity-50">🍲</span>
          </div>
          <div className="relative z-10">
            <p className="font-bold text-sm mb-2">@顾客昵称</p>
            <p className="text-xs text-gray-200 mb-1">{c.title}</p>
            <p className="text-xs text-gray-300 leading-relaxed line-clamp-4">{c.script.split('\n').slice(0, 3).join('\n')}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs text-cyan-400">#武汉美食</span>
              <span className="text-xs text-cyan-400">#藕汤</span>
              <span className="text-xs text-cyan-400">#武汉探店</span>
            </div>
          </div>
          {/* 右侧互动按钮 */}
          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5">
            <div className="text-center">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <span className="text-xs">1890</span>
            </div>
            <div className="text-center">
              <MessageSquare className="w-7 h-7" />
              <span className="text-xs">86</span>
            </div>
            <div className="text-center">
              <Share2 className="w-7 h-7" />
              <span className="text-xs">234</span>
            </div>
          </div>
        </div>
      </div>
    </PhoneMockup>
  )
}

function DianpingPreview() {
  const c = aiGeneratedContent.dianping
  return (
    <PhoneMockup title="大众点评">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">👤</div>
          <div>
            <p className="text-sm font-medium text-gray-900">顾客昵称</p>
            <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}</div>
          </div>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{c.content}</p>
        <div className="grid grid-cols-3 gap-1 mt-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg h-20 flex items-center justify-center">
              <span className="text-2xl">{['🍲', '🥢', '🍜'][i-1]}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex gap-4">
            <span className="text-xs text-gray-500 flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> 有用(12)</span>
            <span className="text-xs text-gray-500 flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> 回复(3)</span>
          </div>
          <span className="text-xs text-gray-400">刚刚</span>
        </div>
      </div>
    </PhoneMockup>
  )
}

function ThumbsUp(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [previewPlatform, setPreviewPlatform] = useState<'xiaohongshu' | 'douyin' | 'dianping'>('xiaohongshu')
  const { currentStore } = useStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">营销Agent</h1>
          <p className="text-gray-500 mt-1">种草码 · AI内容生成 · 优惠活动</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />创建种草码
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-x-auto">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        /* 种草码管理 */
        <div className="space-y-4">
          {/* 总览 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '总扫码量', value: seedCodeStats.totalScans.toLocaleString(), icon: QrCode },
              { label: '已发布内容', value: seedCodeStats.totalPublished.toLocaleString(), icon: Share2 },
              { label: '平均转化率', value: `${seedCodeStats.avgConversion}%`, icon: TrendingUp },
              { label: '预估曝光', value: `${(seedCodeStats.estimatedExposure / 10000).toFixed(1)}万`, icon: Eye },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <s.icon className="w-4 h-4 text-gray-300" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              </div>
            ))}
          </div>

          {/* 工作原理 */}
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-5 border border-primary-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />种草码工作原理
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                <span className="text-lg">📱</span>
                <span>顾客扫码</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                <span className="text-lg">🤖</span>
                <span>AI生成种草内容</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                <span className="text-lg">✏️</span>
                <span>顾客可编辑</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                <span className="text-lg">🚀</span>
                <span>一键发布到平台</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                <span className="text-lg">🎁</span>
                <span>获得奖励</span>
              </div>
            </div>
          </div>

          {/* 种草码列表 */}
          <div className="space-y-4">
            {seedCodes.map(code => {
              const typeInfo = typeLabels[code.type]
              return (
                <div key={code.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100">
                        {typeInfo.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{code.name}</h3>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{typeInfo.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${code.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                            {code.status === 'active' ? '运行中' : '已暂停'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">发布平台：</span>
                          {code.platforms.map(p => <span key={p} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">{p}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title={code.status === 'active' ? '暂停' : '启用'}>
                        {code.status === 'active' ? <Pause className="w-4 h-4 text-gray-400" /> : <Play className="w-4 h-4 text-green-500" />}
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="下载二维码">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="设置">
                        <Settings className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-lg font-bold text-gray-900">{code.scansTotal.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">总扫码</p>
                      <p className="text-[10px] text-green-600">今日 +{code.scansToday}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-lg font-bold text-gray-900">{code.publishedTotal}</p>
                      <p className="text-xs text-gray-500">已发布</p>
                      <p className="text-[10px] text-green-600">今日 +{code.publishedToday}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-lg font-bold text-primary-600">{code.conversionRate}%</p>
                      <p className="text-xs text-gray-500">转化率</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm font-medium text-gray-700">{code.template}</p>
                      <p className="text-xs text-gray-500">内容模板</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm font-medium text-orange-600">{code.reward || '无'}</p>
                      <p className="text-xs text-gray-500">奖励</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 1 && (
        /* 优惠活动 */
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: '进行中活动', value: '2', icon: Zap },
              { label: '本月发券', value: '779', icon: Gift },
              { label: '核销率', value: '42.3%', icon: TrendingUp },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <span className="text-sm text-gray-500">{s.label}</span>
                <div className="text-2xl font-bold text-gray-900 mt-1">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {mockCampaigns.map(c => {
              const s = statusMap[c.status]
              return (
                <div key={c.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{c.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                    </div>
                    <span className="text-xs text-gray-400">{c.platform}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div><p className="text-lg font-bold text-gray-900">{c.used}</p><p className="text-xs text-gray-500">已使用</p></div>
                    <div><p className="text-lg font-bold text-gray-900">¥{c.spent}</p><p className="text-xs text-gray-500">已花费</p></div>
                    <div><p className="text-lg font-bold text-gray-900">¥{c.budget}</p><p className="text-xs text-gray-500">总预算</p></div>
                    <div><p className="text-lg font-bold text-primary-600">{Math.round(c.spent / c.budget * 100)}%</p><p className="text-xs text-gray-500">消耗率</p></div>
                  </div>
                  <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-primary-600 rounded-full h-2 transition-all" style={{ width: `${Math.round(c.spent / c.budget * 100)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        /* 种草内容预览 */
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">AI生成内容预览</h3>
            <p className="text-sm text-gray-500 mb-4">顾客扫码后，AI会根据门店信息和菜品自动生成以下种草内容，顾客可编辑后一键发布</p>
            <div className="flex gap-2 mb-6">
              {[
                { key: 'xiaohongshu' as const, label: '📕 小红书笔记', color: 'bg-red-50 text-red-600 border-red-200' },
                { key: 'douyin' as const, label: '🎵 抖音视频脚本', color: 'bg-gray-100 text-gray-700 border-gray-300' },
                { key: 'dianping' as const, label: '⭐ 大众点评好评', color: 'bg-orange-50 text-orange-600 border-orange-200' },
              ].map(p => (
                <button key={p.key} onClick={() => setPreviewPlatform(p.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${previewPlatform === p.key ? p.color : 'bg-white text-gray-500 border-gray-200'}`}>
                  {p.label}
                </button>
              ))}
            </div>
            {previewPlatform === 'xiaohongshu' && <XiaohongshuPreview />}
            {previewPlatform === 'douyin' && <DouyinPreview />}
            {previewPlatform === 'dianping' && <DianpingPreview />}
          </div>

          {/* 最近发布 */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">最近发布的种草内容</h3>
            <div className="space-y-3">
              {userGeneratedPosts.map(post => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-700">{post.user[0]}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{post.user}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{post.platform}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{post.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-red-500 flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likes}</span>
                    <span className="text-xs text-gray-400">{post.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        /* 数据分析 */
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">扫码与发布趋势（近14天）</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={seedCodeStats.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="scans" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} name="扫码量" />
                  <Area type="monotone" dataKey="published" stroke="#10b981" fill="#d1fae5" strokeWidth={2} name="发布量" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">各平台发布占比</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={seedCodeStats.platformBreakdown} dataKey="published" nameKey="platform" cx="50%" cy="50%" outerRadius={70} innerRadius={40}
                    label={({ platform, percent }: any) => `${platform} ${(percent * 100).toFixed(0)}%`}>
                    {seedCodeStats.platformBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">各平台种草效果</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-gray-500 font-medium">平台</th>
                  <th className="text-right py-3 text-gray-500 font-medium">发布量</th>
                  <th className="text-right py-3 text-gray-500 font-medium">预估曝光</th>
                  <th className="text-right py-3 text-gray-500 font-medium">获得点赞</th>
                  <th className="text-right py-3 text-gray-500 font-medium">单篇均赞</th>
                </tr>
              </thead>
              <tbody>
                {seedCodeStats.platformBreakdown.map((p, i) => (
                  <tr key={p.platform} className="border-b border-gray-50">
                    <td className="py-3 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="font-medium text-gray-900">{p.platform}</span>
                    </td>
                    <td className="py-3 text-right text-gray-700">{p.published}</td>
                    <td className="py-3 text-right text-gray-700">{(p.exposure / 10000).toFixed(1)}万</td>
                    <td className="py-3 text-right text-red-500">{p.likes.toLocaleString()}</td>
                    <td className="py-3 text-right font-medium text-gray-900">{Math.round(p.likes / p.published)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
