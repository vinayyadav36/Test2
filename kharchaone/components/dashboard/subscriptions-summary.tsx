import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

interface SubData {
  id: string;
  merchant: string;
  amount: number;
  nextDate?: string | null;
}

interface SubscriptionsSummaryProps {
  subscriptions: SubData[];
  totalMonthly: number;
}

export function SubscriptionsSummary({ subscriptions, totalMonthly }: SubscriptionsSummaryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-500" />
          Active Subscriptions
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/subscriptions">View all <ArrowRight className="w-3 h-3 ml-1" /></Link>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-1">{formatCurrency(totalMonthly)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
        <p className="text-xs text-muted-foreground mb-3">{subscriptions.length} active subscriptions</p>
        <div className="space-y-2">
          {subscriptions.slice(0, 4).map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <span className="truncate">{s.merchant}</span>
              <span className="font-medium shrink-0 ml-2">{formatCurrency(s.amount)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
