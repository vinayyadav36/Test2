import { Anomaly, NormalizedTransaction } from "@/types";

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = sorted[base + 1] ?? sorted[base];
  return sorted[base] + rest * (next - sorted[base]);
}

function median(sorted: number[]): number {
  return quantile(sorted, 0.5);
}

export function detectAmountOutlier(
  userId: string,
  transaction: NormalizedTransaction,
  historical: NormalizedTransaction[]
): Omit<Anomaly, "id" | "createdAt" | "updatedAt"> | null {
  if (transaction.direction !== "debit") return null;
  const merchant = (transaction.normalizedMerchant || transaction.merchant || "").trim().toLowerCase();
  if (!merchant) return null;

  const samples = historical
    .filter((t) => t.userId === userId)
    .filter((t) => t.id !== transaction.id)
    .filter((t) => t.direction === "debit")
    .filter((t) => (t.normalizedMerchant || t.merchant || "").trim().toLowerCase() === merchant)
    .map((t) => Math.abs(t.amount))
    .sort((a, b) => a - b);

  if (samples.length < 4) return null;

  const q1 = quantile(samples, 0.25);
  const q3 = quantile(samples, 0.75);
  const iqr = Math.max(1, q3 - q1);
  const upper = q3 + 1.5 * iqr;
  const currentAmount = Math.abs(transaction.amount);

  if (currentAmount <= upper) return null;

  const typicalMedian = median(samples);
  return {
    userId,
    transactionId: transaction.id,
    type: "amount_outlier",
    severity: currentAmount >= upper * 2 ? "high" : "medium",
    message: "This payment is significantly higher than your typical spends at this merchant.",
    details: {
      merchant: transaction.normalizedMerchant || transaction.merchant,
      typicalAmountMedian: Number(typicalMedian.toFixed(2)),
      typicalAmountIqrHigh: Number(upper.toFixed(2)),
      currentAmount,
    },
    status: "unread",
  };
}
