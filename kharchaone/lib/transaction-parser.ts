import { normalizeMerchant } from "./merchant-normalizer";
import { detectCategory } from "./category-engine";
import { NormalizedTransaction, RawTransactionRow, SourceType } from "@/types";

function inferSourceType(raw: string, explicit?: string): SourceType {
  const text = `${explicit || ""} ${raw}`.toLowerCase();
  if (text.includes("cashback") || text.includes("reward")) return "CASHBACK";
  if (text.includes("wallet")) return "WALLET";
  if (text.includes("card") || text.includes("visa") || text.includes("rupay") || text.includes("mastercard")) return "CARD";
  if (text.includes("subscription") || text.includes("autopay") || text.includes("netflix") || text.includes("spotify")) return "SUBSCRIPTION";
  if (text.includes("neft") || text.includes("imps") || text.includes("bank transfer")) return "BANK_TRANSFER";
  return "UPI";
}

function explanationFor(txn: {
  amount: number;
  merchant: string;
  category: string;
  sourceType: SourceType;
  direction: "debit" | "credit";
}): string {
  const amt = `₹${txn.amount.toFixed(0)}`;
  if (txn.direction === "credit" && txn.category === "Cashback") {
    return `Cashback of ${amt} credited from ${txn.merchant}.`;
  }
  if (txn.direction === "credit" && txn.category === "Salary") {
    return `Salary credit of ${amt} received from ${txn.merchant}.`;
  }
  if (txn.direction === "credit") {
    return `Money received: ${amt} from ${txn.merchant}.`;
  }
  if (txn.category === "Subscription") {
    return `Recurring subscription payment of ${amt} to ${txn.merchant}.`;
  }
  if (txn.category === "Transfer") {
    return `Bank transfer of ${amt} sent via ${txn.sourceType}.`;
  }
  if (txn.category === "Food") {
    return `Food order of ${amt} paid to ${txn.merchant} via ${txn.sourceType}.`;
  }
  if (txn.category === "Recharge") {
    return `Mobile/utility recharge of ${amt} via ${txn.sourceType}.`;
  }
  if (txn.category === "Transport") {
    return `Transport payment of ${amt} to ${txn.merchant} via ${txn.sourceType}.`;
  }
  return `Paid ${amt} to ${txn.merchant} via ${txn.sourceType}.`;
}

export function parseTransactionRow(row: RawTransactionRow): NormalizedTransaction {
  const amount = Number(row.amount || 0);
  const rawDescription = row.raw_description || "";
  const sourceType = inferSourceType(rawDescription, row.source_type);
  const normalizedMerchant = normalizeMerchant(row.merchant || rawDescription);
  const category = detectCategory(`${rawDescription} ${normalizedMerchant}`);
  const confidence = normalizedMerchant === "Unknown Merchant" || category === "Unknown" ? 0.42 : 0.88;
  const direction = row.type === "credit" ? "credit" : "debit";
  const isSubscription =
    category === "Subscription" || String(row.subscription_flag).toLowerCase() === "true";

  return {
    date: row.date,
    amount,
    direction,
    rawDescription,
    normalizedMerchant,
    sourceType,
    sourceName: row.source_name,
    category,
    confidence,
    explanation: explanationFor({ amount, merchant: normalizedMerchant, category, sourceType, direction }),
    isSubscription,
    cashbackAmount: row.cashback_amount ? Number(row.cashback_amount) : undefined,
    cashbackStatus: row.cashback_status || undefined,
    rewardExpiryDate: row.reward_expiry_date || null,
    referenceId: row.reference_id,
    notes: row.notes,
  };
}
