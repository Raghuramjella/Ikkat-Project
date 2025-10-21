import React from 'react';

export default function TermsOfService() {
  return (
    <div className="py-16 bg-white text-gray-800">
      <div className="container-custom max-w-5xl mx-auto space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-lg leading-relaxed text-gray-700">
            These Terms of Service are designed with reference to global e-commerce standards practiced by Amazon,
            Etsy, and other leading marketplaces. By using IkkatBazaar, you agree to the following guidelines to ensure
            a secure, respectful, and delightful experience for both shoppers and artisans.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">1. Your Account</h2>
          <p className="leading-relaxed text-gray-700">
            Customers are responsible for maintaining the confidentiality of their login credentials and for any activity
            under their account. Two-factor authentication is available, similar to major e-commerce security practices.
          </p>
          <p className="leading-relaxed text-gray-700">
            Artisan partners must complete verification checks, including identity documents and product authenticity
            reviews, before listings go live.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">2. Ordering &amp; Fulfillment</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>Orders are accepted once payment is authorized or Cash-on-Delivery is confirmed.</li>
            <li>Shipping timelines follow marketplace-inspired SLAs: standard (5-7 days) and express (2-3 days) in select cities.</li>
            <li>Customers receive proactive updates—order confirmation, dispatch, and delivery—via email or WhatsApp.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">3. Returns &amp; Exchanges</h2>
          <p className="leading-relaxed text-gray-700">
            We allow returns or exchanges within 7 days of delivery for eligible products, aligning with premium marketplace
            policies. Items must be unused, with original tags and authenticity cards intact.
          </p>
          <p className="leading-relaxed text-gray-700">
            Customized and made-to-order pieces may not be eligible for returns, which will be clearly stated on the product page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">4. Payment &amp; Pricing</h2>
          <p className="leading-relaxed text-gray-700">
            We support secure payment methods offered by leading e-commerce platforms, including UPI, credit/debit cards,
            net banking, and trusted wallets. Prices include applicable taxes, and promotional pricing is governed by clear terms.
          </p>
          <p className="leading-relaxed text-gray-700">
            In the event of pricing errors or promotions, we reserve the right to cancel or modify orders with prompt notification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">5. Intellectual Property</h2>
          <p className="leading-relaxed text-gray-700">
            All content on IkkatBazaar—imagery, product descriptions, artisan stories, and branding—is owned by IkkatBazaar or
            licensed by partners. Inspired by major retailers, unauthorized reproduction is prohibited without written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">6. Artisan Conduct</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>Listings must accurately represent products, including material, craft, and dimensions.</li>
            <li>Order fulfillment should adhere to service levels; repeated delays may lead to account review.</li>
            <li>No counterfeit or misrepresented goods, aligning with strict marketplace authenticity policies.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">7. Limitation of Liability</h2>
          <p className="leading-relaxed text-gray-700">
            IkkatBazaar operates as a curated marketplace. While we ensure rigorous onboarding and periodic quality checks,
            the direct artisan is responsible for product quality. Our liability is limited to the value of the order placed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">8. Policy Updates</h2>
          <p className="leading-relaxed text-gray-700">
            These terms may evolve as we introduce new features and partnerships. Inspired by leading digital retailers, we will
            always communicate significant updates via email, in-app notifications, or banners on the website.
          </p>
          <p className="text-sm text-gray-500">Effective Date: January 2025</p>
        </section>
      </div>
    </div>
  );
}