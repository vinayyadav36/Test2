import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { goalsRepo } from "@/lib/json-db";

const schema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  currentSavedAmount: z.number().min(0).default(0),
  targetDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["in_progress", "achieved", "paused", "abandoned"]).default("in_progress"),
});

const updateSchema = schema.partial().extend({ id: z.string() });

export async function GET() {
  const userId = getSessionUserId();
  const goals = await goalsRepo.query((g) => g.userId === userId);
  return NextResponse.json({ goals });
}

export async function POST(req: Request) {
  const userId = getSessionUserId();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const goal = await goalsRepo.insert({
    userId,
    name: parsed.data.name,
    targetAmount: parsed.data.targetAmount,
    currentSavedAmount: parsed.data.currentSavedAmount,
    targetDate: parsed.data.targetDate,
    priority: parsed.data.priority,
    status: parsed.data.status,
    currentAmount: parsed.data.currentSavedAmount,
    isActive: parsed.data.status === "in_progress",
  });

  return NextResponse.json({ goal }, { status: 201 });
}

export async function PUT(req: Request) {
  const userId = getSessionUserId();
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updatePayload = {
    ...parsed.data,
    currentAmount: parsed.data.currentSavedAmount,
    isActive: parsed.data.status ? parsed.data.status === "in_progress" : undefined,
  };
  const updated = await goalsRepo.update(parsed.data.id, updatePayload);
  if (!updated || updated.userId !== userId) return NextResponse.json({ error: "Goal not found" }, { status: 404 });

  return NextResponse.json({ goal: updated });
}
