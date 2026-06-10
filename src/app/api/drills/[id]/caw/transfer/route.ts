import { NextResponse } from "next/server";
import { z } from "zod";
import { transferWithPact } from "@/lib/caw";
import { getDrill, sanitizeDrill, updateDrill } from "@/lib/store";

export const runtime = "nodejs";

const TransferSchema = z.object({
  mode: z.enum(["allowed", "denied"])
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = TransferSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const drill = await getDrill(id);
  if (!drill) return NextResponse.json({ error: "Drill not found" }, { status: 404 });

  const result = await transferWithPact(drill, parsed.data.mode);
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
    return NextResponse.json({ result, drill: updated ? sanitizeDrill(updated) : null }, { status: 200 });
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
