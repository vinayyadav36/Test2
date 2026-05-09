import { format } from "date-fns";
import { buildMonthlyAnalytics } from "@/lib/insight-engine";
import { analyticsRepo, budgetsRepo, rewardsRepo, subscriptionsRepo, transactionsRepo, usersRepo, walletsRepo } from "@/lib/json-db";

export async function recomputeBudgetsForMonth(userId: string, month: string): Promise<void> {
  const [budgets, transactions] = await Promise.all([
    budgetsRepo.query((b) => b.userId === userId && b.month === month),
    transactionsRepo.query((t) => t.userId === userId && format(new Date(t.date), "yyyy-MM") === month),
  ]);

  await Promise.all(
    budgets.map(async (budget) => {
      const spentAmount = transactions
        .filter((t) => t.direction === "debit" && t.category === budget.category)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const remainingAmount = budget.limitAmount - spentAmount;
      const thresholdNearRatio = budget.thresholdNearRatio ?? 0.8;
      const ratio = budget.limitAmount > 0 ? spentAmount / budget.limitAmount : 0;
      const status = ratio >= 1 ? "over" : ratio >= thresholdNearRatio ? "near" : "under";

      await budgetsRepo.update(budget.id, {
        spentAmount,
        remainingAmount,
        thresholdNearRatio,
        status,
      });
    })
  );
}

export async function recomputeMonthlyAnalytics(userId: string, month: string): Promise<void> {
  const [transactions, rewards, wallets, subscriptions, user] = await Promise.all([
    transactionsRepo.query((t) => t.userId === userId),
    rewardsRepo.query((r) => r.userId === userId),
    walletsRepo.query((w) => w.userId === userId),
    subscriptionsRepo.query((s) => s.userId === userId),
    usersRepo.getById(userId),
  ]);

  const analytics = buildMonthlyAnalytics(
    userId,
    month,
    transactions,
    rewards,
    wallets,
    subscriptions,
    user?.smallUpiThreshold ?? 200
  );

  const existing = await analyticsRepo.getById(analytics.id);
  if (existing) {
    await analyticsRepo.update(existing.id, analytics);
  } else {
    await analyticsRepo.replaceAll([...(await analyticsRepo.getAll()), analytics]);
  }
}

export async function recomputeCurrentMonthArtifacts(userId: string): Promise<void> {
  const month = format(new Date(), "yyyy-MM");
  await recomputeBudgetsForMonth(userId, month);
  await recomputeMonthlyAnalytics(userId, month);
}
