"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { RecurringTimeline } from "@/components/subscriptions/recurring-timeline";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { RefreshCw } from "lucide-react";

export default function SubscriptionsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/subscriptions").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return <AppShell><Skeleton className="h-64" /></AppShell>;
  }

  const { subscriptions, totalMonthly } = data;

  const upcomingEvents = subscriptions
    .filter((s: any) => s.nextDate)
    .map((s: any) => ({ merchant: s.merchant, amount: s.amount, date: s.nextDate }));

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard
            title="Monthly Recurring"
            value={formatCurrency(totalMonthly)}
            subtext={`${subscriptions.filter((s: any) => s.isActive).length} active`}
            icon={<RefreshCw className="w-5 h-5" />}
          />
          <KpiCard
            title="Annual Estimate"
            value={formatCurrency(totalMonthly * 12)}
            subtext="projected"
          />
        </div>
        {upcomingEvents.length > 0 && <RecurringTimeline events={upcomingEvents} />}
        <div className="space-y-3">
          {subscriptions.map((s: any) => (
            <SubscriptionCard key={s.id} {...s} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
