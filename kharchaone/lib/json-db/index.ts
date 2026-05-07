import { z } from "zod";
import {
  Budget,
  CashbackReward,
  CategoryFeedback,
  Goal,
  ImportBatch,
  NormalizedTransaction,
  Rule,
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
  description: z.string().optional(),
});

const walletSchema = baseDocSchema.extend({
  userId: z.string(),
  name: z.string(),
  provider: z.string(),
  balance: z.number(),
  lastUsedAt: z.string().nullable().optional(),
  updatedAt: z.string(),
});

const subscriptionSchema = baseDocSchema.extend({
  userId: z.string(),
  merchant: z.string(),
  amount: z.number(),
  frequency: z.enum(["monthly", "quarterly", "yearly"]),
  nextDate: z.string().nullable().optional(),
  lastDate: z.string().nullable().optional(),
  sourceType: sourceTypeSchema,
  isActive: z.boolean(),
  overlapGroup: z.string().nullable().optional(),
});

const ruleSchema = baseDocSchema.extend({
  userId: z.string(),
  field: z.enum(["merchant", "description", "sourceType"]),
  operator: z.enum(["contains", "equals", "regex"]),
  value: z.string(),
  category: z.string().optional(),
  sourceType: sourceTypeSchema.optional(),
  enabled: z.boolean(),
});

const importSchema = baseDocSchema.extend({
  userId: z.string(),
  fileName: z.string(),
  totalRows: z.number(),
  importedRows: z.number(),
  failedRows: z.number(),
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
});

const goalSchema = baseDocSchema.extend({
  userId: z.string(),
  name: z.string(),
  targetAmount: z.number(),
  targetDate: z.string().optional(),
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

export const usersRepo = createJsonRepository<User>("users.json");
export const transactionsRepo = createJsonRepository<NormalizedTransaction>("transactions.json");
export const rewardsRepo = createJsonRepository<CashbackReward>("cashback.json");
export const walletsRepo = createJsonRepository<WalletBalance>("wallets.json");
export const subscriptionsRepo = createJsonRepository<Subscription>("subscriptions.json");
export const rulesRepo = createJsonRepository<Rule>("rules.json");
export const importsRepo = createJsonRepository<ImportBatch>("import-batches.json");
export const budgetsRepo = createJsonRepository<Budget>("budgets.json");
export const goalsRepo = createJsonRepository<Goal>("goals.json");
export const categoryFeedbackRepo = createJsonRepository<CategoryFeedback>("category-feedback.json");

export async function bootstrapJsonDb(): Promise<void> {
  await bootstrapCollections([
    "users.json",
    "transactions.json",
    "cashback.json",
    "wallets.json",
    "subscriptions.json",
    "rules.json",
    "import-batches.json",
    "budgets.json",
    "goals.json",
    "category-feedback.json",
  ]);
}

export function toSource(value: string): SourceType {
  return (value || "UPI") as SourceType;
}
