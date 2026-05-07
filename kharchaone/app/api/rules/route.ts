import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { Rule } from "@/types";
import { categoryFeedbackRepo, rulesRepo } from "@/lib/json-db";

const createRuleSchema = z.object({
  field: z.enum(["merchant", "description", "sourceType"]),
  operator: z.enum(["contains", "equals", "regex"]),
  value: z.string().min(1),
  category: z.string().optional(),
  sourceType: z.enum(["UPI", "CARD", "WALLET", "BANK_TRANSFER", "SUBSCRIPTION", "CASHBACK", "REFUND"]).optional(),
  enabled: z.boolean().default(true),
});

export async function GET() {
  const userId = getSessionUserId();
  const [rules, feedback] = await Promise.all([
    rulesRepo.query((r) => r.userId === userId),
    categoryFeedbackRepo.query((f) => f.userId === userId && f.count >= 3),
  ]);

  const suggestions = feedback.map((f) => ({
    merchant: f.merchant,
    toCategory: f.toCategory,
    count: f.count,
    message: `You've categorized ${f.count} payments to ${f.merchant} as ${f.toCategory}. Create a rule?`,
  }));

  return NextResponse.json({ rules, suggestions });
}

export async function POST(req: Request) {
  const userId = getSessionUserId();
  const body = await req.json().catch(() => null);
  const parsed = createRuleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const rule = await rulesRepo.insert({
    userId,
    field: parsed.data.field,
    operator: parsed.data.operator,
    value: parsed.data.value,
    category: parsed.data.category as Rule["category"],
    sourceType: parsed.data.sourceType,
    enabled: parsed.data.enabled,
  });
  return NextResponse.json({ rule }, { status: 201 });
}
