import Footer from "@/components/core/footer";
import Navbar from "@/components/core/navbar";
import { CORE_CONFIG } from "@/config/CORE_CONFIG";

export const metadata = {
  appName: `Privacy Policy | ${CORE_CONFIG.appName}`,
  description: `Learn how ${CORE_CONFIG.appName} collects, uses, and protects your personal information.`,
};

export default async function Privacy() {
  return (
    <>
      <main className="min-h-screen w-full overflow-hidden bg-background text-foreground">
        <Navbar />

        <section className="mx-auto max-w-4xl px-12 py-12 pt-32 md:pt-32 sm:gap-48">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last Updated: {CORE_CONFIG.last_updated_legal}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
<p>
              At <strong>{CORE_CONFIG.appName}</strong>, we respect your privacy and are committed to protecting your
              personal information. This Privacy Policy explains how we collect, use, and safeguard your data
              when you interact with our SaaS platform, website, and digital services.
            </p>

<h2>1. Information We Collect</h2>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, password, and other registration details</li>
              <li><strong>Usage Data:</strong> Feature interactions, login frequency, and platform usage patterns</li>
              <li><strong>Technical Data:</strong> IP addresses, browser information, device details, and access logs</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through third-party payment providers</li>
              <li><strong>Communication Data:</strong> Support tickets, feedback, and correspondence with our team</li>
            </ul>

<h2>2. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Provide and maintain our SaaS platform and services</li>
              <li>Process subscription payments and manage billing</li>
              <li>Communicate service updates, security alerts, and support information</li>
              <li>Analyze usage patterns to improve our platform and features</li>
              <li>Ensure account security and prevent unauthorized access</li>
            </ul>

<h2>3. Data Sharing and Disclosure</h2>
            <p>
              We do not sell, rent, or trade your personal information. Data may be shared only:
            </p>
            <ul>
              <li>With essential service providers (payment processors, hosting services, analytics tools)</li>
              <li>When required by law, court order, or government regulation</li>
              <li>In connection with business transfers, mergers, or acquisitions</li>
              <li>With your explicit consent for specific integrations or partnerships</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data against unauthorized access,
              alteration, or disclosure. This includes encryption, access controls, and regular security assessments.
              However, no method of electronic transmission or storage is 100% secure.
            </p>

            <h2>5. Your Rights and Choices</h2>
            <ul>
              <li>You may request access to, correction, or deletion of your personal data</li>
              <li>You can object to or restrict certain data processing activities</li>
              <li>You may opt out of marketing communications at any time</li>
              <li>You can request data portability where applicable</li>
            </ul>

<h2>6. Data Retention</h2>
            <p>
              We retain personal data only for as long as necessary to provide our services and fulfill the purposes 
              outlined in this policy. Account data is retained while your subscription is active, and usage data 
              may be retained for analytical purposes even after account deletion in anonymized form.
            </p>

<h2>7. International Data Transfers</h2>
            <p>
              Our services are hosted on cloud infrastructure that may process data in various locations worldwide. 
              We ensure appropriate safeguards are in place to protect your data in accordance with applicable 
              data protection laws, including standard contractual clauses where required.
            </p>

<h2>8. Third-Party Services</h2>
            <p>
              Our platform integrates with third-party services for payment processing, analytics, and customer support. 
              This Privacy Policy does not apply to those third-party services, and we encourage you to review their 
              respective privacy policies. We carefully select partners who prioritize data protection.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy to reflect changes in our practices or legal requirements.
              Updates will be effective immediately upon posting on our website. We will notify you of
              significant changes through appropriate channels.
            </p>

<h2>10. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal data,
              please contact us at:{" "}
              <a href={CORE_CONFIG.contacts.email} className="text-primary underline">
                {CORE_CONFIG.contacts.email.replace("mailto:", "")}
              </a>
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}