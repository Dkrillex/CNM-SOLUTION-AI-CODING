"use client";

import { Eyebrow, LiveDot, WindowChrome } from "@/components/ambient";
import { FadeIn } from "@/components/fade-in";
import { GlowCard } from "@/components/glow-card";
import { cn } from "@/lib/utils";
import { Check, Download, Monitor } from "lucide-react";
import type { ReactNode } from "react";

const highlights = [
  "Local project workspace",
  "Natural-language builds",
  "Preview, diff and deploy",
  "macOS · Windows · Linux",
];

export function DownloadClientLink({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span className={cn("cursor-not-allowed opacity-60", className)} title="Coming soon">
      {children}
    </span>
  );
}

export function DownloadClientHeroButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      disabled
      className={cn(
        "inline-flex h-12 cursor-not-allowed items-center justify-center rounded-md border border-border bg-background px-7 font-mono text-sm uppercase tracking-widest opacity-60",
        className,
      )}
    >
      coming_soon
    </button>
  );
}

export function DownloadClientSection() {
  return (
    <section id="download" className="border-y border-border bg-card/30">
      <div className="container py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <FadeIn className="lg:col-span-6">
            <Eyebrow>desktop client</Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
              cnmsoltion.ai on your machine.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Native desktop client for building, previewing and shipping apps
              locally — same command surface as the web studio.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-muted-foreground">
                  <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <button
                type="button"
                disabled
                className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-md border border-border px-7 font-mono text-sm uppercase tracking-widest text-muted-foreground opacity-70"
              >
                <Download className="mr-2 h-4 w-4" />
                coming_soon
              </button>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                desktop client is not available yet
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.08} className="lg:col-span-6">
            <DesktopPreview />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function DesktopPreview() {
  return (
    <GlowCard>
      <WindowChrome title="cnmsoltion-desktop" live="ready" />
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <Monitor className="h-5 w-5" />
            </span>
            <div>
              <div className="font-semibold">cnmsoltion.ai Desktop</div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                local builder · v1.0
              </div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-primary">
            <LiveDot /> online
          </span>
        </div>
        <div className="mt-6 space-y-2 font-mono text-xs">
          <Row k="$ cnm open" v="workspace/" />
          <Row k="$ cnm build" v='"course sales platform"' />
          <Row k="→ generate" v="next.js · stripe · postgres" />
          <Row k="→ preview" v="localhost:3000" tone />
        </div>
      </div>
    </GlowCard>
  );
}

function Row({
  k,
  v,
  tone = false,
}: {
  k: string;
  v: string;
  tone?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background/60 px-3 py-2">
      <span className={tone ? "text-primary" : "text-muted-foreground"}>{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}
