export type SourceType = "UPI" | "CARD" | "WALLET" | "BANK_TRANSFER" | "SUBSCRIPTION" | "CASHBACK" | "REFUND";

export type Category =
  | "Food"
  | "Grocery"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Recharge"
  | "Health"
  | "Education"
  | "Entertainment"
  | "Subscription"
  | "Transfer"
  | "Travel"
  | "Salary"
  | "Cashback"
  | "Refund"
  | "Rent"
  | "EMI"
  | "Miscellaneous"
  | "Unknown";

export interface RawTransactionRow {
  date: string;
  amount: number | string;
  type: "debit" | "credit";
  raw_description: string;
  source_type?: string;
  source_name?: string;
  merchant?: string;
  reference_id?: string;
  notes?: string;
  wallet_name?: string;
  cashback_amount?: number | string;
  cashback_status?: string;
  reward_expiry_date?: string;
  subscription_flag?: string | boolean;
}

export interface NormalizedTransaction {
  id?: string;
  date: string;
  amount: number;
  direction: "debit" | "credit";
  rawDescription: string;
  normalizedMerchant: string;
  sourceType: SourceType;
  sourceName?: string;
  category: Category;
  confidence: number;
  explanation: string;
  isSubscription: boolean;
  cashbackAmount?: number;
  cashbackStatus?: string;
  rewardExpiryDate?: string | null;
  referenceId?: string;
  notes?: string;
}
