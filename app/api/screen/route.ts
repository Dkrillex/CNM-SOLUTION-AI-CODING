import { runScreen, type ScreenInput } from "@/lib/screen";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ScreenInput;
    const result = runScreen(body);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Screening failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
