# Slide 与 Demo 录屏说明

适用项目：PactBreak Resource Procurement  
提交场景：AI x Web3 Agentic Builders Hackathon，Cobo Track  
当前日期：2026-06-10  
状态：B17a 已把产品主线改成 Agent Resource Procurement。最终 combined pitch + demo 视频已生成并通过 Hunter video gate；公开上传 URL 仍待补。

## 这版交付什么

- Slide 源文件：`pitch/deck.html`
- Slide PDF：`pitch/deck.pdf`
- Slide 缩略图：`pitch/deck-thumbs/slide-01.png` 到 `slide-05.png`
- 录屏脚本源：`pitch/draft.md`
- Demo 录屏说明：`pitch/recording/demo-showcase.zh.md`
- 最终 combined 视频：`pitch/recording/pitch-demo-combined-final.mp4`，270 秒，1920×1200

这版只服务 Demo 录屏展示。路径是：Agent 选择审计数据/API 供应商，CAW 约束付款权限，评委篡改价格或供应商钱包，打开 CAW proof。

## Slide 结构

| 页 | 画面 | 评委要看到什么 | 录屏动作 |
| --- | --- | --- | --- |
| 1 | Hero 与 proof slab | 购买 1 个审计数据包，CAW 拦截篡改 | 打开首页，停在 hero 和 proof hash |
| 2 | Vendor quote table | Agent 真正在做经济选择 | 展示 AuditMesh、Sentinel Plus、Shadow Index 三个报价 |
| 3 | Mutate order | 评委可以破坏订单 | 点击 `Raise price above limit` 或 `Replace vendor wallet` |
| 4 | Proof board | CAW 证据可复查 | 打开 `/app/proof`，展示 Pact ID、tx hash、denial、audit |
| 5 | Submission cut | 评委知道下一步去哪看 | 展示 live app、proof route、code path、deck 文件 |

## 关键证据

- Live URL：`https://pactbreak-treasury-firewall.veithly.workers.dev`
- Pact ID：`59f67ec0-8b3c-4d26-9403-0f70f083e3ec`
- Tx hash：`0xae5e23759f56182d286a89ef55161e5e6af517e963e1f83a6e37d14f30c3e0ea`
- Denied code：`ADDRESS_NOT_WHITELISTED`
- Denied reason：`no_pact_transfer_allow_policy_matched`
- Audit counts：`allowed=19`，`denied=1`

这些值可以出现在 slide 和录屏里。不要把本地 policy block、导入证据、existing live CAW proof 混成一个状态。尤其不要说“这个 tx 已经支付了某个真实供应商”，除非重新执行了一笔目标地址和金额都匹配的 CAW 交易。

## 录屏口播

1. PactBreak 让 RiskOps Agent 购买审计数据/API，付款权限由 Cobo Agentic Wallet 限定。
2. 我先打开 procurement console。这里有三个供应商报价，只有 AuditMesh API 同时满足价格、风险、SLA 和钱包白名单。
3. 点击 `Attach live CAW receipt`。这是已有 live CAW proof，用作原型付款证明，不伪装成一笔新的供应商结算。
4. 现在攻击订单：把价格提高到 Pact cap 以上，或者替换成未白名单钱包。
5. 产品在签名前拦截，并把原因写进 run timeline。
6. 打开 proof board。这里能看到 Pact ID、tx hash、denial code、audit counts，以及 imported/live/configuration_blocked 的证据标签。

## 录屏检查

- 第 5 秒前出现产品名和 Agent procurement。
- 第 30 秒前出现 vendor quote table。
- Mutation 结果停留至少 2 秒，保证原因能读清。
- Proof board 不展示 raw JSON 作为主画面。
- 字幕不要挡住 Pact ID、tx hash、denial code、audit counts。
- 浏览器里不能出现 DevTools、Next.js dev badge、加载失败、登录墙。

## 提交前还缺什么

- 公开 GitHub repo URL。
- Unlisted YouTube、GitHub Release asset 或其他公开视频 URL。
- Deck 的公开 URL，或确认平台允许直接上传 `pitch/deck.pdf`。
- Casual Hackathon 报名需要先通过审核，项目提交按钮才会出现。
- 团队成员名称、邮箱、GitHub handle、角色需要最终确认。
- 用户最终确认后才能点击 Submit。

Hunter 规则：可以帮你填表，但必须停在最终 Submit 前。
