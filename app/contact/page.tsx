import { CompanyPage } from "@/components/company-page";
import { ContactForm } from "@/components/contact-form";
import { GlowCard } from "@/components/glow-card";
import { Mail, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact · EA ENTRETENIMENTO E ESPORTES LTDA",
  description: "Talk to EA ENTRETENIMENTO E ESPORTES LTDA about AI Builder, AML screening, or a partnership.",
};

const channels = [
  {
    icon: Mail,
    title: "hello@cnmsolution.ai",
    desc: "General questions and product demos.",
  },
  {
    icon: ShieldCheck,
    title: "compliance@cnmsolution.ai",
    desc: "Screening, cases and audit requests.",
  },
  {
    icon: Sparkles,
    title: "partners@cnmsolution.ai",
    desc: "Integrations, resellers and enterprise.",
  },
];

export default function ContactPage() {
  return (
    <CompanyPage
      current="/contact"
      eyebrow="company"
      title="Contact"
      subtitle="Send a message and it is stored for the EA ENTRETENIMENTO E ESPORTES LTDA team. Use the form for demos, support, or partnership."
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <GlowCard className="p-6 md:p-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
            write_to_us
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Leave a message</h2>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">
            We typically reply within one business day.
          </p>
          <ContactForm />
        </GlowCard>
        <div className="space-y-4">
          {channels.map((item) => (
            <GlowCard key={item.title} className="p-6">
              <item.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-mono text-sm">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </CompanyPage>
  );
}
