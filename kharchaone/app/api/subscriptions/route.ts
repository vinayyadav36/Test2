import { NextResponse } from "next/server";
import { DEMO_SUBSCRIPTIONS } from "@/lib/demo-data";

export async function GET() {
  const totalMonthly = DEMO_SUBSCRIPTIONS.filter((s) => s.isActive && s.frequency === "monthly").reduce((s, sub) => s + sub.amount, 0);
  return NextResponse.json({ subscriptions: DEMO_SUBSCRIPTIONS, totalMonthly });
}
