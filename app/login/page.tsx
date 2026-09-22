"use client";

import { AuthInput, AuthShell } from "@/components/auth-shell";
import { FadeInOnMount } from "@/components/fade-in";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";

function LoginForm() {
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setPending(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Incorrect email or password. You can also sign in with Google.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const oauthError = searchParams.get("error");

  return (
    <AuthShell
      eyebrow="secure access"
      title="Welcome back"
      subtitle="Sign in to your account to continue."
      panelEyebrow="compliance platform"
      panelTitle="Professional AML compliance platform"
      panelDesc="Integrated with the First AML API for world-leading anti-money-laundering screening and monitoring."
      bullets={[
        "Real-time PEP and Sanctions Screening",
        "24/7 Continuous Monitoring",
        "Automated Risk Assessment",
        "Complete Audit Trail",
      ]}
      prompt="$ auth --login"
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        {error || oauthError ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error || "Sign in was not completed. Try again or use email instead."}
          </p>
        ) : null}
        <AuthInput
          label="Email address"
          name="email"
          icon={Mail}
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          delay={0.05}
        />
        <AuthInput
          label="Password"
          name="password"
          icon={Lock}
          type={show ? "text" : "password"}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          delay={0.1}
          extra={
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />
        <FadeInOnMount y={16} delay={0.15} className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 rounded accent-primary" />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </FadeInOnMount>
        <FadeInOnMount y={16} delay={0.2}>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
          >
            {pending ? "signing_in…" : "sign_in"}
          </button>
        </FadeInOnMount>
      </form>
      <FadeInOnMount y={16} className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            or
          </span>
        </div>
      </FadeInOnMount>
      <FadeInOnMount y={16}>
        <GoogleAuthButton label="Sign in with Google" />
      </FadeInOnMount>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
