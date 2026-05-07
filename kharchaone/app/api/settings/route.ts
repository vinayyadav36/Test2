import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { budgetsRepo, goalsRepo, usersRepo } from "@/lib/json-db";

const patchSchema = z.object({
  darkMode: z.boolean().optional(),
  smallUpiThreshold: z.number().min(50).max(1000).optional(),
});

export async function GET() {
  const userId = getSessionUserId();
  const [user, budgets, goals] = await Promise.all([
    usersRepo.getById(userId),
    budgetsRepo.query((b) => b.userId === userId),
    goalsRepo.query((g) => g.userId === userId),
  ]);
  return NextResponse.json({ user, budgets, goals });
}

export async function PATCH(req: Request) {
  const userId = getSessionUserId();
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updated = await usersRepo.update(userId, parsed.data);
  if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user: updated });
}
