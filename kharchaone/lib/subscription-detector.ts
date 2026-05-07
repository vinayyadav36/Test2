import { NormalizedTransaction } from "@/types";

export interface DetectedSubscription {
  merchant: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "yearly";
  occurrences: number;
  lastDate: string;
  nextDate: string;
  isRedundantCandidate: boolean;
}

function avg(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function detectSubscriptions(transactions: NormalizedTransaction[]): DetectedSubscription[] {
  const debitTxns = transactions.filter((t) => t.direction === "debit");
  const grouped = new Map<string, NormalizedTransaction[]>();

  debitTxns.forEach((txn) => {
    const key = `${txn.merchant.toLowerCase()}::${Math.round(Math.abs(txn.amount) / 10) * 10}`;
    grouped.set(key, [...(grouped.get(key) ?? []), txn]);
  });

  const results: DetectedSubscription[] = [];
  for (const txns of Array.from(grouped.values())) {
    if (txns.length < 2) continue;
    const sorted = [...txns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i += 1) {
      intervals.push((new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime()) / 86400000);
    }

    const average = avg(intervals);
    let frequency: "monthly" | "quarterly" | "yearly" | null = null;
    if (average >= 25 && average <= 35) frequency = "monthly";
    else if (average >= 80 && average <= 100) frequency = "quarterly";
    else if (average >= 330 && average <= 390) frequency = "yearly";

    if (!frequency) continue;

    const merchant = sorted[0].merchant;
    const amount = Math.abs(sorted[sorted.length - 1].amount);
    const lastDate = sorted[sorted.length - 1].date;
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + Math.round(average));

    results.push({
      merchant,
      amount,
      frequency,
      occurrences: sorted.length,
      lastDate,
      nextDate: nextDate.toISOString(),
      isRedundantCandidate: /(netflix|prime|hotstar|spotify|youtube)/i.test(merchant),
    });
  }

  return results;
}
