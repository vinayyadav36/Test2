export const DEFAULT_USER_ID = "local-user-001";
export const DEFAULT_USER_EMAIL = "user@kharchaone.local";

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#ef4444",
  Grocery: "#22c55e",
  Transport: "#3b82f6",
  Shopping: "#a855f7",
  Bills: "#f97316",
  Recharge: "#06b6d4",
  Health: "#ec4899",
  Education: "#6366f1",
  Entertainment: "#f59e0b",
  Subscription: "#8b5cf6",
  Transfer: "#64748b",
  Travel: "#0ea5e9",
  Salary: "#10b981",
  Cashback: "#84cc16",
  Refund: "#14b8a6",
  Rent: "#78716c",
  EMI: "#dc2626",
  Miscellaneous: "#9ca3af",
  Unknown: "#6b7280",
};

export const CATEGORIES = [
  "Food", "Grocery", "Transport", "Shopping", "Bills", "Recharge", "Health",
  "Education", "Entertainment", "Subscription", "Transfer", "Travel", "Salary",
  "Cashback", "Refund", "Rent", "EMI", "Miscellaneous", "Unknown",
] as const;

export const SOURCE_LABELS: Record<string, string> = {
  UPI: "UPI",
  CARD: "Card",
  WALLET: "Wallet",
  BANK_TRANSFER: "Bank Transfer",
  SUBSCRIPTION: "Subscription",
  CASHBACK: "Cashback",
  REFUND: "Refund",
};
