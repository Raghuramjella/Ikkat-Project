import React from 'react';

export default function Accessories() {
  return (
    <div className="py-16 bg-white text-gray-800">
      <div className="container-custom max-w-5xl mx-auto space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Accessories</h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Add the finishing touches to your wardrobe with accessories curated through a lens of craftsmanship and
            contemporary flair. Drawing inspiration from premium lifestyle stores, our collection spans handcrafted
            jewellery, statement clutches, and artisanal stoles that celebrate India&apos;s design diversity.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Jewellery</h2>
            <p className="mt-2 text-sm text-gray-600">
              Hand-beaten brass earrings, silver filigree cuffs, and textile-based neckpieces sourced from craft ateliers.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Bags &amp; Clutches</h2>
            <p className="mt-2 text-sm text-gray-600">
              Limited-edition potlis, sling bags, and clutches with handloom panels—designed to complement occasion wear.</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Stoles &amp; Scarves</h2>
            <p className="mt-2 text-sm text-gray-600">
              Lightweight silk, cashmere blends, and artisan-dyed cotton stoles that bring runway-inspired accessorizing to your closet.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Curated Capsules</h3>
            <p className="mt-3 text-sm text-gray-600">
              Shop seasonally updated capsules: wedding trousseau essentials, minimalist office edits, and travel-ready kits,
              inspired by global accessory drops.
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Personal Styling</h3>
            <p className="mt-3 text-sm text-gray-600">
              Book virtual styling sessions where our experts suggest accessory pairings, gift combinations, and occasion-ready looks.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Customer Benefits</h2>
          <ul className="list-inside list-disc space-y-3 text-gray-700">
            <li>Complimentary eco-friendly packaging and gift cards on select accessories.</li>
            <li>Exchange flexibility on eligible items within 7 days, matching industry-leading standards.</li>
            <li>Care guides and storage tips to maintain the sheen and structure of handcrafted pieces.</li>
            <li>Loyalty rewards for frequent buyers, inspired by top-tier lifestyle loyalty programs.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}