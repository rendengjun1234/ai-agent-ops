// 客服Agent专用mock数据

export interface Message {
  id: string
  sender: 'customer' | 'bot' | 'staff'
  content: string
  time: string
  status?: 'sent' | 'read'
}

export interface Conversation {
  id: string
  customer: string
  platform: string
  platformIcon: string
  lastMsg: string
  time: string
  unread: number
  status: 'bot' | 'staff' | 'closed'
  tags: string[]
  messages: Message[]
  satisfaction?: number
}

export const conversations: Conversation[] = [
  {
    id: 'conv_001',
    customer: '美食达人Leo',
    platform: '美团IM',
    platformIcon: '🟠',
    lastMsg: '你们家周末需要排队吗？',
    time: '5分钟前',
    unread: 1,
    status: 'bot',
    tags: ['咨询', '排队'],
    messages: [
      { id: 'm1', sender: 'customer', content: '你好，请问你们家周末需要排队吗？', time: '17:25' },
      { id: 'm2', sender: 'bot', content: '您好！感谢您的咨询😊 周末高峰时段（11:30-13:00、17:30-19:00）通常需要排队约15-30分钟。建议您通过小程序提前取号，可以减少等待时间哦～', time: '17:25', status: 'sent' },
      { id: 'm3', sender: 'customer', content: '小程序在哪里？', time: '17:26' },
      { id: 'm4', sender: 'bot', content: '您可以在微信搜索"湖北藕汤"小程序，或扫描店内桌面二维码。在小程序首页点击"排队取号"即可远程排队，到号前会微信通知您～ 需要我发送小程序链接给您吗？', time: '17:26', status: 'sent' },
      { id: 'm5', sender: 'customer', content: '好的，那大概几点去比较不用排队？', time: '17:28' },
    ],
  },
  {
    id: 'conv_002',
    customer: '吃货小王',
    platform: '大众点评',
    platformIcon: '🔴',
    lastMsg: '有没有包间可以预约？',
    time: '15分钟前',
    unread: 0,
    status: 'bot',
    tags: ['预约', '包间'],
    messages: [
      { id: 'm1', sender: 'customer', content: '请问有包间吗？想预约周六中午', time: '17:15' },
      { id: 'm2', sender: 'bot', content: '您好！我们店有2个包间，可容纳8-12人。周六中午的包间目前还有1间可预约。请问您大约几位用餐呢？', time: '17:15', status: 'read' },
      { id: 'm3', sender: 'customer', content: '大概10个人，公司聚餐', time: '17:16' },
      { id: 'm4', sender: 'bot', content: '10位的话推荐我们的大包间（可坐12人），非常适合公司聚餐！\n\n🍲 推荐「家庭欢聚套餐」×2 = ¥336（原价¥456）\n包含：3种藕汤+热干面+豆皮+酸梅汤\n\n需要我帮您预约吗？请告知：\n1. 预计到店时间\n2. 联系电话\n3. 有无特殊要求（如忌口）', time: '17:16', status: 'read' },
      { id: 'm5', sender: 'customer', content: '好的，11:30到，电话138xxxx1234，有一位同事不吃辣', time: '17:18' },
      { id: 'm6', sender: 'bot', content: '✅ 已为您预约成功！\n\n📋 预约信息：\n• 时间：周六 11:30\n• 人数：10位\n• 包间：大包间\n• 联系人：138xxxx1234\n• 备注：1位不吃辣\n\n我们会提前准备清淡口味的莲藕丸子汤给不吃辣的同事。到店后报预约电话即可入座，期待您的光临！🍲', time: '17:18', status: 'read' },
    ],
  },
  {
    id: 'conv_003',
    customer: '武汉伢小李',
    platform: '微信',
    platformIcon: '🟢',
    lastMsg: '藕汤可以打包外带吗？',
    time: '1小时前',
    unread: 0,
    status: 'closed',
    tags: ['外带', '已解决'],
    messages: [
      { id: 'm1', sender: 'customer', content: '你们家的藕汤可以打包外带吗？', time: '16:30' },
      { id: 'm2', sender: 'bot', content: '当然可以！我们提供外带服务🍲\n\n外带方式：\n1️⃣ 到店打包 — 所有菜品均可打包，汤品使用密封保温杯装\n2️⃣ 外卖下单 — 美团/京东外卖均可下单，30分钟送达\n3️⃣ 小程序点餐 — 提前下单，到店自取（免排队）\n\n💡 小提示：外带藕汤建议2小时内食用，口感最佳哦～', time: '16:30', status: 'read' },
      { id: 'm3', sender: 'customer', content: '好的谢谢，那我到店打包吧', time: '16:32' },
      { id: 'm4', sender: 'bot', content: '好的，欢迎光临！到店后告诉服务员要打包即可，我们会用保温包装。期待您的到来！😊', time: '16:32', status: 'read' },
    ],
  },
  {
    id: 'conv_004',
    customer: '公司团建王总',
    platform: '美团IM',
    platformIcon: '🟠',
    lastMsg: '能开发票吗？',
    time: '2小时前',
    unread: 0,
    status: 'staff',
    tags: ['发票', '需人工'],
    messages: [
      { id: 'm1', sender: 'customer', content: '你好，我们公司想订20人的团建午餐，能开发票吗？', time: '15:30' },
      { id: 'm2', sender: 'bot', content: '您好！可以开具发票的。我们支持：\n• 增值税普通发票（电子/纸质）\n• 增值税专用发票（需提供公司税号等信息）\n\n20人团建午餐推荐方案：\n🍲 「家庭欢聚套餐」×5 = ¥840\n或自选菜品人均约¥50-60\n\n由于是大额团餐，我帮您转接人工客服来对接具体方案，请稍等～', time: '15:30', status: 'read' },
      { id: 'm3', sender: 'staff', content: '王总您好，我是纺大店的张店长。20人团建我们可以安排大厅拼桌或者包场（需提前1天预约）。发票信息您方便发给我吗？我帮您做个详细方案和报价。', time: '15:35', status: 'read' },
      { id: 'm4', sender: 'customer', content: '好的，公司名称是xxx科技有限公司，税号xxxx，请发个方案给我看看', time: '15:40' },
    ],
  },
  {
    id: 'conv_005',
    customer: '退休大爷',
    platform: '微信',
    platformIcon: '🟢',
    lastMsg: '营业到几点？',
    time: '3小时前',
    unread: 0,
    status: 'closed',
    tags: ['营业时间', '已解决'],
    messages: [
      { id: 'm1', sender: 'customer', content: '请问你们晚上营业到几点？', time: '14:20' },
      { id: 'm2', sender: 'bot', content: '您好！我们的营业时间是 10:00 - 22:00（最后点餐21:30）。全年无休，节假日正常营业。\n\n📍 地址：武汉市洪山区纺织大学南门\n📞 电话：027-8888-6666\n\n欢迎您来品尝正宗湖北藕汤！🍲', time: '14:20', status: 'read' },
      { id: 'm3', sender: 'customer', content: '好的知道了', time: '14:22' },
    ],
  },
  {
    id: 'conv_006',
    customer: '健身达人Lily',
    platform: '抖音',
    platformIcon: '⬛',
    lastMsg: '有没有低卡的推荐？',
    time: '4小时前',
    unread: 0,
    status: 'bot',
    tags: ['菜品推荐', '健康'],
    messages: [
      { id: 'm1', sender: 'customer', content: '你好，我在减脂期，你们有没有低卡的菜推荐？', time: '13:15' },
      { id: 'm2', sender: 'bot', content: '您好！减脂期也能享受美味藕汤哦😊\n\n🥬 低卡推荐：\n1. 莲藕丸子汤（约280kcal/碗）— 藕粉糯，丸子是蒸制非油炸\n2. 凉拌藕片（约120kcal）— 清爽低脂\n3. 菌菇藕汤（约250kcal/碗）— 菌菇提鲜，少油\n\n❌ 减脂期建议少点：热干面（约450kcal）、豆皮（油炸）\n\n💡 温馨提示：可以告诉服务员"少油少盐"，我们可以调整口味～', time: '13:16', status: 'read' },
    ],
  },
]

// 知识库
export const knowledgeBase = [
  { id: 1, category: '基本信息', question: '营业时间', answer: '10:00 - 22:00（最后点餐21:30），全年无休', hitCount: 156 },
  { id: 2, category: '基本信息', question: '门店地址', answer: '武汉市洪山区纺织大学南门', hitCount: 134 },
  { id: 3, category: '基本信息', question: '联系电话', answer: '027-8888-6666', hitCount: 89 },
  { id: 4, category: '预约排队', question: '需要排队吗', answer: '周末高峰11:30-13:00、17:30-19:00需排队约15-30分钟，可通过小程序提前取号', hitCount: 245 },
  { id: 5, category: '预约排队', question: '有包间吗', answer: '有2个包间（8-12人），需提前预约', hitCount: 78 },
  { id: 6, category: '外卖外带', question: '可以打包吗', answer: '所有菜品可打包，汤品使用密封保温杯，也可通过美团/京东外卖下单', hitCount: 167 },
  { id: 7, category: '外卖外带', question: '配送范围', answer: '门店周边5公里，30分钟送达', hitCount: 92 },
  { id: 8, category: '菜品推荐', question: '招牌菜', answer: '招牌排骨藕汤（¥42）、三鲜藕汤（¥45）、菌菇藕汤（¥48）', hitCount: 312 },
  { id: 9, category: '菜品推荐', question: '有辣的吗', answer: '藕汤均为清淡口味，可加辣椒酱调味，配菜有凉拌藕片可选微辣', hitCount: 56 },
  { id: 10, category: '支付优惠', question: '可以开发票吗', answer: '支持增值税普通发票和专用发票，大额需联系店长', hitCount: 45 },
  { id: 11, category: '支付优惠', question: '有什么优惠', answer: '新客满50减10（美团）、会员积分兑换、好评返3元、抖音限定套餐¥39.9', hitCount: 198 },
  { id: 12, category: '其他', question: '停车方便吗', answer: '门口有免费停车位约10个，高峰期建议停在对面停车场（步行2分钟）', hitCount: 67 },
]

// 客服统计
export const serviceStats = {
  today: {
    totalConversations: 47,
    botHandled: 38,
    staffHandled: 9,
    avgResponseTime: 8, // 秒
    satisfactionRate: 94.2,
    resolvedRate: 91.5,
  },
  topQuestions: [
    { question: '招牌菜推荐', count: 15 },
    { question: '排队/预约', count: 12 },
    { question: '营业时间', count: 8 },
    { question: '外卖/打包', count: 7 },
    { question: '优惠活动', count: 5 },
  ],
  hourlyVolume: Array.from({ length: 14 }, (_, i) => ({
    hour: `${i + 9}:00`,
    count: i >= 2 && i <= 4 ? 6 + Math.floor(Math.random() * 4) : i >= 8 && i <= 10 ? 5 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 3),
  })),
}

// 自动回复规则
export const autoReplyRules = [
  { id: 1, trigger: '营业时间/几点开门/几点关门', reply: '营业时间模板', enabled: true, hitCount: 156 },
  { id: 2, trigger: '地址/在哪/怎么走', reply: '地址导航模板', enabled: true, hitCount: 134 },
  { id: 3, trigger: '排队/等位/预约', reply: '排队预约模板', enabled: true, hitCount: 245 },
  { id: 4, trigger: '外卖/打包/外带', reply: '外卖打包模板', enabled: true, hitCount: 167 },
  { id: 5, trigger: '推荐/什么好吃/招牌', reply: '菜品推荐模板', enabled: true, hitCount: 312 },
  { id: 6, trigger: '优惠/折扣/活动/券', reply: '优惠活动模板', enabled: true, hitCount: 198 },
  { id: 7, trigger: '发票', reply: '转人工（发票需店长处理）', enabled: true, hitCount: 45 },
  { id: 8, trigger: '投诉/不满/差评', reply: '转人工（客诉需人工处理）', enabled: true, hitCount: 23 },
]
