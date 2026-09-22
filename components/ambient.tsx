import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function GridBackground({
  scan = false,
  className,
}: {
  scan?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute left-1/2 top-[-18%] h-[560px] w-[min(1000px,95vw)] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
      {scan ? (
        <div className="absolute inset-x-0 top-0 h-24 animate-[scan_7s_linear_infinite] bg-gradient-to-b from-primary/12 to-transparent" />
      ) : null}
    </div>
  );
}

export const Ambient = GridBackground;

export function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full bg-primary/20 blur-[100px]",
        className,
      )}
    />
  );
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
    </span>
  );
}

export function WindowChrome({ title, live = "live" }: { title: string; live?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-destructive/70" />
      <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
      <span className="h-3 w-3 rounded-full bg-primary/70" />
      <span className="ml-2 font-mono text-xs text-muted-foreground">{title}</span>
      <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-primary">
        <LiveDot /> {live}
      </span>
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.22em] text-primary",
        className,
      )}
    >
      <span className="text-primary/40">[</span>
      {children}
      <span className="text-primary/40">]</span>
    </span>
  );
}
