import { getClientDownloadUrl } from "@/lib/client-download";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  const platform = new URL(request.url).searchParams.get("platform");
  return NextResponse.redirect(getClientDownloadUrl(platform), 302);
}
