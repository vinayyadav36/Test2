import { NextResponse } from "next/server";
import { format } from "date-fns";
import { getSessionUserId } from "@/lib/auth";
import { anomaliesRepo, analyticsRepo, budgetsRepo, goalsRepo, rewardsRepo, subscriptionsRepo, transactionsRepo, usersRepo, walletsRepo } from "@/lib/json-db";
import { computeInsights } from "@/lib/insight-engine";
import { computeCashbackSummary } from "@/lib/cashback-engine";
import { buildTransactionIndexes } from "@/lib/json-db/transaction-index";
import { recomputeCurrentMonthArtifacts } from "@/lib/monthly-maintenance";

export async function GET() {
  const userId = getSessionUserId();
  const month = format(new Date(), "yyyy-MM");

  await recomputeCurrentMonthArtifacts(userId);

  const [transactions, rewards, wallets, subscriptions, budgets, goals, user, analyticsDoc, anomalies] = await Promise.all([
    transactionsRepo.query((t) => t.userId === userId),
    rewardsRepo.query((r) => r.userId === userId),
    walletsRepo.query((w) => w.userId === userId),
    subscriptionsRepo.query((s) => s.userId === userId),
    budgetsRepo.query((b) => b.userId === userId),
    goalsRepo.query((g) => g.userId === userId),
    usersRepo.getById(userId),
    analyticsRepo.getById(`an_${month}_${userId}`),
    anomaliesRepo.query((a) => a.userId === userId && a.status === "unread"),
  ]);

  const indexes = buildTransactionIndexes(transactions);
  const ids = indexes.byUser.get(userId) ?? [];
  const scopedTransactions = ids
    .map((id) => indexes.byId.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const insights = computeInsights(scopedTransactions, budgets, goals, user?.smallUpiThreshold ?? 200);
  const cashback = computeCashbackSummary(rewards);

  const walletsWithIdle = wallets.map((w) => {
    const lastUsedDaysAgo = w.lastUsedAt ? Math.floor((Date.now() - new Date(w.lastUsedAt).getTime()) / 86400000) : 999;
    return { ...w, lastUsedDaysAgo };
  });

  return NextResponse.json({
    ...insights,
    monthlyAnalytics: analyticsDoc,
    rewards,
    wallets: walletsWithIdle,
    subscriptions,
    cashback,
    attentionCount: anomalies.length,
    topGoals: goals.slice(0, 3),
    totalPendingCashback: cashback.totalPending,
    totalMonthlySubscriptions: subscriptions.filter((s) => s.isActive || s.active).reduce((sum, s) => sum + (s.averageAmount ?? s.amount), 0),
  });
}
