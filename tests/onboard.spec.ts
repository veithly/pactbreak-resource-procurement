import { expect, test } from "@playwright/test";

test("fresh judge reaches the CAW-bound procurement consequence", async ({ page }) => {
  await page.request.post("/api/drills");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /compare 3 quotes/i })).toBeVisible();
  await page.getByRole("link", { name: /procure resource/i }).first().click();
  await expect(page.getByRole("heading", { name: /riskops agent buys audit data/i })).toBeVisible();
  await expect(page.getByRole("table")).toContainText("AuditMesh API");
  await page.getByRole("button", { name: /attach live CAW receipt/i }).click();
  await expect(page.getByText(/existing live CAW receipt attached/i)).toBeVisible();
  await page.getByRole("button", { name: /raise price above limit/i }).click();
  await expect(page.getByText(/Order blocked before wallet authority/i)).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: /exceeds the pact cap/i })).toBeVisible();
});

test("policy lab exposes deterministic allow and deny states", async ({ page }) => {
  await page.goto("/app/policy");
  await expect(page.getByRole("heading", { name: /inspect the procurement boundary/i })).toBeVisible();
  await expect(page.getByText(/CAW request can proceed/i)).toBeVisible();
  await page.getByLabel("Amount").fill("0.006");
  await expect(page.getByText(/Request must be blocked/i)).toBeVisible();
});
