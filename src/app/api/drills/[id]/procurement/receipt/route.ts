import { NextResponse } from "next/server";
import { attachProcurementReceipt, sanitizeDrill } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const updated = await attachProcurementReceipt(id);
  if (!updated) return NextResponse.json({ error: "Drill not found" }, { status: 404 });

  return NextResponse.json({ drill: sanitizeDrill(updated) });
}
