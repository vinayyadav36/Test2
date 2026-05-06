import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { RefreshCw } from "lucide-react";

interface SubscriptionCardProps {
  id: string;
  merchant: string;
  amount: number;
  frequency: string;
  nextDate?: string | null;
  lastDate?: string | null;
  isActive: boolean;
}

export function SubscriptionCard({ merchant, amount, frequency, nextDate, lastDate, isActive }: SubscriptionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 shrink-0">
          <RefreshCw className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold">{merchant}</p>
            <Badge variant={isActive ? "success" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
          </div>
          <p className="text-sm text-muted-foreground capitalize">{frequency}</p>
          {lastDate && <p className="text-xs text-muted-foreground mt-1">Last charged {formatDate(lastDate)}</p>}
          {nextDate && <p className="text-xs text-primary mt-0.5">Next {formatDate(nextDate)}</p>}
        </div>
        <p className="text-lg font-bold shrink-0">{formatCurrency(amount)}</p>
      </CardContent>
    </Card>
  );
}
