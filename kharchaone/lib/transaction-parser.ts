import { detectCategory, applyRules } from "@/lib/category-engine";
import { normalizeMerchant } from "@/lib/merchant-normalizer";
import { NormalizedTransaction, RawTransactionRow, Rule, SourceType } from "@/types";

function inferSourceType(raw: string, explicit?: string): SourceType {
  const text = `${explicit || ""} ${raw}`.toLowerCase();
  if (text.includes("cashback") || text.includes("reward")) return "CASHBACK";
  if (text.includes("wallet")) return "WALLET";
  if (text.includes("card") || text.includes("visa") || text.includes("rupay") || text.includes("mastercard")) return "CARD";
  if (text.includes("subscription") || text.includes("autopay") || text.includes("netflix") || text.includes("spotify")) return "SUBSCRIPTION";
  if (text.includes("neft") || text.includes("imps") || text.includes("bank transfer")) return "BANK_TRANSFER";
  return "UPI";
}

function explanationFor(txn: { amount: number; merchant: string; category: string; sourceType: SourceType; direction: "debit" | "credit" }): string {
  const amt = `₹${Math.abs(txn.amount).toFixed(0)}`;
  if (txn.direction === "credit" && txn.category === "Cashback") return `Cashback of ${amt} credited from ${txn.merchant}.`;
  if (txn.direction === "credit" && txn.category === "Salary") return `Salary credit of ${amt} received from ${txn.merchant}.`;
  if (txn.direction === "credit") return `Money received: ${amt} from ${txn.merchant}.`;
  if (txn.category === "Subscription") return `Recurring subscription payment of ${amt} to ${txn.merchant}.`;
  if (txn.category === "Transfer") return `Transfer of ${amt} via ${txn.sourceType}.`;
  return `Paid ${amt} to ${txn.merchant} via ${txn.sourceType}.`;
}

export function parseTransactionRow(row: RawTransactionRow, userId: string, rules: Rule[] = []): Omit<NormalizedTransaction, "id" | "createdAt" | "updatedAt"> {
  const parsedAmount = Number(row.amount || 0);
  const direction = row.type === "credit" ? "credit" : "debit";
  const amount = direction === "debit" ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);

  const rawDescription = row.raw_description || "";
  const source = inferSourceType(rawDescription, row.source_type);
  const merchant = normalizeMerchant(row.merchant || rawDescription);

  const ruleApplied = applyRules(`${rawDescription} ${merchant}`, source, rules);
  const category = ruleApplied.category ?? detectCategory(`${rawDescription} ${merchant}`);
  const confidence = merchant === "Unknown Merchant" || category === "Unknown" ? 0.42 : 0.9;
  const isSubscription = category === "Subscription" || String(row.subscription_flag).toLowerCase() === "true";

  return {
    userId,
    date: row.date,
    amount,
    direction,
    rawDescription,
    merchant,
    normalizedMerchant: merchant,
    source,
    sourceType: source,
    sourceName: row.source_name,
    category,
    confidence,
    explanation: explanationFor({ amount, merchant, category, sourceType: source, direction }),
    isSubscription,
    cashbackAmount: row.cashback_amount ? Number(row.cashback_amount) : undefined,
    cashbackStatus: (row.cashback_status as "earned" | "pending" | "claimed" | "expired") || undefined,
    rewardExpiryDate: row.reward_expiry_date || null,
    referenceId: row.reference_id,
    note: row.notes,
    notes: row.notes,
  };
}
