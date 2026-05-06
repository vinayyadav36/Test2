import { NextResponse } from "next/server";
import { DEMO_TRANSACTIONS, DEMO_WALLETS, DEMO_REWARDS, DEMO_SUBSCRIPTIONS } from "@/lib/demo-data";
import { computeInsights } from "@/lib/insight-engine";

export async function GET() {
  const insights = computeInsights(DEMO_TRANSACTIONS);
  const totalPendingCashback = DEMO_REWARDS.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const totalMonthlySubscriptions = DEMO_SUBSCRIPTIONS.filter((s) => s.isActive).reduce((s, sub) => s + sub.amount, 0);

  return NextResponse.json({
    ...insights,
    wallets: DEMO_WALLETS,
    rewards: DEMO_REWARDS,
    subscriptions: DEMO_SUBSCRIPTIONS,
    totalPendingCashback,
    totalMonthlySubscriptions,
  });
}
