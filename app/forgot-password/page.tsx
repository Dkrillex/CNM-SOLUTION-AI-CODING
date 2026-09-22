"use client";

import { AuthInput, AuthShell } from "@/components/auth-shell";
import { FadeInOnMount } from "@/components/fade-in";
import { Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <AuthShell
      eyebrow="account recovery"
      title="Reset password"
      subtitle="Enter your email and we'll send a reset link."
      panelEyebrow="secure access"
      panelTitle="Professional AML compliance platform"
      panelDesc="Integrated with the First AML API for world-leading anti-money-laundering screening and monitoring."
      bullets={[
        "Real-time PEP and Sanctions Screening",
        "24/7 Continuous Monitoring",
        "Automated Risk Assessment",
        "Complete Audit Trail",
      ]}
      prompt="$ auth --reset"
    >
      {sent ? (
        <p className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
          Reset link sent. Check your inbox.
        </p>
      ) : (
        <form className="space-y-6" onSubmit={onSubmit}>
          <AuthInput
            label="Email address"
            icon={Mail}
            type="email"
            required
            placeholder="your@email.com"
          />
          <FadeInOnMount y={16}>
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
            >
              send_link
            </button>
          </FadeInOnMount>
        </form>
      )}
      <p className="text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
