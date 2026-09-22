"use client";

import { Eyebrow, LiveDot, WindowChrome } from "@/components/ambient";
import { FadeInOnMount } from "@/components/fade-in";
import { Navbar } from "@/components/navbar";
import { SandboxedPreview } from "@/components/sandboxed-preview";
import type { GeneratedApp } from "@/lib/generate-app";
import type { BuildStreamEvent } from "@/lib/generate-app-ai";
import { useBuilds } from "@/lib/use-workspace";
import { cn } from "@/lib/utils";
import { Check, LoaderCircle, Sparkles, WandSparkles } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

export default function BuilderStudioPage() {
  const { items, add } = useBuilds();
  const [prompt, setPrompt] = useState("");
  const [revision, setRevision] = useState("");
  const [busy, setBusy] = useState<"generate" | "revise" | null>(null);
  const [app, setApp] = useState<GeneratedApp | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [tab, setTab] = useState<"code" | "preview">("code");
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [streamText, setStreamText] = useState("");
  const logRef = useRef<HTMLPreElement>(null);
  const [ai, setAi] = useState<{ configured: boolean; model: string | null } | null>(null);

  useEffect(() => {
    fetch("/api/build")
      .then((r) => r.json())
      .then(setAi)
      .catch(() => setAi({ configured: false, model: null }));
  }, []);

  const active = useMemo(
    () => app?.files.find((f) => f.path === filePath) ?? app?.files[0],
    [app, filePath],
  );

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [streamText, logs]);

  function updateActiveFile(content: string) {
    if (!app || !active) return;
    const files = app.files.map((file) =>
      file.path === active.path ? { ...file, content } : file,
    );
    setApp({
      ...app,
      files,
      previewHtml:
        active.path === "preview.html" || active.path.endsWith("/preview.html")
          ? content
          : app.previewHtml,
    });
  }

  async function runBuild(revise: boolean) {
    const text = (revise ? revision : prompt).trim();
    if (!text) return;
    setBusy(revise ? "revise" : "generate");
    setError(null);
    setLogs([revise ? "POST /api/build · revise" : "POST /api/build · stream"]);
    setStreamText("");
    try {
      const res = await fetch("/api/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          stream: true,
          revise,
          app: revise ? app : undefined,
        }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Build failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";
        for (const chunk of chunks) {
          const line = chunk.split("\n").find((row) => row.startsWith("data:"));
          if (!line) continue;
          let event: BuildStreamEvent;
          try {
            event = JSON.parse(line.slice(5).trim()) as BuildStreamEvent;
          } catch {
            continue;
          }
          if (event.type === "status") {
            setLogs((prev) => [...prev, event.message]);
          } else if (event.type === "delta") {
            setStreamText((prev) => prev + event.text);
          } else if (event.type === "done") {
            setLogs((prev) => [...prev, `done · ${event.app.files.length} files`]);
            setApp(event.app);
            setFilePath((current) => current ?? event.app.files[0]?.path ?? null);
            setTab("preview");
            if (revise) setRevision("");
            try {
              add(event.app);
            } catch {
              /* keep the in-page preview even if history cannot be saved */
            }
          } else if (event.type === "error") {
            throw new Error(event.message);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Build failed");
    } finally {
      setBusy(null);
    }
  }

  async function onBuild(e: FormEvent) {
    e.preventDefault();
    await runBuild(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container py-10 md:py-12">
        <FadeInOnMount y={16} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2.5">
              <Eyebrow>builder studio</Eyebrow>
              <LiveDot />
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Describe it. <span className="text-primary">Ship it.</span>
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Natural language in. Preview the generated UI instantly on this page.
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {ai?.configured ? `ai · ${ai.model}` : "ai · waiting for api key"}
          </p>
        </FadeInOnMount>
        {!ai?.configured ? (
          <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            AI generation is not configured. Set AI_API_KEY, AI_BASE_URL, and AI_MODEL
            in Vercel (Production), then Redeploy.
          </p>
        ) : null}

        <form onSubmit={onBuild} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            placeholder='e.g. "a course sales platform with Stripe checkout"'
            className="h-12 flex-1 rounded-md border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={busy !== null}
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy === "generate" ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {busy === "generate" ? "generating…" : app ? "new_app" : "generate_app"}
          </button>
        </form>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

        {app ? (
          <FadeInOnMount className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
            <WindowChrome title={`${app.slug}.cnmsolution.ai`} />
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <aside className="border-b border-border p-5 lg:col-span-4 lg:border-b-0 lg:border-r">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {app.status} · {app.source === "ai" ? "llm" : "template"}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">{app.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{app.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(app.stack ?? []).map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {(app.features ?? []).map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 space-y-2">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    schema
                  </p>
                  {(app.schema ?? []).map((t) => (
                    <div key={t.table} className="rounded-md border border-border px-3 py-2">
                      <div className="font-mono text-xs text-primary">{t.table}</div>
                      <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                        {t.columns.join(" · ")}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
              <div className="lg:col-span-8">
                <div className="flex gap-2 border-b border-border px-3 py-2">
                  {(["preview", "code"] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={cn(
                        "rounded-md px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest",
                        tab === key ? "bg-primary/10 text-primary" : "text-muted-foreground",
                      )}
                    >
                      {key}
                    </button>
                  ))}
                </div>
                {tab === "preview" ? (
                  <SandboxedPreview
                    title={`${app.slug} preview`}
                    className="h-[640px] w-full"
                    srcDoc={app.previewHtml || "<!doctype html><title>Preview</title><p>No preview.</p>"}
                  />
                ) : (
                  <>
                <div className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2">
                  {app.files.map((f) => (
                    <button
                      key={f.path}
                      type="button"
                      onClick={() => setFilePath(f.path)}
                      className={cn(
                        "rounded-md px-2.5 py-1 font-mono text-[11px] whitespace-nowrap",
                        active?.path === f.path
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {f.path}
                    </button>
                  ))}
                </div>
                <textarea
                  value={active?.content ?? ""}
                  onChange={(e) => updateActiveFile(e.target.value)}
                  spellCheck={false}
                  className="max-h-[640px] min-h-[640px] w-full resize-y border-0 bg-transparent p-5 font-mono text-[12px] leading-relaxed text-muted-foreground outline-none"
                />
                  </>
                )}
              </div>
            </div>
            <form
              className="border-t border-border bg-background/40 p-4"
              onSubmit={(e) => {
                e.preventDefault();
                void runBuild(true);
              }}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
                ask ai to edit this project
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                The model keeps the current files and applies your next instruction.
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  value={revision}
                  onChange={(e) => setRevision(e.target.value)}
                  required
                  placeholder='e.g. "make the hero bilingual and add a pricing table"'
                  className="h-12 flex-1 rounded-md border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="submit"
                  disabled={busy !== null}
                  className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {busy === "revise" ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <WandSparkles className="mr-2 h-4 w-4" />
                  )}
                  {busy === "revise" ? "revising…" : "revise_with_ai"}
                </button>
              </div>
            </form>
          </FadeInOnMount>
        ) : null}

        {busy || logs.length ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
            <WindowChrome title="build.stream" live={busy ? "live" : "idle"} />
            <div className="border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {busy
                ? `streaming · ${streamText.length} chars`
                : `last run · ${streamText.length} chars`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <ol className="space-y-1.5 border-b border-border p-4 font-mono text-[11px] text-muted-foreground md:border-b-0 md:border-r">
                {logs.map((line, i) => (
                  <li key={`${line}-${i}`} className="break-all">
                    <span className="text-primary">→</span> {line}
                  </li>
                ))}
              </ol>
              <pre
                ref={logRef}
                className="max-h-72 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-muted-foreground md:col-span-2"
              >
                {streamText || (busy ? "waiting for first token…" : "")}
              </pre>
            </div>
          </div>
        ) : null}

        {items.length ? (
          <div className="mt-10">
            <Eyebrow className="text-muted-foreground">recent builds</Eyebrow>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {items.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setApp(item);
                    setFilePath(item.files[0]?.path ?? null);
                    setPrompt(item.prompt);
                  }}
                  className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary/40"
                >
                  <div className="font-semibold">{item.name}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.prompt}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                    {item.status}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
