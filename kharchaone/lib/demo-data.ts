import { Budget, CashbackReward, Goal, NormalizedTransaction, Rule, Subscription, User, WalletBalance } from "@/types";
import { DEMO_USER_ID } from "@/lib/auth";

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
  { id: "t001", userId: DEMO_USER_ID, date: isoDaysAgo(1), amount: -245, direction: "debit", rawDescription: "UPI-P2M-SWIGGYBLR", merchant: "Swiggy", source: "UPI", category: "Food", confidence: 0.95, explanation: "Food order paid via UPI.", isSubscription: false, ...docMeta() },
  { id: "t002", userId: DEMO_USER_ID, date: isoDaysAgo(2), amount: -129, direction: "debit", rawDescription: "Netflix subscription", merchant: "Netflix", source: "SUBSCRIPTION", category: "Subscription", confidence: 0.98, explanation: "Recurring subscription payment.", isSubscription: true, ...docMeta() },
  { id: "t003", userId: DEMO_USER_ID, date: isoDaysAgo(2), amount: -75, direction: "debit", rawDescription: "UPI-P2M-TEA-STALL", merchant: "Tea Stall", source: "UPI", category: "Food", confidence: 0.45, explanation: "Small UPI spend.", isSubscription: false, ...docMeta() },
  { id: "t004", userId: DEMO_USER_ID, date: isoDaysAgo(3), amount: -350, direction: "debit", rawDescription: "UPI-P2M-UBER", merchant: "Uber", source: "UPI", category: "Transport", confidence: 0.9, explanation: "Cab payment.", isSubscription: false, ...docMeta() },
  { id: "t005", userId: DEMO_USER_ID, date: isoDaysAgo(3), amount: -55, direction: "debit", rawDescription: "UPI-83726@ybl", merchant: "Unknown Merchant", source: "UPI", category: "Unknown", confidence: 0.3, explanation: "Unknown UPI payment.", isSubscription: false, ...docMeta() },
  { id: "t006", userId: DEMO_USER_ID, date: isoDaysAgo(4), amount: 50000, direction: "credit", rawDescription: "NEFT-SALARY", merchant: "Employer", source: "BANK_TRANSFER", category: "Salary", confidence: 0.9, explanation: "Salary credit.", isSubscription: false, ...docMeta() },
  { id: "t007", userId: DEMO_USER_ID, date: isoDaysAgo(5), amount: -119, direction: "debit", rawDescription: "SPOTIFY-PREMIUM", merchant: "Spotify", source: "SUBSCRIPTION", category: "Subscription", confidence: 0.97, explanation: "Streaming subscription.", isSubscription: true, ...docMeta() },
  { id: "t008", userId: DEMO_USER_ID, date: isoDaysAgo(6), amount: -1200, direction: "debit", rawDescription: "BIGBASKET-GROCERY", merchant: "BigBasket", source: "UPI", category: "Grocery", confidence: 0.9, explanation: "Grocery purchase.", isSubscription: false, ...docMeta() },
  { id: "t009", userId: DEMO_USER_ID, date: isoDaysAgo(7), amount: -3500, direction: "debit", rawDescription: "ELECTRICITY-BILL", merchant: "BESCOM", source: "UPI", category: "Bills", confidence: 0.9, explanation: "Utility bill payment.", isSubscription: false, ...docMeta() },
  { id: "t010", userId: DEMO_USER_ID, date: isoDaysAgo(8), amount: -199, direction: "debit", rawDescription: "JIO-RECHARGE", merchant: "Jio", source: "UPI", category: "Recharge", confidence: 0.94, explanation: "Mobile recharge.", isSubscription: false, ...docMeta() },
];

export const DEMO_WALLETS: WalletBalance[] = [
  { id: "w001", userId: DEMO_USER_ID, name: "Paytm Wallet", provider: "Paytm", balance: 1250, lastUsedAt: isoDaysAgo(10), ...docMeta() },
  { id: "w002", userId: DEMO_USER_ID, name: "PhonePe Wallet", provider: "PhonePe", balance: 320, lastUsedAt: isoDaysAgo(50), ...docMeta() },
  { id: "w003", userId: DEMO_USER_ID, name: "Amazon Pay", provider: "Amazon", balance: 840, lastUsedAt: isoDaysAgo(70), ...docMeta() },
];

export const DEMO_REWARDS: CashbackReward[] = [
  { id: "r001", userId: DEMO_USER_ID, sourceName: "PhonePe", amount: 85, status: "earned", earnedAt: isoDaysAgo(6), expiresAt: isoDaysAgo(-7), description: "Swiggy cashback", ...docMeta() },
  { id: "r002", userId: DEMO_USER_ID, sourceName: "Amazon Pay", amount: 50, status: "pending", earnedAt: isoDaysAgo(2), expiresAt: isoDaysAgo(-3), description: "Shopping reward", ...docMeta() },
  { id: "r003", userId: DEMO_USER_ID, sourceName: "Paytm", amount: 40, status: "claimed", earnedAt: isoDaysAgo(25), expiresAt: null, description: "Recharge reward", ...docMeta() },
];

export const DEMO_SUBSCRIPTIONS: Subscription[] = [
  { id: "s001", userId: DEMO_USER_ID, merchant: "Netflix", amount: 149, frequency: "monthly", nextDate: isoDaysAgo(-12), lastDate: isoDaysAgo(18), sourceType: "SUBSCRIPTION", isActive: true, overlapGroup: "ott", ...docMeta() },
  { id: "s002", userId: DEMO_USER_ID, merchant: "Spotify", amount: 119, frequency: "monthly", nextDate: isoDaysAgo(-8), lastDate: isoDaysAgo(22), sourceType: "SUBSCRIPTION", isActive: true, overlapGroup: "music", ...docMeta() },
  { id: "s003", userId: DEMO_USER_ID, merchant: "Disney+ Hotstar", amount: 99, frequency: "monthly", nextDate: isoDaysAgo(-5), lastDate: isoDaysAgo(25), sourceType: "SUBSCRIPTION", isActive: true, overlapGroup: "ott", ...docMeta() },
];

export const DEMO_RULES: Rule[] = [
  { id: "rule-1", userId: DEMO_USER_ID, field: "merchant", operator: "contains", value: "swiggy", category: "Food", enabled: true, ...docMeta() },
  { id: "rule-2", userId: DEMO_USER_ID, field: "merchant", operator: "contains", value: "netflix", category: "Subscription", enabled: true, ...docMeta() },
];

const month = new Date().toISOString().slice(0, 7);

export const DEMO_BUDGETS: Budget[] = [
  { id: "b1", userId: DEMO_USER_ID, month, category: "Food", limitAmount: 5000, ...docMeta() },
  { id: "b2", userId: DEMO_USER_ID, month, category: "Shopping", limitAmount: 8000, ...docMeta() },
  { id: "b3", userId: DEMO_USER_ID, month, category: "Transport", limitAmount: 3000, ...docMeta() },
];

export const DEMO_GOALS: Goal[] = [
  { id: "g1", userId: DEMO_USER_ID, name: "Emergency Fund", targetAmount: 50000, currentAmount: 12000, isActive: true, targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString(), ...docMeta() },
  { id: "g2", userId: DEMO_USER_ID, name: "New Phone", targetAmount: 30000, currentAmount: 8000, isActive: true, targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(), ...docMeta() },
];
