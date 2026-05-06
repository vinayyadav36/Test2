"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpendChart } from "@/components/dashboard/spend-chart";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { UnknownTransactions } from "@/components/dashboard/unknown-transactions";
import { WalletSummary } from "@/components/dashboard/wallet-summary";
import { CashbackSummary } from "@/components/dashboard/cashback-summary";
import { SubscriptionsSummary } from "@/components/dashboard/subscriptions-summary";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { IndianRupee, TrendingDown, AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </AppShell>
    );
  }

  const {
    totalSpend, totalIncome, unknownCount, topCategories, monthlyTrend,
    wallets, rewards, subscriptions, totalPendingCashback, totalMonthlySubscriptions,
    transactions,
  } = data;

  return (
    <AppShell>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Monthly Spend"
          value={formatCurrency(totalSpend ?? 0)}
          trend={8}
          icon={<IndianRupee className="w-5 h-5" />}
        />
        <KpiCard
          title="Monthly Income"
          value={formatCurrency(totalIncome ?? 0)}
          icon={<TrendingDown className="w-5 h-5" />}
        />
        <KpiCard
          title="Needs Review"
          value={String(unknownCount ?? 0)}
          subtext="uncategorised transactions"
          icon={<AlertCircle className="w-5 h-5" />}
        />
        <KpiCard
          title="Subscriptions"
          value={formatCurrency(totalMonthlySubscriptions ?? 0)}
          subtext="per month"
          icon={<RefreshCw className="w-5 h-5" />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SpendChart data={monthlyTrend ?? []} />
        <CategoryBreakdown data={topCategories ?? []} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <UnknownTransactions transactions={data.recentTransactions ?? []} />
        <WalletSummary wallets={(wallets ?? []).map((w: any) => ({ ...w, lastUsedDaysAgo: w.lastUsedDaysAgo ?? 0 }))} />
        <div className="space-y-4">
          <CashbackSummary rewards={rewards ?? []} totalPending={totalPendingCashback ?? 0} />
          <SubscriptionsSummary subscriptions={subscriptions ?? []} totalMonthly={totalMonthlySubscriptions ?? 0} />
        </div>
      </div>
    </AppShell>
  );
}
