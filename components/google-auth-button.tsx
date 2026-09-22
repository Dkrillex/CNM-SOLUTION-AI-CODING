"use client";

import { isGoogleConfigured } from "@/app/actions/auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

export function GoogleAuthButton({ label }: { label: string }) {
  const [pending, setPending] = useState(false);
  const [setup, setSetup] = useState(false);

  async function onClick() {
    setPending(true);
    try {
      const ready = await isGoogleConfigured();
      if (!ready) {
        setSetup(true);
        return;
      }
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setSetup(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background font-mono text-xs uppercase tracking-widest hover:border-primary/40 hover:bg-accent hover:text-primary disabled:pointer-events-none disabled:opacity-60"
      >
        <GoogleMark />
        {pending ? "Connecting…" : label}
      </button>
      {setup ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          onClick={() => setSetup(false)}
        >
          <div
            className="w-full max-w-lg space-y-4 rounded-xl border border-border bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
              google oauth
            </p>
            <h2 className="text-xl font-semibold tracking-tight">
              Add Google credentials to enable this button
            </h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                Open{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Cloud Console
                </a>{" "}
                and create an OAuth 2.0 Web client.
              </li>
              <li>
                Authorized JavaScript origin:{" "}
                <code className="font-mono text-foreground">http://localhost:3000</code>
              </li>
              <li>
                Authorized redirect URI:{" "}
                <code className="font-mono text-xs text-foreground">
                  http://localhost:3000/api/auth/callback/google
                </code>
              </li>
              <li>
                Put the values in{" "}
                <code className="font-mono text-foreground">.env.local</code> then restart{" "}
                <code className="font-mono text-foreground">npm run dev</code>:
              </li>
            </ol>
            <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-xs leading-6">
              {`AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-client-secret`}
            </pre>
            <button
              type="button"
              onClick={() => setSetup(false)}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              got_it
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
