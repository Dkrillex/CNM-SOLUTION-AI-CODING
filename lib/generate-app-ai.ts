import { chatJson, chatJsonStream, getAiConfig, parseJsonObject } from "@/lib/ai";
import type { GeneratedApp, GeneratedFile } from "@/lib/generate-app";

export type BuildStreamEvent =
  | { type: "status"; message: string }
  | { type: "delta"; text: string }
  | { type: "done"; app: GeneratedApp }
  | { type: "error"; message: string };

const SYSTEM = `You are cnmsolution.ai Builder. Generate a REAL, runnable Next.js 16 App Router product from the user's brief.

Return ONLY a raw JSON object. No markdown fences, no bash/docker preambles.

Shape:
{
  "name": "Product Name",
  "slug": "kebab-case-id",
  "summary": "one sentence",
  "stack": ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "NextAuth"],
  "features": ["4-6 concrete features"],
  "schema": [{"table":"users","columns":["id","email","name"]}],
  "previewHtml": "<!doctype html>... complete standalone marketing/app UI using Tailwind CDN, dark zinc background, lime accent, works offline",
  "files": [
    {"path":"package.json","content":"..."},
    {"path":"app/layout.tsx","content":"..."},
    {"path":"app/page.tsx","content":"..."},
    {"path":"app/globals.css","content":"..."},
    {"path":"README.md","content":"..."}
  ]
}

Rules:
- files MUST include: package.json, app/layout.tsx, app/page.tsx, app/globals.css, README.md.
- Add at most 2 extra files if the product needs an API route or helper.
- package.json scripts: dev/build/start. Dependencies must be real (next, react, react-dom, typescript).
- Code must be complete TypeScript/TSX, no placeholders like TODO or "implement later".
- UI must match the user's request, not a generic hello world.
- previewHtml is a compact standalone HTML page; keep it under 80 lines.
- slug: lowercase kebab-case, ascii only.
- 5-7 files. No binary files.`;

function langOf(filePath: string) {
  const ext = filePath.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "ts",
    tsx: "tsx",
    js: "js",
    jsx: "jsx",
    json: "json",
    md: "markdown",
    css: "css",
    sql: "sql",
    prisma: "prisma",
    html: "html",
    env: "bash",
  };
  return map[ext ?? ""] ?? "text";
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function buildPreview(name: string, summary: string, features: string[]) {
  const items = features
    .map((f) => `<li style="margin:8px 0;color:#a1a1aa">${f}</li>`)
    .join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${name}</title>
<script src="https://cdn.tailwindcss.com"></script></head>
<body class="min-h-screen bg-zinc-950 text-zinc-50">
<main class="mx-auto max-w-3xl px-6 py-20">
<p class="font-mono text-xs uppercase tracking-widest text-lime-400">cnmsolution.ai · generated</p>
<h1 class="mt-4 text-5xl font-semibold tracking-tight">${name}</h1>
<p class="mt-4 text-zinc-400">${summary}</p>
<ul class="mt-8">${items}</ul>
</main></body></html>`;
}

export function appFromAiJson(prompt: string, raw: string): GeneratedApp {
  const data = parseJsonObject(raw);

  const name = String(data.name || "cnmsolution.ai App").slice(0, 80);
  const slug =
    String(data.slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "cnm-app";
  const summary = String(data.summary || prompt).slice(0, 280);
  const stack = asStringArray(data.stack);
  const features = asStringArray(data.features);
  const schema = Array.isArray(data.schema)
    ? data.schema
        .map((row) => {
          const item = row as { table?: unknown; columns?: unknown };
          return {
            table: String(item.table || ""),
            columns: asStringArray(item.columns),
          };
        })
        .filter((row) => row.table)
    : [];

  const files: GeneratedFile[] = Array.isArray(data.files)
    ? data.files
        .map((row) => {
          const item = row as { path?: unknown; content?: unknown; language?: unknown };
          const filePath = String(item.path || "").replace(/\\/g, "/").replace(/^\/+/, "");
          if (!filePath || filePath.includes("..")) return null;
          return {
            path: filePath,
            language: String(item.language || langOf(filePath)),
            content: String(item.content || ""),
          };
        })
        .filter((file): file is GeneratedFile => Boolean(file?.path && file.content))
        .slice(0, 16)
    : [];

  if (files.length < 3) {
    throw new Error("AI did not return enough project files");
  }

  const previewHtml =
    String(data.previewHtml || "").trim() || buildPreview(name, summary, features);

  return {
    id: `bld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    prompt,
    name,
    slug,
    summary,
    stack: stack.length ? stack : ["Next.js", "TypeScript"],
    features,
    schema,
    files,
    previewHtml,
    createdAt: new Date().toISOString(),
    status: "generated",
    source: "ai",
  };
}

export async function generateAppWithAi(prompt: string): Promise<GeneratedApp> {
  const raw = await chatJson(SYSTEM, `Build this product:\n${prompt}`);
  return appFromAiJson(prompt, raw);
}

export async function* generateAppWithAiStream(
  prompt: string,
): AsyncGenerator<BuildStreamEvent> {
  const config = getAiConfig();
  yield {
    type: "status",
    message: `connecting ${config?.model ?? "model"} · ${config?.baseUrl ?? ""}`,
  };
  yield { type: "status", message: "waiting for first token" };
  let raw = "";
  let first = true;
  for await (const piece of chatJsonStream(SYSTEM, `Build this product:\n${prompt}`)) {
    if (first) {
      first = false;
      yield { type: "status", message: "streaming tokens" };
    }
    raw += piece;
    yield { type: "delta", text: piece };
  }
  yield { type: "status", message: `received ${raw.length} chars · parsing project` };
  yield { type: "done", app: appFromAiJson(prompt, raw) };
}
