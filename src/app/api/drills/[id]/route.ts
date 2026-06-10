import { NextResponse } from "next/server";
import { getPublicDrill } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const drill = await getPublicDrill(id);
  if (!drill) return NextResponse.json({ error: "Drill not found" }, { status: 404 });
  return NextResponse.json({ drill });
}
