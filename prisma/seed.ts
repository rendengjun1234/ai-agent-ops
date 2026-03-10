import Database from 'better-sqlite3'
import path from 'node:path'

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Init tables (same as db.ts)
db.exec(`
  CREATE TABLE IF NOT EXISTS platform_accounts (id TEXT PRIMARY KEY, platform TEXT NOT NULL, account_id TEXT NOT NULL, account_name TEXT NOT NULL, cookies TEXT DEFAULT '{}', status TEXT DEFAULT 'active', bind_time TEXT DEFAULT (datetime('now')), last_sync_at TEXT, UNIQUE(platform, account_id));
  CREATE TABLE IF NOT EXISTS shops (id TEXT PRIMARY KEY, shop_id TEXT NOT NULL, shop_name TEXT NOT NULL, platform TEXT NOT NULL, address TEXT, rating REAL, account_id TEXT NOT NULL, UNIQUE(platform, shop_id), FOREIGN KEY (account_id) REFERENCES platform_accounts(id) ON DELETE CASCADE);
  CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, review_id TEXT NOT NULL, platform TEXT NOT NULL, shop_id TEXT NOT NULL, user_name TEXT NOT NULL, rating INTEGER NOT NULL, content TEXT NOT NULL, images TEXT, has_video INTEGER DEFAULT 0, created_at TEXT NOT NULL, reply TEXT, replied_at TEXT, synced_at TEXT DEFAULT (datetime('now')), ai_tags TEXT, risk_level TEXT, ai_summary TEXT, ai_reply TEXT, root_cause TEXT, mentioned_dish TEXT, mentioned_staff TEXT, mentioned_period TEXT, status TEXT DEFAULT 'pending', assignee TEXT, is_high_value INTEGER DEFAULT 0, linked_task_id TEXT, UNIQUE(platform, review_id), FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE);
  CREATE TABLE IF NOT EXISTS remediation_tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, source_review_count INTEGER DEFAULT 0, stores TEXT, risk_level TEXT NOT NULL, assignee TEXT NOT NULL, deadline TEXT NOT NULL, status TEXT DEFAULT 'open', suggested_action TEXT NOT NULL, period TEXT, staff TEXT, created_at TEXT DEFAULT (datetime('now')), resolved_at TEXT, score_impact TEXT);
`)

function id() { return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8) }

// Clean
db.exec('DELETE FROM reviews; DELETE FROM shops; DELETE FROM platform_accounts; DELETE FROM remediation_tasks;')

// Accounts
const accs: Record<string, string> = {}
for (const [key, name] of [['meituan', '美团'], ['dianping', '大众点评'], ['douyin', '抖音'], ['xhs', '小红书'], ['eleme', '饿了么']]) {
  const aid = id()
  db.prepare('INSERT INTO platform_accounts (id, platform, account_id, account_name) VALUES (?,?,?,?)').run(aid, key, `${key}_main`, `${name}官方账号`)
  accs[key] = aid
}

// Shops
const shops: Record<string, string> = {}
for (const [sid, name, addr, rating] of [['store_001', '纺大店', '武汉纺织大学旁', 4.6], ['store_002', '光谷店', '光谷广场', 4.3], ['store_003', '汉口店', '汉口江汉路', 4.5], ['store_004', '武昌站店', '武昌火车站', 4.4]] as const) {
  const dbId = id()
  db.prepare('INSERT INTO shops (id, shop_id, shop_name, platform, address, rating, account_id) VALUES (?,?,?,?,?,?,?)').run(dbId, sid, name, 'meituan', addr, rating, accs['meituan'])
  shops[sid] = dbId
}

// Reviews
const ins = db.prepare('INSERT INTO reviews (id, review_id, platform, shop_id, user_name, rating, content, images, has_video, created_at, reply, replied_at, ai_tags, risk_level, ai_summary, ai_reply, root_cause, mentioned_dish, mentioned_period, status, is_high_value) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')

const revs = [
  ['r001', 'meituan', shops['store_001'], '王先生', 1, '等了快50分钟才上齐菜，服务员态度还很冷淡，问了几次都说快了。藕汤味道一般，和之前来吃的差距很大，排骨也没什么肉。再也不来了。', '["img1.jpg"]', 0, '2026-03-08T19:23:00',
    null, null,
    JSON.stringify([{primary:'出餐速度',secondary:'等待过长',sentiment:'negative',intensity:5},{primary:'服务态度',secondary:'冷淡敷衍',sentiment:'negative',intensity:4},{primary:'产品/菜品',secondary:'口味下降',sentiment:'negative',intensity:3}]),
    'P1', '晚高峰出餐超时+服务冷淡+口味不稳定，三重负面，情绪强烈',
    '王先生您好，非常抱歉让您在晚高峰时段等候了这么久。您提到的出餐衔接和服务响应问题，我们已经同步给店长进行专项复盘。已为您准备了一张免单券，期待您再次光临！',
    '晚高峰18:00-20:00人手不足', null, '晚高峰', 'pending', 0],
  ['r002', 'dianping', shops['store_001'], '李女士', 2, '藕汤端上来就不太热了，跟服务员说了也没换，就说"本来就是这个温度"。这态度真的无语。', null, 0, '2026-03-08T12:45:00',
    null, null,
    JSON.stringify([{primary:'产品/菜品',secondary:'温度不够',sentiment:'negative',intensity:3},{primary:'服务态度',secondary:'处理投诉能力弱',sentiment:'negative',intensity:4}]),
    'P2', '菜品温度问题+服务员处理投诉不当',
    '李女士您好，看到您的反馈非常抱歉！藕汤出品温度确实应该保证滚烫上桌。我们已经对出品流程和服务标准做了整改。',
    '出品温控不到位+服务员培训不足', null, null, 'pending', 0],
  ['r003', 'dianping', shops['store_001'], '匿名用户', 1, '桌子上还有上一桌的油渍没擦干净，地上也有垃圾。卫生真的堪忧，拍了照片给你们看看。', '["img2.jpg"]', 0, '2026-03-08T20:10:00',
    null, null,
    JSON.stringify([{primary:'环境卫生',secondary:'桌面不洁',sentiment:'negative',intensity:5},{primary:'环境卫生',secondary:'地面脏乱',sentiment:'negative',intensity:4}]),
    'P1', '⚠️ 卫生问题带图差评，可能引发平台降权风险',
    '非常抱歉给您带来了这么糟糕的用餐体验！卫生问题是我们的底线。我们已经对当班保洁进行了严肃处理。',
    '晚高峰翻台清洁不到位', null, '晚高峰', 'pending', 0],
  ['r004', 'douyin', shops['store_001'], '美食达人Leo', 5, '天花板级别的藕汤！排骨炖得入口即化，藕粉粉糯糯的，汤色奶白特别浓郁。菌菇藕汤也超级推荐。', '["img3.jpg"]', 1, '2026-03-09T12:00:00',
    '谢谢Leo的超详细分享！菌菇藕汤是我们的春季新品🥰', '2026-03-09T12:15:00',
    JSON.stringify([{primary:'产品/菜品',secondary:'口味出色',sentiment:'positive',intensity:5},{primary:'环境卫生',secondary:'干净整洁',sentiment:'positive',intensity:4},{primary:'服务态度',secondary:'热情',sentiment:'positive',intensity:4}]),
    'P4', '⭐ 高质量好评，覆盖口味/环境/服务/性价比四个维度，适合资产化',
    '谢谢Leo的超详细分享！菌菇藕汤是我们的春季新品🥰',
    null, '菌菇藕汤', null, 'replied', 1],
  ['r005', 'xhs', shops['store_001'], '甜甜的生活', 5, '周末带闺蜜来的，排了大概15分钟。招牌排骨藕汤名不虚传！', '["img4.jpg"]', 0, '2026-03-09T14:30:00',
    '谢谢小姐姐的分享！闺蜜聚餐选藕汤真的太会了😊', '2026-03-09T14:45:00',
    JSON.stringify([{primary:'产品/菜品',secondary:'口味出色',sentiment:'positive',intensity:4},{primary:'排队/等位',secondary:'等位适中',sentiment:'neutral',intensity:2}]),
    'P4', '好评为主，轻微提到停车不便',
    '谢谢小姐姐的分享！闺蜜聚餐选藕汤真的太会了😊',
    null, null, null, 'replied', 1],
  ['r006', 'meituan', shops['store_002'], '路过的食客', 3, '味道还行，但是量有点少，和纺大店比起来差了点意思。服务中规中矩。', null, 0, '2026-03-09T13:00:00',
    null, null,
    JSON.stringify([{primary:'产品/菜品',secondary:'分量不足',sentiment:'negative',intensity:2},{primary:'产品/菜品',secondary:'口味一般',sentiment:'neutral',intensity:2}]),
    'P3', '中评，与旗舰店对比有落差感',
    '感谢您的真实反馈！您提到的分量问题我们非常重视。',
    '分店出品标准化执行偏差', null, null, 'pending', 0],
]
for (const r of revs) { ins.run(id(), ...r) }

// Tasks
const tins = db.prepare('INSERT INTO remediation_tasks (id, title, category, source_review_count, stores, risk_level, assignee, deadline, status, suggested_action, period, staff, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
const tasks = [
  ['晚高峰出餐超时问题整改', '出餐速度', 8, '["纺大店"]', 'P1', '张店长', '2026-03-12', 'in_progress', '①增配1名晚班后厨 ②优化备菜流程 ③设置出餐超时预警', '18:00-20:00', null, '2026-03-07'],
  ['"服务冷淡"标签连续上升', '服务态度', 5, '["纺大店"]', 'P2', '张店长', '2026-03-14', 'open', '①开展服务话术培训 ②制定投诉处理SOP ③设立"服务之星"激励', null, '前厅服务团队', '2026-03-08'],
  ['翻台清洁标准执行不到位', '环境卫生', 3, '["纺大店"]', 'P1', '张店长', '2026-03-11', 'in_progress', '①翻台后拍照确认制度 ②增加晚高峰保洁频次 ③每日卫生检查表', '全天，重点晚高峰', null, '2026-03-08'],
  ['光谷店出品标准化偏差', '产品/菜品', 4, '["光谷店"]', 'P2', '刘店长', '2026-03-15', 'open', '①对照纺大店标准量复核 ②总厨巡店指导 ③建立出品自检表', null, null, '2026-03-09'],
  ['菌菇藕汤好评内容资产化', '好评资产化', 12, '["纺大店","光谷店"]', 'P3', '运营组', '2026-03-16', 'open', '①提取好评关键词生成宣传文案 ②制作种草素材', null, null, '2026-03-09'],
]
for (const t of tasks) { tins.run(id(), ...t) }

console.log('✅ Seed completed!')
console.log(`  ${Object.keys(accs).length} accounts, ${Object.keys(shops).length} shops, ${revs.length} reviews, ${tasks.length} tasks`)
db.close()
