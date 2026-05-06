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
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/wallets").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return <AppShell><Skeleton className="h-64" /></AppShell>;
  }

  const { wallets } = data;
  const totalBalance = wallets.reduce((s: number, w: any) => s + w.balance, 0);
  const idleWallets = wallets.filter((w: any) => (w.lastUsedDaysAgo ?? 0) > 30);

  return (
    <AppShell>
      <div className="space-y-6">
        <KpiCard
          title="Total Wallet Balance"
          value={formatCurrency(totalBalance)}
          subtext={`across ${wallets.length} wallets`}
          icon={<Wallet className="w-5 h-5" />}
        />
        {idleWallets.length > 0 && <IdleBalanceWidget wallets={idleWallets} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((w: any) => (
            <WalletCard key={w.id} {...w} isIdle={(w.lastUsedDaysAgo ?? 0) > 30} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
