import Footer from "@/components/core/footer";
import Navbar from "@/components/core/navbar";
import { CORE_CONFIG } from "@/config/CORE_CONFIG";

export const metadata = {
  appName: `Terms of Service | ${CORE_CONFIG.appName}`,
  description: `Read the Terms of Service to understand the rules and guidelines for accessing ${CORE_CONFIG.appName}.`,
};

export default async function Terms() {
  return (
    <>
      <main className="min-h-screen w-full overflow-hidden bg-background text-foreground">
        <Navbar />

        <section className="mx-auto max-w-4xl px-12 py-12 pt-32 md:pt-32 sm:gap-48">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-10">Last Updated: {CORE_CONFIG.last_updated_legal}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p>
              Welcome to <strong>{CORE_CONFIG.appName}</strong> ("the Service").
              By accessing or using our website and services, you agree to the following Terms of Service.
              Please read them carefully.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using {CORE_CONFIG.appName}'s services, you acknowledge that you have read, understood,
              and agree to be bound by these Terms. If you do not agree with any part of these Terms,
              please do not use our services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              {CORE_CONFIG.appName} is a software-as-a-service (SaaS) platform that provides tools and features
              to help users manage their business operations efficiently. Our services may include:
            </p>
            <ul>
              <li>Account management and user authentication</li>
              <li>Data storage and management</li>
              <li>Analytics and reporting tools</li>
              <li>Integration with third-party services</li>
              <li>Customer support and documentation</li>
            </ul>
            <p>Specific features and service offerings may vary based on your subscription plan.</p>

            <h2>3. User Accounts and Responsibilities</h2>
            <ul>
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree not to share your account access with unauthorized individuals</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>You agree to use our services in compliance with all applicable laws and regulations</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              All content, features, functionality, and intellectual property developed by {CORE_CONFIG.appName}
              remain our exclusive property. You may not copy, modify, distribute, or reverse engineer any
              part of our services without express written permission. You retain ownership of any data
              you upload to our platform.
            </p>

            <h2>5. Subscription Plans and Payment</h2>
            <ul>
              <li>We offer various subscription plans with different features and pricing</li>
              <li>Payments are processed securely through our payment providers</li>
              <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
              <li>We may change pricing with 30 days notice for existing subscribers</li>
              <li>Refunds are handled according to our Refund Policy</li>
            </ul>

            <h2>6. Service Availability and Disclaimer</h2>
            <ul>
              <li>Our services are provided "as is" and we strive for high availability</li>
              <li>We may schedule maintenance periods with advance notice when possible</li>
              <li>We do not guarantee uninterrupted or error-free service at all times</li>
              <li>We are not responsible for data loss due to user error or third-party integrations</li>
              <li>Use of our services is at your own discretion and risk</li>
            </ul>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, {CORE_CONFIG.appName} shall not be liable for any direct, indirect,
              incidental, special, consequential, or exemplary damages, including but not limited to damages
              for loss of profits, goodwill, data, or other intangible losses resulting from the use of our services.
            </p>

            <h2>8. Privacy and Data Protection</h2>
            <p>
              We are committed to protecting your privacy and handling your data responsibly.
              We collect and process information in accordance with our Privacy Policy and applicable
              data protection regulations. For detailed information about how we handle your data,
              please see our <a href="/privacy" className="text-primary underline">Privacy Policy</a>.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of
              significant changes through our website or via direct communication. Continued use of
              our services after such changes constitutes acceptance of the updated Terms.
            </p>

            <h2>10. Governing Law and Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
              where our company is established. Any disputes arising from these Terms or your use of our
              services shall be resolved through good faith negotiation and, if necessary, through appropriate
              legal proceedings.
            </p>

            <h2>11. Contact Information</h2>
            <p>
              If you have any questions, concerns, or requests regarding these Terms of Service,
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