import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Gift } from "lucide-react";

interface RewardCardProps {
  id: string;
  source: string;
  amount: number;
  type: string;
  status: string;
  expiresAt?: string | null;
  earnedAt: string;
}

export function RewardCard({ source, amount, type, status, expiresAt, earnedAt }: RewardCardProps) {
  const isExpiringSoon =
    expiresAt && new Date(expiresAt).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 && new Date(expiresAt) > new Date();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 shrink-0">
          <Gift className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground">{source}</p>
            <Badge variant={status === "pending" ? "warning" : "success"}>{status}</Badge>
            {isExpiringSoon && <Badge variant="destructive">Expiring soon</Badge>}
          </div>
          <p className="text-sm text-muted-foreground capitalize">{type}</p>
          <p className="text-xs text-muted-foreground mt-1">Earned {formatDate(earnedAt)}</p>
          {expiresAt && <p className="text-xs text-muted-foreground">Expires {formatDate(expiresAt)}</p>}
        </div>
        <p className="text-lg font-bold text-green-600 shrink-0">+{formatCurrency(amount)}</p>
      </CardContent>
    </Card>
  );
}
