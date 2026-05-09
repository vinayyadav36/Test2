import { NextResponse } from "next/server";
import { z } from "zod";
import { parseCSVText } from "@/lib/csv-importer";
import { parseTransactionRow } from "@/lib/transaction-parser";
import { getSessionUserId } from "@/lib/auth";
import { anomaliesRepo, importsRepo, rulesRepo, transactionsRepo } from "@/lib/json-db";
import { logger } from "@/lib/logger";
import { detectAmountOutlier } from "@/lib/anomaly-engine";
import { recomputeCurrentMonthArtifacts } from "@/lib/monthly-maintenance";

const modeSchema = z.enum(["preview", "confirm"]).default("preview");

export async function POST(req: Request) {
  const userId = getSessionUserId();

  try {
    const startedAt = new Date().toISOString();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No CSV file provided" }, { status: 400 });

    const mode = modeSchema.parse(String(formData.get("mode") || "preview"));
    const text = await file.text();
    logger.info("Import started", { fileName: file.name, mode });

    const result = parseCSVText(text);
    const rules = await rulesRepo.query((r) => r.userId === userId);
    const transactions = result.rows.map((row) => parseTransactionRow(row, userId, rules));

    if (mode === "confirm") {
      const existingTxns = await transactionsRepo.query((t) => t.userId === userId);
      const inserted = await Promise.all(transactions.map((txn) => transactionsRepo.insert(txn)));
      const anomalies = inserted
        .map((txn) => detectAmountOutlier(userId, txn, [...existingTxns, ...inserted]))
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
      if (anomalies.length > 0) {
        await Promise.all(anomalies.map((item) => anomaliesRepo.insert(item)));
      }

      await importsRepo.insert({
        userId,
        fileName: file.name,
        source: "manual_csv_upload",
        totalRows: result.total,
        importedRows: transactions.length,
        failedRows: result.failed,
        startedAt,
        finishedAt: new Date().toISOString(),
        errorSummary: result.errors,
        errors: result.errors,
      });
      await recomputeCurrentMonthArtifacts(userId);
    }

    logger.info("Import finished", { fileName: file.name, imported: transactions.length, errors: result.errors.length });
    return NextResponse.json({ mode, imported: transactions.length, transactions, errors: result.errors });
  } catch (error) {
    logger.error("Import failed", error);
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 });
  }
}
