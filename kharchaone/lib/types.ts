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
  userId?: string;
  name: string;
  email: string;
  currency: "INR";
  darkMode: boolean;
  smallUpiThreshold: number;
}

export interface Session extends BaseDoc {
  userId: string;
  lastSeenAt: string;
  userAgent?: string;
  ipHash?: string;
}

export interface NormalizedTransaction extends BaseDoc {
  userId: string;
  date: string;
  amount: number;
  direction: "debit" | "credit";
  rawDescription: string;
  merchant: string; // compatibility alias for normalizedMerchant
  normalizedMerchant: string;
  source: SourceType;
  sourceType: SourceType;
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
  categorySuggestion?: Category;
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
  linkedTransactionId?: string;
  description?: string;
}

export interface WalletBalance extends BaseDoc {
  userId: string;
  walletName?: string;
  name: string;
  provider?: string;
  balance: number;
  lastActivityAt?: string | null;
  lastUsedAt?: string | null;
  status?: "active" | "dormant";
  updatedAt: string;
}

export interface Subscription extends BaseDoc {
  userId: string;
  merchant: string;
  averageAmount?: number;
  amount: number;
  currency?: "INR";
  cycle?: "monthly" | "quarterly" | "yearly";
  frequency: "monthly" | "quarterly" | "yearly";
  nextDueDate?: string | null;
  lastPaidAt?: string | null;
  nextDate?: string | null;
  lastDate?: string | null;
  sourceType: SourceType;
  sourceName?: string;
  active?: boolean;
  isActive: boolean;
  redundancyFlag?: boolean;
  usageScore?: number;
  overlapGroup?: string | null;
}

export interface Rule extends BaseDoc {
  userId: string;
  field: "merchant" | "description" | "sourceType" | "normalizedMerchant" | "rawDescription";
  operator: "contains" | "equals" | "regex" | "startsWith" | "endsWith";
  value: string;
  actionType?: "setCategory" | "setSourceType";
  actionValue?: string;
  timesTriggered?: number;
  lastTriggeredAt?: string;
  active?: boolean;
  category?: Category;
  sourceType?: SourceType;
  enabled: boolean;
}

export interface ImportBatch extends BaseDoc {
  userId: string;
  fileName: string;
  source?: string;
  totalRows: number;
  importedRows: number;
  failedRows: number;
  startedAt?: string;
  finishedAt?: string;
  errorSummary?: string[];
  errors: string[];
}

export interface Budget extends BaseDoc {
  userId: string;
  month: string;
  category: Category;
  limitAmount: number;
  spentAmount?: number;
  remainingAmount?: number;
  status?: "under" | "near" | "over";
  thresholdNearRatio?: number;
}

export interface Goal extends BaseDoc {
  userId: string;
  name: string;
  targetAmount: number;
  currentSavedAmount?: number;
  targetDate?: string;
  priority?: "low" | "medium" | "high";
  status?: "in_progress" | "achieved" | "paused" | "abandoned";
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

export interface MonthlyAnalytics extends BaseDoc {
  userId: string;
  month: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  byCategory: Array<{ category: string; amount: number }>;
  smallUpiStats: {
    threshold: number;
    count: number;
    total: number;
    byDayOfWeek: Array<{ day: string; count: number; total: number }>;
    byHourBucket: Array<{ hour: string; count: number; total: number }>;
  };
  cashbackSummary: {
    earned: number;
    pending: number;
    claimed: number;
    expired: number;
  };
  walletFloat: {
    activeTotal: number;
    dormantTotal: number;
  };
  subscriptionCostMonthly: number;
}

export interface Anomaly extends BaseDoc {
  userId: string;
  transactionId: string;
  type: "amount_outlier" | "unusual_merchant" | "frequency_spike";
  severity: "low" | "medium" | "high";
  message: string;
  details?: Record<string, unknown>;
  status: "unread" | "acknowledged" | "dismissed";
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
