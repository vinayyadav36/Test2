interface CashbackReward {
  id: string;
  sourceName: string;
  amount: number;
  status: string;
  earnedAt?: Date | null;
  expiresAt?: Date | null;
  description?: string | null;
}

export interface CashbackSummary {
  totalEarned: number;
  totalPending: number;
  totalClaimed: number;
  expiringWithin7Days: CashbackReward[];
  expiringWithin30Days: CashbackReward[];
  bySource: Record<string, number>;
}

export function computeCashbackSummary(rewards: CashbackReward[]): CashbackSummary {
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 86400000);
  const in30 = new Date(now.getTime() + 30 * 86400000);

  const totalEarned = rewards.filter((r) => r.status === "earned").reduce((s, r) => s + r.amount, 0);
  const totalPending = rewards.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const totalClaimed = rewards.filter((r) => r.status === "claimed").reduce((s, r) => s + r.amount, 0);

  const expiringWithin7Days = rewards.filter(
    (r) => r.expiresAt && r.expiresAt <= in7 && r.expiresAt > now && r.status !== "claimed"
  );
  const expiringWithin30Days = rewards.filter(
    (r) => r.expiresAt && r.expiresAt <= in30 && r.expiresAt > now && r.status !== "claimed"
  );

  const bySource: Record<string, number> = {};
  for (const r of rewards) {
    bySource[r.sourceName] = (bySource[r.sourceName] || 0) + r.amount;
  }

  return { totalEarned, totalPending, totalClaimed, expiringWithin7Days, expiringWithin30Days, bySource };
}
