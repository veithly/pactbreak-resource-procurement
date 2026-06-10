import { NextResponse } from "next/server";
import { submitPact } from "@/lib/caw";
import { getDrill, sanitizeDrill, updateDrill } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
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
    return NextResponse.json({ result, drill: updated ? sanitizeDrill(updated) : null }, { status: 200 });
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
        message: "CAW Pact submitted for owner approval.",
        evidence: {
          pactId: result.pactId,
          status: result.status
        }
      },
      ...current.events
    ]
  }));

  return NextResponse.json({ drill: updated ? sanitizeDrill(updated) : null });
}
