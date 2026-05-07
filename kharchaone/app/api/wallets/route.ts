import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { walletsRepo } from "@/lib/json-db";

export async function GET() {
  const userId = getSessionUserId();
  const wallets = await walletsRepo.query((w) => w.userId === userId);

  const enriched = wallets.map((w) => {
    const lastUsedDaysAgo = w.lastUsedAt ? Math.floor((Date.now() - new Date(w.lastUsedAt).getTime()) / 86400000) : 999;
    return {
      ...w,
      lastUsedDaysAgo,
      status: lastUsedDaysAgo <= 30 ? "active" : lastUsedDaysAgo >= 60 ? "dormant" : "warming",
    };
  });

  const activeTotal = enriched.filter((w) => w.status === "active").reduce((s, w) => s + w.balance, 0);
  const dormantTotal = enriched.filter((w) => w.status === "dormant").reduce((s, w) => s + w.balance, 0);

  return NextResponse.json({ wallets: enriched, activeTotal, dormantTotal });
}
