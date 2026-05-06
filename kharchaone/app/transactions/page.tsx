"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionDetailSheet } from "@/components/transactions/transaction-detail-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/use-app-store";
import type { NormalizedTransaction } from "@/types";

export default function TransactionsPage() {
  const [allTxns, setAllTxns] = useState<NormalizedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NormalizedTransaction | null>(null);
  const { searchQuery, categoryFilter, sourceFilter } = useAppStore();

  useEffect(() => {
    fetch("/api/transactions")
      .then((r) => r.json())
      .then((d) => { setAllTxns(d.transactions); setLoading(false); });
  }, []);

  const filtered = allTxns.filter((t) => {
    if (categoryFilter && categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (sourceFilter && sourceFilter !== "all" && t.source !== sourceFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.merchant.toLowerCase().includes(q) || (t.note ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-4">
        <TransactionFilters />
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{filtered.length} transactions</p>
            <TransactionsTable transactions={filtered} onRowClick={setSelected} />
          </>
        )}
      </div>
      <TransactionDetailSheet transaction={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </AppShell>
  );
}
