"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { RecurringTimeline } from "@/components/subscriptions/recurring-timeline";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubscriptionsPage() {
  const [data, setData] = useState<null | { subscriptions: Array<{ id: string; merchant: string; amount: number; frequency: string; nextDate?: string | null; lastDate?: string | null; isActive: boolean }>; totalMonthly: number; annualEstimate: number; forecast: Array<{ month: string; total: number }> }>(null);

  useEffect(() => {
    fetch("/api/subscriptions").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <AppShell><Skeleton className="h-64" /></AppShell>;

  const subscriptions = data.subscriptions;
  const upcomingEvents = subscriptions
    .filter((s): s is typeof s & { nextDate: string } => Boolean(s.nextDate))
    .map((s) => ({ merchant: s.merchant, amount: s.amount, date: s.nextDate }));

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard title="Monthly Recurring" value={formatCurrency(data.totalMonthly)} subtext={`${subscriptions.filter((s) => s.isActive).length} active`} icon={<RefreshCw className="w-5 h-5" />} />
          <KpiCard title="Annual Estimate" value={formatCurrency(data.annualEstimate)} subtext="projected" />
        </div>
        {upcomingEvents.length > 0 && <RecurringTimeline events={upcomingEvents} />}

        <Card>
          <CardHeader><CardTitle className="text-base">12-month forecast</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {data.forecast.slice(0, 12).map((f) => (
              <div key={f.month} className="rounded border p-2">
                <p className="text-muted-foreground">{f.month}</p>
                <p className="font-semibold">{formatCurrency(f.total)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {subscriptions.map((s) => (
            <SubscriptionCard key={s.id} {...s} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
