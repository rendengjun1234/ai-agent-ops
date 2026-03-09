// Mock数据中心
export const mockStore = {
  id: 'store_001',
  name: '湖北藕汤（纺大店）',
  address: '武汉市洪山区纺织大学南门',
  phone: '027-8888-6666',
  platforms: ['美团', '大众点评', '抖音', '高德', '京东外卖', '淘宝闪购'],
  rating: 4.6,
  monthlyRevenue: 186500,
  monthlyOrders: 3720,
  avgPrice: 50.1,
}

export const mockStores = [
  mockStore,
  { id: 'store_002', name: '湖北藕汤（光谷店）', address: '武汉市洪山区光谷广场', phone: '027-8888-7777', platforms: ['美团', '大众点评', '抖音'], rating: 4.5, monthlyRevenue: 152000, monthlyOrders: 3040, avgPrice: 50.0 },
  { id: 'store_003', name: '湖北藕汤（汉口店）', address: '武汉市江汉区江汉路', phone: '027-8888-8888', platforms: ['美团', '大众点评'], rating: 4.4, monthlyRevenue: 134000, monthlyOrders: 2680, avgPrice: 50.0 },
]

const platforms = ['美团', '大众点评', '抖音', '高德', '京东外卖', '淘宝闪购'] as const

const reviewTexts = {
  good: [
    '藕汤味道非常正宗，汤浓味美，藕粉粉糯糯的，每次来武汉必吃！推荐排骨藕汤和莲藕丸子。',
    '环境干净整洁，服务态度很好，上菜速度也快。藕汤是真的好喝，喝完一碗还想再来一碗。',
    '朋友推荐来的，果然没失望！藕汤鲜甜，排骨炖得很烂，入口即化。价格也很实惠，人均50左右。',
    '来武汉出差顺便打卡，这家藕汤确实是我喝过最好喝的！配上热干面绝了，下次还来。',
    '作为武汉本地人，这家是我心目中的top3藕汤店。每周至少来一次，老板人也很好。',
    '带外地朋友来吃的，朋友赞不绝口！量大实惠，藕汤浓郁，强烈推荐他们家的招牌三鲜藕汤。',
  ],
  mid: [
    '味道还行吧，中规中矩。等位时间有点长，建议错峰来。',
    '藕汤不错，但配菜一般。服务还可以，就是店面有点小。',
  ],
  bad: [
    '等了40分钟才上菜，太慢了。味道也没有之前好了，是不是换厨师了？',
    '今天的藕汤明显咸了，而且藕不够粉。服务员态度也一般，叫了好几次才来加汤。',
    '外卖送到的时候都凉了，包装也不太好，汤洒了一半。希望能改进一下外卖包装。',
  ],
}

const userNames = ['张三丰', '吃货小王', '美食达人Leo', '武汉伢小李', '旅行者阿杰', '小红书er', '干饭人', '汤圆妈妈', '胖虎美食记', '吃遍武汉', '湖北老乡', '大学生小陈', '上班族小刘', '宝妈小周', '退休大爷']

function randomDate(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo))
  d.setHours(Math.floor(Math.random() * 14) + 8)
  d.setMinutes(Math.floor(Math.random() * 60))
  return d.toISOString()
}

export interface Review {
  id: string
  platform: string
  userName: string
  avatar: string
  rating: number
  content: string
  images: string[]
  date: string
  replied: boolean
  replyContent?: string
  sentiment: 'positive' | 'neutral' | 'negative'
  tags: string[]
  aiSuggestion?: string
}

function generateReviews(count: number): Review[] {
  const reviews: Review[] = []
  for (let i = 0; i < count; i++) {
    const rand = Math.random()
    const sentiment = rand > 0.25 ? 'positive' : rand > 0.1 ? 'neutral' : 'negative'
    const rating = sentiment === 'positive' ? (Math.random() > 0.3 ? 5 : 4) : sentiment === 'neutral' ? 3 : (Math.random() > 0.5 ? 2 : 1)
    const texts = sentiment === 'positive' ? reviewTexts.good : sentiment === 'neutral' ? reviewTexts.mid : reviewTexts.bad
    const content = texts[Math.floor(Math.random() * texts.length)]
    const replied = Math.random() > 0.4
    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const userName = userNames[Math.floor(Math.random() * userNames.length)]

    reviews.push({
      id: `review_${i + 1}`,
      platform,
      userName,
      avatar: '',
      rating,
      content,
      images: [],
      date: randomDate(30),
      replied,
      replyContent: replied ? '感谢您的评价！我们会继续努力提供更好的服务和美味的藕汤，期待您的再次光临！🙏' : undefined,
      sentiment,
      tags: sentiment === 'negative' ? ['服务', '等待时间'] : ['口味', '推荐'],
      aiSuggestion: !replied ? (sentiment === 'negative'
        ? `尊敬的${userName}，非常抱歉给您带来不好的体验。我们已经将您的反馈转达给店长，会立即整改。为表歉意，下次光临可享8折优惠，期待能重新赢得您的认可！`
        : `感谢${userName}的好评！您的认可是我们最大的动力💪 欢迎下次带更多朋友来品尝正宗湖北藕汤，我们准备了会员专属优惠等着您~`) : undefined,
    })
  }
  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const mockReviews = generateReviews(50)

// 30天营业数据
function generateDailyData() {
  const data = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const isWeekend = d.getDay() === 0 || d.getDay() === 6
    const base = isWeekend ? 7500 : 5500
    const revenue = base + Math.floor(Math.random() * 2000)
    const orders = Math.floor(revenue / (45 + Math.random() * 10))
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      fullDate: d.toISOString().split('T')[0],
      revenue,
      orders,
      avgPrice: Math.round(revenue / orders * 10) / 10,
      newCustomers: Math.floor(Math.random() * 30) + 10,
      returnRate: Math.round((0.3 + Math.random() * 0.2) * 100),
    })
  }
  return data
}

export const mockDailyData = generateDailyData()

export const mockDashboardStats = {
  totalRevenue: mockDailyData.reduce((s, d) => s + d.revenue, 0),
  totalOrders: mockDailyData.reduce((s, d) => s + d.orders, 0),
  avgRating: 4.6,
  ratingChange: 0.1,
  reviewCount: 50,
  unrepliedCount: mockReviews.filter(r => !r.replied).length,
  negativeCount: mockReviews.filter(r => r.sentiment === 'negative').length,
  agentStatus: [
    { name: '评价Agent', status: 'active' as const, processed: 847, icon: 'MessageSquare' },
    { name: '数据Agent', status: 'active' as const, processed: 1203, icon: 'BarChart3' },
    { name: '获客Agent', status: 'active' as const, processed: 356, icon: 'Megaphone' },
    { name: '建站Agent', status: 'idle' as const, processed: 0, icon: 'Globe' },
    { name: '销售Agent', status: 'active' as const, processed: 128, icon: 'Target' },
    { name: '营销Agent', status: 'active' as const, processed: 445, icon: 'Zap' },
    { name: '运营Agent', status: 'active' as const, processed: 672, icon: 'ClipboardList' },
    { name: '客服Agent', status: 'active' as const, processed: 234, icon: 'Headphones' },
    { name: '申诉Agent', status: 'idle' as const, processed: 12, icon: 'Shield' },
    { name: '巡检Agent', status: 'active' as const, processed: 89, icon: 'Radar' },
  ],
}

export const mockPlatformStats = [
  { platform: '美团', rating: 4.7, reviews: 186, trend: 0.1 },
  { platform: '大众点评', rating: 4.5, reviews: 142, trend: -0.05 },
  { platform: '抖音', rating: 4.8, reviews: 98, trend: 0.2 },
  { platform: '高德', rating: 4.4, reviews: 56, trend: 0 },
  { platform: '京东外卖', rating: 4.6, reviews: 34, trend: 0.1 },
  { platform: '淘宝闪购', rating: 4.3, reviews: 22, trend: -0.1 },
]

// AI诊断报告
export const mockDiagnostics = [
  { type: 'warning' as const, title: '差评率上升', desc: '近7天差评率从3.2%上升至5.1%，主要集中在"等待时间"相关评价。建议：高峰期增加1名服务员，优化出餐流程。', date: '2小时前' },
  { type: 'success' as const, title: '营业额环比增长', desc: '本周营业额较上周增长12.3%，主要来自周末客流增加。美团推广通ROI达到3.2，建议继续维持当前投放策略。', date: '6小时前' },
  { type: 'info' as const, title: '新客占比偏低', desc: '本月新客占比22%，低于同商圈均值35%。建议：开启抖音本地推广+美团新客专享券，预计可提升新客占比至30%+。', date: '1天前' },
  { type: 'warning' as const, title: '竞品动态', desc: '"老武汉藕汤馆"（距本店800m）上线了满100减20活动，可能分流部分客源。建议关注并制定应对方案。', date: '1天前' },
]

// 获客数据
export const mockTrafficData = {
  channels: [
    { name: '美团搜索', visitors: 12500, orders: 1250, rate: 10 },
    { name: '大众点评', visitors: 8600, orders: 688, rate: 8 },
    { name: '抖音推荐', visitors: 6200, orders: 310, rate: 5 },
    { name: '微信小程序', visitors: 3400, orders: 510, rate: 15 },
    { name: '高德导航', visitors: 2100, orders: 168, rate: 8 },
    { name: '老客复购', visitors: 4800, orders: 1440, rate: 30 },
  ],
}

// 销售线索
export const mockLeads = [
  { id: 1, name: '张经理', company: '武汉XX餐饮集团', phone: '138****1234', source: '美团推荐', status: '跟进中', lastContact: '2小时前', amount: 50000 },
  { id: 2, name: '李总', company: '光谷创业咖啡', phone: '139****5678', source: '抖音咨询', status: '待联系', lastContact: '1天前', amount: 30000 },
  { id: 3, name: '王老板', company: '汉口小龙虾', phone: '137****9012', source: '转介绍', status: '已成交', lastContact: '3天前', amount: 80000 },
]

// 营销活动
export const mockCampaigns = [
  { id: 1, name: '新客满50减10', platform: '美团', status: 'active', startDate: '2026-03-01', endDate: '2026-03-31', used: 234, budget: 5000, spent: 2340 },
  { id: 2, name: '会员日双倍积分', platform: '小程序', status: 'active', startDate: '2026-03-08', endDate: '2026-03-08', used: 89, budget: 2000, spent: 890 },
  { id: 3, name: '好评返现3元', platform: '大众点评', status: 'paused', startDate: '2026-02-15', endDate: '2026-03-15', used: 456, budget: 3000, spent: 1368 },
]

// 运营任务
export const mockTasks = [
  { id: 1, title: '回复3条未处理差评', agent: '评价Agent', priority: 'high' as const, status: 'pending', dueTime: '今天 18:00' },
  { id: 2, title: '更新本周菜品推荐', agent: '营销Agent', priority: 'medium' as const, status: 'done', dueTime: '今天 12:00' },
  { id: 3, title: '检查美团推广通预算', agent: '获客Agent', priority: 'medium' as const, status: 'pending', dueTime: '今天 20:00' },
  { id: 4, title: '处理1条差评申诉', agent: '申诉Agent', priority: 'high' as const, status: 'in_progress', dueTime: '明天 10:00' },
  { id: 5, title: '发送会员周报', agent: '营销Agent', priority: 'low' as const, status: 'pending', dueTime: '周五 09:00' },
]

// 客服会话
export const mockConversations = [
  { id: 1, customer: '美食达人Leo', platform: '美团IM', lastMsg: '你们家周末需要排队吗？', time: '5分钟前', unread: 1, autoReplied: false },
  { id: 2, customer: '吃货小王', platform: '大众点评', lastMsg: '有没有包间可以预约？', time: '15分钟前', unread: 0, autoReplied: true },
  { id: 3, customer: '武汉伢小李', platform: '微信', lastMsg: '你们家的藕汤可以打包外带吗？', time: '1小时前', unread: 0, autoReplied: true },
]

// 申诉工单
export const mockAppeals = [
  { id: 1, platform: '美团', type: '恶意差评', content: '同行恶意差评，用户从未消费过', status: 'processing', submitDate: '2026-03-07', result: '' },
  { id: 2, platform: '大众点评', type: '不实评价', content: '评价内容与实际消费不符，描述了我们没有的菜品', status: 'success', submitDate: '2026-03-05', result: '申诉成功，评价已删除' },
  { id: 3, platform: '抖音', type: '恶意差评', content: '竞对刷差评，多个新号集中差评', status: 'rejected', submitDate: '2026-03-03', result: '证据不足，建议补充消费记录对比' },
]

// 巡检告警
export const mockAlerts = [
  { id: 1, type: 'error' as const, title: '美团评分预警', desc: '当前评分4.6，距离降档线4.5仅差0.1，近3天差评频率偏高', time: '30分钟前' },
  { id: 2, type: 'warning' as const, title: '推广通余额不足', desc: '美团推广通账户余额¥128，预计明天耗尽，请及时充值', time: '2小时前' },
  { id: 3, type: 'info' as const, title: '系统正常', desc: '所有平台API连接正常，数据同步正常', time: '10分钟前' },
]
