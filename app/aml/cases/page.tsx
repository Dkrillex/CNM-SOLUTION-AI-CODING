"use client";

import { Eyebrow, LiveDot } from "@/components/ambient";
import { FadeIn } from "@/components/fade-in";
import { GlowCard } from "@/components/glow-card";
import { Navbar } from "@/components/navbar";
import { useScreenings } from "@/lib/use-workspace";
import { cn } from "@/lib/utils";
import Link from "next/link";

const riskTone = {
  low: "border-primary/30 bg-primary/10 text-primary",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  high: "border-destructive/30 bg-destructive/10 text-destructive",
};

export default function CasesPage() {
  const { items, ready } = useScreenings();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container py-10 md:py-14">
        <FadeIn className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2.5">
              <Eyebrow>case management</Eyebrow>
              <LiveDot />
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Screening cases
            </h1>
            <p className="mt-2 text-muted-foreground">
              Every run is stored locally with risk, matches and a full audit line.
            </p>
          </div>
          <Link
            href="/aml/screening"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
          >
            new_screening
          </Link>
        </FadeIn>

        <div className="mt-10 space-y-3">
          {!ready ? (
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              loading_cases…
            </p>
          ) : items.length === 0 ? (
            <GlowCard className="p-10 text-center">
              <p className="text-muted-foreground">No cases yet. Run a screening to open one.</p>
              <Link
                href="/aml/screening"
                className="mt-4 inline-flex font-mono text-xs uppercase tracking-widest text-primary hover:underline"
              >
                run_screening
              </Link>
            </GlowCard>
          ) : (
            items.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.03} y={12}>
                <GlowCard className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-lg font-semibold tracking-tight">{item.name}</div>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {item.type} · {new Date(item.createdAt).toLocaleString()} · score{" "}
                        {item.score.toFixed(2)}
                      </p>
                      {item.matches[0] ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {item.matches[0].name} — {item.matches[0].reason}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-muted-foreground">
                          No watchlist hit. Cleared against demo sources.
                        </p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "w-fit rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest",
                        riskTone[item.risk],
                      )}
                    >
                      {item.risk}
                    </span>
                  </div>
                </GlowCard>
              </FadeIn>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
