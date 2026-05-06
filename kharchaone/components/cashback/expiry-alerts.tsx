import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface Reward {
  id: string;
  source: string;
  amount: number;
  expiresAt?: string | null;
}

interface ExpiryAlertsProps {
  rewards: Reward[];
}

export function ExpiryAlerts({ rewards }: ExpiryAlertsProps) {
  const expiring = rewards
    .filter((r) => {
      if (!r.expiresAt) return false;
      const ms = new Date(r.expiresAt).getTime() - Date.now();
      return ms > 0 && ms < 60 * 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime());

  if (expiring.length === 0) return null;

  return (
    <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
          <AlertTriangle className="w-4 h-4" />
          Expiry Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {expiring.map((r) => (
          <div key={r.id} className="flex items-center justify-between text-sm">
            <span className="font-medium">{r.source}</span>
            <div className="flex items-center gap-2">
              <Badge variant="warning">{formatCurrency(r.amount)}</Badge>
              <span className="text-xs text-muted-foreground">{formatDate(r.expiresAt!)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
