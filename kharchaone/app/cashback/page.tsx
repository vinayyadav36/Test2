"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RewardCard } from "@/components/cashback/reward-card";
import { ExpiryAlerts } from "@/components/cashback/expiry-alerts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { Gift } from "lucide-react";

export default function CashbackPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/rewards").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return <AppShell><Skeleton className="h-64" /></AppShell>;
  }

  const { rewards, totalPending, totalEarned } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard title="Total Pending" value={formatCurrency(totalPending)} icon={<Gift className="w-5 h-5" />} />
          <KpiCard title="Total Earned" value={formatCurrency(totalEarned)} subtext="all time" />
        </div>
        <ExpiryAlerts rewards={rewards} />
        <div className="space-y-3">
          {rewards.map((r: any) => (
            <RewardCard key={r.id} {...r} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
