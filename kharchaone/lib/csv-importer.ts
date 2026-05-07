import Papa from "papaparse";
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
  const parsed = Papa.parse<Record<string, string>>(csvText, { header: true, skipEmptyLines: true });
  const errors: string[] = [];

  if (!parsed.meta.fields?.length) {
    return { rows: [], errors: ["CSV must include headers."], total: 0, imported: 0, failed: 0 };
  }

  const headers = parsed.meta.fields.map((h) => h.trim().toLowerCase());
  for (const req of REQUIRED_HEADERS) {
    if (!headers.includes(req)) errors.push(`Missing required column: ${req}`);
  }
  if (errors.length) return { rows: [], errors, total: parsed.data.length, imported: 0, failed: parsed.data.length };

  const rows: RawTransactionRow[] = [];
  parsed.data.forEach((obj, index) => {
    const i = index + 2;
    const amount = Number(obj.amount);
    const type = String(obj.type || "").toLowerCase();

    if (!obj.date || !obj.raw_description || Number.isNaN(amount) || !["debit", "credit"].includes(type)) {
      errors.push(`Row ${i}: invalid required fields`);
      return;
    }

    rows.push({
      date: obj.date,
      amount,
      type: type as "debit" | "credit",
      raw_description: obj.raw_description,
      source_type: obj.source_type,
      source_name: obj.source_name,
      merchant: obj.merchant,
      reference_id: obj.reference_id,
      notes: obj.notes,
      cashback_amount: obj.cashback_amount,
      cashback_status: obj.cashback_status,
      reward_expiry_date: obj.reward_expiry_date,
      subscription_flag: obj.subscription_flag,
    });
  });

  return { rows, errors, total: parsed.data.length, imported: rows.length, failed: errors.length };
}
