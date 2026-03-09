// Mock data for 湖北藕汤（纺大店）

export const store = {
  id: '1311720716',
  name: '湖北藕汤（纺大店）',
  address: '武汉市洪山区纺织路1号',
  phone: '027-8888-6666',
  category: '湖北菜/汤锅',
  platforms: ['美团', '大众点评', '抖音', '高德', '京东外卖'],
  overallRating: 4.6,
  monthlyRevenue: 186500,
  monthlyOrders: 2340,
  avgOrderPrice: 79.7,
}

export const stores = [
  store,
  { id: '2', name: '湖北藕汤（光谷店）', address: '武汉市洪山区光谷广场', overallRating: 4.4 },
  { id: '3', name: '湖北藕汤（汉口店）', address: '武汉市江汉区江汉路步行街', overallRating: 4.5 },
]

// 评价数据
export type Review = {
  id: string
  platform: string
  platformIcon: string
  author: string
  avatar: string
  rating: number
  content: string
  images: string[]
  time: string
  replied: boolean
  replyContent?: string
  sentiment: 'positive' | 'neutral' | 'negative'
  aiSuggestion?: string
  tags: string[]
}

const platforms = ['美团', '大众点评', '抖音', '高德', '京东外卖', '饿了么']
const platformColors: Record<string, string> = {
  '美团': '#FF6633',
  '大众点评': '#FF7700',
  '抖音': '#000000',
  '高德': '#28A0F6',
  '京东外卖': '#C91623',
  '饿了么': '#0097FF',
}

const reviewContents = {
  positive: [
    '藕汤太绝了！莲藕软糯，排骨入味，汤底浓郁不油腻。冬天来一碗真的太幸福了，强烈推荐！',
    '朋友推荐来的，果然名不虚传！藕汤鲜美，配菜也很丰富。环境干净整洁，服务态度好，下次还来。',
    '作为湖北人表示这家藕汤非常正宗！排骨藕汤的味道跟家里做的一模一样，分量也很足，性价比很高。',
    '连续来了三次了，每次都点排骨藕汤+热干面套餐，百吃不腻。老板人也很好，会推荐当天最新鲜的菜品。',
    '带外地朋友来的，他们都说太好喝了！汤炖得很入味，藕粉粉糯糯的，排骨也很嫩。强烈推荐！',
    '等了20分钟但很值得！藕汤是现熬的，能喝出食材的新鲜。价格也合理，两个人吃了150左右。',
  ],
  neutral: [
    '味道还行吧，中规中矩。藕汤确实不错但是配菜一般，炒菜偏咸了。服务速度可以再快点。',
    '汤的味道可以，但是排骨有点少。环境一般，中午人太多有点吵。总体来说性价比还行。',
  ],
  negative: [
    '等了40分钟才上菜，服务员态度也不太好。藕汤味道一般，感觉不如以前了，有点失望。',
    '卫生堪忧，桌子上有油渍。藕汤里面排骨很少，基本都是骨头。价格还涨了，不值。',
    '点的外卖到手都凉了，包装也不好，汤洒了一半。藕汤味道本身还行但这个配送体验太差了。',
  ],
}

const authorNames = [
  '美食小达人', '吃货日记', '武汉美食家', '路过的小猫', '嘴巴很挑', '深夜觅食',
  '减肥明天开始', '一口一个胖', '湖北老饕', '吃遍武汉', '干饭人小王', '甜甜圈🍩',
  '今天吃什么', '随便吃吃', '觅食少年', '火锅不如汤', '藕断丝连', '汤汤水水',
]

const aiSuggestions = [
  '感谢您的好评！建议回复中提及顾客称赞的具体菜品，增强互动感。可以邀请对方下次尝试新品。',
  '这是一条中性评价，建议先感谢顾客光临，然后针对提到的不足（上菜速度）表示改进决心，并邀请再次体验。',
  '差评预警！建议24小时内回复。先道歉，再说明改进措施，最后提供补偿方案（如优惠券），尽量挽回顾客。',
  '顾客提到了配送问题，建议回复时先致歉，说明会与配送平台沟通改进，并可以提供到店用餐优惠。',
]

function generateReviews(): Review[] {
  const reviews: Review[] = []
  const now = Date.now()

  for (let i = 0; i < 50; i++) {
    const isPositive = Math.random() > 0.25
    const isNeutral = !isPositive && Math.random() > 0.5
    const sentiment = isPositive ? 'positive' : isNeutral ? 'neutral' : 'negative'
    const contents = reviewContents[sentiment]
    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const rating = sentiment === 'positive' ? (4 + Math.round(Math.random())) : sentiment === 'neutral' ? 3 : (1 + Math.floor(Math.random() * 2))
    const daysAgo = Math.floor(Math.random() * 30)
    const replied = Math.random() > 0.4

    reviews.push({
      id: `review-${i}`,
      platform,
      platformIcon: platform[0],
      author: authorNames[Math.floor(Math.random() * authorNames.length)],
      avatar: '',
      rating,
      content: contents[Math.floor(Math.random() * contents.length)],
      images: [],
      time: new Date(now - daysAgo * 86400000).toISOString().split('T')[0],
      replied,
      replyContent: replied ? '感谢您的光临和反馈！我们会继续努力提升菜品和服务质量，期待您的再次到来~' : undefined,
      sentiment,
      aiSuggestion: aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)],
      tags: sentiment === 'negative' ? ['需关注', '待回复'] : sentiment === 'positive' ? ['好评'] : ['一般'],
    })
  }

  return reviews.sort((a, b) => b.time.localeCompare(a.time))
}

export const reviews = generateReviews()

// 评价统计
export const reviewStats = {
  total: 2847,
  avgRating: 4.6,
  ratingChange: 0.1,
  thisMonth: 186,
  replied: 2654,
  replyRate: 93.2,
  positiveRate: 78.5,
  negativeRate: 5.2,
  platforms: [
    { name: '美团', count: 892, rating: 4.7 },
    { name: '大众点评', count: 756, rating: 4.6 },
    { name: '抖音', count: 534, rating: 4.5 },
    { name: '高德', count: 312, rating: 4.6 },
    { name: '京东外卖', count: 198, rating: 4.4 },
    { name: '饿了么', count: 155, rating: 4.3 },
  ],
  ratingTrend: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
    rating: +(4.4 + Math.random() * 0.4).toFixed(1),
    count: Math.floor(4 + Math.random() * 8),
  })),
  sentimentTrend: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
    positive: Math.floor(3 + Math.random() * 6),
    neutral: Math.floor(0 + Math.random() * 3),
    negative: Math.floor(Math.random() * 2),
  })),
  keywords: [
    { word: '藕汤', count: 423, sentiment: 'positive' },
    { word: '排骨', count: 312, sentiment: 'positive' },
    { word: '好喝', count: 287, sentiment: 'positive' },
    { word: '正宗', count: 198, sentiment: 'positive' },
    { word: '分量足', count: 176, sentiment: 'positive' },
    { word: '上菜慢', count: 89, sentiment: 'negative' },
    { word: '环境', count: 156, sentiment: 'neutral' },
    { word: '服务态度', count: 134, sentiment: 'neutral' },
    { word: '性价比', count: 145, sentiment: 'positive' },
    { word: '配送', count: 67, sentiment: 'negative' },
  ],
}

// 经营数据
export const businessData = {
  today: {
    revenue: 6850,
    orders: 86,
    avgPrice: 79.7,
    tableRate: 2.3,
  },
  yesterday: {
    revenue: 7200,
    orders: 91,
    avgPrice: 79.1,
    tableRate: 2.4,
  },
  thisMonth: {
    revenue: 186500,
    orders: 2340,
    avgPrice: 79.7,
    tableRate: 2.3,
  },
  lastMonth: {
    revenue: 172300,
    orders: 2180,
    avgPrice: 79.0,
    tableRate: 2.1,
  },
  revenueTrend: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
    revenue: Math.floor(5000 + Math.random() * 4000),
    orders: Math.floor(65 + Math.random() * 40),
  })),
  hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    orders: i >= 11 && i <= 13 ? Math.floor(12 + Math.random() * 8) : i >= 17 && i <= 20 ? Math.floor(10 + Math.random() * 10) : Math.floor(Math.random() * 4),
  })),
  channelRevenue: [
    { name: '堂食', value: 98500, percent: 52.8 },
    { name: '美团外卖', value: 42300, percent: 22.7 },
    { name: '饿了么', value: 18600, percent: 10.0 },
    { name: '抖音团购', value: 15200, percent: 8.1 },
    { name: '京东外卖', value: 7400, percent: 4.0 },
    { name: '其他', value: 4500, percent: 2.4 },
  ],
  aiDiagnosis: {
    score: 82,
    summary: '本月经营状况良好，营业额环比增长8.2%。午间时段客流稳定，建议加强晚间19-20点时段的营销力度。',
    highlights: [
      '营业额环比增长8.2%，连续3个月保持增长趋势',
      '客单价提升0.7元，套餐策略生效',
      '美团评分从4.5升至4.6，好评率提升3.2%',
    ],
    warnings: [
      '周二、周三客流量偏低，建议推出工作日特惠活动',
      '外卖差评率本月上升1.1%，主要集中在配送问题',
      '食材成本占比升至38%，建议优化供应链',
    ],
    suggestions: [
      '推出"周二藕汤日"特价活动，提升工作日客流',
      '与配送平台协商优化配送方案，减少洒漏问题',
      '考虑引入预制菜环节，降低食材损耗',
    ],
  },
}

// Agent状态总览
export const agentOverview = [
  { id: 'review', name: '评价Agent', icon: 'MessageSquare', status: 'active', todayTasks: 12, completedTasks: 10, metric: '回复率 93%', color: '#2563EB' },
  { id: 'analytics', name: '数据Agent', icon: 'BarChart3', status: 'active', todayTasks: 3, completedTasks: 3, metric: '报告已生成', color: '#7C3AED' },
  { id: 'traffic', name: '获客Agent', icon: 'TrendingUp', status: 'active', todayTasks: 8, completedTasks: 5, metric: '曝光+12%', color: '#059669' },
  { id: 'site', name: '建站Agent', icon: 'Globe', status: 'idle', todayTasks: 0, completedTasks: 0, metric: '小程序运行中', color: '#0891B2' },
  { id: 'sales', name: '销售Agent', icon: 'PhoneCall', status: 'active', todayTasks: 15, completedTasks: 8, metric: '转化率 23%', color: '#DC2626' },
  { id: 'marketing', name: '营销Agent', icon: 'Megaphone', status: 'active', todayTasks: 4, completedTasks: 2, metric: '活动进行中', color: '#EA580C' },
  { id: 'ops', name: '运营Agent', icon: 'ClipboardList', status: 'active', todayTasks: 6, completedTasks: 4, metric: 'SOP执行中', color: '#4F46E5' },
  { id: 'service', name: '客服Agent', icon: 'Headphones', status: 'active', todayTasks: 22, completedTasks: 19, metric: '响应<30s', color: '#0D9488' },
  { id: 'appeal', name: '申诉Agent', icon: 'Shield', status: 'idle', todayTasks: 1, completedTasks: 0, metric: '1件待处理', color: '#B45309' },
  { id: 'patrol', name: '巡检Agent', icon: 'Radar', status: 'active', todayTasks: 24, completedTasks: 24, metric: '系统正常', color: '#6D28D9' },
]

// 获客Agent数据
export const trafficData = {
  totalExposure: 156800,
  exposureChange: 12.3,
  clickRate: 4.8,
  channels: [
    { name: '美团搜索', exposure: 52000, clicks: 2860, conversion: 5.5 },
    { name: '点评搜索', exposure: 38000, clicks: 1710, conversion: 4.5 },
    { name: '抖音推荐', exposure: 34000, clicks: 1360, conversion: 4.0 },
    { name: '高德地图', exposure: 18000, clicks: 720, conversion: 4.0 },
    { name: '小红书', exposure: 14800, clicks: 888, conversion: 6.0 },
  ],
}

// 营销Agent数据
export const marketingData = {
  activeCoupons: [
    { id: '1', name: '满100减20', platform: '美团', issued: 500, used: 234, expiry: '2026-03-31' },
    { id: '2', name: '新客立减15', platform: '点评', issued: 300, used: 156, expiry: '2026-03-25' },
    { id: '3', name: '藕汤套餐8折', platform: '抖音', issued: 200, used: 89, expiry: '2026-04-15' },
  ],
  campaigns: [
    { id: '1', name: '春季新品推广', status: 'active', startDate: '2026-03-01', endDate: '2026-03-31', budget: 5000, spent: 2340, conversions: 186 },
    { id: '2', name: '三八节特惠', status: 'completed', startDate: '2026-03-06', endDate: '2026-03-08', budget: 2000, spent: 1980, conversions: 98 },
  ],
}

// 客服Agent数据
export const serviceData = {
  todayConversations: 22,
  avgResponseTime: 28,
  satisfactionRate: 96.5,
  conversations: [
    { id: '1', customer: '用户A', platform: '美团', lastMessage: '请问你们今天几点关门？', time: '16:20', status: 'auto-replied', aiReply: '您好！我们营业到晚上10点，欢迎光临~' },
    { id: '2', customer: '用户B', platform: '点评', lastMessage: '可以预约明天中午的位置吗？', time: '15:45', status: 'pending' },
    { id: '3', customer: '用户C', platform: '抖音', lastMessage: '你们家招牌菜是什么？', time: '14:30', status: 'auto-replied', aiReply: '我们的招牌是排骨藕汤！选用洪湖莲藕，文火慢炖4小时，非常推荐~' },
  ],
}

// 运营Agent数据
export const opsData = {
  todayTasks: [
    { id: '1', title: '回复3条新差评', agent: '评价Agent', priority: 'high', status: 'done', time: '09:30' },
    { id: '2', title: '发布抖音团购活动', agent: '营销Agent', priority: 'medium', status: 'done', time: '10:00' },
    { id: '3', title: '检查午间备餐量', agent: '运营Agent', priority: 'high', status: 'done', time: '10:30' },
    { id: '4', title: '更新菜单价格', agent: '运营Agent', priority: 'medium', status: 'in-progress', time: '14:00' },
    { id: '5', title: '回复5条新评价', agent: '评价Agent', priority: 'medium', status: 'pending', time: '16:00' },
    { id: '6', title: '生成今日经营报告', agent: '数据Agent', priority: 'low', status: 'pending', time: '22:00' },
  ],
}

// 申诉Agent数据
export const appealData = {
  appeals: [
    { id: '1', platform: '美团', reviewId: 'r-001', reason: '恶意差评', status: 'pending', submittedAt: '2026-03-09', content: '从未到店消费，虚假评价' },
    { id: '2', platform: '点评', reviewId: 'r-002', reason: '同行恶意', status: 'approved', submittedAt: '2026-03-07', content: '疑似竞争对手刷差评' },
    { id: '3', platform: '抖音', reviewId: 'r-003', reason: '内容不实', status: 'rejected', submittedAt: '2026-03-05', content: '评价内容与实际不符' },
  ],
}

// 巡检Agent数据
export const patrolData = {
  systemHealth: 98,
  checks: [
    { name: '美团店铺状态', status: 'normal', lastCheck: '16:00' },
    { name: '点评店铺状态', status: 'normal', lastCheck: '16:00' },
    { name: '抖音团购状态', status: 'normal', lastCheck: '16:00' },
    { name: '外卖接单系统', status: 'normal', lastCheck: '15:55' },
    { name: '评价监控', status: 'normal', lastCheck: '16:05' },
    { name: '库存预警', status: 'warning', lastCheck: '14:00', detail: '莲藕库存偏低，建议明日补货' },
  ],
  alerts: [
    { id: '1', level: 'warning', message: '莲藕库存低于安全线，当前剩余约15kg', time: '14:00', handled: false },
    { id: '2', level: 'info', message: '美团评分从4.5升至4.6', time: '10:00', handled: true },
  ],
}
