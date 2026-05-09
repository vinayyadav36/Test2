import { Anomaly, Budget, CashbackReward, Goal, MonthlyAnalytics, NormalizedTransaction, Rule, Session, Subscription, User, WalletBalance } from "@/types";
import { DEMO_USER_ID } from "@/lib/auth";
import { format } from "date-fns";
import { buildMonthlyAnalytics } from "@/lib/insight-engine";

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function docMeta() {
  const now = new Date().toISOString();
  return { createdAt: now, updatedAt: now };
}

export const DEMO_USER: User = {
  id: DEMO_USER_ID,
  name: "Demo User",
  email: "demo@kharchaone.app",
  currency: "INR",
  darkMode: false,
  smallUpiThreshold: 200,
  ...docMeta(),
};

export const DEMO_TRANSACTIONS: NormalizedTransaction[] = [
  { id: "t001", userId: DEMO_USER_ID, date: isoDaysAgo(1), amount: -245, direction: "debit", rawDescription: "UPI-P2M-SWIGGYBLR", merchant: "Swiggy", normalizedMerchant: "Swiggy", source: "UPI", sourceType: "UPI", sourceName: "Google Pay", category: "Food", confidence: 0.95, explanation: "Food order paid via UPI.", isSubscription: false, ...docMeta() },
  { id: "t002", userId: DEMO_USER_ID, date: isoDaysAgo(2), amount: -129, direction: "debit", rawDescription: "Netflix subscription", merchant: "Netflix", normalizedMerchant: "Netflix", source: "SUBSCRIPTION", sourceType: "SUBSCRIPTION", sourceName: "HDFC Credit Card", category: "Subscription", confidence: 0.98, explanation: "Recurring subscription payment.", isSubscription: true, ...docMeta() },
  { id: "t003", userId: DEMO_USER_ID, date: isoDaysAgo(2), amount: -75, direction: "debit", rawDescription: "UPI-P2M-TEA-STALL", merchant: "Tea Stall", normalizedMerchant: "Tea Stall", source: "UPI", sourceType: "UPI", sourceName: "PhonePe", category: "Food", confidence: 0.45, explanation: "Small UPI spend.", isSubscription: false, ...docMeta() },
  { id: "t004", userId: DEMO_USER_ID, date: isoDaysAgo(3), amount: -350, direction: "debit", rawDescription: "UPI-P2M-UBER", merchant: "Uber", normalizedMerchant: "Uber", source: "UPI", sourceType: "UPI", sourceName: "Google Pay", category: "Transport", confidence: 0.9, explanation: "Cab payment.", isSubscription: false, ...docMeta() },
  { id: "t005", userId: DEMO_USER_ID, date: isoDaysAgo(3), amount: -55, direction: "debit", rawDescription: "UPI-83726@ybl", merchant: "Unknown Merchant", normalizedMerchant: "Unknown Merchant", source: "UPI", sourceType: "UPI", sourceName: "PhonePe", category: "Unknown", confidence: 0.3, explanation: "Unknown UPI payment.", isSubscription: false, ...docMeta() },
  { id: "t006", userId: DEMO_USER_ID, date: isoDaysAgo(4), amount: 50000, direction: "credit", rawDescription: "NEFT-SALARY", merchant: "Employer", normalizedMerchant: "Employer", source: "BANK_TRANSFER", sourceType: "BANK_TRANSFER", category: "Salary", confidence: 0.9, explanation: "Salary credit.", isSubscription: false, ...docMeta() },
  { id: "t007", userId: DEMO_USER_ID, date: isoDaysAgo(5), amount: -119, direction: "debit", rawDescription: "SPOTIFY-PREMIUM", merchant: "Spotify", normalizedMerchant: "Spotify", source: "SUBSCRIPTION", sourceType: "SUBSCRIPTION", category: "Subscription", confidence: 0.97, explanation: "Streaming subscription.", isSubscription: true, ...docMeta() },
  { id: "t008", userId: DEMO_USER_ID, date: isoDaysAgo(6), amount: -1200, direction: "debit", rawDescription: "BIGBASKET-GROCERY", merchant: "BigBasket", normalizedMerchant: "BigBasket", source: "UPI", sourceType: "UPI", category: "Grocery", confidence: 0.9, explanation: "Grocery purchase.", isSubscription: false, ...docMeta() },
  { id: "t009", userId: DEMO_USER_ID, date: isoDaysAgo(7), amount: -3500, direction: "debit", rawDescription: "ELECTRICITY-BILL", merchant: "BESCOM", normalizedMerchant: "BESCOM", source: "UPI", sourceType: "UPI", category: "Bills", confidence: 0.9, explanation: "Utility bill payment.", isSubscription: false, ...docMeta() },
  { id: "t010", userId: DEMO_USER_ID, date: isoDaysAgo(8), amount: -199, direction: "debit", rawDescription: "JIO-RECHARGE", merchant: "Jio", normalizedMerchant: "Jio", source: "UPI", sourceType: "UPI", category: "Recharge", confidence: 0.94, explanation: "Mobile recharge.", isSubscription: false, ...docMeta() },
];

export const DEMO_WALLETS: WalletBalance[] = [
  { id: "w001", userId: DEMO_USER_ID, walletName: "Paytm Wallet", name: "Paytm Wallet", provider: "Paytm", balance: 1250, lastActivityAt: isoDaysAgo(10), lastUsedAt: isoDaysAgo(10), status: "active", ...docMeta() },
  { id: "w002", userId: DEMO_USER_ID, walletName: "PhonePe Wallet", name: "PhonePe Wallet", provider: "PhonePe", balance: 320, lastActivityAt: isoDaysAgo(50), lastUsedAt: isoDaysAgo(50), status: "dormant", ...docMeta() },
  { id: "w003", userId: DEMO_USER_ID, walletName: "Amazon Pay", name: "Amazon Pay", provider: "Amazon", balance: 840, lastActivityAt: isoDaysAgo(70), lastUsedAt: isoDaysAgo(70), status: "dormant", ...docMeta() },
];

export const DEMO_REWARDS: CashbackReward[] = [
  { id: "r001", userId: DEMO_USER_ID, sourceName: "PhonePe", amount: 85, status: "earned", earnedAt: isoDaysAgo(6), expiresAt: isoDaysAgo(-7), description: "Swiggy cashback", ...docMeta() },
  { id: "r002", userId: DEMO_USER_ID, sourceName: "Amazon Pay", amount: 50, status: "pending", earnedAt: isoDaysAgo(2), expiresAt: isoDaysAgo(-3), description: "Shopping reward", ...docMeta() },
  { id: "r003", userId: DEMO_USER_ID, sourceName: "Paytm", amount: 40, status: "claimed", earnedAt: isoDaysAgo(25), expiresAt: null, description: "Recharge reward", ...docMeta() },
];

export const DEMO_SUBSCRIPTIONS: Subscription[] = [
  { id: "s001", userId: DEMO_USER_ID, merchant: "Netflix", averageAmount: 149, amount: 149, currency: "INR", cycle: "monthly", frequency: "monthly", nextDueDate: isoDaysAgo(-12), lastPaidAt: isoDaysAgo(18), nextDate: isoDaysAgo(-12), lastDate: isoDaysAgo(18), sourceType: "SUBSCRIPTION", active: true, isActive: true, redundancyFlag: true, usageScore: 0.7, overlapGroup: "ott", ...docMeta() },
  { id: "s002", userId: DEMO_USER_ID, merchant: "Spotify", averageAmount: 119, amount: 119, currency: "INR", cycle: "monthly", frequency: "monthly", nextDueDate: isoDaysAgo(-8), lastPaidAt: isoDaysAgo(22), nextDate: isoDaysAgo(-8), lastDate: isoDaysAgo(22), sourceType: "SUBSCRIPTION", active: true, isActive: true, redundancyFlag: false, usageScore: 0.8, overlapGroup: "music", ...docMeta() },
  { id: "s003", userId: DEMO_USER_ID, merchant: "Disney+ Hotstar", averageAmount: 99, amount: 99, currency: "INR", cycle: "monthly", frequency: "monthly", nextDueDate: isoDaysAgo(-5), lastPaidAt: isoDaysAgo(25), nextDate: isoDaysAgo(-5), lastDate: isoDaysAgo(25), sourceType: "SUBSCRIPTION", active: true, isActive: true, redundancyFlag: true, usageScore: 0.5, overlapGroup: "ott", ...docMeta() },
];

export const DEMO_RULES: Rule[] = [
  { id: "rule-1", userId: DEMO_USER_ID, field: "normalizedMerchant", operator: "contains", value: "swiggy", actionType: "setCategory", actionValue: "Food", category: "Food", enabled: true, active: true, timesTriggered: 12, lastTriggeredAt: isoDaysAgo(0), ...docMeta() },
  { id: "rule-2", userId: DEMO_USER_ID, field: "normalizedMerchant", operator: "contains", value: "netflix", actionType: "setCategory", actionValue: "Subscription", category: "Subscription", enabled: true, active: true, timesTriggered: 8, lastTriggeredAt: isoDaysAgo(1), ...docMeta() },
];

const month = new Date().toISOString().slice(0, 7);

export const DEMO_BUDGETS: Budget[] = [
  { id: "b1", userId: DEMO_USER_ID, month, category: "Food", limitAmount: 5000, spentAmount: 245 + 75, remainingAmount: 4680, status: "under", thresholdNearRatio: 0.8, ...docMeta() },
  { id: "b2", userId: DEMO_USER_ID, month, category: "Shopping", limitAmount: 8000, spentAmount: 0, remainingAmount: 8000, status: "under", thresholdNearRatio: 0.8, ...docMeta() },
  { id: "b3", userId: DEMO_USER_ID, month, category: "Transport", limitAmount: 3000, spentAmount: 350, remainingAmount: 2650, status: "under", thresholdNearRatio: 0.8, ...docMeta() },
];

export const DEMO_GOALS: Goal[] = [
  { id: "g1", userId: DEMO_USER_ID, name: "Emergency Fund", targetAmount: 50000, currentSavedAmount: 12000, currentAmount: 12000, isActive: true, priority: "high", status: "in_progress", targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString(), ...docMeta() },
  { id: "g2", userId: DEMO_USER_ID, name: "New Phone", targetAmount: 30000, currentSavedAmount: 8000, currentAmount: 8000, isActive: true, priority: "medium", status: "in_progress", targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(), ...docMeta() },
];

export const DEMO_SESSIONS: Session[] = [
  { id: "sess_demo", userId: DEMO_USER_ID, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), lastSeenAt: new Date().toISOString(), userAgent: "demo-agent", ipHash: "demo" },
];

export const DEMO_ANALYTICS: MonthlyAnalytics[] = [
  buildMonthlyAnalytics(DEMO_USER_ID, format(new Date(), "yyyy-MM"), DEMO_TRANSACTIONS, DEMO_REWARDS, DEMO_WALLETS, DEMO_SUBSCRIPTIONS, DEMO_USER.smallUpiThreshold),
];

export const DEMO_ANOMALIES: Anomaly[] = [
  {
    id: "anom_demo_1",
    userId: DEMO_USER_ID,
    transactionId: "t009",
    type: "amount_outlier",
    severity: "medium",
    message: "This payment is higher than your typical utility spends.",
    details: { merchant: "BESCOM", currentAmount: 3500 },
    status: "unread",
    ...docMeta(),
  },
];
