'use client'
import { useState } from 'react'
import { Bot, Zap, MessageSquare, FileText, DollarSign, Bell, Package, Clock, CheckCircle, AlertTriangle, Send, Users, Plus, Calendar, Settings, TrendingUp, Eye, Heart } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { useToast } from '@/components/ui/toast'
import { Modal } from '@/components/ui/modal'

// 自动化规则
const autoRules = [
  { id: 1, name: '好评自动回复', desc: '4-5星好评使用AI生成个性化回复', enabled: true, todayCount: 18, icon: '👍', color: 'bg-green-50 border-green-200' },
  { id: 2, name: '中评智能回复', desc: '3星评价AI生成回复，需人工确认后发送', enabled: true, todayCount: 5, icon: '✋', color: 'bg-yellow-50 border-yellow-200' },
  { id: 3, name: '差评预警通知', desc: '1-2星差评立即推送到处理台+通知店长', enabled: true, todayCount: 2, icon: '🚨', color: 'bg-red-50 border-red-200' },
  { id: 4, name: '内容定时发布', desc: '按排期自动发布种草内容到各平台', enabled: true, todayCount: 3, icon: '📱', color: 'bg-blue-50 border-blue-200' },
  { id: 5, name: '推广余额预警', desc: '推广通/千川余额低于阈值时通知', enabled: true, todayCount: 1, icon: '💰', color: 'bg-purple-50 border-purple-200' },
  { id: 6, name: '库存不足提醒', desc: '套餐库存低于设定值时预警', enabled: false, todayCount: 0, icon: '📦', color: 'bg-gray-50 border-gray-200' },
  { id: 7, name: '客服自动应答', desc: '常见问题AI自动回复，复杂问题转人工', enabled: true, todayCount: 12, icon: '💬', color: 'bg-cyan-50 border-cyan-200' },
  { id: 8, name: '周报自动生成', desc: '每周一自动生成经营周报推送到群', enabled: true, todayCount: 0, icon: '📊', color: 'bg-indigo-50 border-indigo-200' },
]

// 执行动态
const activityLog = [
  { time: '14:32', type: 'reply' as const, text: '自动回复美团好评「藕汤炖得真入味，下次还来」', platform: '美团' },
  { time: '14:28', type: 'reply' as const, text: '自动回复点评好评「环境很温馨，适合聚餐」', platform: '大众点评' },
  { time: '14:15', type: 'reply' as const, text: '自动回复美团好评「排骨很烂，藕很粉，好评」', platform: '美团' },
  { time: '13:50', type: 'alert' as const, text: '检测到1星差评「等了40分钟」→ 已推送到评价处理台', platform: '美团' },
  { time: '13:30', type: 'reply' as const, text: '自动回复抖音好评「看视频来的，没失望」', platform: '抖音' },
  { time: '12:00', type: 'publish' as const, text: '自动发布小红书种草内容「武汉必喝的莲藕排骨汤🍲」', platform: '小红书' },
  { time: '11:30', type: 'publish' as const, text: '自动发布抖音短视频「熬汤4小时的秘密」', platform: '抖音' },
  { time: '10:30', type: 'alert' as const, text: '推广通余额¥128，预计明天耗尽 → 已通知店长', platform: '美团' },
  { time: '10:00', type: 'publish' as const, text: '自动发布大众点评长文「纺大店探店记」', platform: '大众点评' },
  { time: '09:00', type: 'service' as const, text: '自动回复客服咨询「营业时间」「停车问题」共5条', platform: '美团' },
  { time: '08:30', type: 'report' as const, text: '自动生成昨日经营日报 → 已推送到运营群', platform: '微信' },
]

const typeConfig = {
  reply: { icon: MessageSquare, color: 'text-green-600 bg-green-50' },
  alert: { icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
  publish: { icon: Send, color: 'text-blue-600 bg-blue-50' },
  service: { icon: MessageSquare, color: 'text-cyan-600 bg-cyan-50' },
  report: { icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
}

// 私域群列表
const wechatGroups = [
  { id: 1, name: '湖北藕汤·纺大店粉丝群', members: 386, todayMsg: 42, lastActive: '14:28', nextPush: '18:00 晚市优惠', activeRate: 78 },
  { id: 2, name: '湖北藕汤·纺大店VIP群', members: 128, todayMsg: 15, lastActive: '13:50', nextPush: '明天 新品预告', activeRate: 85 },
  { id: 3, name: '湖北藕汤·光谷店粉丝群', members: 295, todayMsg: 28, lastActive: '14:10', nextPush: '18:00 晚市优惠', activeRate: 65 },
  { id: 4, name: '湖北藕汤·汉口店粉丝群', members: 342, todayMsg: 35, lastActive: '14:22', nextPush: '18:00 晚市优惠', activeRate: 72 },
  { id: 5, name: '湖北藕汤·武昌站店福利群', members: 210, todayMsg: 18, lastActive: '12:30', nextPush: '18:00 晚市优惠', activeRate: 58 },
  { id: 6, name: '湖北藕汤·吃货交流群', members: 488, todayMsg: 56, lastActive: '14:35', nextPush: '20:00 晚间话题', activeRate: 82 },
]

// 定时推送任务
const scheduledPushes = [
  { id: 1, time: '18:00', target: '全部粉丝群(4)', content: '🍲 晚市特惠来啦！招牌双人藕汤套餐今日¥78（原价¥88），限时3小时！', status: 'scheduled' as const },
  { id: 2, time: '20:00', target: '吃货交流群', content: '今日话题：你们觉得莲藕排骨汤里加什么最好吃？评论区聊起来~', status: 'scheduled' as const },
  { id: 3, time: '明天 10:00', target: 'VIP群', content: '🆕 新品剧透：酸辣藕粉下周上线！VIP群专享首发尝鲜价¥28', status: 'scheduled' as const },
  { id: 4, time: '12:00（已发）', target: '全部群(5)', content: '午间推荐：一人食精选套餐¥38，上班族的温暖午餐 ☀️', status: 'sent' as const },
]

export default function AutoOpsPage() {
  const [ruleStates, setRuleStates] = useState(autoRules.map(r => r.enabled))
  const [showPushModal, setShowPushModal] = useState(false)
  const [pushForm, setPushForm] = useState({ time: '', target: '全部粉丝群', content: '' })
  const { currentStore } = useStore()
  const { toast } = useToast()

  const toggleRule = (index: number) => {
    const next = [...ruleStates]
    next[index] = !next[index]
    setRuleStates(next)
    toast(next[index] ? 'success' : 'info', `${autoRules[index].name}已${next[index] ? '启用' : '关闭'}`)
  }

  const totalAutoActions = autoRules.reduce((s, r) => s + r.todayCount, 0)
  const totalGroupMembers = wechatGroups.reduce((s, g) => s + g.members, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">自动运营</h1>
        <p className="text-gray-500 mt-1">AI 24小时帮你干活，你只需要看结果</p>
      </div>

      {/* AI工作报告 */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-6 h-6" />
          <span className="text-lg font-bold">AI 今日工作报告</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-auto">实时更新</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: '自动回复', value: '23条', sub: '好评18 中评5' },
            { label: '内容发布', value: '3篇', sub: '小红书1 抖音1 点评1' },
            { label: '预警拦截', value: '2条', sub: '差评1 余额1' },
            { label: '客服应答', value: '12条', sub: '全部自动处理' },
            { label: '私域推送', value: '1次', sub: '覆盖1,849人' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm opacity-90">{s.label}</div>
              <div className="text-xs opacity-60 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
        <p className="text-xs opacity-70 mt-3">💡 今日AI共为你节省约 <strong>3.5小时</strong> 人工操作时间</p>
      </div>

      {/* 自动化开关 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" />自动化规则</h3>
          <span className="text-xs text-gray-500">{ruleStates.filter(Boolean).length}/{autoRules.length} 已启用</span>
        </div>
        <div className="divide-y divide-gray-50">
          {autoRules.map((rule, i) => (
            <div key={rule.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
              <span className="text-2xl">{rule.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{rule.name}</span>
                  {ruleStates[i] && rule.todayCount > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">今日 {rule.todayCount}次</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{rule.desc}</p>
              </div>
              <button onClick={() => toggleRule(i)} className={`relative w-12 h-6 rounded-full transition-colors ${ruleStates[i] ? 'bg-primary-600' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${ruleStates[i] ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 执行动态 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Clock className="w-5 h-5 text-gray-400" />执行动态</h3>
          <span className="text-xs text-gray-500">今日共 {totalAutoActions} 次自动执行</span>
        </div>
        <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
          {activityLog.map((log, i) => {
            const cfg = typeConfig[log.type]
            return (
              <div key={i} className="flex items-start gap-3 px-5 py-3">
                <span className="text-xs text-gray-400 w-12 shrink-0 pt-0.5">{log.time}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                  <cfg.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{log.text}</p>
                  <span className="text-xs text-gray-400">{log.platform}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 自动报表 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500" />自动报表推送</h3>
          <button onClick={() => toast('info', '报表配置功能开发中')} className="text-xs px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"><Plus className="w-3 h-3" />新建报表</button>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { name: '日报', schedule: '每天 09:00', target: '老板微信 + 运营群', content: '昨日营收/订单/评分/差评/待办', lastSent: '今天 09:00', status: 'active', preview: '📊 纺大店3/8日报\n营收¥6,230(↑8%) | 订单132(↑5%) | 评分4.6(持平)\n新增差评2条(已自动预警) | 待办3项\n🔥 爆品：一人食套餐45单 | ⚠️ 抖音套餐库存剩86' },
            { name: '周报', schedule: '每周一 10:00', target: '老板微信 + 管理层群', content: '周度经营分析/同比/环比/AI建议', lastSent: '3/3 10:00', status: 'active', preview: '📊 纺大店第10周周报(2/24-3/2)\n周营收¥42,800(环比↑6.2%) | 周订单896单\n好评率82%(↑3%) | 差评TOP1:出餐慢(8条)\n🏆 本周最佳套餐：抖音限定(312单)\n💡 AI建议：增加晚高峰备餐量，预计可减少30%出餐超时' },
            { name: '月报', schedule: '每月1日 10:00', target: '老板微信', content: '月度经营总结/利润/趋势/下月建议', lastSent: '3/1 10:00', status: 'active', preview: '📊 纺大店2月月报\n月营收¥185,000(同比↑15%) | 月订单3,860单\n综合评分4.6(↑0.1) | 新增评价287条\n利润率预估22%(↑1.5%)\n📈 增长最快：菌菇藕汤(+45%)\n💡 3月建议：加大抖音投放，上线春季新品' },
            { name: '连锁周报', schedule: '每周一 10:00', target: '品牌管理群', content: '各门店PK/品牌共性问题/标杆经验', lastSent: '3/3 10:00', status: 'active', preview: '📊 湖北藕汤品牌第10周报\n品牌总营收¥168,000 | 4家门店营业\n🏆 评分第一：汉口店4.5 | ⚠️ 差评最多：光谷店(11.2%)\n品牌共性问题：出餐速度(3家涉及)\n✅ 标杆经验：汉口店服务SOP可推广' },
          ].map(report => (
            <div key={report.name} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{report.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">已启用</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>🕐 {report.schedule}</span>
                  <span>上次: {report.lastSent}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span>📤 推送到: {report.target}</span>
              </div>
              <details className="group">
                <summary className="text-xs text-primary-600 cursor-pointer hover:text-primary-700">预览报表内容 ▸</summary>
                <div className="mt-2 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 max-w-sm">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center"><Bot className="w-4 h-4 text-primary-600" /></div>
                      <div><p className="text-xs font-medium text-gray-900">智店AI助手</p><p className="text-[10px] text-gray-400">{report.lastSent}</p></div>
                    </div>
                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{report.preview}</div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 text-center">↑ 微信消息预览</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* 私域运营 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-green-600" />私域运营</h2>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{wechatGroups.length}个群</span>
            <span>{totalGroupMembers.toLocaleString()}人</span>
          </div>
        </div>

        {/* 群列表 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">群名</th>
                  <th className="text-right px-3 py-3 text-gray-500 font-medium">成员</th>
                  <th className="text-right px-3 py-3 text-gray-500 font-medium">今日消息</th>
                  <th className="text-right px-3 py-3 text-gray-500 font-medium">活跃度</th>
                  <th className="text-left px-3 py-3 text-gray-500 font-medium">下次推送</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">最后活跃</th>
                </tr>
              </thead>
              <tbody>
                {wechatGroups.map(g => (
                  <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{g.name}</td>
                    <td className="px-3 py-3 text-right">{g.members}</td>
                    <td className="px-3 py-3 text-right">{g.todayMsg}</td>
                    <td className="px-3 py-3 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${g.activeRate >= 80 ? 'bg-green-50 text-green-600' : g.activeRate >= 60 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>{g.activeRate}%</span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">{g.nextPush}</td>
                    <td className="px-5 py-3 text-right text-xs text-gray-400">{g.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 定时推送 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" />定时推送</h3>
            <button onClick={() => setShowPushModal(true)} className="text-xs px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"><Plus className="w-3 h-3" />新建推送</button>
          </div>
          <div className="divide-y divide-gray-50">
            {scheduledPushes.map(push => (
              <div key={push.id} className="flex items-start gap-3 px-5 py-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${push.status === 'sent' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  {push.status === 'sent' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-900">{push.time}</span>
                    <span className="text-xs text-gray-400">→ {push.target}</span>
                    {push.status === 'sent' && <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-600 rounded">已发送</span>}
                  </div>
                  <p className="text-sm text-gray-600">{push.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Push Modal */}
      <Modal open={showPushModal} onClose={() => setShowPushModal(false)} title="新建定时推送" footer={
        <>
          <button onClick={() => setShowPushModal(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">取消</button>
          <button onClick={() => { toast('success', '推送任务已创建'); setShowPushModal(false); setPushForm({ time: '', target: '全部粉丝群', content: '' }) }} className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">创建</button>
        </>
      }>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">推送时间</label>
            <input type="datetime-local" value={pushForm.time} onChange={e => setPushForm(f => ({ ...f, time: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">目标群</label>
            <select value={pushForm.target} onChange={e => setPushForm(f => ({ ...f, target: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
              <option>全部粉丝群</option>
              {wechatGroups.map(g => <option key={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">推送内容</label>
            <textarea value={pushForm.content} onChange={e => setPushForm(f => ({ ...f, content: e.target.value }))} placeholder="输入推送内容..." rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
