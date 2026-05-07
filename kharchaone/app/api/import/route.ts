import { NextResponse } from "next/server";
import { z } from "zod";
import { parseCSVText } from "@/lib/csv-importer";
import { parseTransactionRow } from "@/lib/transaction-parser";
import { getSessionUserId } from "@/lib/auth";
import { importsRepo, rulesRepo, transactionsRepo } from "@/lib/json-db";
import { logger } from "@/lib/logger";

const modeSchema = z.enum(["preview", "confirm"]).default("preview");

export async function POST(req: Request) {
  const userId = getSessionUserId();

  try {
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
      await Promise.all(transactions.map((txn) => transactionsRepo.insert(txn)));
      await importsRepo.insert({
        userId,
        fileName: file.name,
        totalRows: result.total,
        importedRows: transactions.length,
        failedRows: result.failed,
        errors: result.errors,
      });
    }

    logger.info("Import finished", { fileName: file.name, imported: transactions.length, errors: result.errors.length });
    return NextResponse.json({ mode, imported: transactions.length, transactions, errors: result.errors });
  } catch (error) {
    logger.error("Import failed", error);
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 });
  }
}
