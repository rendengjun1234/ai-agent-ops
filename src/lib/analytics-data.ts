// 数据Agent专用mock数据

// 套餐数据
export const menuItems = [
  { id: 1, name: '招牌排骨藕汤', category: '招牌汤品', price: 42, cost: 15, monthSales: 1860, trend: 12.3, rating: 4.8 },
  { id: 2, name: '三鲜藕汤', category: '招牌汤品', price: 45, cost: 16, monthSales: 1420, trend: 8.5, rating: 4.7 },
  { id: 3, name: '莲藕丸子汤', category: '招牌汤品', price: 38, cost: 12, monthSales: 980, trend: -2.1, rating: 4.6 },
  { id: 4, name: '菌菇藕汤', category: '招牌汤品', price: 48, cost: 18, monthSales: 650, trend: 25.6, rating: 4.9 },
  { id: 5, name: '热干面', category: '主食', price: 14, cost: 4, monthSales: 2340, trend: 3.2, rating: 4.5 },
  { id: 6, name: '豆皮', category: '小吃', price: 10, cost: 3, monthSales: 1890, trend: 1.8, rating: 4.4 },
  { id: 7, name: '酸梅汤', category: '饮品', price: 8, cost: 2, monthSales: 1560, trend: 5.4, rating: 4.3 },
  { id: 8, name: '凉拌藕片', category: '凉菜', price: 16, cost: 5, monthSales: 1120, trend: -1.2, rating: 4.5 },
]

export const comboPackages = [
  {
    id: 1, name: '招牌双人套餐', price: 98, originalPrice: 138, items: ['排骨藕汤×1', '三鲜藕汤×1', '热干面×2', '酸梅汤×2'],
    monthSales: 680, trend: 15.2, platforms: { '美团': 320, '大众点评': 180, '抖音': 120, '京东外卖': 60 },
    conversionRate: 22.5, avgRating: 4.7,
  },
  {
    id: 2, name: '家庭欢聚套餐', price: 168, originalPrice: 228, items: ['排骨藕汤×1', '三鲜藕汤×1', '菌菇藕汤×1', '热干面×3', '豆皮×2', '酸梅汤×3'],
    monthSales: 340, trend: 8.7, platforms: { '美团': 160, '大众点评': 90, '抖音': 50, '京东外卖': 40 },
    conversionRate: 18.3, avgRating: 4.8,
  },
  {
    id: 3, name: '一人食套餐', price: 45, originalPrice: 62, items: ['莲藕丸子汤×1', '热干面×1', '酸梅汤×1'],
    monthSales: 920, trend: 22.1, platforms: { '美团': 380, '大众点评': 200, '抖音': 240, '京东外卖': 100 },
    conversionRate: 28.6, avgRating: 4.6,
  },
  {
    id: 4, name: '尝鲜套餐', price: 68, originalPrice: 96, items: ['排骨藕汤×1', '凉拌藕片×1', '热干面×1', '豆皮×1', '酸梅汤×1'],
    monthSales: 520, trend: 10.4, platforms: { '美团': 240, '大众点评': 140, '抖音': 80, '京东外卖': 60 },
    conversionRate: 20.1, avgRating: 4.7,
  },
  {
    id: 5, name: '抖音限定套餐', price: 39.9, originalPrice: 62, items: ['莲藕丸子汤×1', '豆皮×1', '酸梅汤×1'],
    monthSales: 1150, trend: 35.8, platforms: { '抖音': 980, '美团': 120, '大众点评': 50 },
    conversionRate: 32.4, avgRating: 4.5,
  },
]

// 分平台数据
export const platformAnalytics = [
  {
    platform: '美团',
    color: '#FF6B00',
    revenue: 82500,
    orders: 1650,
    avgPrice: 50.0,
    newCustomers: 420,
    returnRate: 32.5,
    rating: 4.7,
    commission: 18, // 佣金率%
    commissionAmount: 14850,
    topItems: ['招牌排骨藕汤', '招牌双人套餐', '热干面'],
    dailyData: Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i))
      const isWknd = d.getDay() === 0 || d.getDay() === 6
      return {
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        revenue: (isWknd ? 3500 : 2400) + Math.floor(Math.random() * 800),
        orders: (isWknd ? 70 : 48) + Math.floor(Math.random() * 15),
      }
    }),
  },
  {
    platform: '大众点评',
    color: '#FF4F00',
    revenue: 48600,
    orders: 972,
    avgPrice: 50.0,
    newCustomers: 280,
    returnRate: 28.3,
    rating: 4.5,
    commission: 10,
    commissionAmount: 4860,
    topItems: ['三鲜藕汤', '家庭欢聚套餐', '凉拌藕片'],
    dailyData: Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i))
      const isWknd = d.getDay() === 0 || d.getDay() === 6
      return {
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        revenue: (isWknd ? 2200 : 1400) + Math.floor(Math.random() * 500),
        orders: (isWknd ? 44 : 28) + Math.floor(Math.random() * 10),
      }
    }),
  },
  {
    platform: '抖音',
    color: '#000000',
    revenue: 28900,
    orders: 723,
    avgPrice: 40.0,
    newCustomers: 520,
    returnRate: 15.2,
    rating: 4.8,
    commission: 5,
    commissionAmount: 1445,
    topItems: ['抖音限定套餐', '一人食套餐', '菌菇藕汤'],
    dailyData: Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i))
      return {
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        revenue: 700 + Math.floor(Math.random() * 600),
        orders: 18 + Math.floor(Math.random() * 12),
      }
    }),
  },
  {
    platform: '高德',
    color: '#2B7FFF',
    revenue: 8200,
    orders: 164,
    avgPrice: 50.0,
    newCustomers: 98,
    returnRate: 22.1,
    rating: 4.4,
    commission: 0,
    commissionAmount: 0,
    topItems: ['排骨藕汤', '热干面'],
    dailyData: Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i))
      return {
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        revenue: 200 + Math.floor(Math.random() * 200),
        orders: 4 + Math.floor(Math.random() * 4),
      }
    }),
  },
  {
    platform: '京东外卖',
    color: '#E42313',
    revenue: 12800,
    orders: 320,
    avgPrice: 40.0,
    newCustomers: 180,
    returnRate: 18.7,
    rating: 4.6,
    commission: 8,
    commissionAmount: 1024,
    topItems: ['一人食套餐', '招牌双人套餐', '排骨藕汤'],
    dailyData: Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i))
      return {
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        revenue: 300 + Math.floor(Math.random() * 300),
        orders: 8 + Math.floor(Math.random() * 6),
      }
    }),
  },
  {
    platform: '淘宝闪购',
    color: '#FF5000',
    revenue: 5500,
    orders: 138,
    avgPrice: 39.9,
    newCustomers: 95,
    returnRate: 12.4,
    rating: 4.3,
    commission: 6,
    commissionAmount: 330,
    topItems: ['一人食套餐', '莲藕丸子汤'],
    dailyData: Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i))
      return {
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        revenue: 100 + Math.floor(Math.random() * 200),
        orders: 3 + Math.floor(Math.random() * 4),
      }
    }),
  },
]

// 时段分析
export const hourlyData = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 9 // 9:00 - 22:00
  const isPeak = (hour >= 11 && hour <= 13) || (hour >= 17 && hour <= 19)
  return {
    hour: `${hour}:00`,
    orders: isPeak ? 30 + Math.floor(Math.random() * 20) : 5 + Math.floor(Math.random() * 10),
    revenue: isPeak ? 1500 + Math.floor(Math.random() * 800) : 250 + Math.floor(Math.random() * 300),
    avgWait: isPeak ? 25 + Math.floor(Math.random() * 15) : 5 + Math.floor(Math.random() * 5),
  }
})

// 经营诊断（增强版）
export const aiDiagnostics = [
  {
    type: 'opportunity' as const,
    title: '抖音限定套餐表现优异',
    desc: '抖音限定套餐月销1150份，增速35.8%，转化率32.4%。建议：1）增加抖音直播频次；2）设计更多平台专属套餐；3）投放预算向抖音倾斜。',
    impact: '预计可增收¥15,000/月',
    date: '1小时前',
  },
  {
    type: 'warning' as const,
    title: '美团佣金成本偏高',
    desc: '美团佣金率18%，月佣金支出¥14,850，占总佣金支出66%。建议：1）引导美团用户转向小程序点餐；2）与美团协商降低佣金率；3）增加自有渠道占比。',
    impact: '优化后可月省¥5,000+',
    date: '3小时前',
  },
  {
    type: 'warning' as const,
    title: '莲藕丸子汤销量下滑',
    desc: '莲藕丸子汤月销同比下降2.1%，是唯一下滑的汤品。建议：1）检查口味是否有变化；2）推出莲藕丸子汤限时折扣；3）在套餐中增加露出。',
    impact: '止跌可回收¥3,000/月',
    date: '6小时前',
  },
  {
    type: 'success' as const,
    title: '菌菇藕汤成新爆品',
    desc: '菌菇藕汤上线2个月，月销650份增速25.6%，评分4.9为全店最高。建议：1）作为引流品重点推广；2）设计"菌菇藕汤+热干面"组合套餐。',
    impact: '潜力¥20,000+/月',
    date: '1天前',
  },
  {
    type: 'info' as const,
    title: '午高峰等待时间偏长',
    desc: '11:00-13:00平均等餐时间32分钟，超过行业标准20分钟。影响：差评中"上菜慢"关键词上升。建议：午市提前备菜+增加1名后厨。',
    impact: '改善可减少差评40%',
    date: '1天前',
  },
]

// 佣金汇总
export const commissionSummary = {
  totalRevenue: platformAnalytics.reduce((s, p) => s + p.revenue, 0),
  totalCommission: platformAnalytics.reduce((s, p) => s + p.commissionAmount, 0),
  avgCommissionRate: 0,
  byPlatform: platformAnalytics.map(p => ({
    platform: p.platform,
    revenue: p.revenue,
    rate: p.commission,
    amount: p.commissionAmount,
    color: p.color,
  })),
}
commissionSummary.avgCommissionRate = Math.round(commissionSummary.totalCommission / commissionSummary.totalRevenue * 100 * 10) / 10
