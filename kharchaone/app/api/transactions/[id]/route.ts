import { NextResponse } from "next/server";
import { z } from "zod";
import { anomaliesRepo, categoryFeedbackRepo, transactionsRepo } from "@/lib/json-db";
import { getSessionUserId } from "@/lib/auth";
import { recomputeCurrentMonthArtifacts } from "@/lib/monthly-maintenance";

const patchSchema = z.object({
  category: z.string().optional(),
  note: z.string().optional(),
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const txn = await transactionsRepo.getById(params.id);
  if (!txn) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  const anomaly = await anomaliesRepo.query((a) => a.transactionId === params.id && a.status !== "dismissed");
  return NextResponse.json({
    transaction: anomaly.length
      ? { ...txn, anomaly: { flagged: true, reason: anomaly[0].message } }
      : txn,
    anomaly: anomaly[0] ?? null,
  });
}

async function updateTransaction(req: Request, { params }: { params: { id: string } }) {
  const userId = getSessionUserId();
  const existing = await transactionsRepo.getById(params.id);
  if (!existing) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updated = await transactionsRepo.update(params.id, {
    category: (parsed.data.category ?? existing.category) as typeof existing.category,
    note: parsed.data.note ?? existing.note,
    notes: parsed.data.note ?? existing.notes,
  });

  if (parsed.data.category && parsed.data.category !== existing.category) {
    const merchant = existing.merchant.toLowerCase();
    const all = await categoryFeedbackRepo.query((f) => f.userId === userId && f.merchant.toLowerCase() === merchant && f.fromCategory === existing.category && f.toCategory === parsed.data.category);
    if (all.length > 0) {
      await categoryFeedbackRepo.update(all[0].id, { count: all[0].count + 1, lastChangedAt: new Date().toISOString() });
    } else {
      await categoryFeedbackRepo.insert({
        userId,
        merchant: existing.merchant,
        fromCategory: existing.category,
        toCategory: parsed.data.category as typeof existing.category,
        count: 1,
        lastChangedAt: new Date().toISOString(),
      });
    }
  }

  const feedback = await categoryFeedbackRepo.query((f) => f.userId === userId && f.merchant.toLowerCase() === existing.merchant.toLowerCase());
  const suggestion =
    feedback.find((f) => f.count >= 3) &&
    `You often change ${existing.merchant} to ${feedback.find((f) => f.count >= 3)?.toCategory}. Consider creating a rule.`;
  await recomputeCurrentMonthArtifacts(userId);
  return NextResponse.json({ transaction: updated, ruleSuggestion: suggestion ?? null });
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  return updateTransaction(req, context);
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  return updateTransaction(req, context);
}
