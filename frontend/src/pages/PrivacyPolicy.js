import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="py-16 bg-white text-gray-800">
      <div className="container-custom max-w-5xl mx-auto space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-lg leading-relaxed text-gray-700">
            At IkkatBazaar, we follow privacy benchmarks adopted by the world&apos;s most trusted e-commerce platforms.
            This policy explains how we collect, use, and safeguard personal data in accordance with Indian IT laws,
            GDPR-inspired principles, and industry best practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li><span className="font-semibold">Account Data</span>: Name, email, and contact number for profile creation.</li>
            <li><span className="font-semibold">Order Details</span>: Shipping addresses, payment references, and delivery preferences.</li>
            <li><span className="font-semibold">Usage Insights</span>: Device information, browsing patterns, and wishlist interactions to personalize recommendations, similar to leading retail platforms.</li>
            <li><span className="font-semibold">Artisan Credentials</span>: Verification documents for sellers, handled with encrypted storage.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>To fulfill orders, process payments securely, and manage deliveries with our logistics partners.</li>
            <li>To provide personalized product suggestions, curated feeds, and loyalty experiences inspired by top-tier marketplaces.</li>
            <li>To communicate service updates, transactional alerts, and exclusive artisan stories.</li>
            <li>To prevent fraud, ensure platform security, and comply with legal obligations.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Data Sharing &amp; Partnerships</h2>
          <p className="leading-relaxed text-gray-700">
            We do not sell your personal information. Data is shared strictly with trusted service providers—payment
            gateways, logistics companies, and analytics platforms—under confidentiality agreements, mirroring the
            privacy standards followed by global e-commerce leaders.
          </p>
          <p className="leading-relaxed text-gray-700">
            Your data may be processed outside India when required by our partners, and we ensure comparable levels of
            protection through contractual safeguards and frequent audits.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Your Controls &amp; Choices</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>Access or update your profile and saved addresses anytime from your account dashboard.</li>
            <li>Opt out of marketing emails using the unsubscribe link, similar to global retail norms.</li>
            <li>Request data exports or deletion by writing to <span className="font-semibold">privacy@ikkatbazaar.com</span>.</li>
            <li>Manage cookie preferences through the banner displayed during your first visit.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Security Measures</h2>
          <p className="leading-relaxed text-gray-700">
            We implement encryption at rest and in transit, multi-layer firewalls, and regular penetration testing—aligned
            with security practices used by major online retailers. Sensitive payment data is handled by PCI-DSS compliant
            gateways and never stored on our servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Policy Updates</h2>
          <p className="leading-relaxed text-gray-700">
            As we introduce new features and partnerships, this policy may be updated. We notify customers via email and
            highlight major changes, ensuring transparent communication similar to industry leaders.
          </p>
          <p className="text-sm text-gray-500">Last updated: January 2025</p>
        </section>
      </div>
    </div>
  );
}