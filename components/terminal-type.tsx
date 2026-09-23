"use client";

import { LiveDot } from "@/components/ambient";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = [
  { t: '$ cnm screen --entity "Acme Global Ltd"', cls: "text-foreground" },
  { t: "→ querying 1,000+ sources ....... ok", cls: "text-muted-foreground" },
  { t: "→ sanctions (OFAC/UN/EU) ........ clear", cls: "text-muted-foreground" },
  { t: "→ pep + adverse media .......... 2 hits", cls: "text-muted-foreground" },
  { t: "✓ risk assessed in 0.8s", cls: "text-primary" },
  { t: "  RISK_LEVEL = MEDIUM  ·  score 0.62", cls: "text-primary" },
];

export function TerminalType() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= LINES.length) {
      const id = window.setTimeout(() => setShown(0), 2600);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setShown((n) => n + 1), 620);
    return () => window.clearTimeout(id);
  }, [shown]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-destructive/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-primary/70" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          compliance-hub — screening
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-primary">
          <LiveDot /> live
        </span>
      </div>
      <div className="min-h-[220px] space-y-1.5 p-5 font-mono text-[13px] leading-relaxed">
        {LINES.slice(0, shown).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className={line.cls}
          >
            {line.t}
          </motion.div>
        ))}
        {shown < LINES.length ? (
          <span className="inline-block h-4 w-2 animate-blink bg-primary align-middle" />
        ) : null}
      </div>
    </div>
  );
}
