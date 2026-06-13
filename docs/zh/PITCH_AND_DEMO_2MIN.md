# PactBreak 2 分钟中文交付稿

## 交付文件

- 纯 Demo 视频：`submission-media/pactbreak-demo-zh-2min.mp4`
- Pitch deck 视频：`submission-media/pactbreak-pitch-deck-zh-2min.mp4`
- Pitch deck PDF：`submission-media/pactbreak-pitch-deck-zh-2min.pdf`
- 中文讲稿与表单文案：`submission-media/pactbreak-zh-2min-script.md`

## QA 记录

- Demo 视频：120 秒，1920x1200，30fps，H.264 + AAC，只放实机操作画面。
- Demo 旁白：87.2 秒，按屏幕动作讲，后半段留给评委看 proof board 和 run detail。
- Pitch deck 视频：120 秒，1920x1200，30fps，H.264 + AAC。
- Hunter audit：claims、judge-red-team、submission、external-skills 全部通过。

## 表单主句

三家报价，一笔 CAW 付款。评委改价格、换钱包，CAW 当场拦住。

给表单用：只写 Cobo Agentic Wallet、CAW、Pact、tx hash、拒绝码、allowed 十九、denied 一。别写制作工具。

## 纯 Demo 视频讲稿

### 1. 打开采购台

各位评委，我直接跑实机。这里是 PactBreak 的采购台。RiskOps Agent 要买一份安全数据，它可以自己选供应商，但付款一定要走 Cobo Agentic Wallet。

### 2. 看三家报价

先看报价。AuditMesh 在预算内，钱包也在 Pact 允许的名单里；另外两家，一个太贵，一个收款地址不该付。

### 3. 挂上 CAW 记录

我点 Attach live CAW receipt。订单里现在有 Pact ID 和 tx hash。这里用的是已经准备好的 CAW live 记录，方便你们点开回看，我不把它说成刚刚新打出去的钱。

### 4. 改价格

现在我改订单。先把价格抬到上限外，右侧马上停住，原因写得很直接：金额超过 Pact cap。

### 5. 换钱包

再换供应商钱包。这个地址在 denylist 里，所以 CAW 路径不会继续。结果就是钱没有出去，页面也留下拒绝码。

### 6. 看记录

我往下看记录。这里有 Pact、tx hash、ADDRESS_NOT_WHITELISTED，还有 allowed 十九、denied 一。

### 7. 回看全流程

最后打开 proof board 和 run detail。评委可以沿着这几页回看每一次选择、拦截和 CAW 记录。最后一句：Agent 可以采购资源，但资金边界由 CAW 管住。

## 2 分钟 Pitch Deck 配音稿

### 1. 开场

各位评委，我用一句话讲：PactBreak 是给采购 Agent 用的 CAW 支付保险丝。Agent 可以自己选资源，但付款必须按 Pact 里写好的范围来。

### 2. 问题

问题很现实。Agent 以后会买数据、API、审计报告和算力。你不能给它一把服务器私钥；但每笔都叫人审批，小额采购又跑不起来。

### 3. 演示

所以 demo 只做一个场景：安全团队要买一份风险数据。RiskOps Agent 从三家报价里选 AuditMesh，然后把付款交给 Cobo Agentic Wallet。

### 4. 付款路径

我当场改价格、换钱包。正常订单能挂上 CAW 付款记录；改坏的订单会停住，CAW 返回 ADDRESS_NOT_WHITELISTED。屏幕上有 Pact ID 和 tx hash。

### 5. 收尾

代码里也很直：前端提交订单，policy 先看预算、用途、代币和地址，CAW adapter 只把合格订单送去付款。下一步，我们会把每个供应商订单接成独立 CAW 执行，让 Agent 按订单付钱。

## 表单短文案

项目名称：PactBreak Resource Procurement

项目描述：
PactBreak 是给采购 Agent 用的 CAW 支付原型。RiskOps Agent 在三家安全数据报价里选供应商，合格订单走 CAW Pact；评委现场改价格或钱包后，页面会留下 CAW 拒绝码。成功记录里有 tx hash，失败记录里有 ADDRESS_NOT_WHITELISTED 和 allowed 十九、denied 一。

项目链接：https://pactbreak-treasury-firewall.veithly.workers.dev

GitHub Repo Link：https://github.com/veithly/pactbreak-resource-procurement

Demo 视频链接：https://raw.githubusercontent.com/veithly/pactbreak-resource-procurement/main/submission-media/pactbreak-demo-zh-2min.mp4

Pitch deck 视频链接：https://raw.githubusercontent.com/veithly/pactbreak-resource-procurement/main/submission-media/pactbreak-pitch-deck-zh-2min.mp4

PPT 链接：https://raw.githubusercontent.com/veithly/pactbreak-resource-procurement/main/submission-media/pactbreak-pitch-deck-zh-2min.pdf
