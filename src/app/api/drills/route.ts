import { NextResponse } from "next/server";
import { fetchAuditCounts, fetchTransactionRecord, pollPact, submitPact, transferWithPact } from "@/lib/caw";
import { evaluateIntent } from "@/lib/policy";
import {
  attachProcurementReceipt,
  getDrill,
  listDrills,
  mutateDrill,
  resetSeed,
  sanitizeDrill,
  selectProcurementQuote,
  updateDrill
} from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ drills: await listDrills() });
}

type DrillActionBody = {
  id?: string;
  action?: string;
  quoteId?: string;
  amount?: number | string;
  recipient?: string;
  mode?: "allowed" | "denied";
  pactId?: string;
  transactionHash?: string;
  auditLogUrl?: string;
  note?: string;
};

async function readActionBody(request: Request): Promise<DrillActionBody | null> {
  try {
    return (await request.json()) as DrillActionBody;
  } catch {
    return null;
  }
}

function requireString(value: unknown, label: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} is required.`);
  }
  return value.trim();
}

export async function POST(request: Request) {
  const body = await readActionBody(request);
  if (!body?.action) {
    const drill = await resetSeed();
    return NextResponse.json({ drill: sanitizeDrill(drill) }, { status: 201 });
  }

  try {
    const id = requireString(body.id, "id");

    if (body.action === "select_quote") {
      const quoteId = requireString(body.quoteId, "quoteId");
      const updated = await selectProcurementQuote(id, quoteId);
      if (!updated) return NextResponse.json({ error: "Drill not found" }, { status: 404 });
      return NextResponse.json({ drill: sanitizeDrill(updated), decision: evaluateIntent(updated) });
    }

    if (body.action === "mutate") {
      const amount = Number(body.amount);
      const recipient = requireString(body.recipient, "recipient");
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
      }
      const updated = await mutateDrill(id, { amount, recipient });
      if (!updated) return NextResponse.json({ error: "Drill not found" }, { status: 404 });
      return NextResponse.json({ drill: sanitizeDrill(updated), decision: evaluateIntent(updated) });
    }

    if (body.action === "attach_receipt") {
      const updated = await attachProcurementReceipt(id);
      if (!updated) return NextResponse.json({ error: "Drill not found" }, { status: 404 });
      return NextResponse.json({ drill: sanitizeDrill(updated) });
    }

    if (body.action === "import_evidence") {
      const updated = await updateDrill(id, (current) => ({
        ...current,
        status: "evidence_imported",
        caw: {
          ...current.caw,
          pactId: body.pactId || current.caw.pactId,
          transactionHash: body.transactionHash || current.caw.transactionHash,
          auditLogUrl: body.auditLogUrl || current.caw.auditLogUrl,
          importedByUser: true,
          evidenceSource: "operator_attested_imported",
          signatureStatus: body.transactionHash ? "signed" : current.caw.signatureStatus ?? "not_signed"
        },
        events: [
          {
            id: crypto.randomUUID(),
            type: "evidence_imported",
            at: new Date().toISOString(),
            message: body.note || "Real CAW receipt or audit evidence imported by the demo operator.",
            evidence: {
              pactId: body.pactId ?? "",
              transactionHash: body.transactionHash ?? "",
              auditLogUrl: body.auditLogUrl ?? ""
            }
          },
          ...current.events
        ]
      }));
      if (!updated) return NextResponse.json({ error: "Drill not found" }, { status: 404 });
      return NextResponse.json({ drill: sanitizeDrill(updated) });
    }

    if (body.action === "caw_pact") {
      const drill = await getDrill(id);
      if (!drill) return NextResponse.json({ error: "Drill not found" }, { status: 404 });
      const result = await submitPact(drill);
      if (!result.ok && "missing" in result) {
        const missing = result.missing ?? [];
        const message = result.message ?? "Cobo Agentic Wallet credentials are not configured.";
        const updated = await updateDrill(id, (current) => ({
          ...current,
          status: "configuration_blocked",
          caw: {
            ...current.caw,
            evidenceSource: "configuration_blocked",
            signatureStatus: "not_signed"
          },
          events: [
            {
              id: crypto.randomUUID(),
              type: "configuration_blocked",
              at: new Date().toISOString(),
              message,
              evidence: { missing: missing.join(",") }
            },
            ...current.events
          ]
        }));
        return NextResponse.json({ ...result, missing, message, drill: updated ? sanitizeDrill(updated) : null }, { status: 428 });
      }
      if (!result.ok && "payload" in result) {
        const payload = result.payload ?? {};
        const updated = await updateDrill(id, (current) => ({
          ...current,
          caw: {
            ...current.caw,
            evidenceSource: "live_caw",
            signatureStatus: "not_signed",
            denialReason: result.message
          },
          events: [
            {
              id: crypto.randomUUID(),
              type: "caw_transfer_denied",
              at: new Date().toISOString(),
              message: result.message ?? "CAW rejected the pact request.",
              evidence: {
                http: String(result.status),
                suggestion: payload.suggestion ?? "",
                requestId: payload.api_request_uuid ?? ""
              }
            },
            ...current.events
          ]
        }));
        return NextResponse.json({ result, drill: updated ? sanitizeDrill(updated) : null });
      }
      const updated = await updateDrill(id, (current) => ({
        ...current,
        status: "pact_submitted",
        caw: {
          ...current.caw,
          pactId: result.pactId,
          pactStatus: result.status,
          evidenceSource: "live_caw",
          signatureStatus: "owner_gated"
        },
        events: [
          {
            id: crypto.randomUUID(),
            type: "caw_pact_submitted",
            at: new Date().toISOString(),
            message: "CAW Pact submitted for the resource procurement order.",
            evidence: { pactId: result.pactId, status: result.status }
          },
          ...current.events
        ]
      }));
      return NextResponse.json({ result, drill: updated ? sanitizeDrill(updated) : null });
    }

    if (body.action === "caw_poll") {
      const drill = await getDrill(id);
      if (!drill) return NextResponse.json({ error: "Drill not found" }, { status: 404 });
      if (!drill.caw.pactId) {
        return NextResponse.json({ error: "Submit a CAW pact before polling." }, { status: 409 });
      }
      const result = await pollPact(drill.caw.pactId);
      if (!result.ok) {
        const updated = await updateDrill(id, (current) => ({
          ...current,
          status: "configuration_blocked",
          caw: {
            ...current.caw,
            evidenceSource: "configuration_blocked",
            signatureStatus: "not_signed"
          },
          events: [
            {
              id: crypto.randomUUID(),
              type: "configuration_blocked",
              at: new Date().toISOString(),
              message: result.message,
              evidence: { missing: result.missing.join(",") }
            },
            ...current.events
          ]
        }));
        return NextResponse.json({ ...result, drill: updated ? sanitizeDrill(updated) : null }, { status: result.status });
      }
      const updated = await updateDrill(id, (current) => ({
        ...current,
        status: result.status === "active" ? "pact_active" : current.status,
        caw: {
          ...current.caw,
          pactStatus: result.status,
          pactApiKey: result.pactApiKey ?? current.caw.pactApiKey,
          evidenceSource: "live_caw",
          signatureStatus: result.status === "active" ? "owner_gated" : current.caw.signatureStatus
        },
        events: [
          {
            id: crypto.randomUUID(),
            type: result.status === "active" ? "caw_pact_active" : "caw_pact_submitted",
            at: new Date().toISOString(),
            message: `CAW Pact status is ${result.status}.`,
            evidence: {
              pactId: current.caw.pactId ?? "",
              active: result.status === "active",
              hasPactScopedKey: Boolean(result.pactApiKey ?? current.caw.pactApiKey)
            }
          },
          ...current.events
        ]
      }));
      return NextResponse.json({ drill: updated ? sanitizeDrill(updated) : null });
    }

    if (body.action === "caw_transfer") {
      const mode = body.mode === "denied" ? "denied" : "allowed";
      const drill = await getDrill(id);
      if (!drill) return NextResponse.json({ error: "Drill not found" }, { status: 404 });
      const result = await transferWithPact(drill, mode);
      if (!result.ok && "missing" in result) {
        const missing = result.missing ?? [];
        const message = result.message ?? "Cobo Agentic Wallet credentials are not configured.";
        const updated = await updateDrill(id, (current) => ({
          ...current,
          status: "configuration_blocked",
          caw: {
            ...current.caw,
            evidenceSource: "configuration_blocked",
            signatureStatus: "not_signed"
          },
          events: [
            {
              id: crypto.randomUUID(),
              type: "configuration_blocked",
              at: new Date().toISOString(),
              message,
              evidence: { missing: missing.join(",") }
            },
            ...current.events
          ]
        }));
        return NextResponse.json({ ...result, missing, message, drill: updated ? sanitizeDrill(updated) : null }, { status: 428 });
      }
      if (!result.ok && "payload" in result) {
        const payload = result.payload ?? {};
        const updated = await updateDrill(id, (current) => ({
          ...current,
          status: "transfer_denied",
          caw: {
            ...current.caw,
            denialCode: payload.error?.code,
            denialReason: payload.error?.reason,
            denialSuggestion: payload.suggestion,
            evidenceSource: "live_caw",
            signatureStatus: "not_signed"
          },
          events: [
            {
              id: crypto.randomUUID(),
              type: "caw_transfer_denied",
              at: new Date().toISOString(),
              message: payload.error?.reason ?? "CAW policy denied the transfer.",
              evidence: {
                code: payload.error?.code ?? "",
                http: String(result.status),
                suggestion: payload.suggestion ?? ""
              }
            },
            ...current.events
          ]
        }));
        return NextResponse.json({ result, drill: updated ? sanitizeDrill(updated) : null });
      }
      if (!result.ok) return NextResponse.json(result, { status: result.status });
      const tx = result.result;
      const updated = await updateDrill(id, (current) => ({
        ...current,
        status: "transfer_allowed",
        caw: {
          ...current.caw,
          txId: tx.id,
          requestId: tx.request_id,
          transactionHash: tx.transaction_hash,
          statusDisplay: tx.status_display ?? String(tx.status),
          evidenceSource: "live_caw",
          signatureStatus: "signed"
        },
        events: [
          {
            id: crypto.randomUUID(),
            type: "caw_transfer_allowed",
            at: new Date().toISOString(),
            message: "CAW executed an allowed transfer inside the pact boundary.",
            evidence: {
              txId: tx.id ?? "",
              requestId: tx.request_id ?? "",
              transactionHash: tx.transaction_hash ?? ""
            }
          },
          ...current.events
        ]
      }));
      return NextResponse.json({ result: tx, drill: updated ? sanitizeDrill(updated) : null });
    }

    if (body.action === "caw_audit") {
      const drill = await getDrill(id);
      const result = await fetchAuditCounts();
      if (!result.ok) {
        const updated = await updateDrill(id, (current) => ({
          ...current,
          status: "configuration_blocked",
          caw: {
            ...current.caw,
            evidenceSource: "configuration_blocked",
            signatureStatus: "not_signed"
          },
          events: [
            {
              id: crypto.randomUUID(),
              type: "configuration_blocked",
              at: new Date().toISOString(),
              message: result.message,
              evidence: { missing: result.missing.join(",") }
            },
            ...current.events
          ]
        }));
        return NextResponse.json({ ...result, drill: updated ? sanitizeDrill(updated) : null }, { status: result.status });
      }
      const transaction = drill?.caw.txId ? await fetchTransactionRecord(drill.caw.txId) : null;
      const tx = transaction?.ok ? transaction.transaction : null;
      const updated = await updateDrill(id, (current) => ({
        ...current,
        caw: {
          ...current.caw,
          auditAllowedCount: result.allowed,
          auditDeniedCount: result.denied,
          transactionHash: tx?.transaction_hash ?? current.caw.transactionHash,
          requestId: tx?.request_id ?? current.caw.requestId,
          statusDisplay: tx?.status_display ?? tx?.sub_status ?? (tx?.status ? String(tx.status) : current.caw.statusDisplay),
          evidenceSource: "live_caw"
        },
        events: [
          {
            id: crypto.randomUUID(),
            type: "caw_audit_synced",
            at: new Date().toISOString(),
            message: "CAW audit log counts synced from the wallet.",
            evidence: {
              allowed: result.allowed,
              denied: result.denied,
              total: result.total,
              txHash: tx?.transaction_hash ?? "",
              txStatus: tx?.status_display ?? tx?.sub_status ?? (tx?.status ? String(tx.status) : "")
            }
          },
          ...current.events
        ]
      }));
      return NextResponse.json({ result, drill: updated ? sanitizeDrill(updated) : null });
    }

    return NextResponse.json({ error: `Unknown drill action: ${body.action}` }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Drill action failed." }, { status: 400 });
  }
}
