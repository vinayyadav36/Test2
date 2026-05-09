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
  const totalMonthly = subscriptions
    .filter((s) => s.isActive || s.active)
    .reduce((sum, sub) => {
      const frequency = sub.cycle ?? sub.frequency;
      const amount = sub.averageAmount ?? sub.amount;
      if (frequency === "yearly") return sum + amount / 12;
      if (frequency === "quarterly") return sum + amount / 3;
      return sum + amount;
    }, 0);

  const forecast = Array.from({ length: 12 }).map((_, i) => {
    const month = addMonths(new Date(), i).toISOString().slice(0, 7);
    return {
      month,
      total: totalMonthly,
    };
  });

  return NextResponse.json({
    subscriptions: subscriptions.map((s) => ({ ...s, redundancyFlag: s.redundancyFlag ?? /ott|stream|netflix|prime|hotstar|spotify/i.test(s.merchant) })),
    inferred,
    totalMonthly,
    annualEstimate: totalMonthly * 12,
    forecast,
  });
}
