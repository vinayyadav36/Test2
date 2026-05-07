"use client";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "./confidence-badge";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/constants";
import type { NormalizedTransaction } from "@/types";

interface TransactionsTableProps {
  transactions: NormalizedTransaction[];
  onRowClick?: (t: NormalizedTransaction) => void;
}

export function TransactionsTable({ transactions, onRowClick }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No transactions found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Merchant</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Category</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Source</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
            <th className="text-center py-3 px-4 font-medium text-muted-foreground hidden xl:table-cell">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr
              key={t.id}
              className={cn("border-b border-border last:border-0 transition-colors", onRowClick ? "cursor-pointer hover:bg-accent/50" : "", i % 2 === 0 ? "bg-background" : "bg-muted/20")}
              onClick={() => onRowClick?.(t)}
            >
              <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{formatDate(t.date)}</td>
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium truncate max-w-[200px]">{t.merchant}</p>
                  {t.note && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{t.note}</p>}
                </div>
              </td>
              <td className="py-3 px-4 hidden md:table-cell">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] ?? "#6b7280" }}>
                  {t.category}
                </span>
              </td>
              <td className="py-3 px-4 hidden lg:table-cell"><Badge variant="outline" className="text-xs capitalize">{t.source}</Badge></td>
              <td className={cn("py-3 px-4 text-right font-semibold whitespace-nowrap", t.direction === "debit" ? "text-red-500" : "text-green-600")}>
                {t.direction === "debit" ? "-" : "+"}{formatCurrency(Math.abs(t.amount))}
              </td>
              <td className="py-3 px-4 text-center hidden xl:table-cell"><ConfidenceBadge confidence={t.confidence ?? 0.88} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
