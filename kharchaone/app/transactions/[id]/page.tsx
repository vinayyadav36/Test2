"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TransactionDetailSheet } from "@/components/transactions/transaction-detail-sheet";
import type { NormalizedTransaction } from "@/types";

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const [txn, setTxn] = useState<NormalizedTransaction | null>(null);

  useEffect(() => {
    fetch(`/api/transactions/${params.id}`).then((r) => r.json()).then((d) => setTxn(d.transaction ?? null));
  }, [params.id]);

  return (
    <AppShell>
      <TransactionDetailSheet transaction={txn} open={true} onOpenChange={() => {}} />
    </AppShell>
  );
}
