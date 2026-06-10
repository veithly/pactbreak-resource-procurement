import {
  AuditApi,
  Configuration,
  PactsApi,
  TransactionsApi
} from "@cobo/agentic-wallet";

const CHAIN_ID = process.env.CAW_CHAIN_ID ?? "SETH";
const TOKEN_ID = process.env.CAW_TOKEN_ID ?? "SETH";
const ALLOWED_AMOUNT = "0.001";
const DENIED_AMOUNT = "0.005";
const DENY_THRESHOLD = "0.002";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required. See .env.example.`);
  return value;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseApiError(err: unknown) {
  const response = (err as { response?: { status?: number; data?: unknown } }).response;
  const payload = response?.data && typeof response.data === "object" ? response.data : {};
  return { status: response?.status ?? "-", payload };
}

async function main() {
  const basePath = requireEnv("AGENT_WALLET_API_URL");
  const apiKey = requireEnv("AGENT_WALLET_API_KEY");
  const walletId = requireEnv("AGENT_WALLET_WALLET_ID");
  const sourceAddress = requireEnv("CAW_SOURCE_ADDRESS");
  const destination = process.env.CAW_DESTINATION ?? "0x1111111111111111111111111111111111111111";

  const ownerConfig = new Configuration({ apiKey, basePath });
  const pactsApi = new PactsApi(ownerConfig);
  const auditApi = new AuditApi(ownerConfig);

  console.log(`[1/5] submit pact with cap ${DENY_THRESHOLD} ${TOKEN_ID}`);
  const pactResp = await pactsApi.submitPact({
    wallet_id: walletId,
    intent: "Treasury Firewall Drill: vendor security audit payout",
    spec: {
      policies: [
        {
          name: "treasury-firewall-max-transfer",
          type: "transfer",
          rules: {
            effect: "allow",
            when: {
              chain_in: [CHAIN_ID],
              token_in: [{ chain_id: CHAIN_ID, token_id: TOKEN_ID }]
            },
            deny_if: { amount_gt: DENY_THRESHOLD }
          }
        }
      ],
      completion_conditions: [{ type: "time_elapsed", threshold: "86400" }]
    }
  });
  const pactId = pactResp.data.result.pact_id;
  console.log(`pact_id=${pactId}`);

  console.log("[2/5] waiting for owner approval in Cobo Agentic Wallet");
  let pactApiKey = "";
  for (;;) {
    const pact = (await pactsApi.getPact(pactId)).data.result;
    console.log(`pact_status=${pact.status ?? "unknown"}`);
    if (pact.status === "active" && pact.api_key) {
      pactApiKey = pact.api_key;
      break;
    }
    if (["rejected", "expired", "revoked", "completed"].includes(pact.status ?? "")) {
      throw new Error(`pact reached terminal status: ${pact.status}`);
    }
    await sleep(5000);
  }

  const txApi = new TransactionsApi(new Configuration({ apiKey: pactApiKey, basePath }));

  console.log(`[3/5] execute allowed transfer ${ALLOWED_AMOUNT} ${TOKEN_ID}`);
  const allowed = (
    await txApi.transferTokens(walletId, {
      chain_id: CHAIN_ID,
      src_addr: sourceAddress,
      dst_addr: destination,
      token_id: TOKEN_ID,
      amount: ALLOWED_AMOUNT
    })
  ).data.result;
  console.log(
    `allowed tx_id=${allowed.id} status=${allowed.status} request_id=${allowed.request_id} hash=${allowed.transaction_hash ?? "-"}`
  );

  console.log(`[4/5] ask CAW to block oversized transfer ${DENIED_AMOUNT} ${TOKEN_ID}`);
  try {
    await txApi.transferTokens(walletId, {
      chain_id: CHAIN_ID,
      src_addr: sourceAddress,
      dst_addr: destination,
      token_id: TOKEN_ID,
      amount: DENIED_AMOUNT
    });
    console.log("unexpected_allowed=true");
  } catch (error) {
    const parsed = parseApiError(error);
    console.log(`denied status=${parsed.status} payload=${JSON.stringify(parsed.payload)}`);
  }

  console.log("[5/5] fetch audit counts");
  const logs = await auditApi.listAuditLogs(
    walletId,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    20
  );
  const items = (logs.data.result as { items?: Array<{ result?: string }> }).items ?? [];
  console.log(
    `audit total=${items.length} allowed=${items.filter((item) => item.result === "allowed").length} denied=${items.filter((item) => item.result === "denied").length}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
