import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { Wallet, TrendingDown } from "lucide-react";

interface WalletCardProps {
  id: string;
  name: string;
  provider: string;
  balance: number;
  lastUsedDaysAgo?: number;
  isIdle?: boolean;
}

export function WalletCard({ name, provider, balance, lastUsedDaysAgo, isIdle }: WalletCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${isIdle ? "border-yellow-300" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          {isIdle && <Badge variant="warning">Idle</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{provider}</p>
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-2xl font-bold mt-2">{formatCurrency(balance)}</p>
        {lastUsedDaysAgo !== undefined && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {isIdle && <TrendingDown className="w-3 h-3 text-yellow-500" />}
            Last used {lastUsedDaysAgo} days ago
          </p>
        )}
      </CardContent>
    </Card>
  );
}
