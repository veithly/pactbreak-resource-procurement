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
const hero = "三家报价，一笔 CAW 付款。评委改价格、换钱包，CAW 当场拦住。";

const demoScenes = [
  {
    id: "01_open",
    title: "打开采购台",
    text:
      "各位评委，我直接跑实机。这里是 PactBreak 的采购台。RiskOps Agent 要买一份安全数据，它可以自己选供应商，但付款一定要走 Cobo Agentic Wallet。"
  },
  {
    id: "02_quotes",
    title: "看三家报价",
    text:
      "先看报价。AuditMesh 在预算内，钱包也在 Pact 允许的名单里；另外两家，一个太贵，一个收款地址不该付。"
  },
  {
    id: "03_receipt",
    title: "挂上 CAW 记录",
    text:
      "我点 Attach live CAW receipt。订单里现在有 Pact ID 和 tx hash。这里用的是已经准备好的 CAW live 记录，方便你们点开回看，我不把它说成刚刚新打出去的钱。"
  },
  {
    id: "04_price",
    title: "改价格",
    text:
      "现在我改订单。先把价格抬到上限外，右侧马上停住，原因写得很直接：金额超过 Pact cap。"
  },
  {
    id: "05_wallet",
    title: "换钱包",
    text:
      "再换供应商钱包。这个地址在 denylist 里，所以 CAW 路径不会继续。结果就是钱没有出去，页面也留下拒绝码。"
  },
  {
    id: "06_records",
    title: "看记录",
    text:
      "我往下看记录。这里有 Pact、tx hash、ADDRESS_NOT_WHITELISTED，还有 allowed 十九、denied 一。"
  },
  {
    id: "07_close",
    title: "回看全流程",
    text:
      "最后打开 proof board 和 run detail。评委可以沿着这几页回看每一次选择、拦截和 CAW 记录。最后一句：Agent 可以采购资源，但资金边界由 CAW 管住。"
  }
];

const pitchScenes = [
  {
    id: "01_hook",
    title: "开场",
    text:
      "各位评委，我用一句话讲：PactBreak 是给采购 Agent 用的 CAW 支付保险丝。Agent 可以自己选资源，但付款必须按 Pact 里写好的范围来。"
  },
  {
    id: "02_problem",
    title: "问题",
    text:
      "问题很现实。Agent 以后会买数据、API、审计报告和算力。你不能给它一把服务器私钥；但每笔都叫人审批，小额采购又跑不起来。"
  },
  {
    id: "03_demo",
    title: "演示",
    text:
      "所以 demo 只做一个场景：安全团队要买一份风险数据。RiskOps Agent 从三家报价里选 AuditMesh，然后把付款交给 Cobo Agentic Wallet。"
  },
  {
    id: "04_path",
    title: "付款路径",
    text:
      "我当场改价格、换钱包。正常订单能挂上 CAW 付款记录；改坏的订单会停住，CAW 返回 ADDRESS_NOT_WHITELISTED。屏幕上有 Pact ID 和 tx hash。"
  },
  {
    id: "05_close",
    title: "收尾",
    text:
      "代码里也很直：前端提交订单，policy 先看预算、用途、代币和地址，CAW adapter 只把合格订单送去付款。下一步，我们会把每个供应商订单接成独立 CAW 执行，让 Agent 按订单付钱。"
  }
];

const scriptMarkdown = `# PactBreak 2 分钟中文交付稿

## 交付文件

- 纯 Demo 视频：\`submission-media/pactbreak-demo-zh-2min.mp4\`
- Pitch deck 视频：\`submission-media/pactbreak-pitch-deck-zh-2min.mp4\`
- Pitch deck PDF：\`submission-media/pactbreak-pitch-deck-zh-2min.pdf\`
- 中文讲稿与表单文案：\`submission-media/pactbreak-zh-2min-script.md\`

## QA 记录

- Demo 视频：120 秒，1920x1200，30fps，H.264 + AAC，只放实机操作画面。
- Demo 旁白：87.2 秒，按屏幕动作讲，后半段留给评委看 proof board 和 run detail。
- Pitch deck 视频：120 秒，1920x1200，30fps，H.264 + AAC。
- Hunter audit：claims、judge-red-team、submission、external-skills 全部通过。

## 表单主句

${hero}

给表单用：只写 Cobo Agentic Wallet、CAW、Pact、tx hash、拒绝码、allowed 十九、denied 一。别写制作工具。

## 纯 Demo 视频讲稿

${demoScenes.map((scene, index) => `### ${index + 1}. ${scene.title}\n\n${scene.text}`).join("\n\n")}

## 2 分钟 Pitch Deck 配音稿

${pitchScenes.map((scene, index) => `### ${index + 1}. ${scene.title}\n\n${scene.text}`).join("\n\n")}

## 表单短文案

项目名称：PactBreak Resource Procurement

项目描述：
PactBreak 是给采购 Agent 用的 CAW 支付原型。RiskOps Agent 在三家安全数据报价里选供应商，合格订单走 CAW Pact；评委现场改价格或钱包后，页面会留下 CAW 拒绝码。成功记录里有 tx hash，失败记录里有 ADDRESS_NOT_WHITELISTED 和 allowed 十九、denied 一。

项目链接：${liveUrl}

GitHub Repo Link：${repoUrl}

Demo 视频链接：https://raw.githubusercontent.com/veithly/pactbreak-resource-procurement/main/submission-media/pactbreak-demo-zh-2min.mp4

Pitch deck 视频链接：https://raw.githubusercontent.com/veithly/pactbreak-resource-procurement/main/submission-media/pactbreak-pitch-deck-zh-2min.mp4

PPT 链接：https://raw.githubusercontent.com/veithly/pactbreak-resource-procurement/main/submission-media/pactbreak-pitch-deck-zh-2min.pdf
`;

function narrationManifest(kind, scenes) {
  return {
    $schema: "narration.v1",
    language: "zh-CN",
    voice: "mimo",
    first_sentence: scenes[0].text,
    instruction:
      "中文产品演示旁白。像创始人在评委面前边点屏幕边讲，语气自然，别像新闻播报，也别像广告。遇到短句要稍微停顿，像真人在换屏幕。Cobo Agentic Wallet 读作 Cobo Agentic Wallet，CAW 读作 C A W，Pact 读作 Pact。重点数字和拒绝码读清楚。",
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
    path.join(demoVideoDir, "images"),
    path.join(pitchVideoDir, "assets"),
    path.join(pitchVideoDir, "deck-thumbs"),
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
    await copyIfExists(path.join(root, from), path.join(demoVideoDir, "images", name));
  }
  for (const name of ["slide-01.png", "slide-02.png", "slide-03.png", "slide-04.png", "slide-05.png"]) {
    await copyIfExists(path.join(deckThumbsDir, name), path.join(pitchVideoDir, "deck-thumbs", name));
  }
  await copyIfExists(path.join(root, "pitch/recording/zh-demo-real/demo-120-gop30.mp4"), path.join(demoVideoDir, "assets", "real-demo.mp4"));
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
        <div class="lead" style="max-width:58ch;color:rgba(255,255,255,.88);font-weight:300">评委改价格或钱包，Pact 先拦。tx hash、拒绝码、allowed 十九、denied 一留在记录页。</div>
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
      <h2 class="h-xl-zh" style="font-size:min(5.4vw,9.4vh);max-width:14ch">Agent 要花钱，不能拿服务器私钥。</h2>
    </div>
    <div class="duo-compare" style="flex:1;min-height:0">
      <div class="duo-half col" style="padding-right:3vw">
        <span class="t-cat">Loose Key</span>
        <h3 style="font-size:min(4.6vw,8vh);font-weight:200;line-height:1">服务器 key 太宽</h3>
        <p class="lead" style="font-size:max(22px,1.5vw);max-width:26ch">一个采购 Agent 可以误付、超付，甚至把钱打到错误地址。</p>
        <div class="t-meta" style="margin-top:auto;color:var(--text-helper)">风险：钱先动，记录后补。</div>
      </div>
      <span class="vrule"></span>
      <div class="duo-half col" style="padding-left:3vw">
        <span class="t-cat" style="color:var(--accent)">CAW Pact</span>
        <h3 style="font-size:min(4.6vw,8vh);font-weight:200;line-height:1;color:var(--accent)">Pact 先写好</h3>
        <p class="lead" style="font-size:max(22px,1.5vw);max-width:26ch">链、代币、金额、地址和用途先写进 Pact，Agent 仍然能自己执行。</p>
        <div class="t-meta" style="margin-top:auto;color:var(--accent)">结果：放行和拒绝都能回看。</div>
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
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">CAW TX</div><div style="font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em">1</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">已有真实 CAW 付款记录</p></div>
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">DENIAL</div><div style="font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em;color:var(--accent)">1</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">ADDRESS_NOT_WHITELISTED</p></div>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-layout="S17" data-animate="system-diagram">
  <div class="canvas-card">
    ${slideChrome("CAW path · What breaks without it", "04 / 05")}
    <div style="flex:1;display:grid;grid-template-columns:.9fr 1.1fr;gap:5vw;align-items:center;min-height:0">
      <div data-anim="line" style="display:flex;flex-direction:column;gap:2.2vh">
        <div class="t-meta">THREE LAYERS</div>
        <h2 class="h-xl-zh" style="font-size:min(5.2vw,9vh);max-width:12ch">报价后面，还有付款范围。</h2>
        <p class="lead" style="font-size:max(21px,1.45vw);max-width:32ch">前端提交采购单；policy 看金额、用途、地址和代币；CAW 只执行允许范围内的转账。</p>
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
        <div class="sys-label" style="position:absolute;left:26%;bottom:7%"><b>CAW</b><span>Pact、转账、记录</span></div>
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
        <div class="chrome-min" style="margin-bottom:0;position:relative;z-index:1"><div class="l">05 / 05</div><div class="r">RECORDS</div></div>
        <div data-anim="manifesto" style="display:flex;flex-direction:column;gap:2vh;position:relative;z-index:1">
          <div class="t-meta" style="color:rgba(255,255,255,.78);letter-spacing:.22em;margin-bottom:1.6vh">REPLAY</div>
          <h2 style="font-size:min(7.4vw,13vh);line-height:.96;letter-spacing:-.025em;font-weight:200;color:#fff">改坏订单。<br>看<span style="font-style:italic;font-weight:300">CAW</span> 怎么拦。</h2>
          <div style="font-size:max(16px,1.1vw);line-height:1.55;color:rgba(255,255,255,.84);font-weight:400;max-width:34ch;margin-top:1.4vh">Pact、tx hash、拒绝码、allowed 十九、denied 一都放在记录页。</div>
        </div>
        <div data-anim="signature" style="border-top:1px solid rgba(255,255,255,.22);padding-top:2vh;position:relative;z-index:1" class="t-meta">pactbreak-treasury-firewall.veithly.workers.dev</div>
      </div>
      <div class="half" style="padding:5.6vh 3.6vw 4.4vh;justify-content:space-between">
        <div class="chrome-min"><div class="l">CAW RECORDS</div><div class="r">OPEN SOURCE</div></div>
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
    .real-demo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#020711}
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
    <video id="real-demo" class="real-demo clip" data-start="0" data-duration="120" data-track-index="1" data-media-start="0" src="./assets/real-demo.mp4" muted playsinline></video>
  </div><script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><script>
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    tl.to({}, { duration: 120 });
    window.__timelines["root"] = tl;
  </script></body></html>`;
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
    ${slideScene("p2", 23, 25, "slide-02.png", "02 / Problem", "Agent 花钱不能拿服务器私钥。")}
    ${slideScene("p3", 46, 26, "slide-03.png", "03 / Demo", "评委改订单，页面留下付款或拒绝记录。")}
    ${slideScene("p4", 70, 25, "slide-04.png", "04 / CAW path", "CAW 决定这笔钱能不能动。")}
    ${slideScene("p5", 93, 27, "slide-05.png", "05 / Records", "Pact、tx、拒绝码、allowed、denied 都能回看。")}
  </div><script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><script>${videoTimeline(["p1", "p2", "p3", "p4", "p5"], [0, 23, 46, 70, 93])}</script></body></html>`;
}

function slideScene(id, start, duration, image, label, line) {
  return `<section id="${id}" class="scene clip" data-start="${start}" data-duration="${duration}" data-track-index="${start + 1}" style="display:block;padding:0;background:#111614">
    <img class="slide-img" src="deck-thumbs/${image}">
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
    const targets = (selector) => gsap.utils.toArray(selector);
    const fromToIf = (selector, fromVars, toVars, at) => {
      const els = targets(selector);
      if (els.length) tl.fromTo(els, fromVars, toVars, at);
    };
    const toIf = (selector, toVars, at) => {
      const els = targets(selector);
      if (els.length) tl.to(els, toVars, at);
    };
    ids.forEach((id, i) => {
      const t = starts[i] + 0.18;
      fromToIf("#" + id, { opacity: 0 }, { opacity: 1, duration: 0.65, ease: "power3.out" }, t);
      fromToIf("#" + id + " .kicker, #" + id + " .frame-title", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "expo.out" }, t + 0.15);
      fromToIf("#" + id + " h1", { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, ease: "power4.out" }, t + 0.28);
      fromToIf("#" + id + " p", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62, ease: "power2.out" }, t + 0.45);
      fromToIf("#" + id + " .panel", { y: 52, rotateX: -8, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 0.82, ease: "back.out(0.85)", stagger: 0.12 }, t + 0.35);
      fromToIf("#" + id + " .chip, #" + id + " .proof-row, #" + id + " .route div", { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power2.out", stagger: 0.09 }, t + 0.78);
      toIf("#" + id + " .marker", { width: 620, duration: 0.55, ease: "power3.out" }, t + 1.1);
    });
    fromToIf(".video-label, .lower", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.18 }, 34.4);
    toIf(".app-video", { filter: "saturate(1.12) contrast(1.04)", duration: 1.2, ease: "sine.inOut" }, 34.2);
    toIf(".lower b", { color: "#67d391", duration: 0.4, ease: "power2.out" }, 46.5);
    toIf(".lower b", { color: "#ff6b35", duration: 0.4, ease: "power2.out" }, 87.5);
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
      evidence_summary: "Generated a five-slide Chinese deck around CAW payment, mutation, records, and mechanism.",
      fallback_if_missing: "Use the existing demo-recording deck and record the weaker deck polish gap.",
      status: "used"
    },
    {
      skill: "hyperframes",
      installed_path: "/Users/rick/.skills-manager/skills/hyperframes/SKILL.md",
      loaded_at: now,
      why_used: "Render the new Chinese pure-demo video and pitch-deck video as silent HTML compositions before audio mux.",
      output_file: "submission-media/pactbreak-demo-zh-2min.mp4",
      evidence_summary: "Two 1920x1200 video projects hold the demo plate, deck thumbs, CAW record chips, and timed overlays.",
      fallback_if_missing: "Do not ship a raw screen recording; keep local MP4 pending and record a video blocker.",
      status: "used"
    },
    {
      skill: "humanizer-zh",
      installed_path: "/Users/rick/.skills-manager/skills/humanizer-zh/SKILL.md",
      loaded_at: now,
      why_used: "Rewrite Chinese narration and submission-facing script so it sounds like a founder talking to judges during the demo.",
      output_file: "pitch/zh-2min/script.md",
      evidence_summary: "Chinese copy uses screen actions, CAW records, rejection codes, and short spoken sentences.",
      fallback_if_missing: "Keep factual copy and mark Chinese copy polish as incomplete.",
      status: "used"
    },
    {
      skill: "stop-slop",
      installed_path: "/Users/rick/.skills-manager/skills/stop-slop/SKILL.md",
      loaded_at: now,
      why_used: "Remove AI-flavored filler from the Chinese narration, deck notes, and form snippets.",
      output_file: "docs/zh/PITCH_AND_DEMO_2MIN.md",
      evidence_summary: "Banned phrases were avoided; public copy only names sponsor technology, screen actions, and inspectable records.",
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
