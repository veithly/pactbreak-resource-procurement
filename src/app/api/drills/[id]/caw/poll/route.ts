import { NextResponse } from "next/server";
import { pollPact } from "@/lib/caw";
import { appendDrillEvent, getDrill, sanitizeDrill, updateDrill } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
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
