import { NextResponse } from "next/server";
import { DEMO_REWARDS } from "@/lib/demo-data";

export async function GET() {
  const rewards = DEMO_REWARDS;
  const totalPending = rewards.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const totalEarned = rewards.reduce((s, r) => s + r.amount, 0);

  return NextResponse.json({ rewards, totalPending, totalEarned });
}
