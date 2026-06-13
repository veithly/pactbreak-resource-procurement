import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const hunterRoot = "/Users/rick/Documents/MySkill/hackathonhunter-skill";
const guizangRoot = "/Users/rick/.skills-manager/skills/guizang-ppt-skill";
const outRoot = path.join(root, "pitch", "zh-2min");
const imagesDir = path.join(outRoot, "images");
const deckThumbsDir = path.join(outRoot, "deck-thumbs");
const demoAudioDir = path.join(outRoot, "demo-audio");
const pitchAudioDir = path.join(outRoot, "pitch-audio");
const demoVideoDir = path.join(outRoot, "demo-video");
const pitchVideoDir = path.join(outRoot, "pitch-video");
const submissionDir = path.join(root, "submission-media");

const proof = {
  pactId: "59f67ec0-8b3c-4d26-9403-0f70f083e3ec",
  tx: "0xae5e23759f56182d286a89ef55161e5e6af517e963e1f83a6e37d14f30c3e0ea",
  deniedCode: "ADDRESS_NOT_WHITELISTED",
  deniedReason: "no_pact_transfer_allow_policy_matched",
  audit: "allowed=19, denied=1"
};

const liveUrl = "https://pactbreak-treasury-firewall.veithly.workers.dev";
const repoUrl = "https://github.com/veithly/pactbreak-resource-procurement";
const hero = "三家报价，一笔 CAW 付款。价格或钱包被改，CAW 直接拦住。";

const demoScenes = [
  {
    id: "01_result",
    title: "先看结果",
    text:
      "先看结果。PactBreak 让 RiskOps Agent 比三家安全审计数据报价，然后在一分钟内发起一笔 Cobo Agentic Wallet 付款。评委可以改价格，也可以换收款地址。只要离开 Pact 边界，钱不会动。"
  },
  {
    id: "02_quotes",
    title: "报价选择",
    text:
      "这里不是钱包面板。Agent 在买资源。它看价格、服务等级、风险分和收款地址白名单，最后只选择 AuditMesh 这一单。Sentinel Plus 超预算，Shadow Index 的钱包不在允许范围内。"
  },
  {
    id: "03_receipt",
    title: "CAW 付款证据",
    text:
      "点击附加 CAW 收据后，证明区出现 Pact 编号和一笔已有的真实转账哈希。这里说清楚：这笔哈希是原型的 CAW 支付证据，不把它伪装成新的供应商结算。"
  },
  {
    id: "04_mutation",
    title: "评委改订单",
    text:
      "现在把价格抬到 Pact 上限之外，或者把供应商钱包换成另一个地址。页面不是演一个固定成功路径。它会重新计算这张订单能不能交给 CAW 执行。"
  },
  {
    id: "05_block",
    title: "边界拦截",
    text:
      "结果会变成阻断。价格过线、本地策略先挡住；地址不在 Pact 允许范围内时，CAW 返回 ADDRESS_NOT_WHITELISTED。关键点是，失败也被保存下来。"
  },
  {
    id: "06_proof",
    title: "证明板",
    text:
      "证明板把三件事分开：Agent 选择了哪家，CAW 允许过哪笔支付，危险改动为什么被拒。Pact、交易哈希、拒绝码和审计计数都能复查，刷新页面也还在。"
  },
  {
    id: "07_close",
    title: "复查路径",
    text:
      "这就是完整 demo：Agent 形成采购意图，CAW 给出资金边界，评委改订单，系统给出允许或拒绝证据。想复查，打开线上地址，看证明板，再看代码里的 CAW 适配器。"
  }
];

const pitchScenes = [
  {
    id: "01_hook",
    title: "Hook",
    text:
      "一个 Agent 想买数据，最危险的不是报价贵，而是它拿着一把过大的钥匙。PactBreak 把采购动作缩到一个清楚的边界里：三家报价，一笔 CAW 付款，价格或钱包被改就拦住。"
  },
  {
    id: "02_problem",
    title: "Problem",
    text:
      "现在常见做法有两个坏选择。给 Agent 一个服务器密钥，它可能花错钱；每次都等人工审批，它又不像 Agent 了。Cobo Agentic Wallet 正好适合这个缺口：Agent 可以花钱，但只能按 Pact 花。"
  },
  {
    id: "03_demo",
    title: "Demo",
    text:
      "演示里，RiskOps Agent 选择 AuditMesh 的安全审计数据包。随后评委把价格抬高，或者把收款钱包换掉。订单会从可付款变成阻断，证明板留下 Pact、交易哈希、拒绝码和审计计数。"
  },
  {
    id: "04_mechanism",
    title: "Mechanism",
    text:
      "机制只有三层。前端收集采购意图和评委改动；策略层先判断金额、用途、地址和代币；CAW 执行被允许的转账，并把拒绝和审计记录拉回产品里。没有 CAW，这个项目只剩报价表。"
  },
  {
    id: "05_proof",
    title: "Proof",
    text:
      "当前原型已经公开运行。CAW 证据包括 Pact 编号、真实转账哈希、ADDRESS_NOT_WHITELISTED 拒绝码，以及 allowed 十九、denied 一的审计计数。下一步是把同一套边界接到真实数据供应商。"
  }
];

const scriptMarkdown = `# PactBreak 2 分钟中文交付稿

## 公开口径

${hero}

公共材料只提 Cobo Agentic Wallet、CAW、Pact、交易哈希、拒绝码和审计记录。制作和发布细节不进入评委可见文案。

## 纯 Demo 视频讲稿

${demoScenes.map((scene, index) => `### ${index + 1}. ${scene.title}\n\n${scene.text}`).join("\n\n")}

## 2 分钟 Pitch Deck 配音稿

${pitchScenes.map((scene, index) => `### ${index + 1}. ${scene.title}\n\n${scene.text}`).join("\n\n")}

## 表单短文案

项目名称：PactBreak Resource Procurement

项目描述：
PactBreak 让 RiskOps Agent 比三家审计数据报价，在 CAW Pact 边界内发起一笔付款。评委可以改价格或供应商钱包；安全路径留下真实 CAW 转账哈希，危险路径留下拒绝码和审计记录。

项目链接：${liveUrl}

GitHub Repo Link：${repoUrl}

Demo 视频链接：上传 \`submission-media/pactbreak-demo-zh-2min.mp4\` 后填写公开视频链接。

PPT 链接：上传 \`submission-media/pactbreak-pitch-deck-zh-2min.pdf\` 后填写公开 deck 链接，或直接作为附件提交。
`;

function narrationManifest(kind, scenes) {
  return {
    $schema: "narration.v1",
    language: "zh-CN",
    voice: "mimo",
    first_sentence: scenes[0].text,
    instruction:
      "中文产品演示旁白。声音冷静、有把握，语速接近两分钟 demo，不要新闻腔，不要广告腔。Cobo Agentic Wallet 读作 Cobo Agentic Wallet，CAW 读作 C A W，Pact 读作 Pact。保留轻微停顿，重点数字读清楚。",
    scenes: scenes.map((scene) => ({
      id: `${kind}_${scene.id}`,
      title: scene.title,
      text: scene.text
    }))
  };
}

async function ensureDirs() {
  for (const dir of [
    outRoot,
    imagesDir,
    deckThumbsDir,
    demoAudioDir,
    pitchAudioDir,
    demoVideoDir,
    pitchVideoDir,
    path.join(demoVideoDir, "assets"),
    path.join(pitchVideoDir, "assets"),
    submissionDir,
    path.join(outRoot, "assets")
  ]) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function copyIfExists(from, to) {
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.copyFile(from, to);
}

async function copyAssets() {
  const imageCopies = [
    ["pitch/screenshots/01-hero.png", "01-hero.png"],
    ["pitch/screenshots/02-queue.png", "02-queue.png"],
    ["pitch/screenshots/03-proof.png", "03-proof.png"],
    ["pitch/screenshots/04-mobile.png", "04-mobile.png"],
    ["public/art/gpt-pro/round2/display/vendor-quote-lanes-01.jpg", "vendor-quote-lanes.jpg"],
    ["public/art/gpt-pro/round2/display/caw-authorization-rail-01.jpg", "caw-authorization-rail.jpg"],
    ["public/art/gpt-pro/round2/display/mutation-block-shield-01.jpg", "mutation-block-shield.jpg"],
    ["public/art/gpt-pro/round2/display/proof-audit-board-01.jpg", "proof-audit-board.jpg"],
    ["public/brand/logomark.svg", "logomark.svg"],
    ["public/brand/wordmark.svg", "wordmark.svg"]
  ];
  for (const [from, name] of imageCopies) {
    await copyIfExists(path.join(root, from), path.join(imagesDir, name));
  }
  await copyIfExists(path.join(root, "pitch/recording/tight.mp4"), path.join(demoVideoDir, "assets", "tight.mp4"));
  await copyIfExists(path.join(root, "pitch/recording/tight.mp4"), path.join(pitchVideoDir, "assets", "tight.mp4"));
  await copyIfExists(path.join(guizangRoot, "assets/motion.min.js"), path.join(outRoot, "assets", "motion.min.js"));
}

function slideChrome(left, right) {
  return `<div class="chrome-min"><div class="l">${left}</div><div class="r">${right}</div></div>`;
}

function buildSlides() {
  return `
<section class="slide accent" data-layout="SWISS-COVER-ASCII" data-animate="hero">
  <div class="canvas-card">
    <canvas class="ascii-bg" aria-hidden="true"></canvas>
    ${slideChrome("PactBreak · Cobo Agentic Wallet", "01 / 05")}
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr auto;gap:2.6vh">
      <div data-anim="kicker" class="t-meta" style="color:rgba(255,255,255,.78);letter-spacing:.22em">AGENTIC COMMERCE / RESOURCE PROCUREMENT</div>
      <h1 data-anim="title" style="align-self:center;font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(8.6vw,15vh);line-height:.96;letter-spacing:-.025em;color:#fff;max-width:13ch">三家报价<br><span style="font-style:italic;font-weight:300">一笔</span> CAW 付款</h1>
      <div data-anim="bottom" style="display:grid;grid-template-rows:auto auto;gap:1.6vh;border-top:1px solid rgba(255,255,255,.24);padding-top:2vh">
        <div class="lead" style="max-width:58ch;color:rgba(255,255,255,.88);font-weight:300">价格或钱包被改，Pact 边界会先拦住。证明留在交易哈希、拒绝码和审计记录里。</div>
        <div style="display:flex;justify-content:space-between;align-items:end">
          <div class="t-meta" style="color:rgba(255,255,255,.64)">Live: pactbreak-treasury-firewall.veithly.workers.dev</div>
          <div class="t-meta" style="color:rgba(255,255,255,.64)">CAW / PACT / AUDIT</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-layout="S08" data-animate="duo-mirror">
  <div class="canvas-card">
    ${slideChrome("Problem · Agent money authority", "02 / 05")}
    <div data-anim="line" style="display:flex;flex-direction:column;gap:1.4vh;margin-bottom:7vh">
      <div class="t-meta">THE TRADE-OFF</div>
      <h2 class="h-xl-zh" style="font-size:min(5.4vw,9.4vh);max-width:14ch">Agent 要花钱，不能拿万能钥匙。</h2>
    </div>
    <div class="duo-compare" style="flex:1;min-height:0">
      <div class="duo-half col" style="padding-right:3vw">
        <span class="t-cat">Loose Key</span>
        <h3 style="font-size:min(4.6vw,8vh);font-weight:200;line-height:1">服务器 key 太宽</h3>
        <p class="lead" style="font-size:max(22px,1.5vw);max-width:26ch">一个采购 Agent 可以误付、超付，甚至把钱打到错误地址。</p>
        <div class="t-meta" style="margin-top:auto;color:var(--text-helper)">风险：钱动了，证据晚到。</div>
      </div>
      <span class="vrule"></span>
      <div class="duo-half col" style="padding-left:3vw">
        <span class="t-cat" style="color:var(--accent)">CAW Pact</span>
        <h3 style="font-size:min(4.6vw,8vh);font-weight:200;line-height:1;color:var(--accent)">边界先写好</h3>
        <p class="lead" style="font-size:max(22px,1.5vw);max-width:26ch">链、代币、金额、地址和用途都被限制，Agent 仍然能自己执行。</p>
        <div class="t-meta" style="margin-top:auto;color:var(--accent)">结果：允许与拒绝都可复查。</div>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-layout="S22" data-animate="image-hero">
  <div class="canvas-card" style="padding:0;display:flex;flex-direction:column;overflow:hidden">
    <div data-anim="img" style="position:relative;flex:0 0 60%;overflow:hidden;background:var(--grey-1)">
      <img src="images/02-queue.png" data-image-slot="s22-hero-21x9" alt="PactBreak procurement queue" loading="eager" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%">
      <div class="chrome-min" style="position:absolute;top:0;left:0;right:0;color:rgba(255,255,255,.92);padding:5.6vh 5vw 0">
        <div class="l">Live demo path</div><div class="r">03 / 05</div>
      </div>
      <div data-anim="title-block" style="position:absolute;left:5vw;top:11vh;background:var(--paper);padding:3.2vh 3.2vw;max-width:38vw">
        <div style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(5vw,8.8vh);line-height:1;letter-spacing:-.035em;color:var(--text-primary)">报价<br>改动<br>拦截</div>
      </div>
    </div>
    <div data-anim="kpi" class="image-hero-body">
      <div style="max-width:42ch;font-size:max(18px,1.35vw);line-height:1.52;font-weight:400;color:var(--text-primary)">
        Agent 选择 AuditMesh。评委提高价格或替换钱包后，订单从可付款变成阻断。
      </div>
      <div class="image-hero-stats" style="gap:4vw">
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">QUOTES</div><div style="font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em">3</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">价格、SLA、风险、地址白名单</p></div>
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">CAW TX</div><div style="font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em">1</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">已有真实 CAW 支付证据</p></div>
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">DENIAL</div><div style="font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em;color:var(--accent)">1</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">ADDRESS_NOT_WHITELISTED</p></div>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-layout="S17" data-animate="system-diagram">
  <div class="canvas-card">
    ${slideChrome("Mechanism · What breaks without CAW", "04 / 05")}
    <div style="flex:1;display:grid;grid-template-columns:.9fr 1.1fr;gap:5vw;align-items:center;min-height:0">
      <div data-anim="line" style="display:flex;flex-direction:column;gap:2.2vh">
        <div class="t-meta">THREE LAYERS</div>
        <h2 class="h-xl-zh" style="font-size:min(5.2vw,9vh);max-width:12ch">不是报价表，是资金执行边界。</h2>
        <p class="lead" style="font-size:max(21px,1.45vw);max-width:32ch">前端收集采购意图；策略层判断金额、用途、地址和代币；CAW 执行被允许的转账，并返回审计证据。</p>
      </div>
      <div data-anim="up" class="system-diagram" style="position:relative;height:70vh">
        <svg class="sys-svg" viewBox="0 0 720 620" style="width:100%;height:100%" aria-hidden="true">
          <circle cx="360" cy="310" r="250" fill="none" stroke="var(--grey-2)" stroke-width="2"/>
          <circle cx="360" cy="310" r="166" fill="none" stroke="var(--accent)" stroke-width="4"/>
          <circle cx="360" cy="310" r="82" fill="var(--ink)"/>
          <path d="M360 60 L360 560 M110 310 L610 310" stroke="var(--grey-2)" stroke-width="1" opacity=".7"/>
        </svg>
        <div class="sys-label" style="position:absolute;left:7%;top:9%"><b>Intent</b><span>报价与评委改动</span></div>
        <div class="sys-label" style="position:absolute;right:3%;top:36%"><b>Policy</b><span>金额、地址、用途</span></div>
        <div class="sys-label" style="position:absolute;left:26%;bottom:7%"><b>CAW</b><span>Pact、转账、审计</span></div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:#fff;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:600;letter-spacing:.08em">Pact</div>
      </div>
    </div>
  </div>
</section>

<section class="slide split" data-layout="S10" data-animate="split-statement">
  <div class="canvas-card">
    <div class="split-half">
      <div class="half b-accent" style="padding:5.6vh 3.6vw 4.4vh;justify-content:space-between;position:relative;overflow:hidden">
        <canvas class="ascii-bg" aria-hidden="true"></canvas>
        <div class="chrome-min" style="margin-bottom:0;position:relative;z-index:1"><div class="l">05 / 05</div><div class="r">PROOF</div></div>
        <div data-anim="manifesto" style="display:flex;flex-direction:column;gap:2vh;position:relative;z-index:1">
          <div class="t-meta" style="color:rgba(255,255,255,.78);letter-spacing:.22em;margin-bottom:1.6vh">VERIFY</div>
          <h2 style="font-size:min(7.4vw,13vh);line-height:.96;letter-spacing:-.025em;font-weight:200;color:#fff">别听承诺。<br>看<span style="font-style:italic;font-weight:300">证据</span>。</h2>
          <div style="font-size:max(16px,1.1vw);line-height:1.55;color:rgba(255,255,255,.84);font-weight:400;max-width:34ch;margin-top:1.4vh">Pact、交易哈希、拒绝码和审计计数都放在证明板。</div>
        </div>
        <div data-anim="signature" style="border-top:1px solid rgba(255,255,255,.22);padding-top:2vh;position:relative;z-index:1" class="t-meta">pactbreak-treasury-firewall.veithly.workers.dev</div>
      </div>
      <div class="half" style="padding:5.6vh 3.6vw 4.4vh;justify-content:space-between">
        <div class="chrome-min"><div class="l">CAW PROOF PACK</div><div class="r">OPEN SOURCE</div></div>
        <div data-anim="rules" style="display:grid;gap:2.2vh">
          ${proofRow("PACT", proof.pactId)}
          ${proofRow("TX", "0xae5e...c3e0ea")}
          ${proofRow("DENIED", proof.deniedCode, true)}
          ${proofRow("AUDIT", proof.audit)}
        </div>
        <div data-anim="foot" class="t-meta" style="color:var(--text-helper);text-align:right">Repo · github.com/veithly/pactbreak-resource-procurement</div>
      </div>
    </div>
  </div>
</section>`;
}

function proofRow(label, value, accent = false) {
  return `<div style="display:grid;grid-template-columns:104px 1fr;gap:1.2vw;border-top:1px solid var(--border-subtle);padding-top:1.4vh;align-items:start">
    <div class="t-meta">${label}</div>
    <div style="font-family:var(--mono);font-size:max(16px,1.05vw);line-height:1.35;word-break:break-all;color:${accent ? "var(--accent)" : "var(--text-primary)"}">${value}</div>
  </div>`;
}

async function writeDeck() {
  let template = await fs.readFile(path.join(guizangRoot, "assets/template-swiss.html"), "utf8");
  template = template.replace("[必填] 替换为 PPT 标题 · Deck Title", "PactBreak 中文 2 分钟 Pitch Deck");
  template = template.replace("--accent:#002FA7;", "--accent:#FF6B35;");
  template = template.replace("--accent-rgb:0,47,167;", "--accent-rgb:255,107,53;");
  template = template.replace("--accent-on:#ffffff;", "--accent-on:#ffffff;");
  template = template.replace("--accent-bright:#5B7BFF;", "--accent-bright:#FF9A70;");
  const start = template.indexOf("<div id=\"deck\">");
  const end = template.indexOf("<div id=\"nav\"></div>");
  if (start < 0 || end < 0) throw new Error("Could not locate guizang deck insertion region");
  const before = template.slice(0, start);
  const after = template.slice(end);
  const deck = `${before}<div id="deck">\n${buildSlides()}\n</div>\n\n${after}`;
  await fs.writeFile(path.join(outRoot, "deck.html"), deck);
}

function videoCss() {
  return `
    :root{color-scheme:dark;--bg:#111614;--paper:#f7f2e8;--muted:#b7b0a2;--line:#3a403c;--accent:#ff6b35;--green:#67d391;--red:#ff6868}
    *{box-sizing:border-box} body{margin:0;background:#111614;color:var(--paper);font-family:system-ui,sans-serif}
    #root{width:1920px;height:1200px;overflow:hidden;background:radial-gradient(circle at 84% 12%,rgba(255,107,53,.22),transparent 24%),linear-gradient(120deg,rgba(103,211,145,.13),transparent 32%),#111614;position:relative}
    .scene{position:absolute;inset:0;padding:86px 96px;display:grid;grid-template-columns:.86fr 1.14fr;gap:70px;opacity:0;background:rgba(17,22,20,.96);overflow:hidden}
    .scene::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:42px 42px;mask-image:linear-gradient(90deg,#000 0%,transparent 78%);pointer-events:none}
    .copy{position:relative;z-index:2;display:flex;flex-direction:column;justify-content:center;gap:26px}
    .kicker{font-size:22px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);font-weight:700}
    h1{margin:0;font-size:92px;line-height:1.03;letter-spacing:-.04em;font-weight:760;max-width:760px}
    p{margin:0;font-size:34px;line-height:1.42;color:var(--muted);max-width:760px}
    .visual{position:relative;z-index:2;display:grid;align-content:center;gap:24px}
    .panel{border:2px solid rgba(247,242,232,.14);background:rgba(247,242,232,.07);box-shadow:0 42px 110px rgba(0,0,0,.36);border-radius:8px;overflow:hidden}
    .panel.pad{padding:30px}
    .media{width:100%;height:100%;object-fit:cover;display:block}
    .mono{font-family:ui-monospace,monospace}
    .chips{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
    .chip{border:1px solid rgba(255,107,53,.52);background:rgba(255,107,53,.1);padding:16px 18px;border-radius:999px;font-size:21px;color:#ffd8c8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .app-video{position:absolute;left:96px;right:96px;top:92px;width:1728px;height:982px;object-fit:cover;border:2px solid rgba(247,242,232,.18);border-radius:8px;box-shadow:0 48px 120px rgba(0,0,0,.5);z-index:4}
    .video-label{position:absolute;left:130px;top:126px;z-index:6;background:rgba(17,22,20,.88);border:1px solid rgba(255,255,255,.18);padding:14px 18px;border-radius:999px;font-size:22px;color:var(--paper)}
    .lower{position:absolute;left:130px;bottom:112px;z-index:6;display:grid;gap:8px;max-width:820px;background:rgba(17,22,20,.86);border:1px solid rgba(255,255,255,.18);padding:24px 28px;border-radius:8px}
    .lower b{font-size:28px;color:var(--accent)} .lower span{font-size:22px;color:var(--muted)}
    .route{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.route div{border-top:3px solid var(--accent);padding-top:16px;font-size:24px;color:var(--paper)}
    .proof-grid{display:grid;grid-template-columns:1fr;gap:18px}.proof-row{display:grid;grid-template-columns:160px 1fr;gap:18px;border-top:1px solid rgba(255,255,255,.16);padding-top:16px;font-size:26px}.proof-row label{color:var(--muted);text-transform:uppercase;letter-spacing:.12em;font-size:17px}
    .big-num{font-size:120px;line-height:.9;font-weight:800;color:var(--accent);letter-spacing:-.06em}
    .slide-img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(1.05) contrast(1.02)}
    .marker{height:14px;background:var(--accent);width:0;position:absolute;left:112px;bottom:132px;z-index:8}
    .frame-title{position:absolute;left:96px;top:82px;z-index:8;background:rgba(17,22,20,.9);border:1px solid rgba(255,255,255,.18);padding:18px 22px;border-radius:8px;color:var(--paper);font-size:26px}
  `;
}

function buildDemoVideoHtml() {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>PactBreak 纯 Demo 中文 2 分钟</title><style>${videoCss()}</style></head><body>
  <div id="root" data-composition-id="root" data-start="0" data-width="1920" data-height="1200" data-duration="120">
    <section id="s1" class="scene clip" data-start="0" data-duration="18" data-track-index="1">
      <div class="copy"><div class="kicker">Demo / result first</div><h1>三家报价，一笔 CAW 付款。</h1><p>评委改价格或钱包，Pact 边界会先拦住。成功和失败都留下证据。</p></div>
      <div class="visual"><div class="panel"><img class="media" src="../images/01-hero.png"></div><div class="chips"><div class="chip">Pact ${proof.pactId.slice(0, 8)}...</div><div class="chip">tx 0xae5e...c3e0ea</div><div class="chip">${proof.deniedCode}</div><div class="chip">${proof.audit}</div></div></div>
    </section>
    <section id="s2" class="scene clip" data-start="16" data-duration="20" data-track-index="2">
      <div class="copy"><div class="kicker">Step 1 / quote decision</div><h1>Agent 先选资源，不先摸钱。</h1><p>价格、SLA、风险、钱包白名单一起进表。只有 AuditMesh 进入 CAW 付款边界。</p></div>
      <div class="visual"><div class="panel"><img class="media" src="../images/vendor-quote-lanes.jpg"></div><div class="route"><div>AuditMesh</div><div>Sentinel Plus</div><div>Shadow Index</div><div>CAW boundary</div></div></div>
    </section>
    <video id="demo-live-queue" class="app-video clip" data-start="34" data-duration="27" data-track-index="10" data-media-start="0" src="./assets/tight-gop30.mp4" muted playsinline></video>
    <div id="demo-live-queue-label" class="video-label clip" data-start="34" data-duration="27" data-track-index="11">Live product plate · queue and receipt</div>
    <div id="demo-receipt-note" class="lower clip" data-start="45" data-duration="15" data-track-index="12"><b>CAW 付款证据附加</b><span>Pact 与真实 tx hash 进入证明板，但不伪装成新的供应商结算。</span></div>
    <section id="s4" class="scene clip" data-start="59" data-duration="20" data-track-index="4">
      <div class="copy"><div class="kicker">Step 2 / mutate</div><h1>现在故意把订单改坏。</h1><p>抬高价格，或者把供应商钱包替换掉。页面会重新计算这张订单能不能交给 CAW。</p></div>
      <div class="visual"><div class="panel"><img class="media" src="../images/mutation-block-shield.jpg"></div><div class="panel pad"><div class="big-num">BLOCK</div><p>危险改动不会进入资金执行。</p></div></div>
    </section>
    <video id="demo-live-proof" class="app-video clip" data-start="77" data-duration="24" data-track-index="13" data-media-start="28" src="./assets/tight-gop30.mp4" muted playsinline></video>
    <div id="demo-live-proof-label" class="video-label clip" data-start="77" data-duration="24" data-track-index="14">Live product plate · mutation and proof</div>
    <div id="demo-denial-note" class="lower clip" data-start="86" data-duration="15" data-track-index="15"><b>${proof.deniedCode}</b><span>${proof.deniedReason}</span></div>
    <section id="s6" class="scene clip" data-start="100" data-duration="16" data-track-index="6">
      <div class="copy"><div class="kicker">Step 3 / proof board</div><h1>证明要能复查。</h1><p>Agent 选择、CAW 支付、危险拒绝和审计计数分开存放。刷新页面也还能看。</p></div>
      <div class="visual"><div class="panel"><img class="media" src="../images/03-proof.png"></div><div class="proof-grid panel pad">${proofRowsHtml()}</div></div>
    </section>
    <section id="s7" class="scene clip" data-start="114" data-duration="6" data-track-index="7">
      <div class="copy"><div class="kicker">Inspect next</div><h1>线上可跑，代码可查。</h1><p>${liveUrl}<br>${repoUrl}</p></div>
      <div class="visual"><div class="panel"><img class="media" src="../images/proof-audit-board.jpg"></div></div>
    </section>
  </div><script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><script>${videoTimeline(["s1", "s2", "s4", "s6", "s7"], [0, 16, 59, 100, 114])}</script></body></html>`;
}

function proofRowsHtml() {
  return [
    ["Pact", proof.pactId],
    ["Tx", "0xae5e...c3e0ea"],
    ["Denied", proof.deniedCode],
    ["Audit", proof.audit]
  ].map(([label, value]) => `<div class="proof-row"><label>${label}</label><div class="mono">${value}</div></div>`).join("");
}

function buildPitchVideoHtml() {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>PactBreak Pitch Deck 中文 2 分钟</title><style>${videoCss()}</style></head><body>
  <div id="root" data-composition-id="root" data-start="0" data-width="1920" data-height="1200" data-duration="120">
    ${slideScene("p1", 0, 25, "slide-01.png", "01 / Hook", "三家报价，一笔 CAW 付款。")}
    ${slideScene("p2", 23, 25, "slide-02.png", "02 / Problem", "Agent 花钱不能拿万能钥匙。")}
    ${slideScene("p3", 46, 26, "slide-03.png", "03 / Demo", "评委改订单，系统留下允许或拒绝证据。")}
    ${slideScene("p4", 70, 25, "slide-04.png", "04 / Mechanism", "没有 CAW，只剩报价表。")}
    ${slideScene("p5", 93, 27, "slide-05.png", "05 / Proof", "Pact、tx、拒绝码、审计计数都可复查。")}
  </div><script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><script>${videoTimeline(["p1", "p2", "p3", "p4", "p5"], [0, 23, 46, 70, 93])}</script></body></html>`;
}

function slideScene(id, start, duration, image, label, line) {
  return `<section id="${id}" class="scene clip" data-start="${start}" data-duration="${duration}" data-track-index="${start + 1}" style="display:block;padding:0;background:#111614">
    <img class="slide-img" src="../deck-thumbs/${image}">
    <div class="frame-title">${label} · ${line}</div>
    <div class="marker"></div>
  </section>`;
}

function videoTimeline(ids, starts) {
  return `
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    const starts = ${JSON.stringify(starts)};
    const ids = ${JSON.stringify(ids)};
    ids.forEach((id, i) => {
      const t = starts[i] + 0.18;
      tl.fromTo("#" + id, { opacity: 0 }, { opacity: 1, duration: 0.65, ease: "power3.out" }, t);
      tl.fromTo("#" + id + " .kicker, #" + id + " .frame-title", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "expo.out" }, t + 0.15);
      tl.fromTo("#" + id + " h1", { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, ease: "power4.out" }, t + 0.28);
      tl.fromTo("#" + id + " p", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62, ease: "power2.out" }, t + 0.45);
      tl.fromTo("#" + id + " .panel", { y: 52, rotateX: -8, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 0.82, ease: "back.out(0.85)", stagger: 0.12 }, t + 0.35);
      tl.fromTo("#" + id + " .chip, #" + id + " .proof-row, #" + id + " .route div", { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power2.out", stagger: 0.09 }, t + 0.78);
      tl.to("#" + id + " .marker", { width: 620, duration: 0.55, ease: "power3.out" }, t + 1.1);
    });
    tl.fromTo(".video-label, .lower", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.18 }, 34.4);
    tl.to(".app-video", { filter: "saturate(1.12) contrast(1.04)", duration: 1.2, ease: "sine.inOut" }, 34.2);
    tl.to(".lower b", { color: "#67d391", duration: 0.4, ease: "power2.out" }, 46.5);
    tl.to(".lower b", { color: "#ff6b35", duration: 0.4, ease: "power2.out" }, 87.5);
    window.__timelines["root"] = tl;
  `;
}

async function writeVideoProjects() {
  await fs.writeFile(path.join(demoVideoDir, "index.html"), buildDemoVideoHtml());
  await fs.writeFile(path.join(pitchVideoDir, "index.html"), buildPitchVideoHtml());
}

async function writeDocs() {
  await fs.writeFile(path.join(outRoot, "script.md"), scriptMarkdown);
  await fs.writeFile(path.join(demoAudioDir, "narration.json"), JSON.stringify(narrationManifest("demo", demoScenes), null, 2));
  await fs.writeFile(path.join(pitchAudioDir, "narration.json"), JSON.stringify(narrationManifest("pitch", pitchScenes), null, 2));
  await fs.writeFile(path.join(root, "docs/zh/PITCH_AND_DEMO_2MIN.md"), scriptMarkdown);
  await fs.writeFile(path.join(submissionDir, "pactbreak-zh-2min-script.md"), scriptMarkdown);
}

async function updateExternalSkillUsage() {
  const file = path.join(root, ".hunter/external-skill-usage.json");
  const raw = await fs.readFile(file, "utf8");
  const data = JSON.parse(raw);
  const now = new Date().toISOString();
  const rows = [
    {
      skill: "guizang-ppt-skill",
      installed_path: "/Users/rick/.skills-manager/skills/guizang-ppt-skill/SKILL.md",
      loaded_at: now,
      why_used: "Generate the new Chinese two-minute pitch deck and PDF.",
      output_file: "pitch/zh-2min/deck.html",
      evidence_summary: "Generated a five-slide Chinese deck around CAW payment, mutation, proof, and mechanism.",
      fallback_if_missing: "Use the existing demo-recording deck and record the weaker deck polish gap.",
      status: "used"
    },
    {
      skill: "hyperframes",
      installed_path: "/Users/rick/.skills-manager/skills/hyperframes/SKILL.md",
      loaded_at: now,
      why_used: "Render the new Chinese pure-demo video and pitch-deck video as silent HTML compositions before audio mux.",
      output_file: "pitch/zh-2min/demo-video/index.html; pitch/zh-2min/pitch-video/index.html",
      evidence_summary: "Two 1920x1200 video projects hold the demo plate, deck thumbs, proof chips, and timed overlays.",
      fallback_if_missing: "Do not ship a raw screen recording; keep local MP4 pending and record a video blocker.",
      status: "used"
    },
    {
      skill: "humanizer-zh",
      installed_path: "/Users/rick/.skills-manager/skills/humanizer-zh/SKILL.md",
      loaded_at: now,
      why_used: "Rewrite Chinese narration and submission-facing script so it reads like a founder demo, not AI copy.",
      output_file: "pitch/zh-2min/script.md",
      evidence_summary: "Chinese copy uses short concrete sentences, names the CAW proof, and avoids generic hype.",
      fallback_if_missing: "Keep factual copy and mark Chinese copy polish as incomplete.",
      status: "used"
    },
    {
      skill: "stop-slop",
      installed_path: "/Users/rick/.skills-manager/skills/stop-slop/SKILL.md",
      loaded_at: now,
      why_used: "Remove AI-flavored filler from the Chinese narration, deck notes, and form snippets.",
      output_file: "docs/zh/PITCH_AND_DEMO_2MIN.md",
      evidence_summary: "Banned phrases were avoided; public copy only names sponsor technology and proof surfaces.",
      fallback_if_missing: "Proceed with factual copy and rerun a manual slop checklist.",
      status: "used"
    }
  ];
  const existingKeys = new Set(data.skills.map((row) => `${row.skill}|${row.output_file}`));
  for (const row of rows) {
    const key = `${row.skill}|${row.output_file}`;
    if (!existingKeys.has(key)) data.skills.push(row);
  }
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function main() {
  await ensureDirs();
  await copyAssets();
  await writeDocs();
  await writeDeck();
  await writeVideoProjects();
  await updateExternalSkillUsage();
  console.log(`Wrote Chinese 2-min source package to ${path.relative(root, outRoot)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
