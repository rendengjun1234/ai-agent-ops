// 评价管理系统 - 完整数据模型

// AI标签体系
export interface ReviewTag {
  primary: string    // 一级标签
  secondary: string  // 二级标签
  sentiment: 'positive' | 'negative' | 'neutral'
  intensity: number  // 情绪强度 1-5
}

export interface Review {
  id: string
  platform: string
  platformIcon: string
  store: string
  storeId: string
  rating: number
  content: string
  author: string
  time: string
  timeAgo: string
  hasImage: boolean
  hasVideo: boolean
  // AI分析
  tags: ReviewTag[]
  riskLevel: 'P1' | 'P2' | 'P3' | 'P4'
  aiSummary: string
  aiReply: string
  rootCause?: string
  mentionedDish?: string
  mentionedStaff?: string
  mentionedPeriod?: string
  // 状态
  status: 'pending' | 'replied' | 'escalated' | 'closed'
  assignee?: string
  replyTime?: string
  // 关联
  linkedTaskId?: string
  isHighValue: boolean // 高质量好评可资产化
}

// 整改任务
export interface RemediationTask {
  id: string
  title: string
  category: string
  sourceReviewCount: number
  stores: string[]
  riskLevel: 'P1' | 'P2' | 'P3'
  assignee: string
  deadline: string
  status: 'open' | 'in_progress' | 'resolved' | 'verified'
  suggestedAction: string
  period?: string
  staff?: string
  createdAt: string
  resolvedAt?: string
  scoreImpact?: string // 整改后评分变化
}

// 评价数据
export const reviews: Review[] = [
  {
    id: 'r001', platform: '美团', platformIcon: '🟠', store: '纺大店', storeId: 'store_001',
    rating: 1, content: '等了快50分钟才上齐菜，服务员态度还很冷淡，问了几次都说快了。藕汤味道一般，和之前来吃的差距很大，排骨也没什么肉。再也不来了。',
    author: '王先生', time: '2026-03-08 19:23', timeAgo: '32小时前',
    hasImage: true, hasVideo: false,
    tags: [
      { primary: '出餐速度', secondary: '等待过长', sentiment: 'negative', intensity: 5 },
      { primary: '服务态度', secondary: '冷淡敷衍', sentiment: 'negative', intensity: 4 },
      { primary: '产品/菜品', secondary: '口味下降', sentiment: 'negative', intensity: 3 },
    ],
    riskLevel: 'P1', status: 'pending',
    aiSummary: '晚高峰出餐超时+服务冷淡+口味不稳定，三重负面，情绪强烈',
    aiReply: '王先生您好，非常抱歉让您在晚高峰时段等候了这么久，这完全不是我们应有的服务水准。您提到的出餐衔接和服务响应问题，我们已经同步给店长进行专项复盘，针对晚高峰时段增配了1名前厅服务员。关于藕汤口味的波动，我们也会加强品控。非常希望给您一次弥补的机会，已为您准备了一张免单券，期待您再次光临时能感受到我们的改变。',
    rootCause: '晚高峰18:00-20:00人手不足',
    mentionedPeriod: '晚高峰',
    isHighValue: false,
  },
  {
    id: 'r002', platform: '大众点评', platformIcon: '🔴', store: '纺大店', storeId: 'store_001',
    rating: 2, content: '藕汤端上来就不太热了，跟服务员说了也没换，就说"本来就是这个温度"。这态度真的无语。',
    author: '李女士', time: '2026-03-08 12:45', timeAgo: '28小时前',
    hasImage: false, hasVideo: false,
    tags: [
      { primary: '产品/菜品', secondary: '温度不够', sentiment: 'negative', intensity: 3 },
      { primary: '服务态度', secondary: '处理投诉能力弱', sentiment: 'negative', intensity: 4 },
    ],
    riskLevel: 'P2', status: 'pending',
    aiSummary: '菜品温度问题+服务员处理投诉不当',
    aiReply: '李女士您好，看到您的反馈非常抱歉！藕汤出品温度确实应该保证滚烫上桌，服务员的回应方式也非常不妥。我们已经对出品流程和服务标准做了整改：①出餐前必须检查温度 ②遇到顾客反馈必须第一时间更换。真心希望您能再给我们一次机会，下次来店可以找店长，我们一定做到让您满意！',
    rootCause: '出品温控不到位+服务员培训不足',
    isHighValue: false,
  },
  {
    id: 'r003', platform: '大众点评', platformIcon: '🔴', store: '纺大店', storeId: 'store_001',
    rating: 1, content: '桌子上还有上一桌的油渍没擦干净，地上也有垃圾。卫生真的堪忧，拍了照片给你们看看。',
    author: '匿名用户', time: '2026-03-08 20:10', timeAgo: '26小时前',
    hasImage: true, hasVideo: false,
    tags: [
      { primary: '环境卫生', secondary: '桌面不洁', sentiment: 'negative', intensity: 5 },
      { primary: '环境卫生', secondary: '地面脏乱', sentiment: 'negative', intensity: 4 },
    ],
    riskLevel: 'P1', status: 'pending',
    aiSummary: '⚠️ 卫生问题带图差评，可能引发平台降权风险',
    aiReply: '非常抱歉给您带来了这么糟糕的用餐体验！卫生问题是我们的底线，绝不应该出现这种情况。我们已经：①对当班保洁进行了严肃处理 ②增加了翻台清洁检查流程 ③每桌清洁后必须拍照确认。感谢您的监督，这些照片我们已经作为内部整改的重要依据。希望您能给我们改正的机会！',
    rootCause: '晚高峰翻台清洁不到位',
    mentionedPeriod: '晚高峰',
    isHighValue: false,
  },
  {
    id: 'r004', platform: '抖音', platformIcon: '⬛', store: '纺大店', storeId: 'store_001',
    rating: 5, content: '天花板级别的藕汤！排骨炖得入口即化，藕粉粉糯糯的，汤色奶白特别浓郁。菌菇藕汤也超级推荐，菌菇提鲜，喝完整个人都暖了。环境干净，服务态度好，价格也实惠，人均50左右。',
    author: '美食达人Leo', time: '2026-03-09 12:00', timeAgo: '6小时前',
    hasImage: true, hasVideo: true,
    tags: [
      { primary: '产品/菜品', secondary: '口味出色', sentiment: 'positive', intensity: 5 },
      { primary: '环境卫生', secondary: '干净整洁', sentiment: 'positive', intensity: 4 },
      { primary: '服务态度', secondary: '热情', sentiment: 'positive', intensity: 4 },
      { primary: '价格性价比', secondary: '高性价比', sentiment: 'positive', intensity: 4 },
    ],
    riskLevel: 'P4', status: 'replied',
    aiSummary: '⭐ 高质量好评，覆盖口味/环境/服务/性价比四个维度，适合资产化',
    aiReply: '谢谢Leo的超详细分享！您说的菌菇藕汤是我们的春季新品，能得到您的认可太开心啦🥰 下次来可以试试我们的热干面配藕汤，武汉人的经典CP！',
    mentionedDish: '菌菇藕汤',
    replyTime: '2026-03-09 12:15',
    isHighValue: true,
  },
  {
    id: 'r005', platform: '小红书', platformIcon: '📕', store: '纺大店', storeId: 'store_001',
    rating: 5, content: '周末带闺蜜来的，排了大概15分钟。招牌排骨藕汤名不虚传！汤底浓郁，藕炖得很软糯。环境挺温馨的，适合朋友小聚。就是停车不太方便，建议坐地铁来。',
    author: '甜甜的生活', time: '2026-03-09 14:30', timeAgo: '3小时前',
    hasImage: true, hasVideo: false,
    tags: [
      { primary: '产品/菜品', secondary: '口味出色', sentiment: 'positive', intensity: 4 },
      { primary: '排队/等位', secondary: '等位适中', sentiment: 'neutral', intensity: 2 },
      { primary: '停车/交通', secondary: '停车不便', sentiment: 'negative', intensity: 2 },
      { primary: '推荐意愿', secondary: '愿意推荐', sentiment: 'positive', intensity: 4 },
    ],
    riskLevel: 'P4', status: 'replied',
    aiSummary: '好评为主，轻微提到停车不便（非核心问题）',
    aiReply: '谢谢小姐姐的分享！闺蜜聚餐选藕汤真的太会了😊 停车确实是附近的小痛点，我们门口有约10个车位，高峰期建议停对面停车场步行2分钟～下次来可以用小程序提前取号，省去排队时间哦！',
    replyTime: '2026-03-09 14:45',
    isHighValue: true,
  },
  {
    id: 'r006', platform: '美团', platformIcon: '🟠', store: '光谷店', storeId: 'store_002',
    rating: 3, content: '味道还行，但是量有点少，和纺大店比起来差了点意思。服务中规中矩。',
    author: '路过的食客', time: '2026-03-09 13:00', timeAgo: '5小时前',
    hasImage: false, hasVideo: false,
    tags: [
      { primary: '产品/菜品', secondary: '分量不足', sentiment: 'negative', intensity: 2 },
      { primary: '产品/菜品', secondary: '口味一般', sentiment: 'neutral', intensity: 2 },
    ],
    riskLevel: 'P3', status: 'pending',
    aiSummary: '中评，与旗舰店对比有落差感，需关注分店品控一致性',
    aiReply: '感谢您的真实反馈！您提到的分量问题我们非常重视，已经和后厨确认了标准化出品量。我们各门店都统一使用相同的食材和配方，但您的对比感受说明我们在执行上还有提升空间。下次来光谷店可以找店长，我们一定让您满意！',
    rootCause: '分店出品标准化执行偏差',
    isHighValue: false,
  },
]

// 整改任务
export const remediationTasks: RemediationTask[] = [
  {
    id: 'task_001', title: '晚高峰出餐超时问题整改',
    category: '出餐速度', sourceReviewCount: 8,
    stores: ['纺大店'], riskLevel: 'P1',
    assignee: '张店长', deadline: '2026-03-12',
    status: 'in_progress',
    suggestedAction: '①增配1名晚班后厨 ②优化备菜流程 ③设置出餐超时预警（>25分钟自动提醒）',
    period: '18:00-20:00',
    createdAt: '2026-03-07',
  },
  {
    id: 'task_002', title: '"服务冷淡"标签连续上升',
    category: '服务态度', sourceReviewCount: 5,
    stores: ['纺大店'], riskLevel: 'P2',
    assignee: '张店长', deadline: '2026-03-14',
    status: 'open',
    suggestedAction: '①开展服务话术培训 ②制定投诉处理SOP ③设立"服务之星"激励',
    staff: '前厅服务团队',
    createdAt: '2026-03-08',
  },
  {
    id: 'task_003', title: '翻台清洁标准执行不到位',
    category: '环境卫生', sourceReviewCount: 3,
    stores: ['纺大店'], riskLevel: 'P1',
    assignee: '张店长', deadline: '2026-03-11',
    status: 'in_progress',
    suggestedAction: '①翻台后拍照确认制度 ②增加晚高峰保洁频次 ③每日卫生检查表',
    period: '全天，重点晚高峰',
    createdAt: '2026-03-08',
  },
  {
    id: 'task_004', title: '光谷店出品标准化偏差',
    category: '产品/菜品', sourceReviewCount: 4,
    stores: ['光谷店'], riskLevel: 'P2',
    assignee: '刘店长', deadline: '2026-03-15',
    status: 'open',
    suggestedAction: '①对照纺大店标准量复核 ②总厨巡店指导 ③建立出品自检表',
    createdAt: '2026-03-09',
  },
  {
    id: 'task_005', title: '菌菇藕汤好评内容资产化',
    category: '好评资产化', sourceReviewCount: 12,
    stores: ['纺大店', '光谷店'], riskLevel: 'P3',
    assignee: '运营组', deadline: '2026-03-16',
    status: 'open',
    suggestedAction: '①提取好评关键词生成宣传文案 ②制作种草素材 ③更新团购详情页描述',
    createdAt: '2026-03-09',
  },
]

// 标签趋势数据
export const tagTrends = [
  { date: '3/3', 出餐速度: 2, 服务态度: 1, 环境卫生: 0, 产品菜品: 1 },
  { date: '3/4', 出餐速度: 3, 服务态度: 2, 环境卫生: 1, 产品菜品: 0 },
  { date: '3/5', 出餐速度: 4, 服务态度: 3, 环境卫生: 1, 产品菜品: 2 },
  { date: '3/6', 出餐速度: 3, 服务态度: 2, 环境卫生: 2, 产品菜品: 1 },
  { date: '3/7', 出餐速度: 5, 服务态度: 4, 环境卫生: 1, 产品菜品: 1 },
  { date: '3/8', 出餐速度: 6, 服务态度: 3, 环境卫生: 3, 产品菜品: 2 },
  { date: '3/9', 出餐速度: 4, 服务态度: 2, 环境卫生: 1, 产品菜品: 1 },
]

// 门店对比
export const storeComparison = [
  { store: '纺大店', score: 4.6, reviews: 156, negRate: 8.3, avgReplyTime: 4.2, topIssue: '出餐速度' },
  { store: '光谷店', score: 4.3, reviews: 89, negRate: 11.2, avgReplyTime: 6.8, topIssue: '产品标准化' },
  { store: '汉口店', score: 4.5, reviews: 112, negRate: 7.1, avgReplyTime: 3.5, topIssue: '排队等位' },
  { store: '武昌站店', score: 4.4, reviews: 67, negRate: 9.0, avgReplyTime: 5.1, topIssue: '服务态度' },
]

// 好评资产
export const goodReviewAssets = {
  topKeywords: ['藕粉糯', '汤色奶白', '入口即化', '性价比高', '环境温馨', '服务热情', '适合聚餐', '量大实惠'],
  suggestedCopy: [
    { use: '团购详情页', text: '"很多顾客说：藕汤浓郁鲜美，排骨入口即化，人均50超高性价比"' },
    { use: '小红书种草', text: '"适合下班后和朋友来一碗热腾腾的藕汤，温馨又实惠"' },
    { use: '朋友圈文案', text: '"93%的顾客推荐的宝藏藕汤店，藕粉糯、汤奶白、价格亲民"' },
  ],
  bestReviews: reviews.filter(r => r.isHighValue),
}

// KPI数据
export const reviewKPIs = {
  avgResponseTime: 4.2, // 小时
  p1ResponseTime: 1.8,
  aiAdoptionRate: 78, // %
  unrepliedRate: 12,
  scoreChange: +0.1,
  negRateChange: -2.3,
  topIssueRecurrence: 15, // %下降
}
