import { Ambient, Eyebrow } from "@/components/ambient";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { type ReactNode } from "react";

export const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function CompanyPage({
  current,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  current: (typeof companyLinks)[number]["href"];
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="relative overflow-hidden">
        <Ambient />
        <div className="container max-w-5xl py-14 md:py-20">
          <nav className="flex flex-wrap gap-2">
            {companyLinks.map((link) => {
              const active = link.href === current;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors",
                    active
                      ? "border border-primary/30 bg-primary/10 text-primary"
                      : "border border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Eyebrow className="mt-8">{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
          <div className="mt-10">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 border-b border-border py-6 last:border-b-0">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}
