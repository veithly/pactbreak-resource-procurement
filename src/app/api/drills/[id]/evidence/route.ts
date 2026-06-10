import { NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeDrill, updateDrill } from "@/lib/store";

export const runtime = "nodejs";

const EvidenceSchema = z.object({
  pactId: z.string().optional(),
  transactionHash: z.string().optional(),
  auditLogUrl: z.string().url().optional(),
  note: z.string().max(500).optional()
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = EvidenceSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await updateDrill(id, (current) => ({
    ...current,
    status: "evidence_imported",
    caw: {
      ...current.caw,
      pactId: parsed.data.pactId || current.caw.pactId,
      transactionHash: parsed.data.transactionHash || current.caw.transactionHash,
      auditLogUrl: parsed.data.auditLogUrl || current.caw.auditLogUrl,
      importedByUser: true,
      evidenceSource: "operator_attested_imported",
      signatureStatus: parsed.data.transactionHash ? "signed" : current.caw.signatureStatus ?? "not_signed"
    },
    events: [
      {
        id: crypto.randomUUID(),
        type: "evidence_imported",
        at: new Date().toISOString(),
        message: parsed.data.note || "Real CAW receipt or audit evidence imported by the demo operator.",
        evidence: {
          pactId: parsed.data.pactId ?? "",
          transactionHash: parsed.data.transactionHash ?? "",
          auditLogUrl: parsed.data.auditLogUrl ?? ""
        }
      },
      ...current.events
    ]
  }));

  if (!updated) return NextResponse.json({ error: "Drill not found" }, { status: 404 });
  return NextResponse.json({ drill: sanitizeDrill(updated) });
}
