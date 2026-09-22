import { getPool, isDatabaseConfigured } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      ok: false,
      configured: false,
      error: "DATABASE_HOST/USER/PASSWORD/NAME are missing on this deployment",
    });
  }

  try {
    const [rows] = await getPool().query("SELECT 1 AS ok");
    return NextResponse.json({
      ok: true,
      configured: true,
      result: rows,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        error: message.replace(/password[^,\s]*/gi, "password"),
      },
      { status: 503 },
    );
  }
}
