import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateIntent } from "@/lib/policy";
import { sanitizeDrill, selectProcurementQuote } from "@/lib/store";

export const runtime = "nodejs";

const SelectQuoteSchema = z.object({
  quoteId: z.string().min(1)
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = SelectQuoteSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await selectProcurementQuote(id, parsed.data.quoteId);
  if (!updated) return NextResponse.json({ error: "Drill not found" }, { status: 404 });

  return NextResponse.json({
    drill: sanitizeDrill(updated),
    decision: evaluateIntent(updated)
  });
}
