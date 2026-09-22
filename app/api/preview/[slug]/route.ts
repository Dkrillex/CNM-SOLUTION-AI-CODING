import { projectDir } from "@/lib/project-fs";
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    const html = await readFile(path.join(projectDir(slug), "preview.html"), "utf8");
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy":
          "sandbox allow-scripts allow-forms; frame-ancestors 'self'",
      },
    });
  } catch {
    return NextResponse.json({ error: "Preview not found. Deploy the app first." }, { status: 404 });
  }
}
