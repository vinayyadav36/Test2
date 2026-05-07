import { describe, expect, it } from "vitest";
import { parseTransactionRow } from "../lib/transaction-parser";

describe("parseTransactionRow", () => {
  it("parses debit and infers source/category", () => {
    const parsed = parseTransactionRow({ date: "2026-05-01", amount: "129", type: "debit", raw_description: "Netflix subscription" }, "u1");
    expect(parsed.amount).toBe(-129);
    expect(parsed.source).toBe("SUBSCRIPTION");
    expect(parsed.category).toBe("Subscription");
    expect(parsed.isSubscription).toBe(true);
  });

  it("parses cashback credit", () => {
    const parsed = parseTransactionRow({ date: "2026-05-01", amount: "50", type: "credit", raw_description: "AMAZON PAY CASHBACK", cashback_status: "earned" }, "u1");
    expect(parsed.amount).toBe(50);
    expect(parsed.direction).toBe("credit");
    expect(parsed.source).toBe("CASHBACK");
  });
});
