import Footer from "@/components/core/footer";
import Navbar from "@/components/core/navbar";
import { CORE_CONFIG } from "@/config/CORE_CONFIG";

export const metadata = {
  appName: `Refunds Policy | ${CORE_CONFIG.appName}`,
  description: "Understand our refunds policy and terms.",
};

export default async function Refunds() {
  return (
    <>
      <main className="min-h-screen w-full overflow-hidden bg-background text-foreground">
        <Navbar />

        <section className="mx-auto max-w-4xl px-12 py-12 pt-32 md:pt-32 sm:gap-48">
          <h1 className="text-3xl font-bold mb-6">Refunds Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last Updated: {CORE_CONFIG.last_updated_legal}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
<p>
              This Refunds Policy explains how <strong>{CORE_CONFIG.appName}</strong> handles refunds 
              for our subscription services. By using our platform, you agree to the terms outlined 
              in this policy.
            </p>

<h2>1. Refund Eligibility</h2>
            <p>
              We offer refunds under the following circumstances:
            </p>
            <ul>
              <li>Within 14 days of initial subscription for new customers</li>
              <li>If our service experiences significant downtime (more than 24 hours)</li>
              <li>If you're charged for services you didn't receive</li>
              <li>For billing errors or unauthorized charges</li>
            </ul>

<h2>2. Non-Refundable Items</h2>
            <p>
              The following are not eligible for refunds:
            </p>
            <ul>
              <li>Subscription fees after the 14-day trial period</li>
              <li>Partial month usage of subscription services</li>
              <li>Add-on purchases or one-time fees</li>
              <li>Services that have been fully utilized</li>
              <li>Refunds requested due to user error or misunderstanding</li>
            </ul>

<h2>3. How to Request a Refund</h2>
            <p>
              To request a refund, please follow these steps:
            </p>
            <ul>
              <li>Contact our support team within the eligible timeframe</li>
              <li>Provide your account details and reason for the refund request</li>
              <li>Include any relevant documentation or screenshots</li>
              <li>Allow 5-7 business days for processing</li>
            </ul>

<h2>4. Refund Processing</h2>
            <p>
              Once your refund is approved:
            </p>
            <ul>
              <li>Refunds are processed to the original payment method</li>
              <li>Processing time varies by payment provider (typically 5-10 business days)</li>
              <li>You'll receive a confirmation email when the refund is initiated</li>
              <li>Your account access will be terminated upon refund approval</li>
            </ul>

<h2>5. Subscription Cancellations</h2>
            <p>
              Regarding subscription cancellations:
            </p>
            <ul>
              <li>You can cancel your subscription at any time from your account settings</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No refunds are provided for partial months of service</li>
              <li>You'll retain access until the end of your paid period</li>
            </ul>

<h2>6. Disputes and Exceptions</h2>
            <p>
              In cases of dispute or exceptional circumstances:
            </p>
            <ul>
              <li>We reserve the right to evaluate refund requests on a case-by-case basis</li>
              <li>Exceptions may be made for technical issues or service failures</li>
              <li>Final decisions rest with our management team</li>
              <li>We may offer service credits instead of monetary refunds</li>
            </ul>

<h2>7. Contact Information</h2>
            <p>
              For refund inquiries, please contact us at:{" "}
              <a href={CORE_CONFIG.contacts.email} className="text-primary underline">
                {CORE_CONFIG.contacts.email.replace("mailto:", "")}
              </a>
            </p>

<h2>8. Policy Updates</h2>
            <p>
              We may update this Refunds Policy from time to time. Changes will be effective immediately 
              upon posting on our website. We encourage you to review this policy periodically for 
              any updates.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}