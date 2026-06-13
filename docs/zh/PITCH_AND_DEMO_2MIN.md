# PactBreak 2 分钟中文交付稿

## 交付文件

- 纯 Demo 视频：`submission-media/pactbreak-demo-zh-2min.mp4`
- Pitch deck 视频：`submission-media/pactbreak-pitch-deck-zh-2min.mp4`
- Pitch deck PDF：`submission-media/pactbreak-pitch-deck-zh-2min.pdf`
- 中文讲稿与表单文案：`submission-media/pactbreak-zh-2min-script.md`

## QA 记录

- 两条视频均为 120 秒，1920×1200，30fps，H.264 + AAC。
- Demo 视频响度：mean_volume -17.4 dB，max_volume -1.5 dB。
- Pitch deck 视频响度：mean_volume -17.6 dB，max_volume -1.3 dB。
- 视频结构检查：demo / pitch 均为 0 issues。
- Deck 校验通过：5 页；第 4 页保留机制图的自定义网格提醒。

## 公开口径

三家报价，一笔 CAW 付款。价格或钱包被改，CAW 直接拦住。

公共材料只提 Cobo Agentic Wallet、CAW、Pact、交易哈希、拒绝码和审计记录。制作和发布细节不进入评委可见文案。

## 纯 Demo 视频讲稿

### 1. 先看结果

先看结果。PactBreak 让 RiskOps Agent 比三家安全审计数据报价，然后在一分钟内发起一笔 Cobo Agentic Wallet 付款。评委可以改价格，也可以换收款地址。只要离开 Pact 边界，钱不会动。

### 2. 报价选择

这里不是钱包面板。Agent 在买资源。它看价格、服务等级、风险分和收款地址白名单，最后只选择 AuditMesh 这一单。Sentinel Plus 超预算，Shadow Index 的钱包不在允许范围内。

### 3. CAW 付款证据

点击附加 CAW 收据后，证明区出现 Pact 编号和一笔已有的真实转账哈希。这里说清楚：这笔哈希是原型的 CAW 支付证据，不把它伪装成新的供应商结算。

### 4. 评委改订单

现在把价格抬到 Pact 上限之外，或者把供应商钱包换成另一个地址。页面不是演一个固定成功路径。它会重新计算这张订单能不能交给 CAW 执行。

### 5. 边界拦截

结果会变成阻断。价格过线、本地策略先挡住；地址不在 Pact 允许范围内时，CAW 返回 ADDRESS_NOT_WHITELISTED。关键点是，失败也被保存下来。

### 6. 证明板

证明板把三件事分开：Agent 选择了哪家，CAW 允许过哪笔支付，危险改动为什么被拒。Pact、交易哈希、拒绝码和审计计数都能复查，刷新页面也还在。

### 7. 复查路径

这就是完整 demo：Agent 形成采购意图，CAW 给出资金边界，评委改订单，系统给出允许或拒绝证据。想复查，打开线上地址，看证明板，再看代码里的 CAW 适配器。

## 2 分钟 Pitch Deck 配音稿

### 1. Hook

一个 Agent 想买数据，最危险的不是报价贵，而是它拿着一把过大的钥匙。PactBreak 把采购动作缩到一个清楚的边界里：三家报价，一笔 CAW 付款，价格或钱包被改就拦住。

### 2. Problem

现在常见做法有两个坏选择。给 Agent 一个服务器密钥，它可能花错钱；每次都等人工审批，它又不像 Agent 了。Cobo Agentic Wallet 正好适合这个缺口：Agent 可以花钱，但只能按 Pact 花。

### 3. Demo

演示里，RiskOps Agent 选择 AuditMesh 的安全审计数据包。随后评委把价格抬高，或者把收款钱包换掉。订单会从可付款变成阻断，证明板留下 Pact、交易哈希、拒绝码和审计计数。

### 4. Mechanism

机制只有三层。前端收集采购意图和评委改动；策略层先判断金额、用途、地址和代币；CAW 执行被允许的转账，并把拒绝和审计记录拉回产品里。没有 CAW，这个项目只剩报价表。

### 5. Proof

当前原型已经公开运行。CAW 证据包括 Pact 编号、真实转账哈希、ADDRESS_NOT_WHITELISTED 拒绝码，以及 allowed 十九、denied 一的审计计数。下一步是把同一套边界接到真实数据供应商。

## 表单短文案

项目名称：PactBreak Resource Procurement

项目描述：
PactBreak 让 RiskOps Agent 比三家审计数据报价，在 CAW Pact 边界内发起一笔付款。评委可以改价格或供应商钱包；安全路径留下真实 CAW 转账哈希，危险路径留下拒绝码和审计记录。

项目链接：https://pactbreak-treasury-firewall.veithly.workers.dev

GitHub Repo Link：https://github.com/veithly/pactbreak-resource-procurement

Demo 视频链接：https://raw.githubusercontent.com/veithly/pactbreak-resource-procurement/main/submission-media/pactbreak-demo-zh-2min.mp4

Pitch deck 视频链接：https://raw.githubusercontent.com/veithly/pactbreak-resource-procurement/main/submission-media/pactbreak-pitch-deck-zh-2min.mp4

PPT 链接：https://raw.githubusercontent.com/veithly/pactbreak-resource-procurement/main/submission-media/pactbreak-pitch-deck-zh-2min.pdf
