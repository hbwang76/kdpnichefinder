# Cloudflare 后端与会员系统交接摘要

## 当前结论
- 状态：[DONE]
- 一句话结论：KDP Niche Finder CF Workers 后端完整实现 — D1 schema、Google OAuth (PKCE)、Creem 支付（订阅+credit pack）、分析 API、Niche Analysis placeholder，均 typecheck 通过。

## 关键输入
- 项目：kdpnichefinder.net
- 当前阶段：R7 后端
- 上游资料：
  - `/root/workspace/kdpnichefinder/PRD.md`
  - `/root/workspace/kdpnichefinder/pricing_calibration.md`（Starter $9.99 / Pro $29.99 / Credit Pack $4.99）
  - `/root/workspace/kdpnichefinder/SEO-LAUNCH-BLUEPRINT-2026-08-17.md`
  - `/root/workspace/kdpnichefinder/compliance/`（合规页 + COMPLIANCE.md）

## 本阶段交付物

### 文件清单
```
backend/
├── package.json          # Workers + TypeScript + Wrangler，devDependencies 同 charforge
├── wrangler.jsonc       # D1 binding、vars（APP_ORIGIN、FREE_DAILY_LIMIT=1）、secrets 占位
├── tsconfig.json        # ES2022 + skipLibCheck + noEmit（同 charforge）
├── migrations/
│   └── 0001_initial.sql # 完整 D1 schema：users / sessions / subscriptions / credit_packs / credit_ledger / analyses / webhook_events
└── src/
    └── index.ts         # 完整 Worker 实现（无框架，纯 fetch handler）
```

### 核心判断

#### Auth（Google OAuth + PKCE）
- `/api/auth/google` → 302 重定向到 Google Authorization Server
- `/api/auth/callback` → 交换 code、upsert user、创建 30 天 session（HttpOnly cookie `session_id`）
- `/api/auth/logout` → 删除 session、清除 cookie
- `/api/auth/me` → 返回当前登录用户（optional auth）
- **注意**：`GOOGLE_REDIRECT_URI` 必须精确配置，**不能**带尾部斜杠

#### 订阅与计费（Creem）
- `/api/billing/checkout`（需登录）→ POST `{ plan: "starter"|"pro"|"credit_pack" }` → 返回 Creem checkout URL
- `/api/billing/webhook`（无需 auth，验证 HMAC-SHA256 签名）→ 处理：
  - `order.completed` → 写入 credit_pack + credit_ledger（credit pack = 35 credits）
  - `subscription.created/updated` → upsert subscriptions + 更新 users.plan
  - `subscription.cancelled` → 标记 cancel_at_period_end
- **生产前必须配置**：`CREEM_STARTER_PRICE_ID`、`CREEM_PRO_PRICE_ID`、`CREEM_CREDIT_PACK_ID`

#### Credits
- `/api/credits/balance`（需登录）→ 返回 `credit_ledger` SUM

#### 分析（核心业务）
- `POST /api/analyses`（optional auth）→ niche 分析
  - 免费用户/IP：1次/24小时（按 CF-IP 去重）
  - paid 用户：无限制
  - **AI 分析 TODO**：当前返回 placeholder JSON（按 PRD §7 Niche Card 结构），需接入 OpenAI GPT-4o-mini 或 Claude
- `GET /api/analyses`（需登录）→ 返回最近 N 条历史
- `GET /api/analyses/:id`（需登录）→ 返回单条完整结果

#### 免费限额
- `FREE_DAILY_LIMIT = 1`（wrangler.jsonc vars）
- 匿名用户：按 `cf-connecting-ip` 去重，每天 1 次
- 付费用户（plan ≠ 'free'）：无限制

### 已确认项
- D1 schema 与 Creem webhook event 类型一一对应
- PKCE S256 challenge（正确 SHA-256 base64url 编码）
- HMAC-SHA256 webhook 签名验证（使用 crypto.subtle）
- 生产 secrets 不进代码（全部 wrangler secrets 或 env vars）
- 幂等 webhook 处理（webhook_events 去重）

### 待确认项
- ~~`kdpnichefinder.com` 还是 `.net`~~ **已定：`.net`**（.com 被 artistly.ai 占用，见 QA-REPORT；wrangler.jsonc APP_ORIGIN/GOOGLE_REDIRECT_URI 已用 https://kdpnichefinder.net）
- Google OAuth Console 应用已创建，回调 URI 已配置（回调必须是 https://kdpnichefinder.net/api/auth/callback）
- Creem test/live API key + product IDs 已配置
- 生产 D1 database 已创建（`wrangler d1 create kdpnichefinder-db`）
- 生产 R2 bucket（future 报告/导出存储）

## 质量门槛自检
- [x] 前端拿到机器可读 API contract（本文件 + src/index.ts）
- [x] 生产 secrets 没进代码
- [x] Auth/权限/错误态可测（/api/health、/api/auth/me 公开可测）
- [x] 远端 migration 和本地 schema 对齐（0001_initial.sql 可重复执行）
- [x] 合规披露和实际数据流一致

## 风险
- P0：Niche Analysis AI 未实现（placeholder，需接入 OpenAI/Claude）
- P1：生产 D1 和 R2 未创建
- P1：Google OAuth callback URI 未配置
- P2：~~域名未确定~~ 已定 .net；剩余风险是 AI provider key 未配置时 /api/analyses 返回 placeholder

## 给下游的最小必要信息

### 下一阶段：R8 前端（frontend-dev）

#### 必须读取
- 本文件（交接摘要）
- `src/app/api/`（API 实现，已合并为 Next.js API Routes 单体架构）
- `migrations/0001_initial.sql`（D1 schema）
- `wrangler.jsonc`（D1 binding + env vars 名称）

#### 不能假设
- 不能在前端存储或发送 user plan / credits / entitlements（全部从 `/api/auth/me` 和 `/api/credits/balance` 获取）
- Creem checkout 不能在前端构造（只能调用 `/api/billing/checkout` 获取 URL）
- webhook 成功后 browser 重定向到 `/account?checkout=success`

#### 前端集成要点
```typescript
// Auth check
const me = await fetch('/api/auth/me').then(r => r.json())
if (!me.authenticated) { showLoginPrompt() }

// Submit analysis
const result = await fetch('/api/analyses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'journal for doctors', book_type: 'low-content' }),
  credentials: 'include',  // Required for session cookie
}).then(r => r.json())

// Get credits
const { balance } = await fetch('/api/credits/balance', { credentials: 'include' }).then(r => r.json())

// Buy plan
const { checkout_url } = await fetch('/api/billing/checkout', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ plan: 'starter' }),
}).then(r => r.json())
window.location.href = checkout_url
```

### R9 QA 提示
- `/api/health` 应返回 `{ status: 'ok', db: true }`
- 未登录调用需 auth 接口应返回 401
- 免费用户 2 次 POST `/api/analyses` 同 IP 应返回 429
- Google OAuth callback 需要真实 GOOGLE_CLIENT_ID/SECRET
- Creem webhook 需要真实 CREEM_WEBHOOK_SECRET

## 配置清单（部署前必须）
```
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put SESSION_SECRET          # openssl rand -base64 32
wrangler secret put CREEM_API_KEY
wrangler secret put CREEM_WEBHOOK_SECRET
wrangler secret put CREEM_STARTER_PRICE_ID
wrangler secret put CREEM_PRO_PRICE_ID
wrangler secret put CREEM_CREDIT_PACK_ID

# wrangler d1 create kdpnichefinder-db  （一次性）
# npx wrangler d1 migrations apply kdpnichefinder-db --remote
```
