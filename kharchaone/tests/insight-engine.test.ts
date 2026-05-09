import { describe, expect, it } from "vitest";
import { buildMonthlyAnalytics } from "../lib/insight-engine";
import { CashbackReward, NormalizedTransaction, Subscription, WalletBalance } from "../types";

const nowMeta = { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

describe("buildMonthlyAnalytics", () => {
  it("builds monthly totals and small UPI stats", () => {
    const txns: NormalizedTransaction[] = [
      {
        id: "t1",
        userId: "u1",
        date: "2026-05-02T10:00:00.000Z",
        amount: -120,
        direction: "debit",
        rawDescription: "UPI tea",
        merchant: "Tea",
        normalizedMerchant: "Tea",
        source: "UPI",
        sourceType: "UPI",
        category: "Food",
        confidence: 0.9,
        explanation: "",
        isSubscription: false,
        ...nowMeta,
      },
      {
        id: "t2",
        userId: "u1",
        date: "2026-05-03T10:00:00.000Z",
        amount: -800,
        direction: "debit",
        rawDescription: "Grocery",
        merchant: "Store",
        normalizedMerchant: "Store",
        source: "UPI",
        sourceType: "UPI",
        category: "Grocery",
        confidence: 0.9,
        explanation: "",
        isSubscription: false,
        ...nowMeta,
      },
      {
        id: "t3",
        userId: "u1",
        date: "2026-05-04T10:00:00.000Z",
        amount: 5000,
        direction: "credit",
        rawDescription: "Salary",
        merchant: "Employer",
        normalizedMerchant: "Employer",
        source: "BANK_TRANSFER",
        sourceType: "BANK_TRANSFER",
        category: "Salary",
        confidence: 0.9,
        explanation: "",
        isSubscription: false,
        ...nowMeta,
      },
    ];

    const rewards: CashbackReward[] = [
      { id: "r1", userId: "u1", sourceName: "PhonePe", amount: 50, status: "earned", earnedAt: "2026-05-03", ...nowMeta },
      { id: "r2", userId: "u1", sourceName: "PhonePe", amount: 20, status: "pending", earnedAt: "2026-05-03", ...nowMeta },
    ];

    const wallets: WalletBalance[] = [
      { id: "w1", userId: "u1", name: "PhonePe", walletName: "PhonePe", balance: 100, status: "active", ...nowMeta },
      { id: "w2", userId: "u1", name: "Amazon", walletName: "Amazon", balance: 300, status: "dormant", ...nowMeta },
    ];

    const subscriptions: Subscription[] = [
      {
        id: "s1",
        userId: "u1",
        merchant: "Netflix",
        amount: 300,
        averageAmount: 300,
        cycle: "monthly",
        frequency: "monthly",
        sourceType: "CARD",
        isActive: true,
        ...nowMeta,
      },
    ];

    const out = buildMonthlyAnalytics("u1", "2026-05", txns, rewards, wallets, subscriptions, 200);

    expect(out.totalIncome).toBe(5000);
    expect(out.totalExpense).toBe(920);
    expect(out.smallUpiStats.count).toBe(1);
    expect(out.cashbackSummary.earned).toBe(50);
    expect(out.walletFloat.activeTotal).toBe(100);
    expect(out.subscriptionCostMonthly).toBe(300);
  });
});
