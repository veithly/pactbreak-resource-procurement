import { NextResponse } from "next/server";
import { fetchAuditCounts, fetchTransactionRecord } from "@/lib/caw";
import { getDrill, sanitizeDrill, updateDrill } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
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
