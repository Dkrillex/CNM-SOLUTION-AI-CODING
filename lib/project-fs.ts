import type { GeneratedApp } from "@/lib/generate-app";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ROOT = path.join(process.cwd(), "generated");

function safeSlug(slug: string) {
  const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
  if (!clean) throw new Error("Invalid project slug");
  return clean;
}

function safeRel(filePath: string) {
  const clean = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!clean || clean.includes("..") || path.isAbsolute(clean)) {
    throw new Error(`Unsafe file path: ${filePath}`);
  }
  return clean;
}

export function projectDir(slug: string) {
  return path.join(ROOT, safeSlug(slug));
}

export async function writeGeneratedProject(app: GeneratedApp) {
  const dir = projectDir(app.slug);
  await mkdir(dir, { recursive: true });

  const files = [...app.files];
  if (app.previewHtml && !files.some((f) => f.path === "preview.html")) {
    files.push({ path: "preview.html", language: "html", content: app.previewHtml });
  }

  for (const file of files) {
    const rel = safeRel(file.path);
    const abs = path.join(dir, rel);
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, file.content, "utf8");
  }

  return {
    diskPath: `generated/${safeSlug(app.slug)}`,
    absPath: dir,
  };
}
