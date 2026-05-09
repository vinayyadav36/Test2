import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { budgetsRepo } from "@/lib/json-db";
import { recomputeCurrentMonthArtifacts } from "@/lib/monthly-maintenance";
import { CATEGORIES } from "@/lib/constants";

const schema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  category: z.enum(CATEGORIES),
  limitAmount: z.number().positive(),
  thresholdNearRatio: z.number().min(0.5).max(1).optional(),
});

const updateSchema = schema.partial().extend({ id: z.string() });

export async function GET(req: Request) {
  const userId = getSessionUserId();
  const month = new URL(req.url).searchParams.get("month");
  const budgets = await budgetsRepo.query((b) => b.userId === userId && (!month || b.month === month));
  return NextResponse.json({ budgets });
}

export async function POST(req: Request) {
  const userId = getSessionUserId();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const budget = await budgetsRepo.insert({
    userId,
    month: parsed.data.month,
    category: parsed.data.category,
    limitAmount: parsed.data.limitAmount,
    spentAmount: 0,
    remainingAmount: parsed.data.limitAmount,
    status: "under",
    thresholdNearRatio: parsed.data.thresholdNearRatio ?? 0.8,
  });

  await recomputeCurrentMonthArtifacts(userId);
  return NextResponse.json({ budget }, { status: 201 });
}

export async function PUT(req: Request) {
  const userId = getSessionUserId();
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id, ...patch } = parsed.data;
  const updated = await budgetsRepo.update(id, patch);
  if (!updated || updated.userId !== userId) return NextResponse.json({ error: "Budget not found" }, { status: 404 });

  await recomputeCurrentMonthArtifacts(userId);
  return NextResponse.json({ budget: updated });
}
