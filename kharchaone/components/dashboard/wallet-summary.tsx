import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface WalletData {
  id: string;
  name: string;
  balance: number;
  lastUsedDaysAgo?: number;
}

interface WalletSummaryProps {
  wallets: WalletData[];
}

export function WalletSummary({ wallets }: WalletSummaryProps) {
  const maxBalance = Math.max(...wallets.map((w) => w.balance), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary" />
          Wallet Balances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {wallets.map((w) => (
          <div key={w.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{w.name}</span>
              <span className="text-foreground font-semibold">{formatCurrency(w.balance)}</span>
            </div>
            <Progress value={(w.balance / maxBalance) * 100} className="h-2" />
            {w.lastUsedDaysAgo !== undefined && w.lastUsedDaysAgo > 30 && (
              <p className="text-xs text-yellow-600">Idle for {w.lastUsedDaysAgo} days</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
