"use client";

import { Ambient, Eyebrow } from "@/components/ambient";
import { FadeInOnMount } from "@/components/fade-in";
import { Logo } from "@/components/navbar";
import { Check, ShieldCheck } from "lucide-react";
import {
  type ComponentType,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  panelEyebrow,
  panelTitle,
  panelDesc,
  bullets,
  prompt,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  panelEyebrow: string;
  panelTitle: string;
  panelDesc: string;
  bullets: string[];
  prompt: string;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Logo large />
            <FadeInOnMount y={12}>
              <div className="mt-8">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            </FadeInOnMount>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
      <div className="relative hidden items-center justify-center overflow-hidden bg-card p-12 lg:flex lg:w-1/2">
        <Ambient />
        <div className="relative max-w-md space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <Eyebrow>{panelEyebrow}</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight">{panelTitle}</h2>
          <p className="text-muted-foreground">{panelDesc}</p>
          <ul className="space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-foreground/90">
                <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                {b}
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-border bg-background/40 px-4 py-3 font-mono text-sm text-muted-foreground">
            {prompt}
            <span className="animate-blink text-primary">▊</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthInput({
  label,
  icon: Icon,
  extra,
  delay = 0,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ComponentType<{ className?: string }>;
  extra?: ReactNode;
  delay?: number;
}) {
  return (
    <FadeInOnMount y={16} delay={delay}>
      <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          {...props}
          className={`w-full rounded-lg border border-input bg-background py-3 pl-10 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30 ${
            extra ? "pr-12" : "pr-4"
          }`}
        />
        {extra}
      </div>
    </FadeInOnMount>
  );
}
