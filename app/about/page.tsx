import { CompanyPage } from "@/components/company-page";
import { GlowCard } from "@/components/glow-card";
import { Building2, Radar, ShieldCheck, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About · EA ENTRETENIMENTO E ESPORTES LTDA",
  description:
    "EA ENTRETENIMENTO E ESPORTES LTDA builds AI application generation and AML compliance in one platform.",
};

const products = [
  {
    icon: Terminal,
    title: "AI Builder",
    desc: "Turn a sentence into a full-stack app — schema, auth, payments and deploy.",
    href: "/builder",
    cmd: "open_builder",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Hub",
    desc: "Screen people and companies against PEP, sanctions and watchlists in real time.",
    href: "/aml/screening",
    cmd: "open_hub",
  },
];

const values = [
  {
    icon: Radar,
    title: "Signal over noise",
    desc: "Screening should be fast, sourced and auditable — not a spreadsheet afterthought.",
  },
  {
    icon: Building2,
    title: "Ship, then stay compliant",
    desc: "Teams should launch software and meet AML obligations from the same workspace.",
  },
];

export default function AboutPage() {
  return (
    <CompanyPage
      current="/about"
      eyebrow="company"
      title="EA ENTRETENIMENTO E ESPORTES LTDA"
      subtitle="We operate a single surface for generating production software and running AML compliance."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {products.map((item) => (
          <GlowCard key={item.title} className="p-6">
            <item.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-4 text-xl font-semibold tracking-tight">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            <Link
              href={item.href}
              className="mt-5 inline-flex h-10 items-center rounded-md border border-border px-4 font-mono text-xs uppercase tracking-widest hover:border-primary/40 hover:bg-accent hover:text-primary"
            >
              {item.cmd}
            </Link>
          </GlowCard>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {values.map((item) => (
          <GlowCard key={item.title} className="p-6">
            <item.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
          </GlowCard>
        ))}
      </div>
      <GlowCard className="mt-4 p-6 md:p-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-primary">who we are</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          EA ENTRETENIMENTO E ESPORTES LTDA builds tools for teams that cannot choose between
          speed and regulation. The platform brings an AI application generator and an AML
          screening engine onto one surface, so product, risk and operations share the same audit
          trail.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
          >
            contact_us
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-md border border-border px-4 font-mono text-xs uppercase tracking-widest hover:border-primary/40 hover:bg-accent hover:text-primary"
          >
            create_account
          </Link>
        </div>
      </GlowCard>
    </CompanyPage>
  );
}
