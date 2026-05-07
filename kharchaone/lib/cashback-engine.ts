import { CashbackReward } from "@/types";

export interface CashbackSummary {
  totalEarned: number;
  totalPending: number;
  totalClaimed: number;
  totalExpired: number;
  realizedVsPotentialPct: number;
  expiringWithin7Days: CashbackReward[];
  expiringWithin30Days: CashbackReward[];
  bySource: Record<string, number>;
}

export function computeCashbackSummary(rewards: CashbackReward[]): CashbackSummary {
  const now = Date.now();
  const in7 = now + 7 * 86400000;
  const in30 = now + 30 * 86400000;

  const totalEarned = rewards.filter((r) => r.status === "earned").reduce((s, r) => s + r.amount, 0);
  const totalPending = rewards.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const totalClaimed = rewards.filter((r) => r.status === "claimed").reduce((s, r) => s + r.amount, 0);
  const totalExpired = rewards.filter((r) => r.status === "expired").reduce((s, r) => s + r.amount, 0);

  const expiringWithin7Days = rewards.filter((r) => r.expiresAt && new Date(r.expiresAt).getTime() <= in7 && new Date(r.expiresAt).getTime() > now && r.status !== "claimed");
  const expiringWithin30Days = rewards.filter((r) => r.expiresAt && new Date(r.expiresAt).getTime() <= in30 && new Date(r.expiresAt).getTime() > now && r.status !== "claimed");

  const bySource: Record<string, number> = {};
  rewards.forEach((r) => {
    bySource[r.sourceName] = (bySource[r.sourceName] || 0) + r.amount;
  });

  const potential = totalEarned + totalPending;
  const realizedVsPotentialPct = potential > 0 ? Number(((totalClaimed / potential) * 100).toFixed(1)) : 0;

  return { totalEarned, totalPending, totalClaimed, totalExpired, realizedVsPotentialPct, expiringWithin7Days, expiringWithin30Days, bySource };
}
