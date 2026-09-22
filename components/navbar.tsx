"use client";

import { signOutNow } from "@/app/actions/auth";
import { EASE } from "@/components/motion";
import { shouldLoadSession } from "@/lib/session-routes";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/builder", label: "builder" },
  { href: "/aml/screening", label: "compliance" },
  { href: "/dashboard", label: "dashboard" },
];

export function Logo({ large = false }: { large?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/40 bg-primary/10 font-mono text-[10px] font-bold text-primary transition-colors group-hover:bg-primary/20">
        EA
      </span>
      <span
        className={cn(
          "font-mono font-semibold tracking-tight",
          large ? "text-lg" : "text-sm sm:text-base",
        )}
      >
        EA ESPORTES
        <span className="animate-blink text-primary">_</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="sticky top-0 z-50 w-full">
      <nav
        className={cn(
          "w-full border-b transition-all duration-300",
          scrolled
            ? "border-border bg-background/70 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active ? (
                    <span className="absolute inset-0 -z-10 rounded-lg border border-primary/30 bg-primary/10" />
                  ) : null}
                  {l.label}
                </Link>
              );
            })}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <AuthActions />
          </div>
          <button
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
            >
              <div className="space-y-4 p-4">
                <div className="space-y-1">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
                <div className="flex gap-2">
                  <AuthActions compact />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </div>
  );
}

function AuthActions({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  if (!shouldLoadSession(pathname)) {
    return <GuestActions compact={compact} />;
  }
  return <SessionAuthActions compact={compact} />;
}

function GuestActions({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <Link
        href="/login"
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:bg-accent hover:text-accent-foreground",
          compact && "flex-1 text-center text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        login
      </Link>
      <Link
        href="/signup"
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90",
          compact && "flex-1 text-center",
        )}
      >
        start_free
      </Link>
    </>
  );
}

function SessionAuthActions({ compact = false }: { compact?: boolean }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div
        className={cn(
          "h-10 rounded-md bg-muted/40",
          compact ? "flex-1" : "w-36",
        )}
      />
    );
  }

  if (session?.user) {
    const name = session.user.name?.split(" ")[0] ?? session.user.email ?? "you";
    return (
      <div className={cn("flex items-center gap-2", compact && "w-full")}>
        <span className="truncate font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {name}
        </span>
        <button
          type="button"
          onClick={() => signOutNow()}
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-md border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest hover:border-primary/40 hover:bg-accent hover:text-primary",
            compact && "flex-1",
          )}
        >
          sign_out
        </button>
      </div>
    );
  }

  return <GuestActions compact={compact} />;
}
