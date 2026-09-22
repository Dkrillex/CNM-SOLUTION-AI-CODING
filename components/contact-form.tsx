"use client";

import { submitContact } from "@/app/actions/contact";
import { AuthInput } from "@/components/auth-shell";
import { Mail, MessageSquare, User } from "lucide-react";
import { FormEvent, useState } from "react";

const topics = [
  { value: "general", label: "General" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "compliance", label: "Compliance" },
  { value: "partnership", label: "Partnership" },
];

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setError("");
    try {
      const result = await submitContact({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        topic: String(data.get("topic") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setSent(true);
      form.reset();
    } catch {
      setError("Could not send your message. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/10 p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
          message_received
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight">We will get back to you</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your note is stored with the CNM SOLUTION team. A reply usually goes out within one
          business day.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-border px-4 font-mono text-xs uppercase tracking-widest hover:border-primary/40 hover:bg-accent hover:text-primary"
        >
          send_another
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
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
        placeholder="Your name"
      />
      <AuthInput
        label="Work email"
        name="email"
        icon={Mail}
        type="email"
        required
        autoComplete="email"
        placeholder="you@company.com"
      />
      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Topic
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <select
            name="topic"
            required
            defaultValue="general"
            className="w-full appearance-none rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
          >
            {topics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Message
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          placeholder="Tell us what you need — a demo, a screening question, or a partnership."
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 font-mono text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "sending…" : "send_message"}
      </button>
    </form>
  );
}
