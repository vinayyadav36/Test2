import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface RewardData {
  id: string;
  source: string;
  amount: number;
  expiresAt?: string | null;
}

interface CashbackSummaryProps {
  rewards: RewardData[];
  totalPending: number;
}

export function CashbackSummary({ rewards, totalPending }: CashbackSummaryProps) {
  const expiringSoon = rewards.filter((r) => {
    if (!r.expiresAt) return false;
    const diff = new Date(r.expiresAt).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Gift className="w-4 h-4 text-green-500" />
          Pending Cashback
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cashback">View all <ArrowRight className="w-3 h-3 ml-1" /></Link>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-green-600 mb-3">{formatCurrency(totalPending)}</p>
        {expiringSoon.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Expiring Soon</p>
            {expiringSoon.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <span>{r.source}</span>
                <Badge variant="warning">{formatCurrency(r.amount)}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
