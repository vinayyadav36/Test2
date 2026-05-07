import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { rewardsRepo } from "@/lib/json-db";
import { computeCashbackSummary } from "@/lib/cashback-engine";

export async function GET() {
  const userId = getSessionUserId();
  const rewards = await rewardsRepo.query((r) => r.userId === userId);
  const summary = computeCashbackSummary(rewards);

  return NextResponse.json({ rewards, ...summary });
}
