import { Budget, CashbackReward, Goal, MonthlyAnalytics, NormalizedTransaction, Subscription, WalletBalance } from "@/types";
import { format } from "date-fns";

export interface DashboardInsights {
  totalSpend: number;
  totalIncome: number;
  unknownCount: number;
  topCategories: Array<{ category: string; total: number }>;
  monthlyTrend: Array<{ month: string; spend: number; income: number }>;
  recentTransactions: NormalizedTransaction[];
  smallUpi: {
    threshold: number;
    count: number;
    total: number;
    byDayHour: Array<{ day: string; hour: number; total: number; count: number }>;
    whatIf20Pct: number;
  };
  budgets: Array<{ category: string; spent: number; limitAmount: number; pct: number; over: boolean }>;
  goals: Array<{ name: string; targetAmount: number; currentAmount: number; monthlySuggested: number }>;
  forecastNextMonth: number;
}

export function computeInsights(transactions: NormalizedTransaction[], budgets: Budget[], goals: Goal[], smallUpiThreshold: number): DashboardInsights {
  const now = new Date();
  const currentMonth = format(now, "yyyy-MM");

  const monthTxns = transactions.filter((t) => format(new Date(t.date), "yyyy-MM") === currentMonth);
  const totalSpend = monthTxns.filter((t) => t.direction === "debit").reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalIncome = monthTxns.filter((t) => t.direction === "credit").reduce((s, t) => s + Math.abs(t.amount), 0);

  const unknownCount = transactions.filter((t) => t.category === "Unknown" || t.confidence < 0.5).length;

  const categoryTotals: Record<string, number> = {};
  monthTxns.filter((t) => t.direction === "debit").forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
  });

  const topCategories = Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const monthlyMap: Record<string, { spend: number; income: number }> = {};
  transactions.forEach((t) => {
    const key = format(new Date(t.date), "yyyy-MM");
    if (!monthlyMap[key]) monthlyMap[key] = { spend: 0, income: 0 };
    if (t.direction === "debit") monthlyMap[key].spend += Math.abs(t.amount);
    else monthlyMap[key].income += Math.abs(t.amount);
  });

  const monthlyTrend = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, value]) => ({ month, ...value }));

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const small = monthTxns.filter((t) => t.source === "UPI" && t.direction === "debit" && Math.abs(t.amount) <= smallUpiThreshold);
  const byDayHourMap = new Map<string, { day: string; hour: number; total: number; count: number }>();
  small.forEach((txn) => {
    const date = new Date(txn.date);
    const day = format(date, "EEE");
    const hour = date.getHours();
    const key = `${day}-${hour}`;
    const prev = byDayHourMap.get(key) ?? { day, hour, total: 0, count: 0 };
    byDayHourMap.set(key, { day, hour, total: prev.total + Math.abs(txn.amount), count: prev.count + 1 });
  });

  const smallTotal = small.reduce((s, t) => s + Math.abs(t.amount), 0);

  const budgetProgress = budgets.filter((b) => b.month === currentMonth).map((budget) => {
    const spent = monthTxns
      .filter((t) => t.direction === "debit" && t.category === budget.category)
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const pct = budget.limitAmount > 0 ? Math.round((spent / budget.limitAmount) * 100) : 0;
    return { category: budget.category, spent, limitAmount: budget.limitAmount, pct, over: spent > budget.limitAmount };
  });

  const surplus = Math.max(0, totalIncome - totalSpend);
  const activeGoals = goals.filter((g) => g.isActive).map((goal) => {
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    return {
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      monthlySuggested: Number(Math.min(remaining, surplus).toFixed(0)),
    };
  });

  const recent3 = monthlyTrend.slice(-3).map((m) => m.spend);
  const forecastNextMonth = recent3.length ? Number((recent3.reduce((a, b) => a + b, 0) / recent3.length).toFixed(0)) : 0;

  return {
    totalSpend,
    totalIncome,
    unknownCount,
    topCategories,
    monthlyTrend,
    recentTransactions,
    smallUpi: {
      threshold: smallUpiThreshold,
      count: small.length,
      total: smallTotal,
      byDayHour: Array.from(byDayHourMap.values()),
      whatIf20Pct: Number((smallTotal * 0.2).toFixed(0)),
    },
    budgets: budgetProgress,
    goals: activeGoals,
    forecastNextMonth,
  };
}

function hourBucket(hour: number): string {
  const start = Math.floor(hour / 4) * 4;
  const end = start + 3;
  return `${String(start).padStart(2, "0")}-${String(end).padStart(2, "0")}`;
}

export function buildMonthlyAnalytics(
  userId: string,
  month: string,
  transactions: NormalizedTransaction[],
  cashback: CashbackReward[],
  wallets: WalletBalance[],
  subscriptions: Subscription[],
  smallUpiThreshold = 200
): MonthlyAnalytics {
  const now = new Date().toISOString();
  const monthTransactions = transactions.filter((t) => format(new Date(t.date), "yyyy-MM") === month);
  const totalIncome = monthTransactions.filter((t) => t.direction === "credit").reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalExpense = monthTransactions.filter((t) => t.direction === "debit").reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netSavings = totalIncome - totalExpense;

  const byCategoryMap = new Map<string, number>();
  monthTransactions
    .filter((t) => t.direction === "debit")
    .forEach((t) => byCategoryMap.set(t.category, (byCategoryMap.get(t.category) ?? 0) + Math.abs(t.amount)));

  const smallTxns = monthTransactions.filter(
    (t) =>
      t.direction === "debit" &&
      (t.sourceType ?? t.source) === "UPI" &&
      Math.abs(t.amount) <= smallUpiThreshold
  );

  const byDay = new Map<string, { day: string; count: number; total: number }>();
  const byHour = new Map<string, { hour: string; count: number; total: number }>();
  smallTxns.forEach((t) => {
    const dt = new Date(t.date);
    const day = format(dt, "EEE");
    const bucket = hourBucket(dt.getHours());
    byDay.set(day, { day, count: (byDay.get(day)?.count ?? 0) + 1, total: (byDay.get(day)?.total ?? 0) + Math.abs(t.amount) });
    byHour.set(bucket, { hour: bucket, count: (byHour.get(bucket)?.count ?? 0) + 1, total: (byHour.get(bucket)?.total ?? 0) + Math.abs(t.amount) });
  });

  const cashbackSummary = cashback.reduce(
    (acc, item) => {
      acc[item.status] += item.amount;
      return acc;
    },
    { earned: 0, pending: 0, claimed: 0, expired: 0 }
  );

  const walletFloat = wallets.reduce(
    (acc, wallet) => {
      const lastActivity = wallet.lastActivityAt ?? wallet.lastUsedAt;
      const derivedActive = lastActivity ? (Date.now() - new Date(lastActivity).getTime()) / 86400000 <= 30 : false;
      const isActive = wallet.status ? wallet.status === "active" : derivedActive;
      if (isActive) acc.activeTotal += wallet.balance;
      else acc.dormantTotal += wallet.balance;
      return acc;
    },
    { activeTotal: 0, dormantTotal: 0 }
  );

  const subscriptionCostMonthly = subscriptions
    .filter((s) => s.isActive || s.active)
    .reduce((sum, s) => {
      const cycle = s.cycle ?? s.frequency;
      const amount = s.averageAmount ?? s.amount;
      if (cycle === "yearly") return sum + amount / 12;
      if (cycle === "quarterly") return sum + amount / 3;
      return sum + amount;
    }, 0);

  return {
    id: `an_${month}_${userId}`,
    userId,
    month,
    totalIncome,
    totalExpense,
    netSavings,
    byCategory: Array.from(byCategoryMap.entries()).map(([category, amount]) => ({ category, amount })),
    smallUpiStats: {
      threshold: smallUpiThreshold,
      count: smallTxns.length,
      total: smallTxns.reduce((sum, t) => sum + Math.abs(t.amount), 0),
      byDayOfWeek: Array.from(byDay.values()),
      byHourBucket: Array.from(byHour.values()),
    },
    cashbackSummary,
    walletFloat,
    subscriptionCostMonthly,
    createdAt: now,
    updatedAt: now,
  };
}
