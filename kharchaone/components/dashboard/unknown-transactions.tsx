import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { NormalizedTransaction } from "@/types";

interface UnknownTransactionsProps {
  transactions: NormalizedTransaction[];
}

export function UnknownTransactions({ transactions }: UnknownTransactionsProps) {
  const unknown = transactions.filter((t) => t.category === "Unknown").slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          Needs Review
          <Badge variant="warning">{transactions.filter((t) => t.category === "Unknown").length}</Badge>
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions?filter=unknown">
            View all <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {unknown.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">All transactions categorised ✓</p>
        )}
        {unknown.map((t) => (
          <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{t.merchant}</p>
              <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-sm font-semibold text-red-500">
                -{formatCurrency(Math.abs(t.amount))}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
