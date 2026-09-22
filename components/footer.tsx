import { LiveDot } from "@/components/ambient";
import Link from "next/link";

const columns = [
  {
    title: "Builder",
    links: [
      { href: "/builder", label: "Builder" },
      { href: "/builder/studio", label: "Generator" },
    ],
  },
  {
    title: "Compliance",
    links: [
      { href: "/aml/screening", label: "Screening" },
      { href: "/aml/cases", label: "Cases" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="about" className="border-t border-border">
      <div className="container py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/40 bg-primary/10 font-mono text-sm font-bold text-primary">
                C
              </span>
              <span className="font-mono text-base font-semibold">cnmsolution.ai</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The unified surface for AI application building and AML compliance.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-foreground/80 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 font-mono text-xs text-muted-foreground sm:flex-row">
          <span>© power by CNM SOLUTION</span>
          <span className="flex items-center gap-2">
            <LiveDot />
            all systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}

export function MiniFooter({
  left = "© 2026 cnmsolution.ai. All rights reserved.",
  right = "builder online",
}: {
  left?: string;
  right?: string;
}) {
  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 font-mono text-xs text-muted-foreground sm:flex-row">
        <span>{left}</span>
        <span className="flex items-center gap-2">
          <LiveDot />
          {right}
        </span>
      </div>
    </footer>
  );
}
