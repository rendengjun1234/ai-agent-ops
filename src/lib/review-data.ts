// 评价Agent专用mock数据
import type { Review } from './mock-data'

// 回复模板库
export const replyTemplates = [
  {
    id: 'good_1',
    name: '标准好评回复',
    category: 'positive',
    content: '感谢您的好评！您的认可是我们最大的动力💪 我们会继续用心做好每一碗藕汤，期待您的再次光临！',
  },
  {
    id: 'good_2',
    name: '好评+推荐新品',
    category: 'positive',
    content: '非常感谢您的认可！下次来店可以试试我们新推出的{菜品名}，相信一定不会让您失望～期待再次见到您！🍲',
  },
  {
    id: 'good_3',
    name: '好评+会员引导',
    category: 'positive',
    content: '谢谢您的五星好评！温馨提醒：成为我们的会员可以享受专属折扣和积分奖励哦～欢迎下次光临时咨询店员了解详情！',
  },
  {
    id: 'mid_1',
    name: '中评安抚',
    category: 'neutral',
    content: '感谢您的反馈！我们已经记录了您提到的问题，会持续改进服务体验。期待下次能给您带来更好的用餐感受～',
  },
  {
    id: 'bad_1',
    name: '差评道歉+补偿',
    category: 'negative',
    content: '非常抱歉给您带来不好的体验！我们已经将您的反馈转达给店长并立即整改。为表歉意，下次光临可享8折优惠，期待能重新赢得您的认可！🙏',
  },
  {
    id: 'bad_2',
    name: '差评道歉+解释',
    category: 'negative',
    content: '真的很抱歉让您失望了！{问题原因}。我们已经{改进措施}，确保不会再发生类似的情况。真诚期待您能再给我们一次机会！',
  },
  {
    id: 'bad_3',
    name: '外卖差评专用',
    category: 'negative',
    content: '非常抱歉外卖体验不佳！配送过程中的问题我们会和骑手平台沟通改进。同时我们已升级了外卖包装，确保汤品密封不洒。下次点外卖可备注"加固包装"，我们会格外注意！',
  },
  {
    id: 'wait_1',
    name: '等位/上菜慢专用',
    category: 'negative',
    content: '非常抱歉让您久等了！最近客流较大，我们已经增加了后厨人手并优化了出餐流程。建议您下次可以通过小程序提前预约，可以大大减少等待时间哦～',
  },
]

// 更丰富的评价用户
const reviewUsers = [
  { name: '张三丰', level: 'Lv6', reviewCount: 86 },
  { name: '吃货小王', level: 'Lv5', reviewCount: 142 },
  { name: '美食达人Leo', level: 'Lv7', reviewCount: 328 },
  { name: '武汉伢小李', level: 'Lv4', reviewCount: 45 },
  { name: '旅行者阿杰', level: 'Lv3', reviewCount: 23 },
  { name: '小红书er', level: 'Lv5', reviewCount: 167 },
  { name: '干饭人', level: 'Lv4', reviewCount: 58 },
  { name: '汤圆妈妈', level: 'Lv6', reviewCount: 203 },
  { name: '胖虎美食记', level: 'Lv7', reviewCount: 456 },
  { name: '吃遍武汉', level: 'Lv8', reviewCount: 892 },
  { name: '湖北老乡', level: 'Lv3', reviewCount: 19 },
  { name: '大学生小陈', level: 'Lv2', reviewCount: 8 },
  { name: '上班族小刘', level: 'Lv4', reviewCount: 67 },
  { name: '宝妈小周', level: 'Lv5', reviewCount: 134 },
  { name: '退休大爷', level: 'Lv3', reviewCount: 12 },
  { name: '公司团建王总', level: 'Lv4', reviewCount: 34 },
  { name: '摄影师小杨', level: 'Lv6', reviewCount: 245 },
  { name: '健身达人Lily', level: 'Lv5', reviewCount: 89 },
  { name: '美团金牌会员', level: 'Lv8', reviewCount: 1203 },
  { name: '本地通老赵', level: 'Lv7', reviewCount: 567 },
]

const goodReviews = [
  { content: '藕汤味道非常正宗，汤浓味美，藕粉粉糯糯的，每次来武汉必吃！排骨炖得很烂，入口即化。推荐排骨藕汤和莲藕丸子。', tags: ['口味好', '推荐', '正宗'] },
  { content: '环境干净整洁，服务态度很好，上菜速度也快。藕汤是真的好喝，喝完一碗还想再来一碗。桌上的辣椒酱也很好吃！', tags: ['环境好', '服务好', '上菜快'] },
  { content: '朋友推荐来的，果然没失望！藕汤鲜甜，排骨炖得很烂，入口即化。价格也很实惠，人均50左右，性价比超高。', tags: ['朋友推荐', '实惠', '性价比'] },
  { content: '来武汉出差顺便打卡，这家藕汤确实是我喝过最好喝的！配上热干面绝了，下次还来。老板还送了一碟小菜，很暖心。', tags: ['出差打卡', '热干面', '暖心'] },
  { content: '作为武汉本地人，这家是我心目中的top3藕汤店。每周至少来一次，老板人也很好，记得我的口味偏好。', tags: ['本地人推荐', '常客', 'top3'] },
  { content: '带外地朋友来吃的，朋友赞不绝口！量大实惠，藕汤浓郁，强烈推荐他们家的招牌三鲜藕汤，料很足！', tags: ['带朋友', '量大', '料足'] },
  { content: '第一次吃湖北藕汤就爱上了！汤底是真的鲜，不是味精那种鲜，是食材本身的鲜味。藕也炖得恰到好处，粉糯但不烂。', tags: ['第一次', '真鲜', '食材好'] },
  { content: '周末带家人来吃的，一家四口点了三个汤，都很好喝。小朋友特别喜欢莲藕丸子，吃了好几个。环境适合家庭聚餐。', tags: ['家庭聚餐', '适合小朋友', '周末'] },
  { content: '美团上看到评分很高就来试试了，没想到真的名不虚传！藕汤鲜美，配菜也很用心。会推荐给同事们。', tags: ['评分高', '名不虚传', '会推荐'] },
  { content: '住在附近经常来，冬天喝一碗热乎乎的藕汤太幸福了！最近新出的菌菇藕汤也很不错，汤底更鲜了。', tags: ['常客', '冬天必备', '新品好'] },
  { content: '在抖音上刷到的，专门过来打卡。出品确实稳定，和视频里看到的一样！拍照也很上镜，适合发朋友圈哈哈。', tags: ['抖音种草', '出品稳定', '适合拍照'] },
  { content: '加班到很晚，幸好这家店营业到10点！深夜来一碗藕汤，整个人都暖了。服务员态度也好，不会因为快打烊就催你。', tags: ['深夜美食', '服务好', '暖心'] },
  { content: '团购券很划算，原价138的双人套餐只要98！量很足，两个人吃得饱饱的。性价比真的高，下次还买券来。', tags: ['团购划算', '量足', '性价比高'] },
  { content: '之前在光谷店吃过，这次试了纺大店，味道一样好！连锁品质很稳定，赞👍 停车也方便，门口就有车位。', tags: ['连锁品质', '停车方便', '稳定'] },
]

const midReviews = [
  { content: '味道还行吧，中规中矩。等位时间有点长，建议错峰来。不过看在味道还不错的份上，可以再来。', tags: ['等位久', '味道还行'] },
  { content: '藕汤不错，但配菜一般。服务还可以，就是店面有点小，坐着不太舒服。建议扩大一下用餐区域。', tags: ['店面小', '配菜一般'] },
  { content: '之前来过觉得很惊艳，这次感觉味道没上次好了，可能是期望太高了？总体还是可以的，就是略有失望。', tags: ['期望落差', '味道波动'] },
  { content: '外卖送到的时候有点凉了，不过味道还是能感受到不错的。包装还可以改进一下，汤有点洒出来。', tags: ['外卖', '包装待改进'] },
]

const badReviews = [
  { content: '等了40分钟才上菜，太慢了。味道也没有之前好了，是不是换厨师了？而且服务员叫了好几次都不来，体验很差。', tags: ['上菜慢', '服务差', '味道下降'] },
  { content: '今天的藕汤明显咸了，而且藕不够粉。服务员态度也一般，叫了好几次才来加汤。希望能保持品质稳定。', tags: ['太咸', '藕不粉', '服务态度'] },
  { content: '外卖送到的时候都凉了，包装也不太好，汤洒了一半。而且少了一份小菜，联系商家也没人回。差评！', tags: ['外卖差', '漏送', '不回消息'] },
  { content: '周六中午去的，排了一个小时的队！好不容易坐下来，上菜又等了半小时。味道是不错，但这个效率真的接受不了。', tags: ['排队久', '效率低'] },
  { content: '价格涨了不少啊，以前38的排骨藕汤现在42了，量还感觉少了。性价比不如从前了，有点失望。', tags: ['涨价', '量少', '性价比下降'] },
  { content: '卫生条件需要改善，桌子擦得不太干净，地上也有点油腻。希望店家重视一下环境卫生问题。', tags: ['卫生差', '桌子脏'] },
]

const platforms = ['美团', '大众点评', '抖音', '高德', '京东外卖', '淘宝闪购'] as const

function randomDate(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo))
  d.setHours(Math.floor(Math.random() * 14) + 8)
  d.setMinutes(Math.floor(Math.random() * 60))
  return d.toISOString()
}

export function generateDetailedReviews(count: number): Review[] {
  const reviews: Review[] = []
  for (let i = 0; i < count; i++) {
    const rand = Math.random()
    const sentiment = rand > 0.2 ? 'positive' : rand > 0.08 ? 'neutral' : 'negative'
    const rating = sentiment === 'positive' ? (Math.random() > 0.3 ? 5 : 4) : sentiment === 'neutral' ? 3 : (Math.random() > 0.5 ? 2 : 1)

    const pool = sentiment === 'positive' ? goodReviews : sentiment === 'neutral' ? midReviews : badReviews
    const selected = pool[Math.floor(Math.random() * pool.length)]
    const user = reviewUsers[Math.floor(Math.random() * reviewUsers.length)]
    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const replied = Math.random() > 0.35
    const hasImages = Math.random() > 0.6
    const date = randomDate(30)

    reviews.push({
      id: `review_${String(i + 1).padStart(3, '0')}`,
      platform,
      userName: user.name,
      avatar: '',
      rating,
      content: selected.content,
      images: hasImages ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => `/img/review_${i}_${j}.jpg`) : [],
      date,
      replied,
      replyContent: replied ? '感谢您的评价！我们会继续努力提供更好的服务和美味的藕汤，期待您的再次光临！🙏' : undefined,
      sentiment,
      tags: selected.tags,
      aiSuggestion: !replied ? generateAISuggestion(sentiment, user.name, selected.tags) : undefined,
    })
  }
  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function generateAISuggestion(sentiment: string, userName: string, tags: string[]): string {
  if (sentiment === 'positive') {
    const options = [
      `感谢${userName}的五星好评！您提到的"${tags[0]}"正是我们一直坚持的品质标准💪 欢迎下次带更多朋友来品尝，我们准备了会员专属优惠等着您～`,
      `${userName}您好！非常开心您喜欢我们的藕汤😊 您的支持是我们最大的动力！温馨提醒：关注我们的小程序可以领取新客优惠券哦～`,
      `谢谢${userName}的认可！看到"${tags[0]}"这样的评价我们整个团队都很开心！期待您再次光临，我们会准备更多惊喜～🍲`,
    ]
    return options[Math.floor(Math.random() * options.length)]
  } else if (sentiment === 'neutral') {
    return `${userName}您好，感谢您的反馈！我们注意到您提到的"${tags[0]}"问题，已经安排改进。希望下次能给您带来更好的体验，期待再次见到您！`
  } else {
    const options = [
      `${userName}您好，非常抱歉给您带来不好的体验！关于"${tags[0]}"的问题，我们已经${tags[0].includes('慢') ? '增加了后厨人手并优化出餐流程' : tags[0].includes('卫生') ? '加强了卫生巡检频次' : '立即反馈给店长进行整改'}。为表歉意，下次光临可享8折优惠，期待能重新赢得您的认可！🙏`,
      `尊敬的${userName}，看到您的反馈我们深感抱歉。"${tags[0]}"确实不应该发生，我们已经${tags[0].includes('外卖') ? '升级了外卖包装并加强了出餐检查' : '进行了全面整改'}。衷心希望您能再给我们一次机会，我们一定做得更好！`,
    ]
    return options[Math.floor(Math.random() * options.length)]
  }
}

export const detailedReviews = generateDetailedReviews(120)

// 竞品数据
export const competitorData = [
  {
    name: '湖北藕汤（纺大店）',
    isOwn: true,
    rating: 4.6,
    reviewCount: 538,
    positiveRate: 88.5,
    avgReplyTime: '2.3小时',
    replyRate: 92,
    topTags: ['口味好', '正宗', '实惠'],
    trend: [4.5, 4.5, 4.6, 4.5, 4.6, 4.6, 4.7, 4.6, 4.5, 4.6, 4.6, 4.6],
  },
  {
    name: '老武汉藕汤馆',
    isOwn: false,
    rating: 4.4,
    reviewCount: 423,
    positiveRate: 82.3,
    avgReplyTime: '5.1小时',
    replyRate: 78,
    topTags: ['量大', '老店', '便宜'],
    trend: [4.3, 4.4, 4.4, 4.3, 4.4, 4.4, 4.3, 4.4, 4.4, 4.5, 4.4, 4.4],
  },
  {
    name: '荆楚藕汤王',
    isOwn: false,
    rating: 4.3,
    reviewCount: 312,
    positiveRate: 79.8,
    avgReplyTime: '8.2小时',
    replyRate: 65,
    topTags: ['环境好', '装修新', '拍照好看'],
    trend: [4.2, 4.2, 4.3, 4.3, 4.2, 4.3, 4.3, 4.4, 4.3, 4.3, 4.3, 4.3],
  },
  {
    name: '武汉印象藕汤',
    isOwn: false,
    rating: 4.5,
    reviewCount: 267,
    positiveRate: 85.1,
    avgReplyTime: '3.8小时',
    replyRate: 88,
    topTags: ['创新', '年轻人喜欢', '打卡'],
    trend: [4.3, 4.4, 4.4, 4.4, 4.5, 4.4, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5],
  },
]

// 评价统计趋势（按天）
export const reviewDailyStats = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (29 - i))
  const total = Math.floor(Math.random() * 8) + 3
  const positive = Math.floor(total * (0.7 + Math.random() * 0.2))
  const negative = Math.floor(Math.random() * 2)
  const neutral = total - positive - negative
  return {
    date: `${d.getMonth() + 1}/${d.getDate()}`,
    total,
    positive,
    neutral: Math.max(0, neutral),
    negative,
    rating: +(4.3 + Math.random() * 0.5).toFixed(1),
    replyRate: Math.floor(80 + Math.random() * 18),
  }
})

// 关键词分析（更详细）
export const keywordAnalysis = {
  positive: [
    { keyword: '味道好', count: 68, trend: 'up' as const },
    { keyword: '正宗', count: 52, trend: 'up' as const },
    { keyword: '推荐', count: 48, trend: 'stable' as const },
    { keyword: '好喝', count: 45, trend: 'up' as const },
    { keyword: '实惠', count: 38, trend: 'stable' as const },
    { keyword: '服务好', count: 32, trend: 'up' as const },
    { keyword: '环境好', count: 28, trend: 'stable' as const },
    { keyword: '量大', count: 25, trend: 'down' as const },
    { keyword: '上菜快', count: 22, trend: 'up' as const },
    { keyword: '性价比高', count: 20, trend: 'stable' as const },
  ],
  negative: [
    { keyword: '等位久', count: 15, trend: 'up' as const },
    { keyword: '上菜慢', count: 12, trend: 'up' as const },
    { keyword: '太咸', count: 8, trend: 'stable' as const },
    { keyword: '价格贵', count: 6, trend: 'up' as const },
    { keyword: '外卖包装差', count: 5, trend: 'down' as const },
    { keyword: '卫生', count: 4, trend: 'stable' as const },
    { keyword: '量少', count: 3, trend: 'stable' as const },
  ],
}

// 邀评配置
export const inviteReviewConfig = {
  sms: {
    enabled: true,
    delayHours: 2,
    template: '【湖北藕汤】感谢您今天的光临！如果您觉得我们的藕汤不错，麻烦给个好评鼓励一下我们吧～ {评价链接}',
    sentToday: 23,
    conversionRate: 18.5,
  },
  wechat: {
    enabled: true,
    delayHours: 1,
    template: '亲爱的顾客，感谢您选择湖北藕汤🍲 您的每一条评价都是我们进步的动力！点击下方链接分享您的用餐体验吧～',
    sentToday: 45,
    conversionRate: 22.3,
  },
  inStore: {
    enabled: true,
    type: 'qrcode',
    reward: '好评送酸梅汤一杯',
    scansToday: 18,
    conversionRate: 35.2,
  },
  preFilter: {
    enabled: true,
    question: '您对今天的用餐体验满意吗？',
    satisfiedAction: '引导去平台写好评',
    unsatisfiedAction: '引导填写内部反馈表单',
  },
}
