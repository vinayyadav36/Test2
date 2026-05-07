import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { transactionsRepo } from "@/lib/json-db";

const querySchema = z.object({
  category: z.string().optional(),
  source: z.string().optional(),
  q: z.string().optional(),
});

export async function GET(req: Request) {
  const userId = getSessionUserId();
  const { searchParams } = new URL(req.url);

  const parsed = querySchema.safeParse({
    category: searchParams.get("category") ?? undefined,
    source: searchParams.get("source") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
  }

  let txns = await transactionsRepo.query((t) => t.userId === userId);
  const { category, source, q } = parsed.data;

  if (category && category !== "all") txns = txns.filter((t) => t.category === category);
  if (source && source !== "all") txns = txns.filter((t) => t.source === source);
  if (q) {
    const needle = q.toLowerCase();
    txns = txns.filter((t) => t.merchant.toLowerCase().includes(needle) || (t.note ?? "").toLowerCase().includes(needle));
  }

  txns = txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ transactions: txns, total: txns.length });
}
