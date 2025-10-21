import React from 'react';

export default function Dupattas() {
  return (
    <div className="py-16 bg-white text-gray-800">
      <div className="container-custom max-w-5xl mx-auto space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Dupattas</h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Elevate every ensemble with our curated dupatta collection. Like top accessory boutiques, we combine seasonal
            edits, capsule launches, and fabric innovation to ensure every piece feels special yet versatile.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Artisan Editions</h2>
            <p className="mt-2 text-sm text-gray-600">
              Limited-edition Ikat, Banarasi, and Kalamkari dupattas co-designed with weaving clusters, featuring
              certified dyes and hand-finished embellishments.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Everyday Essentials</h2>
            <p className="mt-2 text-sm text-gray-600">
              Breathable cottons and lightweight silks curated for office wear, college fits, and travel wardrobes.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Statement Layers</h2>
            <p className="mt-2 text-sm text-gray-600">
              Festive-ready dupattas with zari borders, mirror work, and tassel trims—styled the way luxury retailers
              showcase red-carpet accessories.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Lookbook &amp; Styling</h3>
            <p className="mt-3 text-sm text-gray-600">
              Explore pairing suggestions with kurtas, lehengas, and contemporary separates. We offer size inclusivity,
              draping videos, and color theory tips inspired by premium fashion styling guides.
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Care &amp; Preservation</h3>
            <p className="mt-3 text-sm text-gray-600">
              Learn how to store, steam, and care for delicate fabrics with easy tutorials, echoing the aftercare playbooks
              of global accessory houses.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Services You Can Expect</h2>
          <ul className="list-inside list-disc space-y-3 text-gray-700">
            <li>On-demand gift packaging with handwritten notes for special occasions.</li>
            <li>Color matching consultations across our saree, suit, and accessory collections.</li>
            <li>Swift doorstep deliveries with eco-friendly wrapping in major Indian metros.</li>
            <li>Exchange options within 7 days on eligible products, ensuring complete confidence.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}