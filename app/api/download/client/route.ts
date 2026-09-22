import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { error: "Desktop client is coming soon." },
    { status: 404 },
  );
}
