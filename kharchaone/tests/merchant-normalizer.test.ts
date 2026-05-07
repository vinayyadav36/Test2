import { describe, expect, it } from "vitest";
import { normalizeMerchant } from "../lib/merchant-normalizer";

describe("normalizeMerchant", () => {
  it("normalizes popular apps", () => {
    expect(normalizeMerchant("UPI-P2M-SWIGGYBLR-1234")).toBe("Swiggy");
    expect(normalizeMerchant("txn netflix renewal")).toBe("Netflix");
  });

  it("returns unknown for noisy ids", () => {
    expect(normalizeMerchant("UPI-778899@okaxis")).toBe("Unknown Merchant");
  });
});
