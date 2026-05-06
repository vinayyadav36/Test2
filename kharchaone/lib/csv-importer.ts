import { RawTransactionRow } from "@/types";

const REQUIRED_HEADERS = ["date", "amount", "type", "raw_description"];

export interface ImportResult {
  rows: RawTransactionRow[];
  errors: string[];
  total: number;
  imported: number;
  failed: number;
}

export function parseCSVText(csvText: string): ImportResult {
  const errors: string[] = [];
  const rows: RawTransactionRow[] = [];

  const lines = csvText.trim().split("\n");
  if (lines.length < 2) {
    return { rows: [], errors: ["CSV must have a header row and at least one data row."], total: 0, imported: 0, failed: 0 };
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));

  for (const req of REQUIRED_HEADERS) {
    if (!headers.includes(req)) {
      errors.push(`Missing required column: ${req}`);
    }
  }
  if (errors.length > 0) {
    return { rows: [], errors, total: lines.length - 1, imported: 0, failed: lines.length - 1 };
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || "";
    });

    if (!obj.date || !obj.amount || !obj.type || !obj.raw_description) {
      errors.push(`Row ${i}: Missing required fields`);
      continue;
    }

    const amount = parseFloat(obj.amount);
    if (isNaN(amount)) {
      errors.push(`Row ${i}: Invalid amount "${obj.amount}"`);
      continue;
    }

    rows.push({
      date: obj.date,
      amount,
      type: obj.type === "credit" ? "credit" : "debit",
      raw_description: obj.raw_description,
      source_type: obj.source_type,
      source_name: obj.source_name,
      merchant: obj.merchant,
      reference_id: obj.reference_id,
      notes: obj.notes,
      wallet_name: obj.wallet_name,
      cashback_amount: obj.cashback_amount ? parseFloat(obj.cashback_amount) : undefined,
      cashback_status: obj.cashback_status,
      reward_expiry_date: obj.reward_expiry_date,
      subscription_flag: obj.subscription_flag,
    });
  }

  return { rows, errors, total: lines.length - 1, imported: rows.length, failed: errors.length };
}
