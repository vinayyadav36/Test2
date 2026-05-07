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
import { IndianRupee, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NormalizedTransaction } from "@/types";

type DashboardData = {
  totalSpend: number;
  totalIncome: number;
  unknownCount: number;
  topCategories: { category: string; total: number }[];
  monthlyTrend: { month: string; spend: number; income: number }[];
  wallets: Array<{ id: string; name: string; balance: number; lastUsedDaysAgo?: number }>;
  rewards: Array<{ id: string; sourceName: string; amount: number; expiresAt?: string | null; status: string; earnedAt: string; description?: string }>;
  subscriptions: Array<{ id: string; merchant: string; amount: number; isActive: boolean }>;
  totalPendingCashback: number;
  totalMonthlySubscriptions: number;
  recentTransactions: NormalizedTransaction[];
  smallUpi: { count: number; total: number; threshold: number; whatIf20Pct: number };
  forecastNextMonth: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <AppShell>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Monthly Spend" value={formatCurrency(data.totalSpend)} icon={<IndianRupee className="w-5 h-5" />} />
        <KpiCard title="Monthly Income" value={formatCurrency(data.totalIncome)} icon={<TrendingUp className="w-5 h-5" />} />
        <KpiCard title="Needs Review" value={String(data.unknownCount)} subtext="uncategorised transactions" icon={<AlertCircle className="w-5 h-5" />} />
        <KpiCard title="Subscriptions" value={formatCurrency(data.totalMonthlySubscriptions)} subtext="per month" icon={<RefreshCw className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SpendChart data={data.monthlyTrend} />
        <CategoryBreakdown data={data.topCategories} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Small UPI spends</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{data.smallUpi.count} payments under ₹{data.smallUpi.threshold} this month</p>
            <p className="font-semibold">Total: {formatCurrency(data.smallUpi.total)}</p>
            <p className="text-muted-foreground">If reduced by 20%, you free {formatCurrency(data.smallUpi.whatIf20Pct)}.</p>
            <p className="text-muted-foreground">Next month forecast: {formatCurrency(data.forecastNextMonth)}</p>
          </CardContent>
        </Card>
        <UnknownTransactions transactions={data.recentTransactions ?? []} />
        <WalletSummary wallets={data.wallets ?? []} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CashbackSummary rewards={data.rewards.map((r) => ({ ...r, source: r.sourceName }))} totalPending={data.totalPendingCashback} />
        <SubscriptionsSummary subscriptions={data.subscriptions} totalMonthly={data.totalMonthlySubscriptions} />
      </div>
    </AppShell>
  );
}
