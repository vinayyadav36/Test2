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

export interface BaseDoc {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseDoc {
  name: string;
  email: string;
  currency: "INR";
  darkMode: boolean;
  smallUpiThreshold: number;
}

export interface NormalizedTransaction extends BaseDoc {
  userId: string;
  date: string;
  amount: number;
  direction: "debit" | "credit";
  rawDescription: string;
  merchant: string;
  normalizedMerchant?: string;
  source: SourceType;
  sourceType?: SourceType;
  sourceName?: string;
  category: Category;
  confidence: number;
  explanation: string;
  isSubscription: boolean;
  cashbackAmount?: number;
  cashbackStatus?: "earned" | "pending" | "claimed" | "expired";
  rewardExpiryDate?: string | null;
  referenceId?: string;
  note?: string;
  notes?: string;
  anomaly?: {
    flagged: boolean;
    reason?: string;
  };
}

export interface CashbackReward extends BaseDoc {
  userId: string;
  sourceName: string;
  amount: number;
  status: "earned" | "pending" | "claimed" | "expired";
  earnedAt: string;
  expiresAt?: string | null;
  description?: string;
}

export interface WalletBalance extends BaseDoc {
  userId: string;
  name: string;
  provider: string;
  balance: number;
  lastUsedAt?: string | null;
  updatedAt: string;
}

export interface Subscription extends BaseDoc {
  userId: string;
  merchant: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "yearly";
  nextDate?: string | null;
  lastDate?: string | null;
  sourceType: SourceType;
  isActive: boolean;
  overlapGroup?: string | null;
}

export interface Rule extends BaseDoc {
  userId: string;
  field: "merchant" | "description" | "sourceType";
  operator: "contains" | "equals" | "regex";
  value: string;
  category?: Category;
  sourceType?: SourceType;
  enabled: boolean;
}

export interface ImportBatch extends BaseDoc {
  userId: string;
  fileName: string;
  totalRows: number;
  importedRows: number;
  failedRows: number;
  errors: string[];
}

export interface Budget extends BaseDoc {
  userId: string;
  month: string;
  category: Category;
  limitAmount: number;
}

export interface Goal extends BaseDoc {
  userId: string;
  name: string;
  targetAmount: number;
  targetDate?: string;
  currentAmount: number;
  isActive: boolean;
}

export interface CategoryFeedback extends BaseDoc {
  userId: string;
  merchant: string;
  fromCategory: Category;
  toCategory: Category;
  count: number;
  lastChangedAt: string;
}

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
  cashback_amount?: number | string;
  cashback_status?: string;
  reward_expiry_date?: string;
  subscription_flag?: string | boolean;
}
