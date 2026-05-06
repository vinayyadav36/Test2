"use client";

import { use, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TransactionDetailSheet } from "@/components/transactions/transaction-detail-sheet";
import { DEMO_TRANSACTIONS } from "@/lib/demo-data";
import type { NormalizedTransaction } from "@/types";

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [txn, setTxn] = useState<NormalizedTransaction | null>(null);

  useEffect(() => {
    const found = DEMO_TRANSACTIONS.find((t) => t.id === id) ?? null;
    setTxn(found);
  }, [id]);

  return (
    <AppShell>
      <TransactionDetailSheet transaction={txn} open={true} onOpenChange={() => {}} />
    </AppShell>
  );
}
