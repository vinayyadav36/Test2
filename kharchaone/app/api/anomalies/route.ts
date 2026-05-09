import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { anomaliesRepo } from "@/lib/json-db";

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(["acknowledged", "dismissed"]),
});

export async function GET(req: Request) {
  const userId = getSessionUserId();
  const status = new URL(req.url).searchParams.get("status");
  const anomalies = await anomaliesRepo.query(
    (a) => a.userId === userId && (!status || a.status === status)
  );
  return NextResponse.json({ anomalies });
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updated = await anomaliesRepo.update(parsed.data.id, { status: parsed.data.status });
  if (!updated) return NextResponse.json({ error: "Anomaly not found" }, { status: 404 });
  return NextResponse.json({ anomaly: updated });
}
