# Deployment

PactBreak Resource Procurement deploys to the public runtime through OpenNext.

Live URL: <https://pactbreak-treasury-firewall.veithly.workers.dev>

Worker name: `pactbreak-treasury-firewall`

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev:demo
```

Open <http://localhost:4388>.

## Environment Variables

Local values live in `.env.local`. Deployed secrets and vars live in Cloudflare Workers.

| Name | Scope | Required for | Secret |
| --- | --- | --- | --- |
| `AGENT_WALLET_API_URL` | server | CAW API base URL | No |
| `AGENT_WALLET_API_KEY` | server | CAW API authentication | Yes |
| `AGENT_WALLET_WALLET_ID` | server | Wallet operations | Yes |
| `CAW_SOURCE_ADDRESS` | server | Transfer source address | Yes |
| `CAW_DESTINATION` | server | Approved vendor wallet destination | No |
| `CAW_CHAIN_ID` | server | CAW chain id, defaults to `SETH` | No |
| `CAW_TOKEN_ID` | server | CAW token id, defaults to `SETH` | No |
| `NEXT_PUBLIC_DEMO_URL` | browser | Optional UI metadata | No |

Do not print or commit `AGENT_WALLET_API_KEY`, `AGENT_WALLET_WALLET_ID`, `CAW_SOURCE_ADDRESS`, or Pact-scoped keys.

## Cloudflare Configuration

`wrangler.jsonc` sets:

```jsonc
{
  "name": "pactbreak-treasury-firewall",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-06-09",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
```

Set server secrets with Wrangler:

```bash
npx wrangler secret put AGENT_WALLET_API_KEY
npx wrangler secret put AGENT_WALLET_WALLET_ID
npx wrangler secret put CAW_SOURCE_ADDRESS
```

Set non-secret vars in `wrangler.jsonc` or the Cloudflare dashboard:

```text
AGENT_WALLET_API_URL=https://api.agenticwallet.cobo.com
CAW_CHAIN_ID=SETH
CAW_TOKEN_ID=SETH
CAW_DESTINATION=0x1111111111111111111111111111111111111111
```

## Build And Deploy

```bash
npm run typecheck
npm run build
npm run cf:build
npm run cf:deploy
```

The G5 deployed version recorded in gate evidence is `d85d83b8-afe5-4485-8510-1c71981d192c`.

## Public Smoke Checks

After deploy:

```bash
curl -s https://pactbreak-treasury-firewall.veithly.workers.dev/api/drills
```

Expected proof fields include:

```text
status=transfer_denied
evidenceSource=live_caw
pactId=59f67ec0-8b3c-4d26-9403-0f70f083e3ec
transactionHash=0xae5e23759f56182d286a89ef55161e5e6af517e963e1f83a6e37d14f30c3e0ea
```

Run the HackathonHunter public visual smoke:

```bash
node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/visual_qa_scan.mjs . --url https://pactbreak-treasury-firewall.veithly.workers.dev --routes /,/app/queue,/app/proof,/app/pact,/app/policy,/app/runs --fail-on error --wait-ms 1200
```

G5 public smoke evidence lives at `.hunter/gates/G5-public-smoke.report.json`.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `configuration_blocked` | One or more CAW server variables are missing | Set the secret or var, redeploy, then retry. |
| Safe transfer returns `409` | Pact is not active | Poll owner approval before transfer execution. |
| CAW returns `422` for transfer | `src_addr` missing or invalid | Set `CAW_SOURCE_ADDRESS` from the CAW address list. |
| No tx hash appears | Transfer did not complete | Keep the proof state blocked or pending. Do not paste a fake hash. |
| Public app opens but state does not persist like local dev | Worker runtime has no writable local filesystem | Use the seeded proof for demo; add D1 before production use. |
