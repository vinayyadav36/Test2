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
  const [data, setData] = useState<null | { rewards: Array<{ id: string; sourceName: string; amount: number; status: string; earnedAt: string; expiresAt?: string | null; description?: string }>; totalPending: number; totalEarned: number; realizedVsPotentialPct: number }>(null);

  useEffect(() => {
    fetch("/api/rewards").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <AppShell><Skeleton className="h-64" /></AppShell>;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard title="Pending" value={formatCurrency(data.totalPending)} icon={<Gift className="w-5 h-5" />} />
          <KpiCard title="Earned" value={formatCurrency(data.totalEarned)} />
          <KpiCard title="Realized ratio" value={`${data.realizedVsPotentialPct}%`} subtext="claimed vs potential" />
        </div>
        <ExpiryAlerts rewards={data.rewards.map((r) => ({ ...r, source: r.sourceName }))} />
        <div className="space-y-3">
          {data.rewards.map((r) => (
            <RewardCard key={r.id} {...r} source={r.sourceName} type={r.description ?? "cashback"} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
