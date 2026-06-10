import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateIntent } from "@/lib/policy";
import { mutateDrill, sanitizeDrill } from "@/lib/store";

export const runtime = "nodejs";

const MutationSchema = z.object({
  amount: z.coerce.number().positive(),
  recipient: z.string().min(1)
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = MutationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await mutateDrill(id, parsed.data);
  if (!updated) return NextResponse.json({ error: "Drill not found" }, { status: 404 });
  const decision = evaluateIntent(updated);
  return NextResponse.json({ drill: sanitizeDrill(updated), decision });
}
