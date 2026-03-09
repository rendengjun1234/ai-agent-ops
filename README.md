# 智店AI - 本地生活AI Agent智能运营系统

> 给每一家本地服务商一个永不下班的AI运营团队

## 🚀 功能概览

### 10个AI Agent
| Agent | 功能 | 状态 |
|-------|------|------|
| 🗣️ 评价Agent | 全平台评价聚合、AI智能回复、趋势分析、邀评设置 | ✅ 完整 |
| 📊 数据Agent | KPI看板、营业额趋势、AI诊断报告 | ✅ 完整 |
| 📢 获客Agent | 渠道流量分析、转化率追踪 | ✅ 基础 |
| 🌐 建站Agent | 小程序/官网管理、菜单管理 | ✅ 基础 |
| 🎯 销售Agent | 线索管理、跟进记录 | ✅ 基础 |
| ⚡ 营销Agent | 优惠券管理、活动投放 | ✅ 基础 |
| 📋 运营Agent | 任务看板、SOP管理 | ✅ 基础 |
| 🎧 客服Agent | 智能客服、自动回复 | ✅ 基础 |
| 🛡️ 申诉Agent | 差评申诉、工单跟踪 | ✅ 基础 |
| 📡 巡检Agent | 系统监控、异常告警 | ✅ 基础 |

### 其他功能
- 🔐 登录页（手机号+验证码）
- 📊 运营总览仪表盘
- 🏪 多门店管理与对比
- ⚙️ 系统设置（门店信息、平台绑定、AI风格、通知）

## 🛠️ 技术栈

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (数据可视化)
- **Lucide React** (图标)
- **Mock数据** (全前端，无需后端)

## 📦 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 启动
npm start
```

打开 http://localhost:3000 查看。

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx                 # 登录页
│   └── dashboard/
│       ├── layout.tsx           # 仪表盘布局（侧边栏+导航）
│       ├── page.tsx             # 运营总览
│       ├── review/page.tsx      # 评价Agent
│       ├── analytics/page.tsx   # 数据Agent
│       ├── traffic/page.tsx     # 获客Agent
│       ├── site/page.tsx        # 建站Agent
│       ├── sales/page.tsx       # 销售Agent
│       ├── marketing/page.tsx   # 营销Agent
│       ├── ops/page.tsx         # 运营Agent
│       ├── service/page.tsx     # 客服Agent
│       ├── appeal/page.tsx      # 申诉Agent
│       ├── patrol/page.tsx      # 巡检Agent
│       ├── stores/page.tsx      # 门店管理
│       └── settings/page.tsx    # 系统设置
└── lib/
    └── mock-data.ts             # Mock数据中心
```

## 📝 License

MIT
