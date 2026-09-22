import { Eyebrow, GlowOrb, GridBackground } from "@/components/ambient";
import { SpotlightCard } from "@/components/glow-card";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/motion";
import {
  ArrowRight,
  Boxes,
  Check,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Radar,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Cpu, title: "Natural-language generation", desc: "Describe an app in plain language; ship full-stack code — frontend, backend, database." },
  { icon: Database, title: "Schema + migrations", desc: "Intelligent database design across PostgreSQL, MySQL and MongoDB with auto-migrations." },
  { icon: Globe, title: "Integrations", desc: "Pre-wired payment, auth and AI-model services from 50+ ready templates." },
  { icon: Radar, title: "Real-time screening", desc: "PEP, sanctions and watchlist checks against 1,000+ sources in sub-second time." },
  { icon: GitBranch, title: "Case management", desc: "Full audit trail with tracking, approval workflows and exportable reports." },
  { icon: Zap, title: "One-click deploy", desc: "Automatic CI/CD to major clouds, with global CDN and HTTPS out of the box." },
];

const cases = [
  { k: "01", title: "FinTech companies", desc: "Screen customers with Compliance Hub while shipping internal tools with AI Builder." },
  { k: "02", title: "Startup teams", desc: "Validate ideas fast with AI Builder; meet regulation with Compliance Hub from day one." },
  { k: "03", title: "Enterprise digitalization", desc: "AI Builder powers business systems; Compliance Hub keeps every transaction compliant." },
];

const mini = [
  { icon: Globe, v: 1000, s: "+", l: "data sources" },
  { icon: Boxes, v: 500000, s: "+", l: "screenings run" },
  { icon: Zap, v: 1, s: "s", p: "<", l: "response time" },
  { icon: Radar, v: 99.9, d: 1, s: "%", l: "accuracy" },
];

export function Systems() {
  return (
    <section className="container py-20 md:py-28">
      <Reveal className="mb-12 max-w-2xl">
        <Eyebrow>two systems, one platform</Eyebrow>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
          An AI application generator and an AML compliance engine —
          <span className="text-muted-foreground"> under one roof.</span>
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Reveal className="md:col-span-2">
          <SpotlightCard className="h-full p-8">
            <div className="flex h-full flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <Terminal className="h-6 w-6" />
                </div>
                <Eyebrow className="text-muted-foreground">builder</Eyebrow>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">AI Builder</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Turn natural language into deployed full-stack applications.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  "Full-stack code generation",
                  "Pre-integrated payment, auth & AI",
                  "One-click deployment to production",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-muted-foreground">
                    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/builder/studio"
                className="group/b mt-8 inline-flex h-10 w-fit items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                enter_builder
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/b:translate-x-1" />
              </Link>
            </div>
          </SpotlightCard>
        </Reveal>
        <Reveal delay={0.08} className="md:col-span-2">
          <SpotlightCard className="h-full p-8">
            <div className="flex h-full flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <Eyebrow className="text-muted-foreground">compliance</Eyebrow>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">Compliance Hub</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Real-time AML screening, scoring and case management.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  "PEP / sanctions / watchlist screening",
                  "AI-powered risk scoring",
                  "24/7 monitoring & audit trail",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-muted-foreground">
                    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/aml/screening"
                className="group/c mt-8 inline-flex h-10 w-fit items-center justify-center rounded-md border border-border bg-background px-4 py-2 font-mono text-xs uppercase tracking-widest hover:border-primary/40 hover:bg-accent hover:text-primary"
              >
                enter_hub
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/c:translate-x-1" />
              </Link>
            </div>
          </SpotlightCard>
        </Reveal>
        {mini.map((e, s) => (
          <Reveal key={e.l} delay={0.05 * s}>
            <SpotlightCard className="p-6">
              <e.icon className="h-5 w-5 text-primary" />
              <div className="mt-4 text-3xl font-semibold tracking-tight">
                <Counter value={e.v} decimals={e.d} prefix={e.p} suffix={e.s} />
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {e.l}
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Capabilities() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="container py-20 md:py-28">
        <Reveal className="mb-12 max-w-2xl">
          <Eyebrow>capabilities</Eyebrow>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
            Everything you need, end to end.
          </h2>
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <StaggerItem key={f.title}>
              <div className="group h-full bg-card p-8 transition-colors hover:bg-accent">
                <div className="flex items-center justify-between">
                  <f.icon className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                  <span className="font-mono text-xs text-muted-foreground/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function UseCases() {
  return (
    <section className="container py-20 md:py-28">
      <Reveal className="mb-12 max-w-2xl">
        <Eyebrow>use cases</Eyebrow>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
          Built for teams that ship and stay compliant.
        </h2>
      </Reveal>
      <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cases.map((c) => (
          <StaggerItem key={c.k} className="h-full">
            <SpotlightCard className="h-full p-8">
              <div className="font-mono text-4xl font-semibold text-primary/30">{c.k}</div>
              <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function Cta() {
  return (
    <section className="container pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center md:p-16">
          <GridBackground />
          <GlowOrb className="left-1/2 top-full h-72 w-72 -translate-x-1/2" />
          <Eyebrow>ready when you are</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            Start building and screening in minutes.
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex h-12 items-center justify-center rounded-md bg-primary px-7 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
            >
              start_free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-7 font-mono text-sm uppercase tracking-widest hover:border-primary/40 hover:bg-accent hover:text-primary"
            >
              view_dashboard
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
