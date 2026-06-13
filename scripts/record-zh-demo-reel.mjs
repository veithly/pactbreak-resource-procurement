import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const baseUrl = process.env.DEMO_URL || "http://localhost:4387";
const outDir = path.join(root, "pitch/recording/zh-demo-real");
const rawDir = path.join(outDir, "raw");
const outWebm = path.join(outDir, "raw.webm");
const outMp4 = path.join(outDir, "silent.mp4");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function injectRecordingCss(page) {
  await page.addStyleTag({
    content: `
      nextjs-portal,
      [data-nextjs-toast],
      [data-nextjs-dialog-overlay],
      [data-nextjs-dialog],
      [data-nextjs-dev-tools-button] {
        display: none !important;
      }
      html {
        scroll-behavior: smooth !important;
      }
      body {
        cursor: default !important;
      }
    `
  }).catch(() => undefined);
}

async function moveTo(page, locator, offset = { x: 0.5, y: 0.5 }, steps = 18) {
  const box = await locator.boundingBox().catch(() => null);
  if (!box) return;
  await page.mouse.move(box.x + box.width * offset.x, box.y + box.height * offset.y, { steps });
}

async function slowWheel(page, totalY, durationMs) {
  const steps = Math.max(8, Math.round(durationMs / 90));
  const delta = totalY / steps;
  for (let i = 0; i < steps; i += 1) {
    await page.mouse.wheel(0, delta);
    await sleep(durationMs / steps);
  }
}

async function dwell(page, ms, drift = 0) {
  const start = Date.now();
  const cx = 1450;
  const cy = 430;
  while (Date.now() - start < ms) {
    if (drift) {
      const t = (Date.now() - start) / 1000;
      await page.mouse.move(cx + Math.sin(t) * drift, cy + Math.cos(t * 0.8) * drift * 0.55, { steps: 6 });
    }
    const remaining = ms - (Date.now() - start);
    if (remaining <= 0) break;
    await sleep(Math.min(420, remaining));
  }
}

async function clickByRole(page, role, name) {
  const locator = page.getByRole(role, { name }).first();
  await moveTo(page, locator, { x: 0.5, y: 0.5 }, 22);
  await sleep(250);
  await locator.click();
}

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(rawDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--window-size=1920,1200", "--hide-scrollbars", "--force-device-scale-factor=1"]
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1200 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    recordVideo: { dir: rawDir, size: { width: 1920, height: 1200 } }
  });
  const page = await context.newPage();

  await page.request.post(`${baseUrl}/api/drills`, { data: {} }).catch(() => undefined);

  await page.goto(`${baseUrl}/app/queue`, { waitUntil: "networkidle" });
  await injectRecordingCss(page);
  await page.getByRole("heading", { name: /riskops agent buys audit data/i }).waitFor({ timeout: 30_000 });
  await page.mouse.move(1260, 260, { steps: 24 });
  await dwell(page, 7500, 28);

  await moveTo(page, page.getByText(/CAW budget/i).first(), { x: 0.55, y: 0.55 }, 18);
  await dwell(page, 3000, 18);
  await slowWheel(page, 470, 4200);
  await page.getByRole("table").waitFor({ timeout: 10_000 });
  await moveTo(page, page.getByText(/AuditMesh API/i).first(), { x: 0.45, y: 0.55 }, 20);
  await dwell(page, 3300, 20);
  await moveTo(page, page.getByText(/Sentinel Plus/i).first(), { x: 0.45, y: 0.55 }, 16);
  await dwell(page, 2300, 18);
  await moveTo(page, page.getByText(/Shadow Index/i).first(), { x: 0.45, y: 0.55 }, 16);
  await dwell(page, 2600, 18);

  await slowWheel(page, -520, 3600);
  await sleep(900);
  await clickByRole(page, "button", /attach live CAW receipt/i);
  await page.getByText(/Existing live CAW receipt attached/i).waitFor({ timeout: 10_000 });
  await moveTo(page, page.getByText(/Order stays inside CAW bounds/i).first(), { x: 0.4, y: 0.5 }, 18);
  await dwell(page, 8700, 22);

  await clickByRole(page, "button", /raise price above limit/i);
  await page.getByText(/Order blocked before wallet authority/i).waitFor({ timeout: 10_000 });
  await moveTo(page, page.getByText(/exceeds the Pact cap/i).first(), { x: 0.48, y: 0.6 }, 18);
  await dwell(page, 9000, 24);

  await clickByRole(page, "button", /replace vendor wallet/i);
  await page.getByText(/Recipient is on the treasury denylist/i).first().waitFor({ timeout: 10_000 });
  await moveTo(page, page.getByText(/Recipient is on the treasury denylist/i).first(), { x: 0.48, y: 0.6 }, 18);
  await dwell(page, 8200, 22);

  await slowWheel(page, 780, 4800);
  await moveTo(page, page.getByText(/Live CAW evidence/i).first(), { x: 0.5, y: 0.4 }, 20);
  await dwell(page, 13_000, 20);

  await clickByRole(page, "link", /proof/i);
  await injectRecordingCss(page);
  await page.getByRole("heading", { name: /procurement proof board/i }).waitFor({ timeout: 10_000 });
  await page.mouse.move(1480, 340, { steps: 24 });
  await dwell(page, 12_000, 20);
  await slowWheel(page, 460, 3200);
  await moveTo(page, page.getByText(/Run trace/i).first(), { x: 0.45, y: 0.5 }, 18);
  await dwell(page, 4000, 18);

  await clickByRole(page, "link", /open full run/i);
  await injectRecordingCss(page);
  await page.getByRole("heading", { name: /resource procurement run/i }).waitFor({ timeout: 10_000 }).catch(() => undefined);
  await dwell(page, 12_000, 18);

  const video = page.video();
  await context.close();
  await browser.close();
  const rawPath = await video.path();
  await fs.rename(rawPath, outWebm);

  const ffmpeg = spawnSync("ffmpeg", [
    "-y",
    "-i", outWebm,
    "-vf", "fps=30,scale=1920:1200:flags=lanczos,unsharp=5:5:0.55,eq=contrast=1.035:saturation=1.06",
    "-an",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "17",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    outMp4
  ], { stdio: "inherit" });
  if (ffmpeg.status !== 0) {
    throw new Error("ffmpeg conversion failed");
  }

  console.log(`wrote ${path.relative(root, outMp4)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
