import { buildCawPactSpec } from "@/lib/policy";
import type { TreasuryDrill } from "@/lib/types";
import type { TransferSubmitResult } from "@cobo/agentic-wallet";

type ApiErrorPayload = {
  error?: { code?: string; reason?: string; details?: Record<string, string> };
  suggestion?: string;
  api_request_uuid?: string;
};

type TransactionRecordPayload = {
  result?: {
    id?: string;
    request_id?: string;
    transaction_hash?: string | null;
    status?: number | string;
    status_display?: string;
    sub_status?: string;
  };
  error?: ApiErrorPayload["error"];
  suggestion?: string;
};

export function getCawConfig() {
  const config = {
    basePath: process.env.AGENT_WALLET_API_URL,
    apiKey: process.env.AGENT_WALLET_API_KEY,
    walletId: process.env.AGENT_WALLET_WALLET_ID
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) =>
      key === "basePath"
        ? "AGENT_WALLET_API_URL"
        : key === "apiKey"
          ? "AGENT_WALLET_API_KEY"
          : "AGENT_WALLET_WALLET_ID"
    );

  return {
    ...config,
    ready: missing.length === 0,
    missing
  };
}

export function getCawTransferConfig() {
  const config = getCawConfig();
  const sourceAddress = process.env.CAW_SOURCE_ADDRESS;
  const missing = [...config.missing, ...(sourceAddress ? [] : ["CAW_SOURCE_ADDRESS"])];

  return {
    ...config,
    sourceAddress,
    ready: missing.length === 0,
    missing
  };
}

export function parseApiError(error: unknown): { http: number | string; payload: ApiErrorPayload } {
  const response = (error as { response?: { status?: number; data?: unknown } }).response;
  const data = response?.data;
  return {
    http: response?.status ?? "-",
    payload: data && typeof data === "object" ? (data as ApiErrorPayload) : {}
  };
}

export async function submitPact(drill: TreasuryDrill) {
  const config = getCawConfig();
  if (!config.ready) {
    return {
      ok: false as const,
      status: 428,
      missing: config.missing,
      message: "Cobo Agentic Wallet credentials are not configured."
    };
  }

  const { Configuration, PactsApi } = await import("@cobo/agentic-wallet");
  const pactsApi = new PactsApi(
    new Configuration({
      apiKey: config.apiKey,
      basePath: config.basePath
    })
  );

  try {
    const response = await pactsApi.submitPact({
      wallet_id: config.walletId!,
      intent: `Resource Procurement: ${drill.purpose}`,
      spec: buildCawPactSpec(drill)
    });

    const result = response.data.result as { pact_id: string; status?: string };
    return {
      ok: true as const,
      pactId: result.pact_id,
      status: result.status ?? "submitted"
    };
  } catch (error) {
    const parsed = parseApiError(error);
    return {
      ok: false as const,
      status: parsed.http,
      payload: parsed.payload,
      message: parsed.payload.error?.reason ?? parsed.payload.suggestion ?? "Cobo Agentic Wallet rejected the pact request."
    };
  }
}

export async function pollPact(pactId: string) {
  const config = getCawConfig();
  if (!config.ready) {
    return {
      ok: false as const,
      status: 428,
      missing: config.missing,
      message: "Cobo Agentic Wallet credentials are not configured."
    };
  }

  const { Configuration, PactsApi } = await import("@cobo/agentic-wallet");
  const pactsApi = new PactsApi(
    new Configuration({
      apiKey: config.apiKey,
      basePath: config.basePath
    })
  );

  const response = await pactsApi.getPact(pactId);
  const result = response.data.result as { status?: string; api_key?: string };
  return {
    ok: true as const,
    status: result.status ?? "unknown",
    pactApiKey: result.api_key
  };
}

export async function sendTransactionWithCawPact(drill: TreasuryDrill, mode: "allowed" | "denied") {
  const config = getCawTransferConfig();
  if (!config.ready) {
    return {
      ok: false as const,
      status: 428,
      missing: config.missing,
      message: "Cobo Agentic Wallet credentials are not configured."
    };
  }

  if (!drill.caw.pactApiKey) {
    return {
      ok: false as const,
      status: 409,
      message: "The CAW pact is not active yet. Poll owner approval before transfer execution."
    };
  }

  const deniedAmount = Math.max(drill.amount, drill.policy.maxAmount + 0.003).toString();
  const deniedRecipient =
    drill.policy.denylistedRecipients.find((address) => address !== "0x0000000000000000000000000000000000000000") ??
    drill.recipient;
  const amount = mode === "allowed" ? Math.min(drill.originalAmount, drill.policy.maxAmount).toString() : deniedAmount;
  const recipient = mode === "allowed" ? drill.originalRecipient : deniedRecipient;
  const { Configuration, TransactionsApi } = await import("@cobo/agentic-wallet");
  const txApi = new TransactionsApi(
    new Configuration({
      apiKey: drill.caw.pactApiKey,
      basePath: config.basePath
    })
  );

  try {
    const response = await txApi.transferTokens(config.walletId!, {
      chain_id: drill.policy.chainId,
      src_addr: config.sourceAddress!,
      dst_addr: recipient,
      token_id: drill.policy.tokenId,
      amount
    });
    const result: TransferSubmitResult = response.data.result;

    return {
      ok: true as const,
      result
    };
  } catch (error) {
    const parsed = parseApiError(error);
    return {
      ok: false as const,
      status: parsed.http,
      payload: parsed.payload
    };
  }
}

export const transferWithPact = sendTransactionWithCawPact;

export async function fetchTransactionRecord(txId: string) {
  const config = getCawConfig();
  if (!config.ready) {
    return {
      ok: false as const,
      status: 428,
      missing: config.missing,
      message: "Cobo Agentic Wallet credentials are not configured."
    };
  }

  const url = new URL(`/api/v1/wallets/${config.walletId}/transactions/${txId}`, config.basePath);
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "X-API-Key": config.apiKey!
    }
  });
  const payload = (await response.json()) as TransactionRecordPayload;
  if (!response.ok || !payload.result) {
    return {
      ok: false as const,
      status: response.status,
      payload,
      message: payload.error?.reason ?? payload.suggestion ?? "Unable to fetch CAW transaction status."
    };
  }

  return {
    ok: true as const,
    transaction: payload.result
  };
}

export async function fetchAuditCounts() {
  const config = getCawConfig();
  if (!config.ready) {
    return {
      ok: false as const,
      status: 428,
      missing: config.missing,
      message: "Cobo Agentic Wallet credentials are not configured."
    };
  }

  const { AuditApi, Configuration } = await import("@cobo/agentic-wallet");
  const auditApi = new AuditApi(
    new Configuration({
      apiKey: config.apiKey,
      basePath: config.basePath
    })
  );

  const response = await auditApi.listAuditLogs(
    config.walletId!,
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
  const items = (response.data.result as { items?: Array<{ result?: string }> }).items ?? [];
  return {
    ok: true as const,
    allowed: items.filter((item) => item.result === "allowed").length,
    denied: items.filter((item) => item.result === "denied").length,
    total: items.length
  };
}
