'use client'
import { useState } from 'react'
import { CheckCircle, Clock, AlertTriangle, ListTodo, FileText, Send, Eye, Settings, ChevronDown, Plus, MessageSquare, Calendar, Bell, Smartphone, Check } from 'lucide-react'
import { mockTasks } from '@/lib/mock-data'
import { useStore } from '@/lib/store-context'

const tabs = ['任务看板', '日报/周报', 'SOP管理']
const priorityColors = { high: 'bg-red-50 text-red-600', medium: 'bg-yellow-50 text-yellow-600', low: 'bg-gray-100 text-gray-500' }
const priorityLabels = { high: '紧急', medium: '普通', low: '低优' }

// 日报/周报配置
const reportConfig = {
  daily: {
    enabled: true,
    time: '20:00',
    groups: ['老板群', '纺大店店长群', '运营管理群'],
    metrics: ['营业额', '订单量', '新增评价', '综合评分', '差评预警', '爆款菜品', '推广余额'],
  },
  weekly: {
    enabled: true,
    day: '周一',
    time: '09:00',
    groups: ['老板群', '运营管理群'],
    metrics: ['周营业额对比', '周订单趋势', '评分变化', '好差评分析', '套餐排行', '各平台数据', '竞品动态', 'AI建议'],
  },
}

// 模拟历史报告
const reportHistory = [
  { id: 1, type: 'daily' as const, date: '2026-03-09', status: 'sent', groups: 3, time: '20:00' },
  { id: 2, type: 'daily' as const, date: '2026-03-08', status: 'sent', groups: 3, time: '20:00' },
  { id: 3, type: 'weekly' as const, date: '2026-03-08', status: 'sent', groups: 2, time: '09:00' },
  { id: 4, type: 'daily' as const, date: '2026-03-07', status: 'sent', groups: 3, time: '20:00' },
  { id: 5, type: 'daily' as const, date: '2026-03-06', status: 'sent', groups: 3, time: '20:00' },
]

// SOP模板
const sopTemplates = [
  { id: 1, name: '开店SOP', tasks: 8, status: 'active', desc: '每日开店前检查清单：卫生、设备、食材、人员到岗', time: '09:00' },
  { id: 2, name: '午高峰SOP', tasks: 5, status: 'active', desc: '11:00-13:00高峰期操作规范：备菜、出餐、服务', time: '10:30' },
  { id: 3, name: '闭店SOP', tasks: 6, status: 'active', desc: '每日闭店清洁、盘点、设备关闭检查', time: '22:00' },
  { id: 4, name: '差评处理SOP', tasks: 4, status: 'active', desc: '收到差评后30分钟内响应流程', time: '实时触发' },
  { id: 5, name: '新员工培训SOP', tasks: 12, status: 'draft', desc: '新入职员工7天培训流程', time: '入职触发' },
]

function DailyReportPreview() {
  const { currentStore } = useStore()
  const today = new Date()
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`

  return (
    <div className="max-w-md mx-auto">
      {/* 模拟微信消息气泡 */}
      <div className="bg-[#95EC69] rounded-2xl rounded-tr-sm p-4 text-sm leading-relaxed text-gray-900 shadow-sm">
        <p className="font-bold mb-2">📊 【{currentStore.shortName || currentStore.name}】{dateStr}经营日报</p>
        <p className="mb-2">━━━━━━━━━━━━</p>
        <p>💰 今日营收：¥6,850（<span className="text-green-800">↑12%</span> vs昨日）</p>
        <p>📦 订单量：137单（<span className="text-green-800">↑8%</span>）</p>
        <p>👤 新客：32人 | 回头客：105人</p>
        <p>⭐ 新增评价：8条（好评7 · 差评1）</p>
        <p>📈 综合评分：4.6（持平）</p>
        <p className="mb-2"></p>
        <p className="font-bold">⚠️ 需关注：</p>
        <p>• 1条差评待回复（已生成AI建议）</p>
        <p>• 美团推广通余额¥128，预计明天耗尽</p>
        <p>• 午高峰等餐时间35min，超标准</p>
        <p className="mb-2"></p>
        <p>🔥 今日爆款TOP3：</p>
        <p>1. 招牌排骨藕汤 42份</p>
        <p>2. 一人食套餐 38份</p>
        <p>3. 抖音限定套餐 35份</p>
        <p className="mb-2"></p>
        <p>📱 各平台：</p>
        <p>美团 ¥2,850 | 点评 ¥1,620 | 抖音 ¥1,280</p>
        <p>京东 ¥680 | 高德 ¥280 | 闪购 ¥140</p>
        <p className="mb-2">━━━━━━━━━━━━</p>
        <p className="text-xs text-gray-600">🤖 由智店AI自动生成 | 查看详情请登录后台</p>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">↑ 微信群中收到的日报效果预览</p>
    </div>
  )
}

function WeeklyReportPreview() {
  const { currentStore } = useStore()

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-[#95EC69] rounded-2xl rounded-tr-sm p-4 text-sm leading-relaxed text-gray-900 shadow-sm">
        <p className="font-bold mb-2">📊 【{currentStore.shortName || currentStore.name}】第10周经营周报</p>
        <p className="text-xs text-gray-600 mb-2">3月3日 - 3月9日</p>
        <p className="mb-2">━━━━━━━━━━━━</p>
        <p className="font-bold">📈 本周概览</p>
        <p>💰 周营收：¥47,950（<span className="text-green-800">↑8.3%</span> vs上周）</p>
        <p>📦 周订单：959单（<span className="text-green-800">↑5.2%</span>）</p>
        <p>👤 新客占比：28%（<span className="text-red-800">↓3%</span>）</p>
        <p>⭐ 评分变化：4.6 → 4.6（持平）</p>
        <p className="mb-2"></p>
        <p className="font-bold">🏆 本周亮点</p>
        <p>✅ 抖音限定套餐销量破300份，增速35%</p>
        <p>✅ 菌菇藕汤好评率98%，成为新爆品</p>
        <p>✅ 评价回复率提升至95%</p>
        <p className="mb-2"></p>
        <p className="font-bold">⚠️ 待改进</p>
        <p>• 午高峰等餐时间偏长（均32min）</p>
        <p>• 新客占比下降，需加强拉新</p>
        <p>• 莲藕丸子汤销量连续2周下滑</p>
        <p className="mb-2"></p>
        <p className="font-bold">🔮 AI建议（下周重点）</p>
        <p>1. 推出"午市加速套餐"缩短出餐时间</p>
        <p>2. 抖音加投￥500，目标新客+50人</p>
        <p>3. 莲藕丸子汤做限时"买一送一"止跌</p>
        <p className="mb-2"></p>
        <p className="font-bold">📊 套餐排行</p>
        <p>1. 抖音限定套餐 302份 ¥12,060</p>
        <p>2. 一人食套餐 248份 ¥11,160</p>
        <p>3. 招牌双人套餐 176份 ¥17,248</p>
        <p>4. 尝鲜套餐 135份 ¥9,180</p>
        <p>5. 家庭欢聚套餐 89份 ¥14,952</p>
        <p className="mb-2">━━━━━━━━━━━━</p>
        <p className="text-xs text-gray-600">🤖 由智店AI自动生成 | 数据来源：6平台汇总</p>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">↑ 微信群中收到的周报效果预览</p>
    </div>
  )
}

export default function OpsPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily')
  const [previewMode, setPreviewMode] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">运营Agent</h1>
          <p className="text-gray-500 mt-1">任务看板 · 日报/周报 · SOP管理</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">新建任务</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        /* 任务看板 */
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '待处理', value: mockTasks.filter(t => t.status === 'pending').length, icon: Clock, color: 'text-yellow-500' },
              { label: '进行中', value: mockTasks.filter(t => t.status === 'in_progress').length, icon: ListTodo, color: 'text-blue-500' },
              { label: '已完成', value: mockTasks.filter(t => t.status === 'done').length, icon: CheckCircle, color: 'text-green-500' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
                <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100"><h3 className="font-semibold text-gray-900">任务列表</h3></div>
            <div className="divide-y divide-gray-50">
              {mockTasks.map(t => (
                <div key={t.id} className="flex items-center justify-between p-5 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${t.status === 'done' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {t.status === 'done' ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Clock className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${t.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{t.title}</p>
                      <p className="text-xs text-gray-400">{t.agent} · {t.dueTime}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[t.priority]}`}>{priorityLabels[t.priority]}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 1 && (
        /* 日报/周报 */
        <div className="space-y-4">
          {/* 切换日报/周报 */}
          <div className="flex gap-2">
            <button onClick={() => { setReportType('daily'); setPreviewMode(false) }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${reportType === 'daily' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-600 border border-gray-200'}`}>
              📋 经营日报
            </button>
            <button onClick={() => { setReportType('weekly'); setPreviewMode(false) }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${reportType === 'weekly' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-600 border border-gray-200'}`}>
              📊 经营周报
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 配置面板 */}
            <div className="space-y-4">
              {/* 推送设置 */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {reportType === 'daily' ? '日报推送设置' : '周报推送设置'}
                  </h3>
                  <div className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition ${reportType === 'daily' ? (reportConfig.daily.enabled ? 'bg-primary-600' : 'bg-gray-200') : (reportConfig.weekly.enabled ? 'bg-primary-600' : 'bg-gray-200')}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${(reportType === 'daily' ? reportConfig.daily.enabled : reportConfig.weekly.enabled) ? 'translate-x-5' : ''}`} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">推送时间</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {reportType === 'daily' ? `每天 ${reportConfig.daily.time}` : `${reportConfig.weekly.day} ${reportConfig.weekly.time}`}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">推送群组</span>
                    </div>
                    <div className="space-y-2">
                      {(reportType === 'daily' ? reportConfig.daily.groups : reportConfig.weekly.groups).map(group => (
                        <div key={group} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{group}</span>
                          </div>
                          <span className="text-xs text-green-600">已连接</span>
                        </div>
                      ))}
                      <button className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 px-3 py-2">
                        <Plus className="w-3.5 h-3.5" />添加推送群组
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">包含指标</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(reportType === 'daily' ? reportConfig.daily.metrics : reportConfig.weekly.metrics).map(m => (
                        <span key={m} className="text-xs px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />{m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => setPreviewMode(true)} className="flex-1 py-2 bg-white border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1.5">
                    <Eye className="w-4 h-4" />预览报告
                  </button>
                  <button className="flex-1 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 flex items-center justify-center gap-1.5">
                    <Send className="w-4 h-4" />立即发送
                  </button>
                </div>
              </div>

              {/* 发送历史 */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">发送历史</h3>
                <div className="space-y-2">
                  {reportHistory.filter(r => r.type === reportType).map(r => (
                    <div key={r.id} className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-900">{r.date} {r.type === 'daily' ? '日报' : '周报'}</p>
                          <p className="text-xs text-gray-400">推送至{r.groups}个群 · {r.time}</p>
                        </div>
                      </div>
                      <button className="text-xs text-primary-600 hover:text-primary-700">查看</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 预览面板 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-gray-400" />
                {reportType === 'daily' ? '日报预览' : '周报预览'}
              </h3>
              <div className="bg-[#EDEDED] rounded-xl p-4">
                {reportType === 'daily' ? <DailyReportPreview /> : <WeeklyReportPreview />}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        /* SOP管理 */
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: '运行中SOP', value: sopTemplates.filter(s => s.status === 'active').length },
              { label: '今日完成任务', value: '24/28' },
              { label: '完成率', value: '85.7%' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {sopTemplates.map(sop => (
              <div key={sop.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{sop.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${sop.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {sop.status === 'active' ? '运行中' : '草稿'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />{sop.time}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{sop.desc}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">{sop.tasks}个检查项</span>
                  <div className="flex gap-2">
                    <button className="text-xs text-primary-600 hover:text-primary-700">编辑</button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">查看执行记录</button>
                  </div>
                </div>
                {sop.status === 'active' && (
                  <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-500 rounded-full h-1.5" style={{ width: `${Math.floor(60 + Math.random() * 35)}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
