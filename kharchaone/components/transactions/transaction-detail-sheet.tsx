"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfidenceBadge } from "./confidence-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { CATEGORY_COLORS, SOURCE_LABELS } from "@/lib/constants";
import type { NormalizedTransaction } from "@/types";

interface TransactionDetailSheetProps {
  transaction: NormalizedTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailSheet({ transaction: t, open, onOpenChange }: TransactionDetailSheetProps) {
  if (!t) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t.merchant}</SheetTitle>
          <SheetDescription>Transaction details</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="text-center py-4">
            <p className={`text-4xl font-bold ${t.direction === "debit" ? "text-red-500" : "text-green-600"}`}>
              {t.direction === "debit" ? "-" : "+"}{formatCurrency(Math.abs(t.amount))}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{formatDate(t.date)}</p>
          </div>
          <Separator />
          <dl className="space-y-3">
            <Row label="Category">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] ?? "#6b7280" }}>{t.category}</span>
            </Row>
            <Row label="Source"><Badge variant="outline">{SOURCE_LABELS[t.source] ?? t.source}</Badge></Row>
            <Row label="Confidence"><ConfidenceBadge confidence={t.confidence ?? 0.88} /></Row>
            {t.note && <Row label="Note"><span className="text-sm">{t.note}</span></Row>}
            {t.rawDescription && <Row label="Raw Description"><span className="text-xs text-muted-foreground font-mono break-all">{t.rawDescription}</span></Row>}
            {t.anomaly?.flagged && <Row label="Anomaly"><Badge variant="warning">{t.anomaly.reason ?? "Unusually high/low amount"}</Badge></Row>}
            <Row label="Transaction ID"><span className="text-xs text-muted-foreground font-mono">{t.id}</span></Row>
          </dl>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm text-muted-foreground shrink-0 w-32">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
