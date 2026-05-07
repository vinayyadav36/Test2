import { NormalizedTransaction } from "@/types";

interface TransactionIndexes {
  byId: Map<string, NormalizedTransaction>;
  byMonth: Map<string, string[]>;
  byMerchant: Map<string, string[]>;
  byUser: Map<string, string[]>;
}

function monthKey(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function buildTransactionIndexes(transactions: NormalizedTransaction[]): TransactionIndexes {
  const byId = new Map<string, NormalizedTransaction>();
  const byMonth = new Map<string, string[]>();
  const byMerchant = new Map<string, string[]>();
  const byUser = new Map<string, string[]>();

  for (const txn of transactions) {
    byId.set(txn.id, txn);

    const mk = monthKey(txn.date);
    byMonth.set(mk, [...(byMonth.get(mk) ?? []), txn.id]);

    const merchant = txn.merchant.toLowerCase();
    byMerchant.set(merchant, [...(byMerchant.get(merchant) ?? []), txn.id]);

    byUser.set(txn.userId, [...(byUser.get(txn.userId) ?? []), txn.id]);
  }

  return { byId, byMonth, byMerchant, byUser };
}

export function readByIds(indexes: TransactionIndexes, ids: string[]): NormalizedTransaction[] {
  return ids.map((id) => indexes.byId.get(id)).filter((v): v is NormalizedTransaction => Boolean(v));
}
