import { CompanyPage, LegalSection } from "@/components/company-page";
import { GlowCard } from "@/components/glow-card";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy · CNM SOLUTION",
  description: "How CNM SOLUTION collects, uses and stores personal data on cnmsolution.ai.",
};

export default function PrivacyPage() {
  return (
    <CompanyPage
      current="/privacy"
      eyebrow="legal"
      title="Privacy Policy"
      subtitle="This policy explains what cnmsolution.ai collects when you create an account, sign in with Google, or send a contact message."
    >
      <GlowCard className="px-6 md:px-8">
        <p className="pt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          last updated · 22 sep 2026
        </p>
        <LegalSection title="1. Who we are">
          <p>
            CNM SOLUTION operates the cnmsolution.ai platform, including AI Builder and Compliance
            Hub. Questions about this policy can be sent from the{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact
            </Link>{" "}
            page.
          </p>
        </LegalSection>
        <LegalSection title="2. Data we collect">
          <p>Depending on how you use the product, we may store:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Account details: name, email, profile image, and hashed password.</li>
            <li>Google sign-in identifiers when you choose that provider.</li>
            <li>Contact messages: name, email, topic and the text you send.</li>
            <li>Product activity such as screenings and generated projects you create.</li>
          </ul>
        </LegalSection>
        <LegalSection title="3. How we use it">
          <p>
            We use this data to create and secure your account, operate Builder and Compliance Hub,
            reply to support requests, and keep an audit trail required for AML workflows. We do
            not sell personal data.
          </p>
        </LegalSection>
        <LegalSection title="4. Storage and security">
          <p>
            Account and contact records are stored in our application database. Passwords are
            stored as one-way hashes. Access is limited to systems that need the data to run the
            service.
          </p>
        </LegalSection>
        <LegalSection title="5. Sharing">
          <p>
            We share data with infrastructure providers that host the product, and with Google if
            you authenticate through Google. We may disclose information if required by law or to
            protect the service.
          </p>
        </LegalSection>
        <LegalSection title="6. Retention">
          <p>
            Account data is kept while your account is active. Contact messages are kept so we can
            follow up and improve support. You can ask us to delete or correct records through the
            Contact page.
          </p>
        </LegalSection>
        <LegalSection title="7. Your choices">
          <p>
            You can sign out at any time, use email/password or Google, and request access or
            deletion of your stored profile and messages. Some AML audit records may need to be
            retained for compliance.
          </p>
        </LegalSection>
        <LegalSection title="8. Updates">
          <p>
            If this policy changes in a material way, we will update this page. Continued use of
            cnmsolution.ai after an update means you accept the revised policy.
          </p>
        </LegalSection>
      </GlowCard>
    </CompanyPage>
  );
}
