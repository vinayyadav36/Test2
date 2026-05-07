import { NextResponse } from "next/server";
import { addMonths } from "date-fns";
import { getSessionUserId } from "@/lib/auth";
import { subscriptionsRepo, transactionsRepo } from "@/lib/json-db";
import { detectSubscriptions } from "@/lib/subscription-detector";

export async function GET() {
  const userId = getSessionUserId();
  const [subscriptions, transactions] = await Promise.all([
    subscriptionsRepo.query((s) => s.userId === userId),
    transactionsRepo.query((t) => t.userId === userId),
  ]);

  const inferred = detectSubscriptions(transactions);
  const totalMonthly = subscriptions.filter((s) => s.isActive && s.frequency === "monthly").reduce((sum, sub) => sum + sub.amount, 0);

  const forecast = Array.from({ length: 12 }).map((_, i) => {
    const month = addMonths(new Date(), i).toISOString().slice(0, 7);
    return {
      month,
      total: subscriptions.filter((s) => s.isActive).reduce((sum, sub) => sum + sub.amount, 0),
    };
  });

  return NextResponse.json({ subscriptions, inferred, totalMonthly, annualEstimate: totalMonthly * 12, forecast });
}
