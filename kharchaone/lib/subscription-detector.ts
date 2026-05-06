interface TxnForSub {
  normalizedMerchant: string;
  amount: number;
  date: string;
  isSubscription: boolean;
}

export interface DetectedSubscription {
  merchant: string;
  amount: number;
  cycle: string;
  occurrences: number;
  lastSeen: string;
}

export function detectSubscriptions(transactions: TxnForSub[]): DetectedSubscription[] {
  const map: Record<string, TxnForSub[]> = {};
  for (const txn of transactions) {
    const key = `${txn.normalizedMerchant}__${Math.round(txn.amount / 5) * 5}`;
    if (!map[key]) map[key] = [];
    map[key].push(txn);
  }

  const results: DetectedSubscription[] = [];
  for (const [key, txns] of Object.entries(map)) {
    if (txns.length < 2) continue;
    const [merchant] = key.split("__");
    const sorted = [...txns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    results.push({
      merchant,
      amount: txns[0].amount,
      cycle: "monthly",
      occurrences: txns.length,
      lastSeen: sorted[0].date,
    });
  }

  return results;
}
