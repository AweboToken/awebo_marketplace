"use client";

import { DiscoveryBreadcrumb } from "./DiscoveryBreadcrumb";
import { APPAREL_HOME_MIXES } from "@/lib/discovery-home-mixes";
import { useRotatingMixIndex } from "@/hooks/useRotatingMixIndex";

const apparelCategories = [
  "Poleras gráficas",
  "Polerones hoodie",
  "Gorros beanie",
  "Chaquetas bomber",
  "Camisas oversize",
  "Jeans slim fit",
  "Buzos jogger",
  "Polerones con cierre",
  "Shorts",
  "Zapatillas casuales",
  "Sandalias",
  "Jeans rectos",
  "Calcetines",
  "Pantalones cargo",
  "More Apparel",
];

export function MaleApparel() {
  const mixIndex = useRotatingMixIndex(APPAREL_HOME_MIXES.length, 9000);

  return (
    <section className="py-12 px-4 md:px-8 bg-[#f1f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Main apparel</h2>
          <DiscoveryBreadcrumb
            items={APPAREL_HOME_MIXES[mixIndex]}
            className="mt-3"
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-3">
          {apparelCategories.map((category, index) => (
            <button
              type="button"
              key={`apparel-${index}`}
              className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-[#6e5dcb] hover:text-white transition-all shadow-sm"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
