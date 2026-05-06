import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface IdleWallet {
  name: string;
  balance: number;
  lastUsedDaysAgo: number;
}

interface IdleBalanceWidgetProps {
  wallets: IdleWallet[];
}

export function IdleBalanceWidget({ wallets }: IdleBalanceWidgetProps) {
  const idle = wallets.filter((w) => w.lastUsedDaysAgo > 30);
  if (idle.length === 0) return null;

  const total = idle.reduce((s, w) => s + w.balance, 0);

  return (
    <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
          <AlertTriangle className="w-4 h-4" />
          Idle Balance Alert — {formatCurrency(total)} sitting unused
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">Consider consolidating or investing these balances.</p>
        <div className="space-y-2">
          {idle.map((w) => (
            <div key={w.name} className="flex items-center justify-between text-sm">
              <span>{w.name}</span>
              <span className="font-medium">{formatCurrency(w.balance)} · {w.lastUsedDaysAgo}d idle</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
