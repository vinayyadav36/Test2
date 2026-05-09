import { z } from "zod";
import {
  Anomaly,
  Budget,
  CashbackReward,
  CategoryFeedback,
  Goal,
  ImportBatch,
  MonthlyAnalytics,
  NormalizedTransaction,
  Rule,
  Session,
  SourceType,
  Subscription,
  User,
  WalletBalance,
} from "@/types";
import { bootstrapCollections, registerCollectionSchema } from "@/lib/json-db/fileStore";
import { createJsonRepository } from "@/lib/json-db/repository";

const sourceTypeSchema = z.enum(["UPI", "CARD", "WALLET", "BANK_TRANSFER", "SUBSCRIPTION", "CASHBACK", "REFUND"]);

const baseDocSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const transactionSchema = baseDocSchema.extend({
  userId: z.string(),
  date: z.string(),
  amount: z.number(),
  direction: z.enum(["debit", "credit"]),
  rawDescription: z.string(),
  merchant: z.string(),
  normalizedMerchant: z.string().optional(),
  source: sourceTypeSchema,
  sourceType: sourceTypeSchema.optional(),
  category: z.string(),
  confidence: z.number(),
  explanation: z.string(),
  isSubscription: z.boolean(),
  note: z.string().optional(),
  notes: z.string().optional(),
});

const rewardSchema = baseDocSchema.extend({
  userId: z.string(),
  sourceName: z.string(),
  amount: z.number(),
  status: z.enum(["earned", "pending", "claimed", "expired"]),
  earnedAt: z.string(),
  expiresAt: z.string().nullable().optional(),
  linkedTransactionId: z.string().optional(),
  description: z.string().optional(),
});

const walletSchema = baseDocSchema.extend({
  userId: z.string(),
  walletName: z.string().optional(),
  name: z.string(),
  provider: z.string().optional(),
  balance: z.number(),
  lastActivityAt: z.string().nullable().optional(),
  lastUsedAt: z.string().nullable().optional(),
  status: z.enum(["active", "dormant"]).optional(),
  updatedAt: z.string(),
});

const subscriptionSchema = baseDocSchema.extend({
  userId: z.string(),
  merchant: z.string(),
  averageAmount: z.number().optional(),
  amount: z.number(),
  currency: z.literal("INR").optional(),
  cycle: z.enum(["monthly", "quarterly", "yearly"]).optional(),
  frequency: z.enum(["monthly", "quarterly", "yearly"]),
  nextDueDate: z.string().nullable().optional(),
  lastPaidAt: z.string().nullable().optional(),
  nextDate: z.string().nullable().optional(),
  lastDate: z.string().nullable().optional(),
  sourceType: sourceTypeSchema,
  sourceName: z.string().optional(),
  active: z.boolean().optional(),
  isActive: z.boolean(),
  redundancyFlag: z.boolean().optional(),
  usageScore: z.number().optional(),
  overlapGroup: z.string().nullable().optional(),
});

const ruleSchema = baseDocSchema.extend({
  userId: z.string(),
  field: z.enum(["merchant", "description", "sourceType", "normalizedMerchant", "rawDescription"]),
  operator: z.enum(["contains", "equals", "regex", "startsWith", "endsWith"]),
  value: z.string(),
  actionType: z.enum(["setCategory", "setSourceType"]).optional(),
  actionValue: z.string().optional(),
  timesTriggered: z.number().optional(),
  lastTriggeredAt: z.string().optional(),
  active: z.boolean().optional(),
  category: z.string().optional(),
  sourceType: sourceTypeSchema.optional(),
  enabled: z.boolean(),
});

const importSchema = baseDocSchema.extend({
  userId: z.string(),
  fileName: z.string(),
  source: z.string().optional(),
  totalRows: z.number(),
  importedRows: z.number(),
  failedRows: z.number(),
  startedAt: z.string().optional(),
  finishedAt: z.string().optional(),
  errorSummary: z.array(z.string()).optional(),
  errors: z.array(z.string()),
});

const userSchema = baseDocSchema.extend({
  name: z.string(),
  email: z.string(),
  currency: z.literal("INR"),
  darkMode: z.boolean(),
  smallUpiThreshold: z.number(),
});

const budgetSchema = baseDocSchema.extend({
  userId: z.string(),
  month: z.string(),
  category: z.string(),
  limitAmount: z.number(),
  spentAmount: z.number().optional(),
  remainingAmount: z.number().optional(),
  status: z.enum(["under", "near", "over"]).optional(),
  thresholdNearRatio: z.number().optional(),
});

const goalSchema = baseDocSchema.extend({
  userId: z.string(),
  name: z.string(),
  targetAmount: z.number(),
  currentSavedAmount: z.number().optional(),
  targetDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["in_progress", "achieved", "paused", "abandoned"]).optional(),
  currentAmount: z.number(),
  isActive: z.boolean(),
});

const feedbackSchema = baseDocSchema.extend({
  userId: z.string(),
  merchant: z.string(),
  fromCategory: z.string(),
  toCategory: z.string(),
  count: z.number(),
  lastChangedAt: z.string(),
});

const sessionSchema = baseDocSchema.extend({
  userId: z.string(),
  lastSeenAt: z.string(),
  userAgent: z.string().optional(),
  ipHash: z.string().optional(),
});

const analyticsSchema = baseDocSchema.extend({
  userId: z.string(),
  month: z.string(),
  totalIncome: z.number(),
  totalExpense: z.number(),
  netSavings: z.number(),
  byCategory: z.array(z.object({ category: z.string(), amount: z.number() })),
  smallUpiStats: z.object({
    threshold: z.number(),
    count: z.number(),
    total: z.number(),
    byDayOfWeek: z.array(z.object({ day: z.string(), count: z.number(), total: z.number() })),
    byHourBucket: z.array(z.object({ hour: z.string(), count: z.number(), total: z.number() })),
  }),
  cashbackSummary: z.object({
    earned: z.number(),
    pending: z.number(),
    claimed: z.number(),
    expired: z.number(),
  }),
  walletFloat: z.object({
    activeTotal: z.number(),
    dormantTotal: z.number(),
  }),
  subscriptionCostMonthly: z.number(),
});

const anomalySchema = baseDocSchema.extend({
  userId: z.string(),
  transactionId: z.string(),
  type: z.enum(["amount_outlier", "unusual_merchant", "frequency_spike"]),
  severity: z.enum(["low", "medium", "high"]),
  message: z.string(),
  details: z.record(z.any()).optional(),
  status: z.enum(["unread", "acknowledged", "dismissed"]),
});

registerCollectionSchema("transactions.json", transactionSchema);
registerCollectionSchema("cashback.json", rewardSchema);
registerCollectionSchema("wallets.json", walletSchema);
registerCollectionSchema("subscriptions.json", subscriptionSchema);
registerCollectionSchema("rules.json", ruleSchema);
registerCollectionSchema("import-batches.json", importSchema);
registerCollectionSchema("users.json", userSchema);
registerCollectionSchema("budgets.json", budgetSchema);
registerCollectionSchema("goals.json", goalSchema);
registerCollectionSchema("category-feedback.json", feedbackSchema);
registerCollectionSchema("sessions.json", sessionSchema);
registerCollectionSchema("monthly-analytics.json", analyticsSchema);
registerCollectionSchema("anomalies.json", anomalySchema);

export const usersRepo = createJsonRepository<User>("users.json");
export const sessionsRepo = createJsonRepository<Session>("sessions.json");
export const transactionsRepo = createJsonRepository<NormalizedTransaction>("transactions.json");
export const rewardsRepo = createJsonRepository<CashbackReward>("cashback.json");
export const walletsRepo = createJsonRepository<WalletBalance>("wallets.json");
export const subscriptionsRepo = createJsonRepository<Subscription>("subscriptions.json");
export const rulesRepo = createJsonRepository<Rule>("rules.json");
export const importsRepo = createJsonRepository<ImportBatch>("import-batches.json");
export const budgetsRepo = createJsonRepository<Budget>("budgets.json");
export const goalsRepo = createJsonRepository<Goal>("goals.json");
export const analyticsRepo = createJsonRepository<MonthlyAnalytics>("monthly-analytics.json");
export const anomaliesRepo = createJsonRepository<Anomaly>("anomalies.json");
export const categoryFeedbackRepo = createJsonRepository<CategoryFeedback>("category-feedback.json");

export async function bootstrapJsonDb(): Promise<void> {
  await bootstrapCollections([
    "users.json",
    "sessions.json",
    "transactions.json",
    "cashback.json",
    "wallets.json",
    "subscriptions.json",
    "rules.json",
    "import-batches.json",
    "budgets.json",
    "goals.json",
    "monthly-analytics.json",
    "anomalies.json",
    "category-feedback.json",
  ]);
}

export function toSource(value: string): SourceType {
  return (value || "UPI") as SourceType;
}
