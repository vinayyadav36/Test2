import { describe, expect, it } from "vitest";
import { detectSubscriptions } from "../lib/subscription-detector";
import { NormalizedTransaction } from "../types";

const base = {
  userId: "u1",
  rawDescription: "desc",
  source: "SUBSCRIPTION" as const,
  category: "Subscription" as const,
  confidence: 0.9,
  explanation: "",
  isSubscription: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("detectSubscriptions", () => {
  it("detects monthly recurring charges", () => {
    const txns: NormalizedTransaction[] = [
      { id: "1", ...base, merchant: "Netflix", amount: -149, direction: "debit", date: "2026-01-02" },
      { id: "2", ...base, merchant: "Netflix", amount: -149, direction: "debit", date: "2026-02-02" },
      { id: "3", ...base, merchant: "Netflix", amount: -149, direction: "debit", date: "2026-03-03" },
    ];
    const out = detectSubscriptions(txns);
    expect(out.length).toBe(1);
    expect(out[0].frequency).toBe("monthly");
  });
});
