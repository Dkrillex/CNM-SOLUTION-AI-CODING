"use client";

import { registerAccount } from "@/app/actions/auth";
import { AuthInput, AuthShell } from "@/components/auth-shell";
import { FadeInOnMount } from "@/components/fade-in";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError("");
    try {
      const result = await registerAccount({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        confirmPassword: String(form.get("confirmPassword") ?? ""),
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      const login = await signIn("credentials", {
        email: result.email,
        password: String(form.get("password") ?? ""),
        redirect: false,
      });
      if (login?.error) {
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("注册失败，请稍后重试");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      eyebrow="create account"
      title="Create your account"
      subtitle="Get started with professional AML compliance services."
      panelEyebrow="start your journey"
      panelTitle="Start your professional compliance journey"
      panelDesc="Join thousands of teams running the most advanced AML compliance solution."
      bullets={[
        "14-Day Free Trial",
        "No Credit Card Required",
        "Cancel Anytime",
        "24/7 Customer Support",
      ]}
      prompt="$ auth --signup"
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        {error ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <AuthInput
          label="Full name"
          name="name"
          icon={User}
          type="text"
          required
          autoComplete="name"
          placeholder="Your Name"
        />
        <AuthInput
          label="Email address"
          name="email"
          icon={Mail}
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
        />
        <AuthInput
          label="Password"
          name="password"
          icon={Lock}
          type={show ? "text" : "password"}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
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
        <AuthInput
          label="Confirm password"
          name="confirmPassword"
          icon={Lock}
          type="password"
          required
          autoComplete="new-password"
          placeholder="Re-enter password"
        />
        <FadeInOnMount y={16}>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-1 h-4 w-4 rounded accent-primary" />
            <span className="text-muted-foreground">
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
        </FadeInOnMount>
        <FadeInOnMount y={16}>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
          >
            {pending ? "creating…" : "create_account"}
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
        <GoogleAuthButton label="Sign up with Google" />
      </FadeInOnMount>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
