import React from 'react';

export default function Fabrics() {
  return (
    <div className="py-16 bg-white text-gray-800">
      <div className="container-custom max-w-5xl mx-auto space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Fabrics</h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Build your dream wardrobe or launch your next design capsule with IkkatBazaar fabrics. Modeled after
            industry-leading fabric libraries, our selection balances artisan authenticity with designer-grade quality
            controls.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Handloom Classics</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ikat cottons, tussar silks, and jamdani blends sourced directly from craft clusters, each accompanied by a
              provenance card.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Designer Favorites</h2>
            <p className="mt-2 text-sm text-gray-600">
              Metered yardage chosen by boutique designers, featuring contemporary palettes and limited runs for exclusivity.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Sustainable Staples</h2>
            <p className="mt-2 text-sm text-gray-600">
              Organic cotton, bamboo blends, and naturally dyed fabrics curated for eco-conscious brands and hobbyists.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Tools &amp; Services</h2>
          <ul className="list-inside list-disc space-y-3 text-gray-700">
            <li><span className="font-semibold">Sample Swatches</span>: Order swatch kits similar to luxury textile houses, delivered within 4 business days.</li>
            <li><span className="font-semibold">Design Support</span>: Access fabric pairing guides and trend forecasts prepared by our textile stylists.</li>
            <li><span className="font-semibold">Bulk Ordering</span>: Volume pricing and dedicated account managers for brands, tailors, and boutique creators.</li>
            <li><span className="font-semibold">Craft Education</span>: Video stories highlighting weaving techniques, loom processes, and artisan narratives.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Why Choose IkkatBazaar Fabrics</h2>
          <p className="leading-relaxed text-gray-700">
            Inspired by the quality assurance programs of global fabric platforms, we conduct thread-count testing, dye
            safety checks, and humidity-controlled storage to maintain integrity from loom to doorstep.
          </p>
          <p className="leading-relaxed text-gray-700">
            Dedicated concierge support helps with yardage calculations, delivery timelines, and aftercare—all powered by
            a team that understands both traditional craftsmanship and modern design requirements.
          </p>
        </section>
      </div>
    </div>
  );
}