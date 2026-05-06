import { NextResponse } from "next/server";
import { DEMO_WALLETS } from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({ wallets: DEMO_WALLETS });
}
