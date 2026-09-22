import type { GeneratedApp } from "@/lib/generate-app";
import { ensureSchema, getPool, isDatabaseConfigured } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function saveGeneratedApp(app: GeneratedApp) {
  if (!isDatabaseConfigured()) return;
  await ensureSchema();
  const previewHtml = app.previewHtml?.trim() || "<!doctype html><title>empty</title>";
  await getPool().query(
    `INSERT INTO generated_apps (slug, name, summary, preview_html, payload)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       summary = VALUES(summary),
       preview_html = VALUES(preview_html),
       payload = VALUES(payload)`,
    [app.slug, app.name, app.summary, previewHtml, JSON.stringify(app)],
  );
}

export async function loadGeneratedPreview(slug: string) {
  if (!isDatabaseConfigured()) return null;
  await ensureSchema();
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT preview_html FROM generated_apps WHERE slug = ? LIMIT 1`,
    [slug],
  );
  const html = rows[0]?.preview_html;
  return typeof html === "string" && html.trim() ? html : null;
}
