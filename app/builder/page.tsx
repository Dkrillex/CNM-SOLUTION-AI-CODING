"use client";

import { Ambient, Eyebrow } from "@/components/ambient";
import { FadeIn } from "@/components/fade-in";
import { MiniFooter } from "@/components/footer";
import { GlowCard } from "@/components/glow-card";
import { EASE } from "@/components/motion";
import { Navbar } from "@/components/navbar";
import { useBuilds } from "@/lib/use-workspace";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CreditCard,
  Database,
  Globe,
  Lock,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Describe requirements",
    desc: 'Tell EA ESPORTES what you want in natural language — e.g. "a course sales platform".',
    items: [
      "Plain-language descriptions",
      "AI infers the business logic",
      "Smart feature recommendations",
    ],
  },
  {
    n: "02",
    title: "AI generates code",
    desc: "Complete frontend, backend and database code — ready to preview instantly.",
    items: [
      "React + Next.js frontend",
      "Node.js backend API",
      "PostgreSQL database",
      "Stripe payment integration",
    ],
  },
  {
    n: "03",
    title: "One-click deployment",
    desc: "Ship to production with a single click and get an exclusive domain, instantly live.",
    items: [
      "Automatic HTTPS configuration",
      "Global CDN acceleration",
      "Automatic data backups",
      "Export the code anytime",
    ],
  },
];

const features = [
  { icon: Database, n: "01", title: "Database design", desc: "AI designs an optimized schema and supports PostgreSQL and MySQL." },
  { icon: CreditCard, n: "02", title: "Payment integration", desc: "Pre-integrated Stripe and PayPal, for subscriptions and one-time payments." },
  { icon: Lock, n: "03", title: "User authentication", desc: "Google login, email verification and JWT tokens — secure by default." },
  { icon: Globe, n: "04", title: "Third-party APIs", desc: "Easily wire up OpenAI, Twilio, SendGrid and other mainstream services." },
  { icon: Sparkles, n: "05", title: "Admin dashboard", desc: "Auto-generated dashboards to manage users, orders and content." },
  { icon: Zap, n: "06", title: "Performance", desc: "Automatic code splitting, CDN acceleration and SSR for instant loads." },
];

const uses = [
  { n: "01", title: "SaaS applications", desc: "CRM, ERP, project management" },
  { n: "02", title: "E-commerce platforms", desc: "Online stores, digital goods" },
  { n: "03", title: "Content platforms", desc: "Blogs, knowledge bases, docs" },
  { n: "04", title: "AI tools", desc: "Writing assistants, image generators" },
  { n: "05", title: "Booking systems", desc: "Scheduling, consulting services" },
  { n: "06", title: "Community forums", desc: "Discussion boards, Q&A" },
  { n: "07", title: "Data analytics", desc: "Dashboards, reporting systems" },
  { n: "08", title: "Internal tools", desc: "Approval flows, ticketing" },
];

export default function BuilderPage() {
  const { items, ready } = useBuilds();
  const hasShowcase = ready && items.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative overflow-hidden">
        <Ambient scan />
        <div className="container py-20 md:py-32">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { ease: EASE } },
              }}
            >
              <Eyebrow>ai application generator</Eyebrow>
            </motion.div>
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { ease: EASE } },
              }}
              className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            >
              From a sentence
              <br />
              to a <span className="text-primary">shipped app.</span>
            </motion.h1>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { ease: EASE } },
              }}
              className="mt-6 max-w-xl text-lg text-muted-foreground"
            >
              Describe your idea in natural language and EA ESPORTES generates a complete
              full-stack application — frontend, backend and database — all in one
              place.
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { ease: EASE } },
              }}
              className="mt-8 flex flex-wrap items-center gap-3 font-mono text-sm text-muted-foreground"
            >
              <span className="text-primary">$</span>
              <span className="text-foreground">ea build</span>
              <span className="text-muted-foreground/60">&quot;a course sales platform&quot;</span>
              <ArrowRight className="h-4 w-4 text-primary" />
              <span className="text-primary">deployed</span>
              <span className="inline-block h-4 w-2 animate-blink bg-primary align-middle" />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { ease: EASE } },
              }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/builder/studio"
                className="group inline-flex h-12 items-center justify-center rounded-md bg-primary px-7 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
              >
                start_building
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              {hasShowcase ? (
                <Link
                  href="/builder/studio"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-7 font-mono text-sm uppercase tracking-widest hover:border-primary/40 hover:bg-accent hover:text-primary"
                >
                  view_showcase
                </Link>
              ) : null}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <FadeIn className="mb-12 max-w-2xl">
          <Eyebrow>how it works</Eyebrow>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
            From idea to deployment in three steps.
          </h2>
          <p className="mt-4 text-muted-foreground">
            No programming experience required — as easy as chatting.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.08} className="h-full">
              <GlowCard className="h-full p-8">
                <div className="font-mono text-4xl font-semibold text-primary/30">{s.n}</div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-muted-foreground">
                      <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="features" className="border-y border-border bg-card/30">
        <div className="container py-20 md:py-28">
          <FadeIn className="mb-12 max-w-2xl">
            <Eyebrow>features</Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
              Powerful features, everything you need.
            </h2>
            <p className="mt-4 text-muted-foreground">From zero to one, EA ESPORTES handles it all.</p>
          </FadeIn>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <FadeIn key={f.n} delay={i * 0.04} y={20}>
                <div className="group h-full bg-card p-8 transition-colors hover:bg-accent">
                  <div className="flex items-center justify-between">
                    <f.icon className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                    <span className="font-mono text-xs text-muted-foreground/50">{f.n}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <FadeIn className="mb-12 max-w-2xl">
          <Eyebrow>use cases</Eyebrow>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
            Build almost anything.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Whatever you want to build, EA ESPORTES can help you ship it.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {uses.map((u, i) => (
            <FadeIn key={u.n} delay={i * 0.04} y={20} className="h-full">
              <GlowCard className="h-full p-6">
                <div className="font-mono text-2xl font-semibold text-primary/30">{u.n}</div>
                <h3 className="mt-3 font-semibold">{u.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{u.desc}</p>
              </GlowCard>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="container pb-28">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center md:p-16">
            <Ambient />
            <Rocket className="mx-auto h-8 w-8 text-primary" />
            <Eyebrow>ready to build?</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
              Experience AI-driven development now.
            </h2>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/builder/studio"
                className="group inline-flex h-12 items-center justify-center rounded-md bg-primary px-7 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
              >
                start_free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-7 font-mono text-sm uppercase tracking-widest hover:border-primary/40 hover:bg-accent hover:text-primary"
              >
                view_pricing
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
      <MiniFooter />
    </div>
  );
}
