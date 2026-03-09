// 种草码专用mock数据

export interface SeedCode {
  id: string
  name: string
  type: 'table' | 'takeaway' | 'poster' | 'receipt'
  qrUrl: string
  scansTotal: number
  scansToday: number
  publishedTotal: number
  publishedToday: number
  conversionRate: number
  status: 'active' | 'paused'
  createdAt: string
  platforms: string[]
  template: string
  reward?: string
}

export const seedCodes: SeedCode[] = [
  {
    id: 'sc_001', name: '桌面种草码', type: 'table',
    qrUrl: '', scansTotal: 1856, scansToday: 45,
    publishedTotal: 523, publishedToday: 12,
    conversionRate: 28.2, status: 'active',
    createdAt: '2026-02-01',
    platforms: ['小红书', '大众点评', '抖音'],
    template: '美食探店模板',
    reward: '好评送酸梅汤一杯',
  },
  {
    id: 'sc_002', name: '外卖好评码', type: 'takeaway',
    qrUrl: '', scansTotal: 980, scansToday: 28,
    publishedTotal: 312, publishedToday: 8,
    conversionRate: 31.8, status: 'active',
    createdAt: '2026-02-15',
    platforms: ['美团', '大众点评'],
    template: '外卖好评模板',
    reward: '好评返现3元',
  },
  {
    id: 'sc_003', name: '抖音打卡码', type: 'poster',
    qrUrl: '', scansTotal: 2340, scansToday: 62,
    publishedTotal: 876, publishedToday: 18,
    conversionRate: 37.4, status: 'active',
    createdAt: '2026-01-20',
    platforms: ['抖音', '小红书'],
    template: '短视频脚本模板',
    reward: '发布视频送代金券10元',
  },
  {
    id: 'sc_004', name: '小票种草码', type: 'receipt',
    qrUrl: '', scansTotal: 456, scansToday: 15,
    publishedTotal: 98, publishedToday: 3,
    conversionRate: 21.5, status: 'paused',
    createdAt: '2026-03-01',
    platforms: ['小红书', '大众点评'],
    template: '简洁好评模板',
    reward: '积分×50',
  },
]

// AI生成的种草内容示例
export const aiGeneratedContent = {
  xiaohongshu: {
    title: '武汉藕汤天花板！纺大学生都在排队的宝藏小店🍲',
    content: `今天来纺大这边探店，终于打卡了传说中的湖北藕汤！

🍲 点了招牌排骨藕汤（¥42），汤色奶白浓郁，藕粉粉糯糯的，排骨炖得入口即化！

💡 推荐必点：
1️⃣ 招牌排骨藕汤 — 镇店之宝，必点！
2️⃣ 热干面 — 配藕汤绝了
3️⃣ 酸梅汤 — 解腻神器

📍 湖北藕汤（纺大店）
📮 武汉市洪山区纺织大学南门
⏰ 10:00-22:00
💰 人均50左右

#武汉美食 #湖北藕汤 #纺大美食 #武汉探店 #藕汤推荐`,
    tags: ['武汉美食', '湖北藕汤', '纺大美食', '武汉探店', '藕汤推荐'],
  },
  dianping: {
    title: '',
    content: `⭐⭐⭐⭐⭐ 

味道：藕汤浓郁鲜美，藕炖得粉糯，排骨入口即化。配上他们家的辣椒酱，绝了！
环境：店面干净整洁，虽然不大但很温馨。
服务：服务员态度很好，上菜速度也快。
性价比：人均50左右，量很足，性价比超高！

推荐菜品：招牌排骨藕汤、三鲜藕汤、热干面
📍 建议错峰来，周末高峰排队约15分钟`,
  },
  douyin: {
    title: '武汉排队王！纺大门口的藕汤到底有多好喝？',
    script: `【开头】今天带你们来武汉纺大门口，这家排队排疯了的藕汤店！

【点餐】我点了他们家的招牌排骨藕汤，42块钱一大碗

【展示】你们看这个汤色，奶白奶白的，藕炖得粉粉糯糯的

【品尝】我先喝一口汤… 天呐！太鲜了！这个排骨真的入口即化

【推荐】强烈推荐配他们家的热干面，藕汤配热干面，武汉人的标配！

【结尾】地址在纺大南门，人均50，记得收藏！周末要早点来不然排队哦～

#武汉美食 #藕汤 #武汉探店`,
  },
}

// 种草码统计
export const seedCodeStats = {
  totalScans: seedCodes.reduce((s, c) => s + c.scansTotal, 0),
  totalPublished: seedCodes.reduce((s, c) => s + c.publishedTotal, 0),
  avgConversion: +(seedCodes.reduce((s, c) => s + c.conversionRate, 0) / seedCodes.length).toFixed(1),
  estimatedExposure: 156000, // 预估曝光量
  platformBreakdown: [
    { platform: '小红书', published: 680, exposure: 82000, likes: 3400 },
    { platform: '大众点评', published: 520, exposure: 45000, likes: 1200 },
    { platform: '抖音', published: 380, exposure: 128000, likes: 8900 },
    { platform: '美团', published: 230, exposure: 12000, likes: 450 },
  ],
  dailyTrend: Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i))
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      scans: 30 + Math.floor(Math.random() * 40),
      published: 8 + Math.floor(Math.random() * 15),
    }
  }),
}

// 顾客生成内容流水
export const userGeneratedPosts = [
  { id: 1, user: '小红书er', platform: '小红书', title: '纺大藕汤！YYDS！🍲', likes: 234, time: '30分钟前', status: 'published' },
  { id: 2, user: '吃货小王', platform: '大众点评', title: '⭐⭐⭐⭐⭐ 必吃推荐', likes: 12, time: '1小时前', status: 'published' },
  { id: 3, user: '美食达人Leo', platform: '抖音', title: '武汉排队王藕汤实测', likes: 1890, time: '2小时前', status: 'published' },
  { id: 4, user: '大学生小陈', platform: '小红书', title: '学生党平价美食分享', likes: 56, time: '3小时前', status: 'published' },
  { id: 5, user: '汤圆妈妈', platform: '大众点评', title: '带娃打卡好去处', likes: 8, time: '5小时前', status: 'published' },
  { id: 6, user: '胖虎美食记', platform: '抖音', title: '100块吃遍纺大美食', likes: 3420, time: '昨天', status: 'published' },
]
