"use client";

import { Eyebrow, LiveDot } from "@/components/ambient";
import { FadeIn } from "@/components/fade-in";
import { GlowCard } from "@/components/glow-card";
import { Counter } from "@/components/motion";
import { Navbar } from "@/components/navbar";
import {
  ArrowUpRight,
  CircleCheckBig,
  Clock,
  FileText,
  Shield,
  TriangleAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import { useScreenings } from "@/lib/use-workspace";
import { useSession } from "next-auth/react";
import Link from "next/link";

const kpis = [
  {
    icon: Shield,
    delta: "+12%",
    down: false,
    to: 1234,
    label: "total screenings",
    tone: "primary",
  },
  {
    icon: TriangleAlert,
    delta: "-5%",
    down: true,
    to: 23,
    label: "high risk cases",
    tone: "destructive",
  },
  {
    icon: Clock,
    delta: "+8%",
    down: false,
    to: 156,
    label: "pending",
    tone: "amber",
  },
  {
    icon: CircleCheckBig,
    delta: "+15%",
    down: false,
    to: 1055,
    label: "completed",
    tone: "primary",
  },
];

const activity = [
  { name: "John Doe", kind: "screening", time: "5 min ago", risk: "low" },
  { name: "ABC Corporation", kind: "screening", time: "15 min ago", risk: "medium" },
  { name: "Jane Smith", kind: "monitoring", time: "1 hour ago", risk: "high" },
  { name: "XYZ Ltd", kind: "screening", time: "2 hours ago", risk: "low" },
  { name: "Michael Brown", kind: "review", time: "3 hours ago", risk: "medium" },
];

const risk = [
  { label: "Low Risk", value: 856, pct: 69, color: "bg-primary" },
  { label: "Medium Risk", value: 355, pct: 29, color: "bg-amber-400" },
  { label: "High Risk", value: 23, pct: 2, color: "bg-destructive" },
];

const actions = [
  { href: "/builder/studio", cmd: "launch_builder", desc: "Generate a full-stack app from a sentence", icon: Users },
  { href: "/aml/cases", cmd: "view_cases", desc: "Open stored screening cases and audit lines", icon: FileText },
  { href: "/aml/screening", cmd: "new_screening", desc: "Screen an individual or company now", icon: TrendingUp },
];

const tones = {
  primary: "border-primary/30 bg-primary/10 text-primary",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
};

const riskTone = {
  low: "border-primary/30 bg-primary/10 text-primary",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  high: "border-destructive/30 bg-destructive/10 text-destructive",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const who = session?.user?.name?.split(" ")[0] ?? session?.user?.email;
  const { items: cases } = useScreenings();
  const liveActivity = [
    ...cases.map((c) => ({
      name: c.name,
      kind: "screening" as const,
      time: new Date(c.createdAt).toLocaleString(),
      risk: c.risk,
    })),
    ...activity,
  ].slice(0, 5);
  const high = cases.filter((c) => c.risk === "high").length;
  const liveKpis = [
    { ...kpis[0], to: kpis[0].to + cases.length },
    { ...kpis[1], to: kpis[1].to + high },
    kpis[2],
    { ...kpis[3], to: kpis[3].to + cases.filter((c) => c.risk === "low").length },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container py-10 md:py-12">
        <div className="mx-auto max-w-7xl space-y-8">
          <FadeIn className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2.5">
                <Eyebrow>control room</Eyebrow>
                <LiveDot />
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground">
                Welcome back{who ? `, ${who}` : ""} — here&apos;s your AML
                compliance overview.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/aml/cases"
                className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 font-mono text-xs uppercase tracking-widest hover:border-primary/40 hover:bg-accent hover:text-primary"
              >
                view_cases
              </Link>
              <Link
                href="/aml/screening"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 font-mono text-xs uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
              >
                new_screening
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {liveKpis.map((k, i) => (
              <FadeIn key={k.label} delay={i * 0.06} y={20}>
                <GlowCard className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tones[k.tone as keyof typeof tones]}`}
                    >
                      <k.icon className="h-5 w-5" />
                    </div>
                    <div
                      className={`flex items-center gap-1 font-mono text-xs ${
                        k.down ? "text-destructive" : "text-primary"
                      }`}
                    >
                      {k.delta}
                      <ArrowUpRight className={`h-3.5 w-3.5 ${k.down ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-semibold tracking-tight">
                    <Counter value={k.to} />
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {k.label}
                  </p>
                </GlowCard>
              </FadeIn>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FadeIn>
              <GlowCard className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <Eyebrow className="text-muted-foreground">recent activity</Eyebrow>
                  <Link
                    href="/aml/cases"
                    className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
                  >
                    view_all
                  </Link>
                </div>
                <div className="space-y-3">
                  {liveActivity.map((a) => (
                    <div
                      key={`${a.name}-${a.time}`}
                      className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-medium">{a.name}</div>
                        <div className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                          {a.kind} · {a.time}
                        </div>
                      </div>
                      <span
                        className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${riskTone[a.risk as keyof typeof riskTone]}`}
                      >
                        {a.risk}
                      </span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </FadeIn>
            <FadeIn delay={0.08}>
              <GlowCard className="p-8">
                <Eyebrow className="text-muted-foreground">risk distribution</Eyebrow>
                <div className="mt-6 space-y-5">
                  {risk.map((r) => (
                    <div key={r.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{r.label}</span>
                        <span className="font-mono text-muted-foreground">
                          {r.value}
                          <span className="text-muted-foreground/60"> · {r.pct}</span>
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {actions.map((a, i) => (
              <FadeIn key={a.cmd} delay={i * 0.06} y={20}>
                <Link href={a.href} className="block h-full">
                  <GlowCard className="h-full p-6">
                    <a.icon className="h-5 w-5 text-primary" />
                    <div className="mt-4 font-mono text-sm uppercase tracking-widest">
                      {a.cmd}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
                  </GlowCard>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
