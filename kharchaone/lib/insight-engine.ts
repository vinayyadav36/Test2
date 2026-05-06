import { NormalizedTransaction } from "@/types";

export interface DashboardInsights {
  totalSpentThisMonth: number;
  totalIncomeThisMonth: number;
  unknownTransactionsCount: number;
  topCategories: Array<{ category: string; total: number }>;
  monthlySpendTrend: Array<{ month: string; debit: number; credit: number }>;
  recentUnclearTransactions: NormalizedTransaction[];
}

export function computeInsights(transactions: NormalizedTransaction[]): DashboardInsights {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const thisMonthTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const totalSpentThisMonth = thisMonthTxns
    .filter((t) => t.direction === "debit")
    .reduce((s, t) => s + t.amount, 0);

  const totalIncomeThisMonth = thisMonthTxns
    .filter((t) => t.direction === "credit")
    .reduce((s, t) => s + t.amount, 0);

  const unknownTransactionsCount = transactions.filter(
    (t) => t.category === "Unknown" || t.confidence < 0.5
  ).length;

  const categoryTotals: Record<string, number> = {};
  for (const t of thisMonthTxns.filter((t) => t.direction === "debit")) {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  }
  const topCategories = Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const monthlyMap: Record<string, { debit: number; credit: number }> = {};
  for (const t of transactions) {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyMap[key]) monthlyMap[key] = { debit: 0, credit: 0 };
    if (t.direction === "debit") monthlyMap[key].debit += t.amount;
    else monthlyMap[key].credit += t.amount;
  }
  const monthlySpendTrend = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({ month, ...data }));

  const recentUnclearTransactions = transactions
    .filter((t) => t.category === "Unknown" || t.confidence < 0.5)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return {
    totalSpentThisMonth,
    totalIncomeThisMonth,
    unknownTransactionsCount,
    topCategories,
    monthlySpendTrend,
    recentUnclearTransactions,
  };
}
