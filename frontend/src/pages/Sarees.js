import React from 'react';

export default function Sarees() {
  return (
    <div className="py-16 bg-white text-gray-800">
      <div className="container-custom max-w-5xl mx-auto space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Sarees</h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Discover the signature IkkatBazaar saree experience, inspired by premium fashion marketplaces. Each weave is
            curated for its craftsmanship, provenance, and contemporary relevance—bridging the timeless elegance of
            handloom with the styling tools modern shoppers expect.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Heritage Spotlight</h2>
            <p className="mt-2 text-sm text-gray-600">
              Weekly drops featuring rare Pochampally, Sambalpuri, and Patola sarees, accompanied by artisan interviews
              and weaving stories similar to editorial capsules on luxury platforms.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Style Guidance</h2>
            <p className="mt-2 text-sm text-gray-600">
              Fit and drape tutorials, seasonal trend guides, and occasion-based look books to help you style every Ikkat
              saree with confidence—just like the inspiration tools used by leading e-commerce brands.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Why Customers Love Our Sarees</h2>
          <ul className="list-inside list-disc space-y-3 text-gray-700">
            <li><span className="font-semibold">Quality Verified</span>: Each piece passes a multi-point inspection for weave integrity, color fastness, and finishing.</li>
            <li><span className="font-semibold">Responsible Sourcing</span>: Crafted in collaboration with clusters following fair wage standards.</li>
            <li><span className="font-semibold">Exclusive Editions</span>: Limited-run motifs co-created with artisan cooperatives available only on IkkatBazaar.</li>
            <li><span className="font-semibold">Express Shipping</span>: Priority delivery options in metro cities, with eco-conscious packaging.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Customer Services</h2>
          <p className="leading-relaxed text-gray-700">
            Inspired by leading fashion retailers, we provide virtual styling consults, gift wrapping, and hassle-free
            returns on eligible sarees. Explore size-inclusive petticoat recommendations, blouse customization services,
            and occasion curation to make every saree purchase special.
          </p>
        </section>
      </div>
    </div>
  );
}