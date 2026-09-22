import type { GeneratedApp } from "@/lib/generate-app";
import { saveGeneratedApp } from "@/lib/generated-store";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

function generatedRoot() {
  if (process.env.VERCEL) return path.join("/tmp", "generated");
  return path.join(process.cwd(), "generated");
}

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
  return path.join(generatedRoot(), safeSlug(slug));
}

export async function writeGeneratedProject(app: GeneratedApp) {
  const slug = safeSlug(app.slug);
  const files = [...app.files];
  if (app.previewHtml && !files.some((f) => f.path === "preview.html")) {
    files.push({ path: "preview.html", language: "html", content: app.previewHtml });
  }

  await saveGeneratedApp({ ...app, slug });

  const dir = projectDir(slug);
  try {
    await mkdir(dir, { recursive: true });
    for (const file of files) {
      const rel = safeRel(file.path);
      const abs = path.join(dir, rel);
      await mkdir(path.dirname(abs), { recursive: true });
      await writeFile(abs, file.content, "utf8");
    }
  } catch (error) {
    if (!process.env.VERCEL) throw error;
  }

  return {
    diskPath: `generated/${slug}`,
    absPath: dir,
  };
}
