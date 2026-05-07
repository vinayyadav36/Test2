"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { WalletCard } from "@/components/wallets/wallet-card";
import { IdleBalanceWidget } from "@/components/wallets/idle-balance-widget";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { Wallet } from "lucide-react";

export default function WalletsPage() {
  const [data, setData] = useState<null | { wallets: Array<{ id: string; name: string; provider: string; balance: number; lastUsedDaysAgo: number; status: string }>; activeTotal: number; dormantTotal: number }>(null);

  useEffect(() => {
    fetch("/api/wallets").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <AppShell><Skeleton className="h-64" /></AppShell>;

  const wallets = data.wallets;
  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard title="Total Wallet Balance" value={formatCurrency(totalBalance)} icon={<Wallet className="w-5 h-5" />} />
          <KpiCard title="Active Float" value={formatCurrency(data.activeTotal)} />
          <KpiCard title="Dormant Float" value={formatCurrency(data.dormantTotal)} subtext="idle money" />
        </div>
        <IdleBalanceWidget wallets={wallets.filter((w) => w.status === "dormant")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((w) => (
            <WalletCard key={w.id} {...w} isIdle={w.status === "dormant"} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
