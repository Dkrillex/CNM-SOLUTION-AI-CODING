"use client";

import { Ambient, Eyebrow, LiveDot, WindowChrome } from "@/components/ambient";
import { FadeIn, FadeInOnMount } from "@/components/fade-in";
import { Footer } from "@/components/footer";
import { GlowCard } from "@/components/glow-card";
import { Counter } from "@/components/motion";
import { Navbar } from "@/components/navbar";
import {
  ArrowRight,
  Building,
  Cpu,
  GitBranch,
  Globe,
  Radar,
  ScanLine,
  User,
  Users,
} from "lucide-react";
import type { ScreenResult } from "@/lib/screen";
import { useScreenings } from "@/lib/use-workspace";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FormEvent, useState } from "react";

const reports = [
  {
    title: "FinTech platform",
    quote:
      "Efficiency up 300%, false positives down 85%. We clear 5,000+ transactions a day automatically.",
    tag: "300% faster reviews",
  },
  {
    title: "Multinational trade group",
    quote:
      "Surfaced high-risk counterparties before onboarding, avoiding costly compliance penalties.",
    tag: "50+ countries covered",
  },
  {
    title: "Digital bank",
    quote:
      "Customer onboarding dropped from 3 days to 3 minutes — a step change in experience.",
    tag: "3-minute onboarding",
  },
];

const engines = [
  {
    icon: Radar,
    title: "Real-time screening",
    desc: "Query global sanctions, PEP and watchlists with sub-second response.",
  },
  {
    icon: Cpu,
    title: "AI risk scoring",
    desc: "Intelligent models weigh matches to cut noise and surface real risk.",
  },
  {
    icon: GitBranch,
    title: "Case management",
    desc: "Full audit trail with tracking and approval workflows built in.",
  },
];

const riskTone = {
  low: "border-primary/30 bg-primary/10 text-primary",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  high: "border-destructive/30 bg-destructive/10 text-destructive",
};

export default function ScreeningPage() {
  const [tab, setTab] = useState<"individual" | "company">("individual");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ScreenResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { add } = useScreenings();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: tab,
          first: String(data.get("first") || ""),
          last: String(data.get("last") || ""),
          company: String(data.get("company") || ""),
          dob: String(data.get("dob") || ""),
          nationality: String(data.get("nat") || ""),
          country: String(data.get("country") || ""),
          industry: String(data.get("industry") || ""),
          registration: String(data.get("reg") || ""),
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Screening failed");
      setResult(payload);
      add(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Screening failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative overflow-hidden">
        <Ambient scan />
        <div className="container py-16 md:py-20">
          <FadeInOnMount y={16} className="max-w-2xl">
            <div className="flex items-center gap-3">
              <Eyebrow>real-time screening</Eyebrow>
              <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <LiveDot /> online
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Screen any entity
              <br />
              <span className="text-primary">in seconds.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Check individuals and companies against 1,000+ global data sources —
              accurate, auditable risk decisions for your compliance team.
            </p>
          </FadeInOnMount>
          <FadeInOnMount
            delay={0.15}
            y={16}
            duration={0.6}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-border pt-6"
          >
            <Stat value={1000} suffix="+" label="data sources" />
            <Stat value={500000} suffix="+" label="screenings" />
            <Stat value={1} prefix="<" suffix="s" label="response" />
            <Stat value={99.9} decimals={1} suffix="%" label="accuracy" />
          </FadeInOnMount>
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <FadeIn className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40 lg:col-span-7">
            <WindowChrome title="screening.exec" />
            <div className="p-6 sm:p-8">
              <div className="inline-flex rounded-lg border border-border bg-muted/50 p-1">
                {(
                  [
                    ["individual", User],
                    ["company", Building],
                  ] as const
                ).map(([key, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setTab(key);
                      setResult(null);
                    }}
                    className={`relative z-0 flex items-center gap-2 rounded-md px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                      tab === key
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === key ? (
                      <span className="absolute inset-0 -z-10 rounded-md bg-primary" />
                    ) : null}
                    <Icon className="h-4 w-4" />
                    {key}
                  </button>
                ))}
              </div>
              <form className="mt-6 space-y-5" onSubmit={onSubmit}>
                {tab === "individual" ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field name="first" label="first_name" placeholder="Enter first name" required />
                    <Field name="last" label="last_name" placeholder="Enter last name" required />
                    <Field name="dob" label="date_of_birth" placeholder="Select date" />
                    <Field name="nat" label="nationality" placeholder="Enter nationality" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field name="company" label="company_name" placeholder="Enter legal name" required />
                    <Field name="reg" label="registration_no" placeholder="Enter registration no." />
                    <Field name="country" label="country" placeholder="Enter country" />
                    <Field name="industry" label="industry" placeholder="Enter industry" />
                  </div>
                )}
                <button
                  type="submit"
                  className="group inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 font-mono text-xs uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  <ScanLine className="mr-2 h-4 w-4" />
                  {busy ? "screening..." : "run_screening"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                {result ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={cn(
                          "rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest",
                          riskTone[result.risk],
                        )}
                      >
                        {result.risk} · {result.score.toFixed(2)}
                      </span>
                      <Link
                        href="/aml/cases"
                        className="font-mono text-[11px] uppercase tracking-widest text-primary hover:underline"
                      >
                        open_case
                      </Link>
                    </div>
                    <div className="space-y-1 rounded-lg border border-border bg-background/70 p-4 font-mono text-[13px] leading-relaxed">
                      {result.lines.map((line) => (
                        <div
                          key={line}
                          className={
                            line.startsWith("✓") || line.startsWith("RISK")
                              ? "text-primary"
                              : "text-muted-foreground"
                          }
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                    {result.matches.length ? (
                      <div className="space-y-2">
                        {result.matches.map((match) => (
                          <div
                            key={`${match.name}-${match.confidence}`}
                            className="rounded-lg border border-border bg-background/40 p-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium">{match.name}</p>
                              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                                {Math.round(match.confidence * 100)}%
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{match.reason}</p>
                            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-primary/80">
                              {match.lists.join(" · ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </form>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="relative lg:col-span-5">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-primary/20 blur-[100px]"
            />
            <div className="relative">
              <Eyebrow className="text-muted-foreground">
                <span className="text-primary/60">▪</span> field reports
              </Eyebrow>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                Trusted by compliance teams
              </h3>
              <div className="mt-6 space-y-3">
                {reports.map((r, i) => (
                  <FadeIn key={r.title} delay={0.05 * i} y={16}>
                    <div className="rounded-xl border border-border bg-background/40 p-4 transition-colors hover:border-primary/30">
                      <div className="flex items-center gap-2 text-foreground">
                        <Building className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{r.title}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        “{r.quote}”
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-primary">
                        {r.tag}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="container py-20 md:py-28">
          <FadeIn className="mb-12 max-w-2xl">
            <Eyebrow>engine</Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
              Built for accuracy and audit.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {engines.map((e, i) => (
              <FadeIn key={e.title} delay={i * 0.08} className="h-full">
                <GlowCard className="h-full p-8">
                  <e.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-5 text-lg font-semibold">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{e.desc}</p>
                </GlowCard>
              </FadeIn>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Mini value={190} suffix="+" label="countries" icon={Globe} />
            <Mini value={500} suffix="+" label="sanctions lists" icon={Radar} />
            <Mini value={100} suffix="K+" label="pep records" icon={Users} />
            <FadeIn>
              <GlowCard className="p-6">
                <ScanLine className="h-5 w-5 text-primary" />
                <div className="mt-4 text-3xl font-semibold tracking-tight">24/7</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  monitoring
                </div>
              </GlowCard>
            </FadeIn>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Stat({
  value,
  label,
  decimals,
  prefix,
  suffix,
}: {
  value: number;
  label: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="text-2xl font-semibold tracking-tight md:text-3xl">
        <Counter value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
      </div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Mini({
  value,
  label,
  icon: Icon,
  suffix,
}: {
  value: number;
  label: string;
  icon: typeof Globe;
  suffix?: string;
}) {
  return (
    <FadeIn>
      <GlowCard className="p-6">
        <Icon className="h-5 w-5 text-primary" />
        <div className="mt-4 text-3xl font-semibold tracking-tight">
          <Counter value={value} suffix={suffix} />
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
      </GlowCard>
    </FadeIn>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        name={name}
        type="text"
        required={required}
        autoComplete="off"
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
