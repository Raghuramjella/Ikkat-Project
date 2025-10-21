import React from 'react';

export default function Contact() {
  return (
    <div className="py-16 bg-white text-gray-800">
      <div className="container-custom max-w-5xl mx-auto space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Contact</h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Our customer experience team blends the concierge support of luxury retailers with the speed of modern
            marketplaces. Whether you have a query about a weave technique, order status, or artisan partnership,
            we are here to help through every step of your journey.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Customer Care</h2>
            <p className="mt-2 text-sm text-gray-600">Support available 7 days a week, 9 AM – 9 PM IST.</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li><span className="font-semibold">Email:</span> care@ikkatbazaar.com</li>
              <li><span className="font-semibold">Phone:</span> +91 98765 43210</li>
              <li><span className="font-semibold">Live Chat:</span> Available on the bottom-right icon of every page.</li>
            </ul>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Artisan Partnerships</h2>
            <p className="mt-2 text-sm text-gray-600">
              Dedicated relationship managers inspired by global marketplace partner programs.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li><span className="font-semibold">Email:</span> artisans@ikkatbazaar.com</li>
              <li><span className="font-semibold">Workshops:</span> Monthly onboarding webinars &amp; toolkits.</li>
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Write to Us</h3>
            <p className="mt-3 text-sm text-gray-600">
              IkkatBazaar HQ<br />
              123 Handloom Street, Jubilee Hills<br />
              Hyderabad, Telangana 500033, India
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Press &amp; Collaborations</h3>
            <p className="mt-3 text-sm text-gray-600">
              Reach our media desk for interviews, features, or brand collaborations inspired by major fashion houses.
            </p>
            <p className="mt-2 text-sm text-gray-700"><span className="font-semibold">Email:</span> media@ikkatbazaar.com</p>
          </div>
          <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Corporate Enquiries</h3>
            <p className="mt-3 text-sm text-gray-600">
              Explore white-label gifting, CSR partnerships, and B2B sourcing. We offer curated corporate collections
              similar to enterprise gift suites on global platforms.
            </p>
            <p className="mt-2 text-sm text-gray-700"><span className="font-semibold">Email:</span> business@ikkatbazaar.com</p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Order Self-Service</h2>
            <p className="mt-2 text-sm text-gray-600">
              Following the best practices of leading e-commerce platforms, you can:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-gray-700">
              <li>Track shipments in real time from your account dashboard.</li>
              <li>Initiate exchanges or returns within 7 days of delivery.</li>
              <li>Download GST invoices and gift receipts.</li>
            </ul>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Connect on Social</h2>
            <p className="mt-2 text-sm text-gray-600">DM us on Instagram or WhatsApp for styling advice, size help, and capsule recommendations.</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li><span className="font-semibold">Instagram:</span> @ikkatbazaar</li>
              <li><span className="font-semibold">WhatsApp:</span> +91 91234 56789</li>
              <li><span className="font-semibold">Facebook:</span> facebook.com/ikkatbazaar</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}