// app/api/health/route.ts
// Lightweight endpoint used by Docker's healthcheck.

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}