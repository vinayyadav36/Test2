import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { walletsRepo } from "@/lib/json-db";

const updateSchema = z.object({
  id: z.string(),
  balance: z.number().optional(),
  lastActivityAt: z.string().optional(),
  status: z.enum(["active", "dormant"]).optional(),
});

export async function GET() {
  const userId = getSessionUserId();
  const wallets = await walletsRepo.query((w) => w.userId === userId);

  const enriched = wallets.map((w) => {
    const lastActivity = w.lastActivityAt ?? w.lastUsedAt;
    const lastUsedDaysAgo = lastActivity ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / 86400000) : 999;
    const derivedStatus = lastUsedDaysAgo <= 30 ? "active" : "dormant";
    return {
      ...w,
      name: w.walletName ?? w.name,
      lastUsedDaysAgo,
      status: w.status ?? derivedStatus,
    };
  });

  const activeTotal = enriched.filter((w) => w.status === "active").reduce((s, w) => s + w.balance, 0);
  const dormantTotal = enriched.filter((w) => w.status === "dormant").reduce((s, w) => s + w.balance, 0);

  return NextResponse.json({ wallets: enriched, activeTotal, dormantTotal });
}

export async function PUT(req: Request) {
  const userId = getSessionUserId();
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updated = await walletsRepo.update(parsed.data.id, parsed.data);
  if (!updated || updated.userId !== userId) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
  return NextResponse.json({ wallet: updated });
}
