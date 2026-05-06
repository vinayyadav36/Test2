import { NextResponse } from "next/server";
import { parseCSVText } from "@/lib/csv-importer";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const { transactions, errors } = parseCSVText(text);

    return NextResponse.json({ imported: transactions.length, transactions, errors });
  } catch (err) {
    return NextResponse.json({ error: "Failed to parse CSV" }, { status: 500 });
  }
}
