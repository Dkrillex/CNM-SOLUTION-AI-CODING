import { CompanyPage, LegalSection } from "@/components/company-page";
import { GlowCard } from "@/components/glow-card";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service · EA ENTRETENIMENTO E ESPORTES LTDA",
  description: "Terms for using this platform, including AI Builder and Compliance Hub.",
};

export default function TermsPage() {
  return (
    <CompanyPage
      current="/terms"
      eyebrow="legal"
      title="Terms of Service"
      subtitle="These terms govern access to this platform. By creating an account or using the service, you agree to them."
    >
      <GlowCard className="px-6 md:px-8">
        <p className="pt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          last updated · 22 sep 2026
        </p>
        <LegalSection title="1. The service">
          <p>
            EA ENTRETENIMENTO E ESPORTES LTDA provides AI Builder, Compliance Hub, and related
            account features on this platform. Features may change as we improve the product. Some capabilities are
            preview-quality and should be validated before production use.
          </p>
        </LegalSection>
        <LegalSection title="2. Accounts">
          <p>
            You must provide accurate information when you register with email or Google. You are
            responsible for activity under your account. Notify us through{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact
            </Link>{" "}
            if you believe the account is compromised.
          </p>
        </LegalSection>
        <LegalSection title="3. Acceptable use">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Misuse screening results to harass or unlawfully profile individuals.</li>
            <li>Probe, disrupt or overload the service outside authorized testing.</li>
            <li>Upload unlawful content or attempt to access another customer&apos;s data.</li>
            <li>Resell the platform without a written agreement with EA ENTRETENIMENTO E ESPORTES LTDA.</li>
          </ul>
        </LegalSection>
        <LegalSection title="4. Builder output">
          <p>
            Generated applications are provided for you to review, test and deploy. You are
            responsible for the code you ship, including security, licensing and regulatory fit
            for your own customers.
          </p>
        </LegalSection>
        <LegalSection title="5. Compliance Hub">
          <p>
            Screening results depend on third-party lists and the data you submit. Hits are
            decision-support, not a legal determination. You remain responsible for your AML
            program, escalation and regulatory filings.
          </p>
        </LegalSection>
        <LegalSection title="6. Privacy">
          <p>
            How we handle personal data is described in the{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            . Contact messages you send become part of our support records.
          </p>
        </LegalSection>
        <LegalSection title="7. Availability">
          <p>
            We aim for continuous operation but do not guarantee uninterrupted access. We may
            suspend accounts that violate these terms or that present a security risk.
          </p>
        </LegalSection>
        <LegalSection title="8. Limitation">
          <p>
            To the extent permitted by law, EA ENTRETENIMENTO E ESPORTES LTDA is not liable for indirect or
            consequential losses, or for decisions made solely on generated code or screening
            output. The service is provided on an &quot;as is&quot; basis.
          </p>
        </LegalSection>
        <LegalSection title="9. Changes and contact">
          <p>
            We may update these terms by posting a new version on this page. For questions, use
            the Contact page.
          </p>
        </LegalSection>
      </GlowCard>
    </CompanyPage>
  );
}
