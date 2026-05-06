import { NextResponse } from "next/server";
import { DEMO_TRANSACTIONS } from "@/lib/demo-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const source = searchParams.get("source");
  const q = searchParams.get("q")?.toLowerCase();

  let txns = [...DEMO_TRANSACTIONS];

  if (category && category !== "all") {
    txns = txns.filter((t) => t.category === category);
  }
  if (source && source !== "all") {
    txns = txns.filter((t) => t.source === source);
  }
  if (q) {
    txns = txns.filter((t) => t.merchant.toLowerCase().includes(q) || t.note?.toLowerCase().includes(q));
  }

  txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ transactions: txns, total: txns.length });
}
