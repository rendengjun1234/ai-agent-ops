// 官号运营 + 矩阵账号 数据

export interface SocialAccount {
  id: string
  platform: 'xiaohongshu' | 'douyin' | 'dianping' | 'meituan'
  platformLabel: string
  platformIcon: string
  type: 'official' | 'employee'
  name: string
  avatar: string
  followers: number
  posts: number
  likes: number
  status: 'active' | 'paused'
  persona?: string
  style?: string
}

export interface ContentPost {
  id: string
  accountId: string
  title: string
  content: string
  images: number
  platform: string
  status: 'draft' | 'scheduled' | 'published' | 'generating'
  scheduledTime?: string
  publishedTime?: string
  views: number
  likes: number
  comments: number
  shares: number
  style: string
}

export interface ContentTemplate {
  id: string
  name: string
  style: string
  description: string
  promptPreview: string
  category: string
}

// 矩阵账号
export const socialAccounts: SocialAccount[] = [
  {
    id: 'acc_001', platform: 'xiaohongshu', platformLabel: '小红书', platformIcon: '📕',
    type: 'official', name: '湖北藕汤官方号', avatar: '🏪',
    followers: 12800, posts: 156, likes: 45600, status: 'active',
    persona: '品牌官方号，专业权威', style: '专业权威风格',
  },
  {
    id: 'acc_002', platform: 'xiaohongshu', platformLabel: '小红书', platformIcon: '📕',
    type: 'employee', name: '藕汤小厨娘', avatar: '👩‍🍳',
    followers: 3200, posts: 89, likes: 18900, status: 'active',
    persona: '店员人设，亲切分享日常', style: 'KOC真实分享',
  },
  {
    id: 'acc_003', platform: 'xiaohongshu', platformLabel: '小红书', platformIcon: '📕',
    type: 'employee', name: '武汉吃货日记', avatar: '🍜',
    followers: 5600, posts: 67, likes: 23400, status: 'active',
    persona: '美食博主人设，探店风格', style: '种草安利风格',
  },
  {
    id: 'acc_004', platform: 'douyin', platformLabel: '抖音', platformIcon: '🎵',
    type: 'official', name: '湖北藕汤', avatar: '🏪',
    followers: 28500, posts: 234, likes: 156000, status: 'active',
    persona: '品牌官方号', style: '专业权威风格',
  },
  {
    id: 'acc_005', platform: 'douyin', platformLabel: '抖音', platformIcon: '🎵',
    type: 'employee', name: '藕汤哥的日常', avatar: '👨‍🍳',
    followers: 8900, posts: 112, likes: 67800, status: 'active',
    persona: '厨师人设，展示后厨', style: 'KOC真实分享',
  },
  {
    id: 'acc_006', platform: 'dianping', platformLabel: '大众点评', platformIcon: '⭐',
    type: 'official', name: '湖北藕汤（纺大店）', avatar: '🏪',
    followers: 0, posts: 0, likes: 0, status: 'active',
    persona: '商户号', style: '官方回复',
  },
  {
    id: 'acc_007', platform: 'meituan', platformLabel: '美团', platformIcon: '🟠',
    type: 'official', name: '湖北藕汤（纺大店）', avatar: '🏪',
    followers: 0, posts: 0, likes: 0, status: 'active',
    persona: '商户号', style: '官方回复',
  },
]

// 内容帖子
export const contentPosts: ContentPost[] = [
  {
    id: 'post_001', accountId: 'acc_001',
    title: '😱谁懂啊！武汉这碗藕汤鲜到眉毛掉！',
    content: '作为一个土生土长的武汉人，喝了二十多年藕汤...',
    images: 4, platform: '小红书', status: 'published',
    publishedTime: '2026-03-09 12:00',
    views: 3200, likes: 234, comments: 18, shares: 45,
    style: '情绪种草型',
  },
  {
    id: 'post_002', accountId: 'acc_002',
    title: '后厨偷偷告诉你，藕汤好喝的秘密🤫',
    content: '在店里工作3个月了，今天分享一下我们家藕汤为什么这么好喝...',
    images: 6, platform: '小红书', status: 'published',
    publishedTime: '2026-03-08 18:30',
    views: 5600, likes: 456, comments: 32, shares: 89,
    style: '干货攻略型',
  },
  {
    id: 'post_003', accountId: 'acc_003',
    title: '武汉纺大美食地图｜这家藕汤排队1小时也值！',
    content: '纺大周边吃了三年，这家是我的TOP1...',
    images: 9, platform: '小红书', status: 'published',
    publishedTime: '2026-03-07 20:00',
    views: 8900, likes: 678, comments: 56, shares: 123,
    style: '探店打卡型',
  },
  {
    id: 'post_004', accountId: 'acc_001',
    title: '🍲 春季限定！菌菇藕汤上新啦',
    content: '春天来了，我们推出了全新的菌菇藕汤...',
    images: 4, platform: '小红书', status: 'scheduled',
    scheduledTime: '2026-03-10 12:00',
    views: 0, likes: 0, comments: 0, shares: 0,
    style: '新品发布型',
  },
  {
    id: 'post_005', accountId: 'acc_004',
    title: '武汉排队王！纺大门口的藕汤到底有多好喝？',
    content: '今天带你们来武汉纺大门口...',
    images: 0, platform: '抖音', status: 'published',
    publishedTime: '2026-03-08 11:00',
    views: 45000, likes: 3200, comments: 234, shares: 567,
    style: '探店打卡型',
  },
  {
    id: 'post_006', accountId: 'acc_005',
    title: '厨师长教你在家炖出奶白藕汤！',
    content: '很多粉丝问我藕汤怎么炖才好喝...',
    images: 0, platform: '抖音', status: 'published',
    publishedTime: '2026-03-06 15:00',
    views: 23000, likes: 1890, comments: 156, shares: 345,
    style: '干货教程型',
  },
  {
    id: 'post_007', accountId: 'acc_002',
    title: '💰新客福利！满50减10限时领',
    content: '老板说了，新粉丝专属福利来啦...',
    images: 3, platform: '小红书', status: 'generating',
    views: 0, likes: 0, comments: 0, shares: 0,
    style: '促销福利型',
  },
]

// 内容模板/策略
export const contentStrategies: ContentTemplate[] = [
  {
    id: 'tpl_001', name: '情绪种草型', style: '😭 情绪共鸣',
    description: '用真实感受打动人心，标题使用表情符号开头',
    promptPreview: '谁懂啊！绝绝子！真的会谢！',
    category: '种草',
  },
  {
    id: 'tpl_002', name: '干货攻略型', style: '📝 干货避坑',
    description: '客观真实测评，用数据和事实说话',
    promptPreview: '装修3套房的血泪经验...',
    category: '攻略',
  },
  {
    id: 'tpl_003', name: '促销福利型', style: '💰 薅羊毛',
    description: '突出具体优惠金额，使用紧迫感词汇',
    promptPreview: '立省500！手慢无！',
    category: '促销',
  },
  {
    id: 'tpl_004', name: '探店打卡型', style: '📍 探店Vlog',
    description: '第一人称视角描述探店体验',
    promptPreview: '今天发现一家超棒的店...',
    category: '探店',
  },
  {
    id: 'tpl_005', name: 'SEO优化型', style: '🔍 搜索优化',
    description: '标题包含核心关键词，正文融入长尾词',
    promptPreview: '武汉藕汤推荐 纺大美食...',
    category: 'SEO',
  },
]

// 营销日历节点
export const marketingCalendar = [
  { id: 1, name: '三八女神节', date: '03-08', theme: '女性消费', status: 'completed', notes: 8, desc: '女性消费力爆发，美食/礼物类黄金期' },
  { id: 2, name: '春季新品上市', date: '03-15', theme: '新品种草', status: 'active', notes: 12, desc: '菌菇藕汤上新，抢占换季消费心智' },
  { id: 3, name: '五一劳动节', date: '05-01', theme: '出行消费', status: 'upcoming', notes: 0, desc: '五一小长假，探店/旅行内容高峰' },
  { id: 4, name: '618大促', date: '06-18', theme: '年中大促', status: 'upcoming', notes: 0, desc: '年中大促节点，转化收割关键战役' },
  { id: 5, name: '中秋国庆', date: '09-15', theme: '双节营销', status: 'upcoming', notes: 0, desc: '礼品/聚餐/出游全覆盖' },
  { id: 6, name: '双11狂欢', date: '11-11', theme: '全年大促', status: 'upcoming', notes: 0, desc: '全年最大促销节点' },
]

// 官号运营统计
export const officialOpsStats = {
  totalAccounts: socialAccounts.length,
  officialAccounts: socialAccounts.filter(a => a.type === 'official').length,
  employeeAccounts: socialAccounts.filter(a => a.type === 'employee').length,
  totalPosts: contentPosts.length,
  publishedPosts: contentPosts.filter(p => p.status === 'published').length,
  scheduledPosts: contentPosts.filter(p => p.status === 'scheduled').length,
  totalViews: contentPosts.reduce((s, p) => s + p.views, 0),
  totalLikes: contentPosts.reduce((s, p) => s + p.likes, 0),
  totalComments: contentPosts.reduce((s, p) => s + p.comments, 0),
  weeklyGrowth: {
    followers: '+1,280',
    posts: '+12',
    views: '+85,700',
    likes: '+6,458',
  },
}
