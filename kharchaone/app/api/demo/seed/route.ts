import { NextResponse } from "next/server";
import { bootstrapJsonDb, budgetsRepo, goalsRepo, rewardsRepo, rulesRepo, subscriptionsRepo, transactionsRepo, usersRepo, walletsRepo } from "@/lib/json-db";
import { DEMO_BUDGETS, DEMO_GOALS, DEMO_REWARDS, DEMO_RULES, DEMO_SUBSCRIPTIONS, DEMO_TRANSACTIONS, DEMO_USER, DEMO_WALLETS } from "@/lib/demo-data";

export async function POST() {
  await bootstrapJsonDb();
  await usersRepo.replaceAll([DEMO_USER]);
  await transactionsRepo.replaceAll(DEMO_TRANSACTIONS);
  await rewardsRepo.replaceAll(DEMO_REWARDS);
  await walletsRepo.replaceAll(DEMO_WALLETS);
  await subscriptionsRepo.replaceAll(DEMO_SUBSCRIPTIONS);
  await rulesRepo.replaceAll(DEMO_RULES);
  await budgetsRepo.replaceAll(DEMO_BUDGETS);
  await goalsRepo.replaceAll(DEMO_GOALS);

  return NextResponse.json({ ok: true, message: "Demo data seeded" });
}
