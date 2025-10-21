import React from 'react';

export default function About() {
  return (
    <div className="py-16 bg-white text-gray-800">
      <div className="container-custom max-w-5xl mx-auto space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Inspired by the seamless experiences offered by global e-commerce leaders, IkkatBazaar blends
            frictionless shopping with the soul of India&apos;s handloom heritage. We bring verified artisans and
            conscious shoppers together on a platform that values authenticity, craftsmanship, and fair trade.
          </p>
          <p className="leading-relaxed text-gray-700">
            From doorstep delivery to curated seasonal drops, we adopt best-in-class digital retail practices while
            staying rooted in the communities that weave every thread. Our teams partner with artisan cooperatives,
            sustainable logistics providers, and customer experience specialists to ensure every order feels personal
            and every interaction builds trust.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Curated Collections</h3>
            <p className="text-sm text-gray-600">
              Like the trend-first racks of major fashion marketplaces, our merchandising team studies customer data
              and artisan stories to launch limited-edition edits, city-specific bundles, and festival capsules.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Experience-Driven</h3>
            <p className="text-sm text-gray-600">
              Inspired by premium lifestyle brands, we provide rich editorial content, look books, fit guides, and
              styling advice so shoppers can understand the history and styling potential of each piece.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Partner Success</h3>
            <p className="text-sm text-gray-600">
              Similar to leading marketplace academies, our Artisan Success Program delivers marketing toolkits,
              analytics dashboards, and quarterly webinars that help creators scale responsibly.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Responsible Operations</h3>
            <p className="text-sm text-gray-600">
              From carbon-light shipping lanes to recycled packaging, we apply sustainability benchmarks used by
              top-tier global retailers while respecting local supply chains.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">IkkatBazaar at a Glance</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-100 p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-orange-600">500+</p>
              <p className="mt-2 text-sm text-gray-600">Certified artisan partners from 14 weaving clusters.</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-orange-600">40K</p>
              <p className="mt-2 text-sm text-gray-600">Products delivered with 96% customer satisfaction.</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-orange-600">25</p>
              <p className="mt-2 text-sm text-gray-600">Global cities served with expedited handloom shipping.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Sustainability Commitments</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>Ethical sourcing audits modeled on leading marketplace compliance programs.</li>
            <li>Transparent artisan payouts with real-time tracking for every sale.</li>
            <li>Partnerships with eco-packaging startups to minimize waste in last-mile delivery.</li>
            <li>Community impact fund that reinvests 2% of profits into artisan health and education.</li>
          </ul>
          <p className="leading-relaxed text-gray-700">
            We are continually evolving—testing new personalization tools, expanding virtual try-on pilots, and
            nurturing collaborations that celebrate India&apos;s textile legacy. Together with our artisans and
            customers, we are weaving a future where responsible luxury is the norm.
          </p>
        </section>
      </div>
    </div>
  );
}