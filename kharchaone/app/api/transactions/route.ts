import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { anomaliesRepo, transactionsRepo } from "@/lib/json-db";
import { detectAmountOutlier } from "@/lib/anomaly-engine";
import { recomputeCurrentMonthArtifacts } from "@/lib/monthly-maintenance";

const querySchema = z.object({
  category: z.string().optional(),
  source: z.string().optional(),
  q: z.string().optional(),
});

const transactionPayloadSchema = z.object({
  date: z.string(),
  amount: z.number(),
  direction: z.enum(["debit", "credit"]),
  rawDescription: z.string(),
  normalizedMerchant: z.string().optional(),
  merchant: z.string().optional(),
  source: z.enum(["UPI", "CARD", "WALLET", "BANK_TRANSFER", "SUBSCRIPTION", "CASHBACK", "REFUND"]),
  sourceName: z.string().optional(),
  category: z.string(),
  confidence: z.number().min(0).max(1).default(0.9),
  explanation: z.string(),
  isSubscription: z.boolean().default(false),
  referenceId: z.string().optional(),
  notes: z.string().optional(),
});

const updateSchema = z.object({
  id: z.string(),
  patch: transactionPayloadSchema.partial(),
});

export async function GET(req: Request) {
  const userId = getSessionUserId();
  const { searchParams } = new URL(req.url);

  const parsed = querySchema.safeParse({
    category: searchParams.get("category") ?? undefined,
    source: searchParams.get("source") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
  }

  let txns = await transactionsRepo.query((t) => t.userId === userId);
  const { category, source, q } = parsed.data;

  if (category && category !== "all") txns = txns.filter((t) => t.category === category);
  if (source && source !== "all") txns = txns.filter((t) => t.source === source);
  if (q) {
    const needle = q.toLowerCase();
    txns = txns.filter((t) => t.merchant.toLowerCase().includes(needle) || (t.note ?? "").toLowerCase().includes(needle));
  }

  txns = txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ transactions: txns, total: txns.length });
}

export async function POST(req: Request) {
  const userId = getSessionUserId();
  const body = await req.json().catch(() => null);
  const parsed = transactionPayloadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const payload = parsed.data;
  const historical = await transactionsRepo.query((t) => t.userId === userId);
  const created = await transactionsRepo.insert({
    userId,
    date: payload.date,
    amount: payload.direction === "debit" ? -Math.abs(payload.amount) : Math.abs(payload.amount),
    direction: payload.direction,
    rawDescription: payload.rawDescription,
    merchant: payload.merchant ?? payload.normalizedMerchant ?? "Unknown Merchant",
    normalizedMerchant: payload.normalizedMerchant ?? payload.merchant ?? "Unknown Merchant",
    source: payload.source,
    sourceType: payload.source,
    sourceName: payload.sourceName,
    category: payload.category as never,
    confidence: payload.confidence,
    explanation: payload.explanation,
    isSubscription: payload.isSubscription,
    referenceId: payload.referenceId,
    note: payload.notes,
    notes: payload.notes,
  });

  const anomaly = detectAmountOutlier(userId, created, [...historical, created]);
  if (anomaly) await anomaliesRepo.insert(anomaly);
  await recomputeCurrentMonthArtifacts(userId);

  return NextResponse.json({ transaction: created }, { status: 201 });
}

export async function PUT(req: Request) {
  const userId = getSessionUserId();
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updated = await transactionsRepo.update(parsed.data.id, parsed.data.patch as never);
  if (!updated) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  await recomputeCurrentMonthArtifacts(userId);
  return NextResponse.json({ transaction: updated });
}
