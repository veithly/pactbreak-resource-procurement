import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_POLICY, evaluateIntent } from "@/lib/policy";
import type { DrillEvent, ProcurementOrder, PublicDrill, TreasuryDrill } from "@/lib/types";

// Persistent local JSON storage mirrors the Cloudflare D1Database run schema planned for deployment.
const DB_DIR = path.join(process.cwd(), ".hunter", "local-db");
const DB_FILE = path.join(DB_DIR, "drills.json");

interface DrillStoreFile {
  drills: TreasuryDrill[];
}

const LIVE_CAW_PROOF = {
  pactId: "59f67ec0-8b3c-4d26-9403-0f70f083e3ec",
  txId: "816cd936-cdcb-4d53-a76c-ea65070a0e3e",
  transactionHash: "0xae5e23759f56182d286a89ef55161e5e6af517e963e1f83a6e37d14f30c3e0ea",
  denialCode: "ADDRESS_NOT_WHITELISTED",
  denialReason: "no_pact_transfer_allow_policy_matched",
  auditAllowedCount: 19,
  auditDeniedCount: 1,
  evidenceSource: "live_caw" as const,
  signatureStatus: "not_signed" as const,
  statusDisplay: "Success"
};

const globalStore = globalThis as typeof globalThis & {
  __pactbreakTreasuryStore?: DrillStoreFile;
};

function now() {
  return new Date().toISOString();
}

function event(type: DrillEvent["type"], message: string, evidence?: DrillEvent["evidence"]): DrillEvent {
  return {
    id: randomUUID(),
    type,
    at: now(),
    message,
    evidence
  };
}

function buildProcurementOrder(originalRecipient: string): ProcurementOrder {
  const tokenId = DEFAULT_POLICY.tokenId;
  const maxAmount = DEFAULT_POLICY.maxAmount;
  return {
    id: "procure-security-audit-api",
    businessNeed: "Security-audit API/data package for today's treasury risk report",
    expectedArtifact: "15-minute risk feed, vendor receipt, and CAW execution proof",
    budget: maxAmount,
    selectedQuoteId: "quote-auditmesh",
    status: "payment_ready",
    cawRole: "CAW holds the agent wallet authority and limits chain, token, destination, and max amount.",
    decisionLog: [
      "Compare quotes by SLA, risk score, price, and wallet allowlist.",
      "Select the approved vendor that stays under the CAW Pact budget.",
      "Request payment authority only for the selected destination and amount.",
      "Refuse execution if a judge changes the price or wallet address."
    ],
    quotes: [
      {
        id: "quote-auditmesh",
        vendorName: "AuditMesh API",
        resource: "Security-audit data package",
        sla: "15 min refresh",
        riskScore: 18,
        walletAddress: originalRecipient,
        price: 0.001,
        tokenId,
        allowlisted: true,
        agentDecision: "selected",
        reason: "Approved address, within CAW Pact budget, acceptable SLA."
      },
      {
        id: "quote-sentinel-plus",
        vendorName: "Sentinel Plus",
        resource: "Expanded audit bundle",
        sla: "5 min refresh",
        riskScore: 14,
        walletAddress: originalRecipient,
        price: maxAmount + 0.002,
        tokenId,
        allowlisted: true,
        agentDecision: "rejected",
        reason: "Rejected because price exceeds the Pact amount limit."
      },
      {
        id: "quote-shadow-index",
        vendorName: "Shadow Index",
        resource: "Unverified exploit feed",
        sla: "unknown",
        riskScore: 71,
        walletAddress: "0xdead00000000000000000000000000000000beef",
        price: 0.001,
        tokenId,
        allowlisted: false,
        agentDecision: "rejected",
        reason: "Rejected because vendor wallet is not allowlisted."
      }
    ]
  };
}

function normalizeDrill(drill: TreasuryDrill): TreasuryDrill {
  const originalRecipient =
    drill.originalRecipient ?? process.env.CAW_DESTINATION ?? "0x1111111111111111111111111111111111111111";
  const procurement = drill.procurement ?? buildProcurementOrder(originalRecipient);
  const selected = procurement.quotes.find((quote) => quote.id === procurement.selectedQuoteId) ?? procurement.quotes[0];
  return {
    ...drill,
    title: drill.title.includes("procurement") ? drill.title : "Security audit resource procurement",
    purpose: drill.purpose.includes("procurement")
      ? drill.purpose
      : "security-audit API/data package procurement",
    amount: Number.isFinite(drill.amount) ? drill.amount : selected.price,
    originalAmount: Number.isFinite(drill.originalAmount) ? drill.originalAmount : selected.price,
    recipient: drill.recipient ?? selected.walletAddress,
    originalRecipient,
    procurement
  };
}

function seedDrill(): TreasuryDrill {
  const createdAt = now();
  const originalRecipient = process.env.CAW_DESTINATION ?? "0x1111111111111111111111111111111111111111";
  const procurement = buildProcurementOrder(originalRecipient);
  const selectedQuote = procurement.quotes.find((quote) => quote.id === procurement.selectedQuoteId) ?? procurement.quotes[0];
  return {
    id: "treasury-firewall-main",
    title: "Security audit resource procurement",
    ownerId: "demo-treasury",
    agentId: "agent-risk-ops",
    agentName: "RiskOps Agent",
    purpose: "security-audit API/data package procurement",
    amount: selectedQuote.price,
    originalAmount: selectedQuote.price,
    recipient: selectedQuote.walletAddress,
    originalRecipient,
    procurement,
    policy: DEFAULT_POLICY,
    status: "transfer_denied",
    riskReason: LIVE_CAW_PROOF.denialReason,
    caw: LIVE_CAW_PROOF,
    createdAt,
    updatedAt: createdAt,
    events: [
      event("caw_audit_synced", "CAW audit log counts synced from the wallet.", {
        allowed: LIVE_CAW_PROOF.auditAllowedCount,
        denied: LIVE_CAW_PROOF.auditDeniedCount,
        total: LIVE_CAW_PROOF.auditAllowedCount + LIVE_CAW_PROOF.auditDeniedCount,
        txHash: LIVE_CAW_PROOF.transactionHash,
        txStatus: LIVE_CAW_PROOF.statusDisplay
      }),
      event("quote_selected", "RiskOps Agent selected the approved audit-data vendor quote.", {
        quoteId: selectedQuote.id,
        vendor: selectedQuote.vendorName,
        price: selectedQuote.price,
        wallet: selectedQuote.walletAddress
      }),
      event("caw_transfer_denied", LIVE_CAW_PROOF.denialReason, {
        code: LIVE_CAW_PROOF.denialCode,
        reason: LIVE_CAW_PROOF.denialReason
      }),
      event("caw_transfer_allowed", "CAW allowed the safe transfer inside the pact boundary.", {
        txHash: LIVE_CAW_PROOF.transactionHash,
        txId: LIVE_CAW_PROOF.txId
      }),
      event("created", "Treasury drill queued with a scoped CAW policy.", {
        chain: DEFAULT_POLICY.chainId,
        token: DEFAULT_POLICY.tokenId,
        cap: DEFAULT_POLICY.maxAmount
      })
    ]
  };
}

async function readStore(): Promise<DrillStoreFile> {
  try {
    await mkdir(DB_DIR, { recursive: true });
    const raw = await readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as DrillStoreFile;
    if (Array.isArray(parsed.drills)) {
      const normalized = { drills: parsed.drills.map(normalizeDrill) };
      globalStore.__pactbreakTreasuryStore = normalized;
      return normalized;
    }
  } catch {
    if (globalStore.__pactbreakTreasuryStore) return globalStore.__pactbreakTreasuryStore;
  }

  const seeded = { drills: [seedDrill()] };
  await writeStore(seeded);
  return seeded;
}

async function writeStore(store: DrillStoreFile) {
  globalStore.__pactbreakTreasuryStore = store;
  try {
    await mkdir(DB_DIR, { recursive: true });
    await writeFile(DB_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Cloudflare Workers do not provide a writable local filesystem.
  }
}

export function sanitizeDrill(drill: TreasuryDrill): PublicDrill {
  const { pactApiKey: _pactApiKey, ...safeCaw } = drill.caw;
  return {
    ...drill,
    caw: {
      ...safeCaw,
      hasPactScopedKey: Boolean(drill.caw.pactApiKey)
    }
  };
}

export async function listDrills(): Promise<PublicDrill[]> {
  const store = await readStore();
  return store.drills.map(sanitizeDrill);
}

export async function getDrill(id: string): Promise<TreasuryDrill | null> {
  const store = await readStore();
  return store.drills.find((drill) => drill.id === id) ?? null;
}

export async function getPublicDrill(id: string): Promise<PublicDrill | null> {
  const drill = await getDrill(id);
  return drill ? sanitizeDrill(drill) : null;
}

export async function updateDrill(
  id: string,
  updater: (drill: TreasuryDrill) => TreasuryDrill
): Promise<TreasuryDrill | null> {
  const store = await readStore();
  const index = store.drills.findIndex((drill) => drill.id === id);
  if (index === -1) return null;
  const updated = updater(store.drills[index]);
  updated.updatedAt = now();
  store.drills[index] = updated;
  await writeStore(store);
  return updated;
}

export async function selectProcurementQuote(id: string, quoteId: string) {
  return updateDrill(id, (drill) => {
    const normalized = normalizeDrill(drill);
    const quote = normalized.procurement.quotes.find((item) => item.id === quoteId);
    if (!quote) return normalized;

    const candidate = {
      ...normalized,
      amount: quote.price,
      recipient: quote.walletAddress,
      procurement: {
        ...normalized.procurement,
        selectedQuoteId: quote.id,
        status: (quote.allowlisted && quote.price <= normalized.policy.maxAmount ? "payment_ready" : "mutated_blocked") as
          | "payment_ready"
          | "mutated_blocked"
      }
    };
    const decision = evaluateIntent(candidate);
    return {
      ...candidate,
      status: decision.allowed ? "quote_selected" : "policy_blocked",
      riskReason: decision.allowed ? undefined : decision.reasons.join(" "),
      events: [
        event(decision.allowed ? "quote_selected" : "quote_rejected", decision.allowed
          ? `RiskOps Agent selected ${quote.vendorName} for CAW-bound procurement.`
          : `RiskOps Agent rejected ${quote.vendorName} before payment authority.`, {
          quoteId: quote.id,
          vendor: quote.vendorName,
          price: quote.price,
          wallet: quote.walletAddress,
          allowlisted: quote.allowlisted,
          reasons: decision.reasons.join(" | ")
        }),
        ...normalized.events
      ]
    };
  });
}

export async function attachProcurementReceipt(id: string) {
  return updateDrill(id, (drill) => {
    const normalized = normalizeDrill(drill);
    const quote =
      normalized.procurement.quotes.find((item) => item.id === normalized.procurement.selectedQuoteId) ??
      normalized.procurement.quotes[0];

    return {
      ...normalized,
      amount: quote.price,
      recipient: quote.walletAddress,
      status: "transfer_allowed",
      procurement: {
        ...normalized.procurement,
        status: "receipt_attached"
      },
      caw: {
        ...normalized.caw,
        ...LIVE_CAW_PROOF,
        evidenceSource: "live_caw",
        signatureStatus: "signed"
      },
      events: [
        event("procurement_receipt_attached", "Existing live CAW allowed-transfer evidence attached as the prototype procurement receipt.", {
          quoteId: quote.id,
          vendor: quote.vendorName,
          txHash: LIVE_CAW_PROOF.transactionHash,
          pactId: LIVE_CAW_PROOF.pactId,
          note: "This prototype reuses existing CAW proof; it does not claim a new vendor settlement."
        }),
        ...normalized.events
      ]
    };
  });
}

export async function mutateDrill(id: string, input: { amount: number; recipient: string }) {
  return updateDrill(id, (drill) => {
    const normalized = normalizeDrill(drill);
    const next = {
      ...normalized,
      amount: input.amount,
      recipient: input.recipient,
      procurement: {
        ...normalized.procurement,
        status: "mutated_blocked" as const
      }
    };
    const decision = evaluateIntent(next);
    return {
      ...next,
      status: decision.allowed ? "mutated" : "policy_blocked",
      riskReason: decision.allowed ? undefined : decision.reasons.join(" "),
      events: [
        event("mutated", "Judge-edited treasury intent was checked against the pact policy.", {
          amount: input.amount,
          recipient: input.recipient
        }),
        event("policy_check", decision.allowed ? "Policy allowed the edited intent." : "Policy blocked the edited intent.", {
          allowed: decision.allowed,
          severity: decision.severity,
          reasons: decision.reasons.join(" | ")
        }),
        ...normalized.events
      ]
    };
  });
}

export async function appendDrillEvent(
  id: string,
  type: DrillEvent["type"],
  message: string,
  evidence?: DrillEvent["evidence"]
) {
  return updateDrill(id, (drill) => ({
    ...drill,
    events: [event(type, message, evidence), ...drill.events]
  }));
}

export async function resetSeed() {
  const store = { drills: [seedDrill()] };
  await writeStore(store);
  return store.drills[0];
}
